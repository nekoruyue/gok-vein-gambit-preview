/* 《戈克世界：流脉牌局》局域网中继服务器
 * 仅使用 Node 标准库：静态文件 + 双人 HTTP 长轮询。
 * 房主浏览器是权威端；服务器只负责转发消息与提供页面。
 */
const http = require("http");
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");
const os = require("os");
const { URL } = require("url");
const { createAuth } = process.env.DATABASE_URL ? require("./auth_pg") : require("./auth");

const PORT = Number(process.env.PORT || 4173);

const PUBLIC = path.join(__dirname, "..", "public");
// 本地开发热更新：默认开启（线上 Render 自动关闭）。文件一变就让浏览器自动刷新。
const LIVE = process.env.GOK_LIVE === "1" ? true : (process.env.GOK_EMBEDDED === "1" || process.env.RENDER ? false : process.env.GOK_LIVE !== "0");
const liveClients = new Set();
let liveTimer = null;
function liveBroadcast() {
  for (const res of liveClients) { try { res.write("data: reload\n\n"); } catch (e) {} }
}
if (LIVE) {
  // 用「mtime+大小」快照做变更检测，不用 fs.watch：
  // Windows 上 fs.watch 会因为读写/访问时间抖动误报，导致页面反复自己刷新。
  const watchDirs = ["js", "css", "assets/ui", "assets/generated", "assets/icons", "assets/emblems"]
    .map((p) => path.join(PUBLIC, p)).filter((p) => fs.existsSync(p));
  const watchFiles = [path.join(PUBLIC, "index.html")].filter((p) => fs.existsSync(p));
  const seen = /[.](js|css|html|json|webp|png|svg|woff2?|ttf)$/i;
  const listFiles = (dir, out) => {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) listFiles(full, out);
      else if (seen.test(ent.name)) out.push(full);
    }
    return out;
  };
  const snapshot = () => {
    const parts = [];
    for (const file of watchFiles.concat(...watchDirs.map((d) => listFiles(d, [])))) {
      try { const st = fs.statSync(file); parts.push(file + ":" + st.mtimeMs + ":" + st.size); } catch (e) {}
    }
    return parts.sort().join("|");
  };
  let last = snapshot();
  const timer = setInterval(() => {
    const next = snapshot();
    if (next === last) return;
    last = next;
    clearTimeout(liveTimer);
    liveTimer = setTimeout(liveBroadcast, 300);
  }, 1200);
  if (timer.unref) timer.unref();
  console.log("[live] 热更新已开启（快照比对，静默无事件）");
}
// 玩家反馈：JSONL 落盘 + 查看密钥（环境变量 GOK_FEEDBACK_KEY 优先，否则自动生成到 data/feedback-key.txt）
const FEEDBACK_DIR = process.env.GOK_DATA_DIR || path.join(__dirname, "data");
const FEEDBACK_FILE = path.join(FEEDBACK_DIR, "feedback.jsonl");
const FEEDBACK_KEY_FILE = path.join(FEEDBACK_DIR, "feedback-key.txt");
// 反馈查看密码：默认 21425678（可用环境变量 GOK_FEEDBACK_KEY 覆盖）
const FEEDBACK_PASSWORD = process.env.GOK_FEEDBACK_KEY || "21425678";
let BUILD_ID = "";
try {
  const html = fs.readFileSync(require("path").join(PUBLIC, "index.html"), "utf8");
  const m = html.match(/ui\.js\?v=([\w]+)/);
  BUILD_ID = m ? m[1] : "";
} catch (e) {}
if (process.env.GOK_BUILD_OVERRIDE) BUILD_ID = process.env.GOK_BUILD_OVERRIDE;

// 本地/局域网服务器默认就是实验通道；只有显式声明 stable 才走稳定通道。
const CHANNEL = process.env.GOK_CHANNEL === "stable" ? "stable" : "preview";
const authoritative = require("./authoritative");
const ladder = require("./ladder");
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".svg": "image/svg+xml"
};

const MAX_MESSAGES = 600;
const rooms = new Map();
const matchQueue = new Map();
const matchResults = new Map();
const MATCH_WAIT_TTL = 30 * 1000;
const MATCH_STALE_TTL = 4 * 1000;
const MATCH_RESULT_TTL = 90 * 1000;

