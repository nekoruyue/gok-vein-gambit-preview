/* 账号、会话与云存档的 PostgreSQL 版本。
 * Render 等免费/无持久盘环境使用 DATABASE_URL 连接 Neon / Supabase。
 * 本地开发仍走 auth.js 的 SQLite 版本。
 */
const crypto = require("crypto");
const { Pool } = require("pg");

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;
const SESSION_COOKIE = "gok_session";
const SESSION_TTL = 1000 * 60 * 60 * 24 * 30;
const SAVE_MAX = 2_000_000;

function randomToken() { return crypto.randomBytes(32).toString("hex"); }
function tokenHash(token) { return crypto.createHash("sha256").update(String(token)).digest("hex"); }
function passwordHash(password, salt) { return crypto.scryptSync(String(password), salt, 64).toString("hex"); }
function safeEqual(a, b) {
  const ba = Buffer.from(String(a), "hex");
  const bb = Buffer.from(String(b), "hex");
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}
function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function isHttps(req) {
  return String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim() === "https" ||
    Boolean(req.socket && req.socket.encrypted);
}
function normalizeName(s) { return String(s || "").trim().replace(/\s+/g, " ").slice(0, 24); }

function createAuth(opts) {
  const json = opts.json;
  const readBody = opts.readBody;
  const rawConnectionString = String(process.env.DATABASE_URL || "");
  if (!rawConnectionString) throw new Error("DATABASE_URL is required for PostgreSQL auth");
  // Neon 新版连接串默认带 channel_binding=require，node-postgres 不识别该参数，部署时移除。
  let connectionString = rawConnectionString.replace(/([?&])channel_binding=[^&]*/i, "$1").replace(/&&/g, "&").replace(/[?&]$/, "");
  const useSsl = /sslmode=require|neon\.tech|supabase\.co/i.test(connectionString);
  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined
  });
  pool.on("error", (e) => console.error("[auth_pg] idle client error", e.message));
  const ready = pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      username_lower TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      last_login_at BIGINT,
      status TEXT NOT NULL DEFAULT 'active'
    );
    CREATE TABLE IF NOT EXISTS saves (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      save_version INTEGER NOT NULL DEFAULT 0,
      save_json TEXT NOT NULL,
      updated_at BIGINT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at BIGINT NOT NULL,
      expires_at BIGINT NOT NULL,
      last_seen_at BIGINT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  `).catch((e) => { console.error("[auth_pg] schema init failed", e); throw e; });

  const loginAttempts = new Map();
  function rateLimited(key) {
    const t = Date.now();
    const row = loginAttempts.get(key);
    return !!row && row.until >= t && row.count >= 6;
  }
  function noteFailure(key) {
    const t = Date.now();
    const row = loginAttempts.get(key) || { count: 0, until: t + 10 * 60 * 1000 };
    row.count += 1;
    row.until = t + 10 * 60 * 1000;
    loginAttempts.set(key, row);
  }
  function publicUser(u) {
    return u ? {
      id: u.id,
      username: u.username,
      displayName: u.display_name,
      createdAt: Number(u.created_at)
    } : null;
  }
  function setCookie(req, res, token) {
    const secure = isHttps(req) ? "; Secure" : "";
    res.setHeader("Set-Cookie", SESSION_COOKIE + "=" + encodeURIComponent(token) + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + Math.floor(SESSION_TTL / 1000) + secure);
  }
  function clearCookie(res) {
    res.setHeader("Set-Cookie", SESSION_COOKIE + "=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  }
  async function createSession(req, res, userId) {
    const token = randomToken();
    const t = Date.now();
    await ready;
    await pool.query("INSERT INTO sessions(token_hash,user_id,created_at,expires_at,last_seen_at) VALUES ($1,$2,$3,$4,$5)",
      [tokenHash(token), userId, t, t + SESSION_TTL, t]);
    setCookie(req, res, token);
    return token;
  }
  async function sessionUser(req) {
    const token = parseCookies(req)[SESSION_COOKIE];
    if (!token) return null;
    await ready;
    const hash = tokenHash(token);
    const r = await pool.query("SELECT s.token_hash,s.expires_at,u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1", [hash]);
    const row = r.rows[0];
    if (!row || Number(row.expires_at) < Date.now() || row.status !== "active") {
      if (row) await pool.query("DELETE FROM sessions WHERE token_hash=$1", [hash]);
      return null;
    }
    await pool.query("UPDATE sessions SET last_seen_at=$1 WHERE token_hash=$2", [Date.now(), hash]);
    return publicUser(row);
  }
  async function getSave(userId) {
    await ready;
    const r = await pool.query("SELECT save_version,save_json,updated_at FROM saves WHERE user_id=$1", [userId]);
    const row = r.rows[0];
    if (!row) return null;
    try { return { version: row.save_version, updatedAt: Number(row.updated_at), save: JSON.parse(row.save_json) }; }
    catch (e) { return null; }
  }

  async function handle(req, res, u) {
    const p = u.pathname;
    if (p === "/api/auth/register" && req.method === "POST") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      const displayName = normalizeName(body.displayName) || username;
      if (!USERNAME_RE.test(username)) { json(res, 400, { ok: false, error: "用户名需为 3–20 位字母、数字或下划线。" }); return true; }
      if (password.length < 8) { json(res, 400, { ok: false, error: "密码至少 8 位。" }); return true; }
      const ipKey = "reg:" + (req.socket.remoteAddress || "");
      if (rateLimited(ipKey)) { json(res, 429, { ok: false, error: "尝试过于频繁，请稍后再试。" }); return true; }
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = passwordHash(password, salt);
      try {
        await ready;
        const r = await pool.query(
          "INSERT INTO users(username,username_lower,display_name,password_hash,password_salt,created_at,last_login_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
          [username, username.toLowerCase(), displayName, hash, salt, Date.now(), Date.now()]
        );
        const user = publicUser(r.rows[0]);
        await createSession(req, res, user.id);
        json(res, 200, { ok: true, user, save: await getSave(user.id) });
      } catch (e) {
        if (e && e.code === "23505") json(res, 409, { ok: false, error: "这个用户名已经被使用。" });
        else { console.error("[auth_pg] register", e); json(res, 500, { ok: false, error: "注册失败，请稍后再试。" }); }
      }
      return true;
    }
    if (p === "/api/auth/login" && req.method === "POST") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      const ipKey = "login:" + (req.socket.remoteAddress || "");
      if (rateLimited(ipKey)) { json(res, 429, { ok: false, error: "尝试过于频繁，请稍后再试。" }); return true; }
      await ready;
      const r = await pool.query("SELECT * FROM users WHERE username_lower=$1", [username.toLowerCase()]);
      const row = r.rows[0];
      if (!row || !safeEqual(passwordHash(password, row.password_salt), row.password_hash)) {
        noteFailure(ipKey);
        json(res, 401, { ok: false, error: "用户名或密码错误。" });
        return true;
      }
      await pool.query("UPDATE users SET last_login_at=$1 WHERE id=$2", [Date.now(), row.id]);
      await createSession(req, res, row.id);
      json(res, 200, { ok: true, user: publicUser(row), save: await getSave(row.id) });
      return true;
    }
    if (p === "/api/auth/logout" && req.method === "POST") {
      const token = parseCookies(req)[SESSION_COOKIE];
      if (token) { await ready; await pool.query("DELETE FROM sessions WHERE token_hash=$1", [tokenHash(token)]); }
      clearCookie(res);
      json(res, 200, { ok: true });
      return true;
    }
    if (p === "/api/auth/me" && req.method === "GET") {
      const user = await sessionUser(req);
      if (!user) { json(res, 200, { ok: true, user: null }); return true; }
      json(res, 200, { ok: true, user, save: await getSave(user.id) });
      return true;
    }
    if (p === "/api/account/save" && req.method === "GET") {
      const user = await sessionUser(req);
      if (!user) { json(res, 401, { ok: false, error: "未登录" }); return true; }
      json(res, 200, { ok: true, user, save: await getSave(user.id) });
      return true;
    }
    if (p === "/api/account/save" && req.method === "POST") {
      const user = await sessionUser(req);
      if (!user) { json(res, 401, { ok: false, error: "未登录" }); return true; }
      const body = JSON.parse((await readBody(req)) || "{}");
      const raw = JSON.stringify(body.save || {});
      if (raw.length > SAVE_MAX) { json(res, 413, { ok: false, error: "存档过大。" }); return true; }
      await ready;
      const current = await getSave(user.id);
      const base = Number(body.baseVersion == null ? (current ? current.version : 0) : body.baseVersion);
      if (current && base !== current.version) { json(res, 409, { ok: false, error: "存档版本冲突", current }); return true; }
      const version = (current ? current.version : 0) + 1;
      const t = Date.now();
      await pool.query(
        "INSERT INTO saves(user_id,save_version,save_json,updated_at) VALUES ($1,$2,$3,$4) ON CONFLICT(user_id) DO UPDATE SET save_version=EXCLUDED.save_version, save_json=EXCLUDED.save_json, updated_at=EXCLUDED.updated_at",
        [user.id, version, raw, t]
      );
      json(res, 200, { ok: true, version, updatedAt: t });
      return true;
    }
    if (p === "/api/account/change-password" && req.method === "POST") {
      const user = await sessionUser(req);
      if (!user) { json(res, 401, { ok: false, error: "未登录" }); return true; }
      const body = JSON.parse((await readBody(req)) || "{}");
      const password = String(body.password || "");
      if (password.length < 8) { json(res, 400, { ok: false, error: "密码至少 8 位。" }); return true; }
      const salt = crypto.randomBytes(16).toString("hex");
      await ready;
      await pool.query("UPDATE users SET password_hash=$1,password_salt=$2 WHERE id=$3", [passwordHash(password, salt), salt, user.id]);
      await pool.query("DELETE FROM sessions WHERE user_id=$1", [user.id]);
      await createSession(req, res, user.id);
      json(res, 200, { ok: true, user: await sessionUser(req) });
      return true;
    }
    if (p === "/api/account" && req.method === "DELETE") {
      const user = await sessionUser(req);
      if (!user) { json(res, 401, { ok: false, error: "未登录" }); return true; }
      await ready;
      await pool.query("DELETE FROM users WHERE id=$1", [user.id]);
      clearCookie(res);
      json(res, 200, { ok: true });
      return true;
    }
    return false;
  }
  return { handle, sessionUser, getSave, pool };
}

module.exports = { createAuth };
