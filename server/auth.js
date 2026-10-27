/* 账号、会话与云存档。
 * 使用 Node 24 内置 node:sqlite 与 crypto；不依赖第三方库。
 * 生产环境把 GOK_DATA_DIR 指向 Render Persistent Disk。
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;
const SESSION_COOKIE = "gok_session";
const SESSION_TTL = 1000 * 60 * 60 * 24 * 30;
const SAVE_MAX = 2_000_000;

function now() { return Date.now(); }
function randomToken() { return crypto.randomBytes(32).toString("hex"); }
function tokenHash(token) { return crypto.createHash("sha256").update(String(token)).digest("hex"); }
function passwordHash(password, salt) {
  return crypto.scryptSync(String(password), salt, 64).toString("hex");
}
function safeEqual(a, b) {
  const ba = Buffer.from(String(a), "hex");
  const bb = Buffer.from(String(b), "hex");
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}
function recoveryCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(16);
  let out = "";
  for (let i = 0; i < 16; i++) out += alphabet[bytes[i] % alphabet.length];
  return out.match(/.{4}/g).join("-");
}
function recoveryDigest(code, salt) {
  return crypto.scryptSync("recovery:" + String(code || "").replace(/-/g, "").toUpperCase(), salt, 64).toString("hex");
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

function createAuth(opts) {
  const json = opts.json;
  const readBody = opts.readBody;
  const dataDir = opts.dataDir || path.join(__dirname, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "gok.db");
  const db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      username_lower TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      last_login_at INTEGER,
      status TEXT NOT NULL DEFAULT 'active'
    );
    CREATE TABLE IF NOT EXISTS saves (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      save_version INTEGER NOT NULL DEFAULT 0,
      save_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  `);
  const userCols = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
  if (!userCols.includes("recovery_hash")) db.exec("ALTER TABLE users ADD COLUMN recovery_hash TEXT");
  if (!userCols.includes("recovery_salt")) db.exec("ALTER TABLE users ADD COLUMN recovery_salt TEXT");
  const loginAttempts = new Map();
  function rateLimited(key) {
    const t = now();
    const row = loginAttempts.get(key);
    if (!row || row.until < t) return false;
    return row.count >= 6;
  }
  function noteFailure(key) {
    const t = now();
    const row = loginAttempts.get(key) || { count: 0, until: t + 10 * 60 * 1000 };
    row.count += 1;
    row.until = t + 10 * 60 * 1000;
    loginAttempts.set(key, row);
  }
  function clearFailures(key) { loginAttempts.delete(key); }
  function publicUser(u) {
    return u ? { id: u.id, username: u.username, displayName: u.display_name || u.displayName || u.username, createdAt: u.created_at || u.createdAt } : null;
  }
  function setCookie(req, res, token) {
    const secure = isHttps(req) ? "; Secure" : "";
    res.setHeader("Set-Cookie", SESSION_COOKIE + "=" + encodeURIComponent(token) + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + Math.floor(SESSION_TTL / 1000) + secure);
  }
  function clearCookie(res) {
    res.setHeader("Set-Cookie", SESSION_COOKIE + "=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  }
  function createSession(res, req, userId) {
    const token = randomToken();
    const t = now();
    db.prepare("INSERT INTO sessions(token_hash,user_id,created_at,expires_at,last_seen_at) VALUES (?,?,?,?,?)")
      .run(tokenHash(token), userId, t, t + SESSION_TTL, t);
    setCookie(req, res, token);
    return token;
  }
  function userFromReq(req) {
    const token = parseCookies(req)[SESSION_COOKIE];
    if (!token) return null;
    const t = now();
    const row = db.prepare("SELECT s.token_hash,s.user_id,s.expires_at,u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?").get(tokenHash(token));
    if (!row || row.expires_at < t || row.status !== "active") {
      if (row) db.prepare("DELETE FROM sessions WHERE token_hash=?").run(row.token_hash);
      return null;
    }
    db.prepare("UPDATE sessions SET last_seen_at=? WHERE token_hash=?").run(t, row.token_hash);
    return publicUser(row);
  }
  function sessionUser(req) { return userFromReq(req); }
  function getSave(userId) {
    const row = db.prepare("SELECT save_version,save_json,updated_at FROM saves WHERE user_id=?").get(userId);
    if (!row) return null;
    try { return { version: row.save_version, updatedAt: row.updated_at, save: JSON.parse(row.save_json) }; }
    catch (e) { return null; }
  }
  function normalizeName(s) { return String(s || "").trim().replace(/\s+/g, " ").slice(0, 24); }
  async function handle(req, res, u) {
    const p = u.pathname;
    if (p === "/api/auth/register" && req.method === "POST") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      const displayName = normalizeName(body.displayName) || username;
      if (!USERNAME_RE.test(username)) { json(res, 400, { ok: false, error: "用户名需为 3–20 位字母、数字或下划线。" }); return true; }
      if (password.length < 8) { json(res, 400, { ok: false, error: "密码至少 8 位。" }); return true; }
      if (rateLimited("reg:" + (req.socket.remoteAddress || ""))) { json(res, 429, { ok: false, error: "尝试过于频繁，请稍后再试。" }); return true; }
      const exists = db.prepare("SELECT id FROM users WHERE username_lower=?").get(username.toLowerCase());
      if (exists) { json(res, 409, { ok: false, error: "这个用户名已经被使用。" }); return true; }
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = passwordHash(password, salt);
      const t = now();
      let info;
      const recovery = recoveryCode();
      const recoverySalt = crypto.randomBytes(16).toString("hex");
      const recoveryHash = recoveryDigest(recovery, recoverySalt);
      try {
        info = db.prepare("INSERT INTO users(username,username_lower,display_name,password_hash,password_salt,created_at,last_login_at,recovery_hash,recovery_salt) VALUES (?,?,?,?,?,?,?,?,?)")
          .run(username, username.toLowerCase(), displayName, hash, salt, t, t, recoveryHash, recoverySalt);
      } catch (e) { json(res, 409, { ok: false, error: "这个用户名已经被使用。" }); return true; }
      const userId = Number(info.lastInsertRowid);
      createSession(res, req, userId);
      json(res, 200, { ok: true, user: publicUser(db.prepare("SELECT * FROM users WHERE id=?").get(userId)), save: getSave(userId), recoveryCode: recovery });
      return true;
    }
    if (p === "/api/auth/login" && req.method === "POST") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      const ipKey = "login:" + (req.socket.remoteAddress || "");
      if (rateLimited(ipKey)) { json(res, 429, { ok: false, error: "尝试过于频繁，请稍后再试。" }); return true; }
      const row = db.prepare("SELECT * FROM users WHERE username_lower=?").get(username.toLowerCase());
      if (!row || !safeEqual(passwordHash(password, row.password_salt), row.password_hash)) {
        noteFailure(ipKey);
        json(res, 401, { ok: false, error: "用户名或密码错误。" });
        return true;
      }
      clearFailures(ipKey);
      db.prepare("UPDATE users SET last_login_at=? WHERE id=?").run(now(), row.id);
      createSession(res, req, row.id);
      json(res, 200, { ok: true, user: publicUser(row), save: getSave(row.id) });
      return true;
    }
    if (p === "/api/auth/recover" && req.method === "POST") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const username = String(body.username || "").trim();
      const code = String(body.recoveryCode || "").trim().toUpperCase();
      const password = String(body.password || "");
      const ipKey = "recover:" + (req.socket.remoteAddress || "");
      if (rateLimited(ipKey)) { json(res, 429, { ok: false, error: "尝试过于频繁，请稍后再试。" }); return true; }
      if (password.length < 8) { json(res, 400, { ok: false, error: "新密码至少 8 位。" }); return true; }
      const row = db.prepare("SELECT * FROM users WHERE username_lower=?").get(username.toLowerCase());
      if (!row || !row.recovery_hash || !row.recovery_salt || !safeEqual(recoveryDigest(code, row.recovery_salt), row.recovery_hash)) {
        noteFailure(ipKey);
        json(res, 401, { ok: false, error: "用户名或恢复码不正确。" });
        return true;
      }
      clearFailures(ipKey);
      const salt = crypto.randomBytes(16).toString("hex");
      db.prepare("UPDATE users SET password_hash=?,password_salt=?,recovery_hash=NULL,recovery_salt=NULL WHERE id=?")
        .run(passwordHash(password, salt), salt, row.id);
      db.prepare("DELETE FROM sessions WHERE user_id=?").run(row.id);
      createSession(res, req, row.id);
      json(res, 200, { ok: true, user: publicUser(db.prepare("SELECT * FROM users WHERE id=?").get(row.id)), save: getSave(row.id) });
      return true;
    }
    if (p === "/api/auth/logout" && req.method === "POST") {
      const token = parseCookies(req)[SESSION_COOKIE];
      if (token) db.prepare("DELETE FROM sessions WHERE token_hash=?").run(tokenHash(token));
      clearCookie(res);
      json(res, 200, { ok: true });
      return true;
    }
    if (p === "/api/auth/me" && req.method === "GET") {
      const user = userFromReq(req);
      if (!user) { json(res, 200, { ok: true, user: null }); return true; }
      json(res, 200, { ok: true, user, save: getSave(user.id) });
      return true;
    }
    if (p === "/api/account/save" && req.method === "GET") {
      const user = userFromReq(req);
      if (!user) { json(res, 401, { ok: false, error: "未登录" }); return true; }
      const save = getSave(user.id);
      json(res, 200, { ok: true, user, save });
      return true;
    }
    if (p === "/api/account/save" && req.method === "POST") {
      const user = userFromReq(req);
      if (!user) { json(res, 401, { ok: false, error: "未登录" }); return true; }
      const body = JSON.parse((await readBody(req)) || "{}");
      const raw = JSON.stringify(body.save || {});
      if (raw.length > SAVE_MAX) { json(res, 413, { ok: false, error: "存档过大。" }); return true; }
      const current = getSave(user.id);
      const base = Number(body.baseVersion == null ? (current ? current.version : 0) : body.baseVersion);
      if (current && base !== current.version) { json(res, 409, { ok: false, error: "存档版本冲突", current }); return true; }
      const version = (current ? current.version : 0) + 1;
      const t = now();
      db.prepare("INSERT INTO saves(user_id,save_version,save_json,updated_at) VALUES (?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET save_version=excluded.save_version, save_json=excluded.save_json, updated_at=excluded.updated_at")
        .run(user.id, version, raw, t);
      json(res, 200, { ok: true, version, updatedAt: t });
      return true;
    }
    if (p === "/api/account/recovery-code" && req.method === "POST") {
      const user = userFromReq(req);
      if (!user) { json(res, 401, { ok: false, error: "未登录" }); return true; }
      const code = recoveryCode();
      const salt = crypto.randomBytes(16).toString("hex");
      db.prepare("UPDATE users SET recovery_hash=?,recovery_salt=? WHERE id=?").run(recoveryDigest(code, salt), salt, user.id);
      json(res, 200, { ok: true, recoveryCode: code });
      return true;
    }
    if (p === "/api/account/change-password" && req.method === "POST") {
      const user = userFromReq(req);
      if (!user) { json(res, 401, { ok: false, error: "未登录" }); return true; }
      const body = JSON.parse((await readBody(req)) || "{}");
      const password = String(body.password || "");
      if (password.length < 8) { json(res, 400, { ok: false, error: "密码至少 8 位。" }); return true; }
      const salt = crypto.randomBytes(16).toString("hex");
      db.prepare("UPDATE users SET password_hash=?, password_salt=? WHERE id=?").run(passwordHash(password, salt), salt, user.id);
      db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id);
      createSession(res, req, user.id);
      json(res, 200, { ok: true, user: userFromReq(req) });
      return true;
    }
    if (p === "/api/account" && req.method === "DELETE") {
      const user = userFromReq(req);
      if (!user) { json(res, 401, { ok: false, error: "未登录" }); return true; }
      const body = JSON.parse((await readBody(req)) || "{}");
      const row = db.prepare("SELECT password_hash,password_salt FROM users WHERE id=?").get(user.id);
      if (!row || !safeEqual(passwordHash(String(body.password || ""), row.password_salt), row.password_hash)) {
        json(res, 403, { ok: false, error: "密码不正确，账号未删除。" }); return true;
      }
      db.prepare("DELETE FROM users WHERE id=?").run(user.id);
      clearCookie(res);
      json(res, 200, { ok: true });
      return true;
    }
    return false;
  }
  return { handle, userFromReq, sessionUser, getSave, dbPath, db };
}

module.exports = { createAuth };