function newRoom() {
  return { seq: 0, messages: [], lastSeen: { 0: 0, 1: 0 }, names: [null, null], guestDecks: null, guestFaction: null, guestRelic: null, guestReady: false, ranked: false, createdAt: Date.now() };
}

function newMatchTicket() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function createRoomCode() {
  let code = "";
  for (let i = 0; i < 30; i++) {
    code = Math.random().toString(36).slice(2, 8).toLowerCase();
    if (code.length === 6 && !rooms.has(code)) break;
  }
  if (!code || rooms.has(code)) return null;
  rooms.set(code, newRoom());
  return code;
}

function cleanupMatches(now) {
  const stamp = now || Date.now();
  for (const [ticket, entry] of matchQueue) {
    if (stamp - entry.at > MATCH_WAIT_TTL || stamp - (entry.seen || entry.at) > MATCH_STALE_TTL) matchQueue.delete(ticket);
  }
  for (const [ticket, entry] of matchResults) {
    if (stamp - entry.at > MATCH_RESULT_TTL) matchResults.delete(ticket);
  }
}

function getRoom(id, create) {
  const key = String(id || "lan").toLowerCase();
  if (!rooms.has(key) && create) rooms.set(key, newRoom());
  return rooms.get(key) || null;
}

function roomFromRequest(u, create) {
  const id = String(u.searchParams.get("room") || "lan").toLowerCase();
  if (!/^[a-z0-9]{3,16}$/.test(id)) return null;
  return { id, room: getRoom(id, create) };
}

function touch(room, player) {
  if (room && (player === 0 || player === 1)) room.lastSeen[player] = Date.now();
}

function lanAddresses() {
  const nets = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family !== "IPv4" || net.internal) continue;
      let score = 1;
      const n = String(name).toLowerCase();
      if (net.address.indexOf("169.254.") === 0) score = 0;
      else if (n.indexOf("radmin") >= 0 || n.indexOf("zerotier") >= 0) score = 6;
      else if (n.indexOf("vpn") >= 0) score = 5;
      else if (net.address.indexOf("192.168.") === 0) score = 4;
      else if (net.address.indexOf("10.") === 0) score = 3;
      else if (/^172.(1[6-9]|2[0-9]|3[0-1])./.test(net.address)) score = 2;
      candidates.push({ address: net.address, score, name });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}

function lanIp() {
  const a = lanAddresses();
  return a.length ? a[0].address : "127.0.0.1";
}

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 8_000_000) { reject(new Error("body too large")); req.destroy(); }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}



const auth = createAuth({
  json,
  readBody,
  dataDir: process.env.GOK_DATA_DIR || path.join(__dirname, "data")
});
try { ladder.ensureSchema(auth); ladder.ensureSchemaVersion(auth); } catch (e) { console.log("ladder schema", e && e.message); }

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === "/" || rel === "") rel = "/index.html";
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); res.end("forbidden"); return; }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); res.end("not found"); return; }
    const ext = path.extname(file).toLowerCase();
    // 作弊台只给桌面版和内测端（本机访问）用，公网一律 404
    if (rel === "/cheat.html" && process.env.GOK_ALLOW_CHEAT !== "1") {
      const addr = String((req.socket && req.socket.remoteAddress) || "");
      const isLocal = /^(::1|::ffff:127\.0\.0\.1|127\.0\.0\.1)$/.test(addr);
      if (!isLocal && process.env.GOK_EMBEDDED !== "1") { res.writeHead(404); res.end("not found"); return; }
    }
    if (rel === "/index.html") {
      fs.readFile(file, "utf8", (readErr, html) => {
        if (readErr) { res.writeHead(500); res.end("read error"); return; }
        const health = process.env.GOK_SKIP_HEALTH === "1" ? "true" : "false";
        let body = html
          .replaceAll("__GOK_CHANNEL__", CHANNEL)
          .replace("</head>", "<script>window.__GOK_SKIP_HEALTH__ = " + health + "; window.__GOK_BUILD__ = \"" + BUILD_ID + "\";<\/script></head>");
        if (LIVE) body = body.replace("</body>", "<script src=\"/live-reload.js\"></script></body>");
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache"
        });
        res.end(body);
      });
      return;
    }
    const isUpdateFeed = rel.indexOf("/updates/") === 0;
    // 带 ?v= 构建号的资源可以长缓存；不带版本号的一次性回源
    let hasVersion = false;
    try { hasVersion = !!new URL(req.url, "http://localhost").searchParams.get("v"); } catch (e) {}
    const isText = /^\.(html|js|css|json|svg|txt|map)$/i.test(ext);
    const cacheControl = LIVE ? "no-store" : isUpdateFeed
      ? "no-store"
      : hasVersion
        ? "public, max-age=31536000, immutable"
        : (ext === ".html" || ext === ".js" || ext === ".css" ? "no-cache" : "public, max-age=3600");
    const headers = {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff"
    };
    // 文本资源开 gzip：CSS+JS 合计约 3.3MB，压缩后能省七成多
    const acceptGzip = /\bgzip\b/.test(req.headers["accept-encoding"] || "") && isText && st.size > 1024;
    if (acceptGzip) headers["Content-Encoding"] = "gzip";
    res.writeHead(200, headers);
    if (acceptGzip) fs.createReadStream(file).pipe(zlib.createGzip({ level: 6 })).pipe(res);
    else fs.createReadStream(file).pipe(res);
  });
}

