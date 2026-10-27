/* 战绩与排行榜（阶段 2）
 * 存在同一个 SQLite 里：schema 由这里建，auth 负责连接。
 * 没登录的玩家不记录（排位本来就要求登录）。
 */
const path = require("path");

const SEASON = process.env.GOK_SEASON || "s0";

function ensureSchema(auth) {
  if (!auth || !auth.db) return false;
  try {
    auth.db.exec(`
      CREATE TABLE IF NOT EXISTS ladder (
        user_id INTEGER PRIMARY KEY,
        season TEXT NOT NULL,
        rank INTEGER NOT NULL DEFAULT 0,
        wins INTEGER NOT NULL DEFAULT 0,
        losses INTEGER NOT NULL DEFAULT 0,
        streak INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_ladder_season_rank ON ladder(season, rank DESC);
    `);
    return true;
  } catch (e) {
    return false;
  }
}

function hasLadder(auth) {
  if (!auth || !auth.db) return false;
  try {
    // 表存在就算可用；空表也有 0 行，不能用 SELECT 1 判
    return !!auth.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='ladder'").get();
  } catch (e) {
    return ensureSchema(auth);
  }
}

function row(auth, userId) {
  try {
    return auth.db.prepare("SELECT * FROM ladder WHERE user_id=? AND season=?").get(userId, SEASON) || null;
  } catch (e) { return null; }
}

function ensureRow(auth, userId, rank) {
  const now = Date.now();
  let r = row(auth, userId);
  if (r) return r;
  try {
    auth.db.prepare("INSERT INTO ladder(user_id,season,rank,wins,losses,streak,updated_at) VALUES (?,?,?,0,0,0,?)")
      .run(userId, SEASON, Number(rank) || 1000, now);
  } catch (e) {}
  return row(auth, userId);
}

/** 记一局结果，返回新分数 */
function record(auth, userId, win, rank) {
  if (!userId) return null;
  if (!hasLadder(auth)) return null;
  const cur = ensureRow(auth, userId, rank);
  if (!cur) return null;
  const delta = win ? (cur.streak >= 3 ? 32 : 24) : -18;
  const nextRank = Math.max(0, Math.min(9999, (cur.rank || 1000) + delta));
  const streak = win ? (cur.streak || 0) + 1 : 0;
  try {
    auth.db.prepare("UPDATE ladder SET rank=?, wins=wins+?, losses=losses+?, streak=?, updated_at=? WHERE user_id=? AND season=?")
      .run(nextRank, win ? 1 : 0, win ? 0 : 1, streak, Date.now(), userId, SEASON);
  } catch (e) {}
  return { rank: nextRank, delta, wins: (cur.wins || 0) + (win ? 1 : 0), losses: (cur.losses || 0) + (win ? 0 : 1), streak };
}

function top(auth, limit) {
  if (!hasLadder(auth)) return [];
  try {
    return auth.db.prepare(
      "SELECT l.user_id, l.rank, l.wins, l.losses, l.streak, u.display_name, u.username FROM ladder l JOIN users u ON u.id=l.user_id WHERE l.season=? ORDER BY l.rank DESC, l.wins DESC LIMIT ?"
    ).all(SEASON, Number(limit) || 20).map((r) => ({
      userId: r.user_id,
      name: r.display_name || r.username,
      rank: r.rank,
      wins: r.wins,
      losses: r.losses,
      streak: r.streak
    }));
  } catch (e) { return []; }
}

function me(auth, userId, fallbackRank) {
  if (!userId) return null;
  if (!hasLadder(auth)) return null;
  const r = ensureRow(auth, userId, fallbackRank);
  if (!r) return null;
  let place = null;
  try {
    const better = auth.db.prepare("SELECT COUNT(*) AS n FROM ladder WHERE season=? AND rank > ?").get(SEASON, r.rank);
    place = (better ? better.n : 0) + 1;
  } catch (e) {}
  return { rank: r.rank, wins: r.wins, losses: r.losses, streak: r.streak, place, season: SEASON };
}

/** 开新赛季：老数据留在库里（season 字段区分），新赛季从 1000 分起 */
function resetSeason(auth, nextSeason) {
  const target = String(nextSeason || "").trim() || (SEASON + "-next");
  try {
    auth.db.prepare("DELETE FROM ladder WHERE season=?").run(target);
    return { season: target, cleared: true };
  } catch (e) {
    return { season: target, cleared: false, reason: String((e && e.message) || e) };
  }
}

/** 存档 schema 升级时清一次排行榜（跟客户端迁移对齐） */
function ensureSchemaVersion(auth) {
  const want = String(process.env.GOK_SAVE_SCHEMA || "3");
  try {
    auth.db.exec("CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)");
    const row = auth.db.prepare("SELECT v FROM meta WHERE k='save_schema'").get();
    const got = row ? String(row.v) : "";
    if (got === want) return { reset: false, schema: want };
    // 版本不同：清空排行榜（含历史赛季），让所有人从 1000 重新开始
    auth.db.prepare("DELETE FROM ladder").run();
    auth.db.prepare("INSERT INTO meta(k,v) VALUES('save_schema',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").run(want);
    console.log("save schema " + (got || "(none)") + " -> " + want + "：排行榜已清空");
    return { reset: true, schema: want };
  } catch (e) {
    return { reset: false, schema: want, error: String((e && e.message) || e) };
  }
}

module.exports = { SEASON, ensureSchema, ensureSchemaVersion, record, top, me, hasLadder, resetSeason };