// 权威对局的超时与掉线巡检
const authSweepTimer = setInterval(() => {
  try { authoritative.sweep(); } catch (e) {}
}, Number(process.env.GOK_SWEEP_MS || 5000));
if (authSweepTimer.unref) authSweepTimer.unref();

// ===== 运行指标（阶段 4 的可做部分：先有数，再谈监控系统）=====
const metrics = {
  startedAt: Date.now(),
  requests: 0,
  byRoute: Object.create(null),
  errors: 0
};

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://localhost");
  const p = u.pathname;
  metrics.requests += 1;
  const routeKey = p.replace(/\/api\/aroom\/[A-Za-z0-9]+\//, "/api/aroom/:code/");
  metrics.byRoute[routeKey] = (metrics.byRoute[routeKey] || 0) + 1;
  res.on("finish", () => { if (res.statusCode >= 500) metrics.errors += 1; });
  try {
    if (p === "/api/metrics") {
      const mem = process.memoryUsage();
      const roomsInfo = authoritative.stats();
      json(res, 200, {
        ok: true,
        uptimeSec: Math.round((Date.now() - metrics.startedAt) / 1000),
        requests: metrics.requests,
        errors: metrics.errors,
        rooms: roomsInfo.rooms,
        playing: roomsInfo.list.filter((r) => r.status === "playing").length,
        matchQueue: matchQueue.size,
        rssMB: Math.round(mem.rss / 1048576),
        heapMB: Math.round(mem.heapUsed / 1048576),
        byRoute: metrics.byRoute
      });
      return;
    }

    if (p === "/api/health") {
      json(res, 200, { ok: true, service: "gok-vein-gambit", channel: CHANNEL, time: Date.now(), rooms: rooms.size, auth: (typeof auth.stats === "function" ? await auth.stats() : null) });
      return;
    }
    if (await auth.handle(req, res, u)) return;
    /* ===== 服务端权威对局（阶段 1）===== */
    if (p === "/api/aroom/create" && req.method === "POST") {
      const body = JSON.parse((await readBody(req)) || "{}");
      let room;
      try {
        room = authoritative.createRoom({ faction1: body.faction1, faction2: body.faction2, seed: body.seed,
          deck1: body.deck1, deck2: body.deck2, name1: body.name1, name2: body.name2 });
      } catch (e) {
        json(res, 400, { ok: false, error: String((e && e.message) || e) });
        return;
      }
      // 建房只占 0 号座位；1 号座位留给对手自己 join
      const a = authoritative.join(room, 0);
      json(res, 200, { ok: true, code: room.id, seat: 0, token: a.token });
      return;
    }
    if (p === "/api/aroom/join" && req.method === "POST") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const room = authoritative.getRoom(body.code);
      if (!room) { json(res, 404, { ok: false, error: "房间不存在" }); return; }
      const r = authoritative.join(room, body.seat);
      if (!r.ok) { json(res, 409, r); return; }
      json(res, 200, { ok: true, seat: r.seat, token: r.token, version: room.version });
      return;
    }
    if (p.startsWith("/api/aroom/") && p.endsWith("/events")) {
      const code = p.split("/")[3];
      const room = authoritative.getRoom(code);
      if (!room) { json(res, 404, { ok: false, error: "房间不存在" }); return; }
      const player = Number(u.searchParams.get("player"));
      const token = u.searchParams.get("token") || "";
      if (!authoritative.authorized(room, player, token)) { json(res, 403, { ok: false, error: "座位校验失败" }); return; }
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-store",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no"
      });
      authoritative.attachStream(room, player, res);
      req.on("close", () => { try { res.end(); } catch (e) {} });
      return;
    }
    if (p.startsWith("/api/aroom/") && p.endsWith("/action") && req.method === "POST") {
      const code = p.split("/")[3];
      const room = authoritative.getRoom(code);
      if (!room) { json(res, 404, { ok: false, error: "房间不存在" }); return; }
      const body = JSON.parse((await readBody(req)) || "{}");
      const player = Number(body.player);
      if (!authoritative.authorized(room, player, body.token)) { json(res, 403, { ok: false, error: "座位校验失败" }); return; }
      const r = authoritative.act(room, player, body.action);
      json(res, r.ok ? 200 : 400, r);
      return;
    }
    if (p.startsWith("/api/aroom/") && p.endsWith("/deck") && req.method === "POST") {
      const code = p.split("/")[3];
      const room = authoritative.getRoom(code);
      if (!room) { json(res, 404, { ok: false, error: "房间不存在" }); return; }
      const body = JSON.parse((await readBody(req)) || "{}");
      const player = Number(body.player);
      if (!authoritative.authorized(room, player, body.token)) { json(res, 403, { ok: false, error: "座位校验失败" }); return; }
      const r = authoritative.setDeck(room, player, body.deck, body.faction);
      json(res, r.ok ? 200 : 400, r);
      return;
    }
    if (p === "/api/admin/ladder/reset" && req.method === "POST") {
      const token = process.env.GOK_ADMIN_TOKEN || "";
      if (!token) { json(res, 403, { ok: false, error: "服务端没配 GOK_ADMIN_TOKEN，重置被禁用" }); return; }
      const body = JSON.parse((await readBody(req)) || "{}");
      if (String(body.token || "") !== token) { json(res, 403, { ok: false, error: "口令不对" }); return; }
      const nextSeason = String(body.season || "").trim();
      const r = ladder.resetSeason(auth, nextSeason);
      json(res, 200, { ok: true, ...r });
      return;
    }

    if (p === "/api/ladder" && req.method === "GET") {
      json(res, 200, { ok: true, season: ladder.SEASON, top: ladder.top(auth, 20) });
      return;
    }
    if (p === "/api/ladder/me" && req.method === "GET") {
      const user = await auth.sessionUser(req);
      if (!user) { json(res, 401, { ok: false, error: "需要登录" }); return; }
      const rank = Math.max(0, Math.min(5000, Number(u.searchParams.get("rank")) || 0));
      json(res, 200, { ok: true, me: ladder.me(auth, user.id, rank || 1000) });
      return;
    }
    if (p.startsWith("/api/aroom/") && p.endsWith("/result") && req.method === "POST") {
      const code = p.split("/")[3];
      const room = authoritative.getRoom(code);
      if (!room) { json(res, 404, { ok: false, error: "房间不存在" }); return; }
      const body = JSON.parse((await readBody(req)) || "{}");
      const player = Number(body.player);
      if (!authoritative.authorized(room, player, body.token)) { json(res, 403, { ok: false, error: "座位校验失败" }); return; }
      const g = room.game;
      if (g.status === "playing") { json(res, 409, { ok: false, error: "对局还没结束" }); return; }
      const user = await auth.sessionUser(req);
      if (!user) { json(res, 200, { ok: true, recorded: false, reason: "未登录不记排名" }); return; }
      room.recorded = room.recorded || [false, false];
      if (room.recorded[player]) { json(res, 200, { ok: true, recorded: false, reason: "已记录" }); return; }
      const win = g.winner === player;
      const info = ladder.record(auth, user.id, win, Number(body.rank) || 1000);
      room.recorded[player] = true;
      json(res, 200, { ok: true, recorded: true, win, ladder: info });
      return;
    }

    if (p.startsWith("/api/aroom/") && p.endsWith("/resign") && req.method === "POST") {
      const code = p.split("/")[3];
      const room = authoritative.getRoom(code);
      if (!room) { json(res, 404, { ok: false, error: "房间不存在" }); return; }
      const body = JSON.parse((await readBody(req)) || "{}");
      if (!authoritative.authorized(room, Number(body.player), body.token)) { json(res, 403, { ok: false, error: "座位校验失败" }); return; }
      json(res, 200, authoritative.resign(room, Number(body.player)));
      return;
    }
    if (p.startsWith("/api/aroom/") && p.endsWith("/state")) {
      const code = p.split("/")[3];
      const room = authoritative.getRoom(code);
      if (!room) { json(res, 404, { ok: false, error: "房间不存在" }); return; }
      const player = Number(u.searchParams.get("player"));
      const token = u.searchParams.get("token") || "";
      if (!authoritative.authorized(room, player, token)) { json(res, 403, { ok: false, error: "座位校验失败" }); return; }
      json(res, 200, { ok: true, ...authoritative.snapshotFor(room, player) });
      return;
    }

    if (p === "/api/room/create" && req.method === "POST") {
      const code = createRoomCode();
      if (!code) { json(res, 500, { ok: false, error: "无法创建房间" }); return; }
      json(res, 200, { ok: true, code });
      return;
    }
    if (p === "/api/room/mode" && req.method === "POST") {
      const raw = await readBody(req);
      let body = {};
      try { body = JSON.parse(raw); } catch (e) { body = {}; }
      if (body.ranked && !(await auth.sessionUser(req))) { json(res, 401, { ok: false, error: "排位需要先登录账号。" }); return; }
      const rrMode = roomFromRequest(u, false);
      if (!rrMode) { json(res, 404, { ok: false, error: "房间不存在" }); return; }
      rrMode.room.ranked = !!body.ranked;
      rrMode.room.names[0] = typeof body.name === "string" ? body.name.slice(0, 24) : rrMode.room.names[0];
      rrMode.room.guestReady = false;
      rrMode.room.seq = 0;
      rrMode.room.messages.length = 0;
      json(res, 200, { ok: true, ranked: rrMode.room.ranked });
      return;
    }
    if (p === "/api/match/join" && req.method === "POST") {
      cleanupMatches();
      const rawMatch = await readBody(req);
      let matchBody = {};
      try { matchBody = JSON.parse(rawMatch); } catch (e) { matchBody = {}; }
      const matchRanked = !!matchBody.ranked;
      const matchUser = await auth.sessionUser(req);
      if (matchRanked && !matchUser) { json(res, 401, { ok: false, error: "排位需要先登录账号。" }); return; }
      const matchName = typeof matchBody.name === "string" ? matchBody.name.slice(0, 24) : null;
      const matchRank = Math.max(0, Math.min(5000, Number(matchBody.rank) || 0));
      // 版本门禁：老客户端连新服会打出对不上的房间，直接劝更新
      const clientBuild = String(matchBody.build || "");
      if (BUILD_ID && clientBuild && clientBuild !== BUILD_ID) {
        json(res, 409, { ok: false, code: "stale_client", error: "客户端版本过旧", clientBuild, serverBuild: BUILD_ID });
        return;
      }
      const now = Date.now();
      let waitingTicket = null;
      let bestRankDiff = Infinity;
      for (const [ticket, entry] of matchQueue) {
        if (!!entry.ranked !== matchRanked) continue;
        if (!matchRanked) { waitingTicket = ticket; break; }
        const waited = now - (entry.at || now);
        const range = waited >= 12000 ? 5000 : 300 + Math.floor(waited / 3000) * 250;
        const diff = Math.abs((Number(entry.rank) || 0) - matchRank);
        if (diff <= range && diff < bestRankDiff) { waitingTicket = ticket; bestRankDiff = diff; }
      }
      const ticket = newMatchTicket();
      if (waitingTicket) {
        const waiting = matchQueue.get(waitingTicket);
        const code = createRoomCode();
        if (!code) { json(res, 500, { ok: false, error: "无法创建匹配房间" }); return; }
        const room = rooms.get(code);
        room.ranked = matchRanked;
        room.names[0] = waiting && waiting.name || null;
        room.names[1] = matchName;
        room.createdAt = now;
        matchQueue.delete(waitingTicket);
        // 同时开一局服务端权威对局：两边各拿 (code, seat, token)
        let authInfo = null;
        try {
          const aroom = authoritative.createRoom({
            faction1: (waiting && waiting.faction) || "pus",
            faction2: matchBody.faction || "academy"
          });
          const seat0 = authoritative.join(aroom, 0);
          const seat1 = authoritative.join(aroom, 1);
          authInfo = {
            waiting: { code: aroom.id, seat: 0, token: seat0.token },
            me: { code: aroom.id, seat: 1, token: seat1.token }
          };
        } catch (e) {
          console.log("authoritative room create failed", e && e.message);
        }
        matchResults.set(waitingTicket, { room: code, role: "host", at: now, ranked: matchRanked, names: room.names.slice(), auth: authInfo && authInfo.waiting });
        matchResults.set(ticket, { room: code, role: "guest", at: now, ranked: matchRanked, names: room.names.slice(), auth: authInfo && authInfo.me });
      json(res, 200, { ok: true, matched: true, ticket, room: code, role: "guest", ranked: matchRanked, names: room.names, auth: (authInfo && authInfo.me) || null });
        return;
      }
      matchQueue.set(ticket, { at: now, seen: now, ranked: matchRanked, name: matchName, rank: matchRank, faction: (matchBody.faction || "") });
      json(res, 200, { ok: true, waiting: true, ticket, waitMs: 0, ranked: matchRanked });
      return;
    }
    if (p === "/api/match/status") {
      cleanupMatches();
      const ticket = String(u.searchParams.get("ticket") || "");
      const result = matchResults.get(ticket);
      if (result) {
        json(res, 200, { ok: true, matched: true, ticket, room: result.room, role: result.role, ranked: !!result.ranked, names: result.names || [], auth: result.auth || null });
        return;
      }
      const waiting = matchQueue.get(ticket);
      if (waiting) {
        waiting.seen = Date.now();
        json(res, 200, { ok: true, waiting: true, ticket, waitMs: Math.max(0, Date.now() - waiting.at) });
        return;
      }
      json(res, 200, { ok: true, waiting: false, expired: true, ticket });
      return;
    }
    if (p === "/api/match/cancel" && req.method === "POST") {
      const raw = await readBody(req);
      let body = {};
      try { body = JSON.parse(raw); } catch (e) { body = {}; }
      const ticket = String(body.ticket || "");
      matchQueue.delete(ticket);
      json(res, 200, { ok: true });
      return;
    }
    const requestedRoom = u.searchParams.get("room") || "lan";
    const rr = roomFromRequest(u, requestedRoom === "lan");
    if (p.startsWith("/api/") && p !== "/api/room/create" && !rr) {
      json(res, requestedRoom === "lan" ? 500 : 404, { ok: false, error: "房间不存在或已过期" });
      return;
    }
    if (p === "/api/status") {
      const room = rr.room;
      json(res, 200, {
        ok: true,
        room: rr.id,
        port: PORT,
        ip: lanIp(),
        addresses: lanAddresses().map((x) => ({ address: x.address, name: x.name })),
        now: Date.now(),
        hostOnline: Date.now() - room.lastSeen[0] < 6000,
        guestOnline: Date.now() - room.lastSeen[1] < 6000,
        guestDecksReady: !!room.guestDecks,
        guestDecks: room.guestDecks,
        guestFaction: room.guestFaction,
        guestRelic: room.guestRelic,
        guestReady: room.guestReady,
        ranked: !!room.ranked,
        names: room.names || [null, null],
        seq: room.seq
      });
      return;
    }
    if (p === "/api/hello") {
      const player = Number(u.searchParams.get("player"));
      touch(rr.room, player);
      json(res, 200, { ok: true, player, room: rr.id, ip: lanIp(), port: PORT });
      return;
    }
    if (p.startsWith("/api/art/")) {
      const id = p.slice("/api/art/".length).replace(/\.\./g, "");
      if (!/^[a-z0-9_]+$/.test(id)) { json(res, 400, { ok: false, error: "bad art id" }); return; }
      const candidates = [id + ".webp", id + ".png", id + ".jpg", id + ".jpeg", id + ".svg", "placeholder.svg"];
      let file = null;
      for (const name of candidates) {
        const f = path.join(PUBLIC, "assets", "generated", name);
        if (fs.existsSync(f)) { file = f; break; }
      }
      if (!file) { res.writeHead(404); res.end("not found"); return; }
      const ext = path.extname(file).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": "no-store" });
      fs.createReadStream(file).pipe(res);
      return;
    }
    if (p === "/api/join" && req.method === "POST") {
      const player = Number(u.searchParams.get("player"));
      if (player !== 1) { json(res, 400, { ok: false, error: "only guest" }); return; }
      const room = rr.room;
      touch(room, player);
      const raw = await readBody(req);
      let payload;
      try { payload = JSON.parse(raw); } catch (e) { payload = {}; }
      room.guestDecks = payload && payload.decks && typeof payload.decks === "object" ? payload.decks : {};
      room.guestFaction = payload && typeof payload.faction === "string" && /^[a-z_]+$/.test(payload.faction) ? payload.faction : null;
      room.guestRelic = payload && typeof payload.relic === "string" && /^[a-z_]+$/.test(payload.relic) ? payload.relic : null;
      room.names[1] = payload && typeof payload.name === "string" ? payload.name.slice(0, 24) : room.names[1];
      if (payload && typeof payload.ranked === "boolean") room.ranked = payload.ranked;
      room.guestReady = true;
      room.messages.length = 0;
      room.seq = 0;
      json(res, 200, { ok: true, ready: true, faction: room.guestFaction });
      return;
    }
    if (p === "/api/send" && req.method === "POST") {
      const player = Number(u.searchParams.get("player"));
      if (player !== 0 && player !== 1) { json(res, 400, { ok: false, error: "bad player" }); return; }
      const room = rr.room;
      touch(room, player);
      const raw = await readBody(req);
      let payload;
      try { payload = JSON.parse(raw); } catch (e) { json(res, 400, { ok: false, error: "bad json" }); return; }
      room.messages.push({ seq: ++room.seq, from: player, payload, at: Date.now() });
      if (room.messages.length > MAX_MESSAGES) room.messages.splice(0, room.messages.length - MAX_MESSAGES);
      json(res, 200, { ok: true, seq: room.seq });
      return;
    }
    if (p === "/api/poll") {
      const player = Number(u.searchParams.get("player"));
      if (player !== 0 && player !== 1) { json(res, 400, { ok: false, error: "bad player" }); return; }
      const room = rr.room;
      touch(room, player);
      const since = Number(u.searchParams.get("since") || 0);
      const out = room.messages.filter((m) => m.seq > since && m.from !== player).map((m) => ({ seq: m.seq, from: m.from, payload: m.payload }));
      json(res, 200, { ok: true, seq: room.seq, messages: out, hostOnline: Date.now() - room.lastSeen[0] < 6000, guestOnline: Date.now() - room.lastSeen[1] < 6000 });
      return;
    }
    if (p === "/api/reset" && req.method === "POST") {
      const room = rr.room;
      room.messages.length = 0;
      room.guestDecks = null;
      room.guestFaction = null;
      room.guestRelic = null;
      room.guestReady = false;
      room.seq = 0;
      json(res, 200, { ok: true });
      return;
    }
    if (p === "/api/shutdown" && req.method === "POST") {
      json(res, 200, { ok: true });
      setTimeout(() => process.exit(0), 200);
      return;
    }
    /* ===== 玩家反馈 ===== */
    if (p === "/api/feedback" && req.method === "POST") {
      let body = {};
      try { body = JSON.parse((await readBody(req)) || "{}"); } catch (e) {
        json(res, 400, { ok: false, error: "请求格式不对" });
        return;
      }
      const content = String(body.content || "").trim().slice(0, 2000);
      if (content.length < 1) { json(res, 400, { ok: false, error: "内容不能为空" }); return; }
      const rec = {
        at: new Date().toISOString(),
        type: String(body.type || "其他").slice(0, 20),
        content: content,
        contact: String(body.contact || "").slice(0, 120),
        build: String(body.build || "").slice(0, 40),
        screen: String(body.screen || "").slice(0, 20),
        ua: String(req.headers["user-agent"] || "").slice(0, 180)
      };
      try {
        fs.mkdirSync(FEEDBACK_DIR, { recursive: true });
        fs.appendFileSync(FEEDBACK_FILE, JSON.stringify(rec) + "\n");
      } catch (e) {
        json(res, 500, { ok: false, error: "保存失败" });
        return;
      }
      console.log("收到反馈（" + rec.type + "）：" + content.slice(0, 60));
      json(res, 200, { ok: true });
      return;
    }
    if (p === "/api/feedback" && req.method === "GET") {
      const key = u.searchParams.get("key") || "";
      if (!key || key !== FEEDBACK_PASSWORD) {
        res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("密码不对");
        return;
      }
      let items = [];
      try {
        if (fs.existsSync(FEEDBACK_FILE)) {
          items = fs.readFileSync(FEEDBACK_FILE, "utf8").split("\n").filter(Boolean).map((line) => {
            try { return JSON.parse(line); } catch (e) { return null; }
          }).filter(Boolean);
        }
      } catch (e) {}
      json(res, 200, { ok: true, count: items.length, items: items.slice(-500).reverse() });
      return;
    }
    if (LIVE && p === "/api/live") {
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" });
      res.write("retry: 800\n\n");
      liveClients.add(res);
      const ping = setInterval(() => { try { res.write(": ping\n\n"); } catch (e) {} }, 25000);
      req.on("close", () => { clearInterval(ping); liveClients.delete(res); });
      return;
    }
    if (LIVE && p === "/live-reload.js") {
      res.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-store" });
      res.end("(function(){if(!window.EventSource)return;var es=new EventSource(\"/api/live\");es.onmessage=function(e){if(e.data!=='reload')return;var g=window.GokUI,app=g&&g.app;var inGame=app&&app.screen==='game'&&app.game&&!app.game.over;if(inGame){document.title='● 有新版本，退出对局后刷新';return;}location.reload();};})();");
      return;
    }
    if (p.startsWith("/api/")) { json(res, 404, { ok: false }); return; }
    serveStatic(req, res, p);
  } catch (e) {
    json(res, 500, { ok: false, error: String(e.message || e) });
  }
});

// 空闲自动退出：只在独立进程（CLI / 测试服）里启用。
// 被 Electron 内嵌时不能自杀，否则游戏会在 10 分钟后跟着进程一起没了。
let idleTimer = null;

function startIdleWatch() {
  if (idleTimer) return idleTimer;
  idleTimer = setInterval(() => {
    if (process.env.TRIAL_KEEPALIVE === "1") return;
    const now = Date.now();
    const active = Array.from(rooms.values()).some((r) => now - r.lastSeen[0] < 10 * 60 * 1000 || now - r.lastSeen[1] < 10 * 60 * 1000);
    if (!active) process.exit(0);
  }, 60 * 1000);
  if (idleTimer.unref) idleTimer.unref();
  return idleTimer;
}

function listen(port, host) {
  return new Promise((resolve, reject) => {
    const onError = (err) => { server.removeListener("error", onError); reject(err); };
    server.once("error", onError);
    server.listen(port === undefined ? PORT : port, host || "0.0.0.0", () => {
      server.removeListener("error", onError);
      resolve(server.address());
    });
  });
}

function close() {
  if (idleTimer) { clearInterval(idleTimer); idleTimer = null; }
  return new Promise((resolve) => server.close(() => resolve()));
}

if (require.main === module) {
  // 账号后端告警：没有 DATABASE_URL 时，账号存在本地 SQLite，容器重建就会丢
  if (!process.env.DATABASE_URL && (process.env.RENDER || process.env.NODE_ENV === "production")) {
    console.warn("[auth] 警告：未配置 DATABASE_URL，账号会写进本地 SQLite，部署重建后会全部丢失。请按 README-DEPLOY.md 配置 Postgres。");
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log("Gok Vein Gambit LAN server");
    console.log("http://" + lanIp() + ":" + PORT + "/");
  });
  startIdleWatch();
}

module.exports = { server, listen, close, startIdleWatch, PORT, CHANNEL, PUBLIC };
