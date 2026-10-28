/* 服务端权威对局（阶段 1 地基）
 *
 * 目的：不再让房主浏览器算规则。服务器用同一份 engine.js 维护唯一真身，
 * 客户端只发「我要出哪张牌」，服务器校验后广播脱敏状态。
 *
 * 传输用 SSE（下行）+ POST（上行），不引入第三方库，也不需要 WebSocket 握手。
 */
const crypto = require("crypto");
const path = require("path");

const E = require(path.join(__dirname, "..", "public", "js", "engine.js"));
const D = require(path.join(__dirname, "..", "public", "js", "data.js"));

const ROOM_TTL = 1000 * 60 * 30;
const rooms = new Map();

function newCode() {
  return crypto.randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
}

function makeToken() {
  return crypto.randomBytes(12).toString("hex");
}

/** 创建一局：两个座位，等两边都坐下开始 */
function createRoom(opts) {
  opts = opts || {};
  const id = newCode();
  const faction1 = opts.faction1 || "pus";
  const faction2 = opts.faction2 || "academy";
  const seed = Number(opts.seed) || crypto.randomInt(1, 1e9);
  const rules = require("./deck-rules");
  // 牌组由服务器决定：客户端提交的要过校验，不合法就拒（返回错误给调用方）
  const deck1 = rules.deckFor(faction1, opts.deck1);
  const deck2 = rules.deckFor(faction2, opts.deck2);
  const v1 = rules.validateDeck(deck1, faction1);
  if (opts.deck1 && !v1.ok) throw new Error("座位 0 牌组不合法：" + v1.error);
  const v2 = rules.validateDeck(deck2, faction2);
  if (opts.deck2 && !v2.ok) throw new Error("座位 1 牌组不合法：" + v2.error);

  const game = E.createGame({
    faction1, faction2,
    p1AI: false, p2AI: false,
    mulligan: !!opts.mulligan,
    p1Deck: deck1,
    p2Deck: deck2,
    p1Name: opts.name1 || undefined,
    p2Name: opts.name2 || undefined,
    seed
  });
  const room = {
    id,
    game,
    seed,
    version: 0,
    createdAt: Date.now(),
    touchedAt: Date.now(),
    lastActionAt: Date.now(),      // 上一次有人动作的时间（用来判超时）
    actions: 0,                    // 双方已执行的动作数（0 = 还没开局，可换牌组）
    leftAt: [0, 0],                // 每个座位「最后看到在线」的时间，0 = 一直在线
    seats: [null, null],           // 每个座位放 { token }，token 不对外广播
    clients: new Set(),            // SSE 响应对象
    log: []
  };
  rooms.set(id, room);
  return room;
}

function getRoom(id) {
  const room = rooms.get(String(id || "").toUpperCase());
  if (!room) return null;
  if (Date.now() - room.touchedAt > ROOM_TTL) { rooms.delete(room.id); return null; }
  return room;
}

/** 入座后补交自己的牌组（开局前），服务器重新校验并重建这半边的牌堆 */
function setDeck(room, player, deck, faction) {
  const g = room.game;
  if (!g || g.status !== "playing") return { ok: false, error: "对局已开始" };
  if ((room.actions || 0) > 0) return { ok: false, error: "已经开局，不能再换牌组" };
  const rules = require("./deck-rules");
  const fac = faction || (g.players[player] && g.players[player].faction);
  const v = rules.validateDeck(deck, fac);
  if (!v.ok) return { ok: false, error: v.error };
  // 重建这一方的牌库（保留英雄与阵营）
  const built = require("../public/js/engine.js");
  g.players[player].deck = built.createGame({
    faction1: fac, faction2: fac, p1AI: false, p2AI: false, mulligan: false, seed: room.seed, p1Deck: deck
  }).players[0].deck;
  bump(room, "setDeck");
  return { ok: true };
}

function join(room, seatHint) {
  let seat = seatHint === 0 || seatHint === 1 ? seatHint : room.seats.findIndex((s) => !s);
  if (seat < 0) seat = room.seats.findIndex((s) => !s);
  if (seat < 0) return { ok: false, error: "房间已满" };
  if (room.seats[seat]) return { ok: false, error: "座位已被占用" };
  const token = makeToken();
  room.seats[seat] = { token };
  room.touchedAt = Date.now();
  bump(room, "join");
  return { ok: true, seat, token };
}

function authorized(room, player, token) {
  const seat = room.seats[player];
  return !!(seat && seat.token && seat.token === token);
}

/** 脱敏：对手手牌只给数量，不给具体卡 */
function snapshotFor(room, player) {
  const g = room.game;
  const clone = JSON.parse(JSON.stringify(g));
  if (clone.players && clone.players[1 - player]) {
    clone.players[1 - player].hand = clone.players[1 - player].hand.map(() => ({ hidden: true }));
    clone.players[1 - player].deck = (clone.players[1 - player].deck || []).map(() => ({ hidden: true }));
  }
  const now = Date.now();
  const online = [0, 1].map((i) => {
    for (const res of room.clients) if (res.__gokSeat === i) return true;
    return room.connected && room.connected[i] ? true : false;
  });
  return {
    room: room.id,
    version: room.version,
    you: player,
    online,
    status: g.status,
    current: g.current,
    round: g.round,
    turnNumber: g.turnNumber,
    state: clone
  };
}

function broadcast(room, reason) {
  const payload = [];
  for (const res of room.clients) {
    const player = res.__gokSeat;
    try {
      res.write("event: state\ndata: " + JSON.stringify(snapshotFor(room, player)) + "\n\n");
    } catch (e) { /* 客户端已断 */ }
  }
  return payload;
}

function bump(room, reason) {
  room.version += 1;
  room.touchedAt = Date.now();
  if (reason !== "timeout" && reason !== "forfeit") room.lastActionAt = Date.now();
  room.log.push({ at: Date.now(), reason, version: room.version });
  if (room.log.length > 200) room.log.shift();
  broadcast(room, reason);
}

function attachStream(room, player, res) {
  res.__gokSeat = player;
  room.leftAt[player] = 0;
  room.clients.add(res);
  res.write("retry: 2000\n\n");
  res.write("event: state\ndata: " + JSON.stringify(snapshotFor(room, player)) + "\n\n");
  const beat = setInterval(() => {
    try { res.write(": ping\n\n"); } catch (e) {}
  }, 15000);
  res.on("close", () => {
    clearInterval(beat);
    room.clients.delete(res);
    const stillHere = [...room.clients].some((c) => c.__gokSeat === player);
    if (!stillHere) room.leftAt[player] = Date.now();
  });
}

/** 应用一个动作：全部由服务器用引擎校验 */
function act(room, player, action) {
  const g = room.game;
  if (g.status !== "playing") return { ok: false, error: "对局已结束" };
  action = action || {};
  const type = String(action.type || "");

  if (g.current !== player) return { ok: false, error: "还没轮到你" };

  try {
    if (type === "mulligan") {
      const r = E.mulliganPlayer(g, player, Array.isArray(action.indices) ? action.indices : []);
      if (r && r.ok === false) return r;
    } else if (type === "play") {
      const opt = E.getPlayOptions(g, player, action.uid);
      if (!opt || opt.ok === false) return { ok: false, error: (opt && opt.reason) || "这张牌不能出" };
      const r = E.playCard(g, player, action.uid, { targetUid: action.targetUid || null, zone: action.zone || null });
      if (r && r.ok === false) return r;
    } else if (type === "attack") {
      const r = E.attack(g, player, action.uid, action.targetUid || "hero");
      if (r && r.ok === false) return r;
    } else if (type === "power") {
      const r = E.useHeroPower(g, player, action.targetUid || "hero");
      if (r && r.ok === false) return r;
    } else if (type === "endTurn") {
      const r = E.endTurn(g, player);
      if (r && r.ok === false) return r;
    } else if (type === "repay") {
      const r = E.repayDebt(g, player, action.uid);
      if (r && r.ok === false) return r;
    } else if (type === "discover") {
      // 预兆选牌（原来漏了这个分支，联机时选牌必然失败）
      const r = E.resolveDiscover(g, player, action.cardId);
      if (r && r.ok === false) return r;
    } else if (type === "gravePick") {
      // 坟场回收选牌
      const r = E.resolveGravePick(g, player, action.cardId);
      if (r && r.ok === false) return r;
    } else {
      return { ok: false, error: "未知动作：" + type };
    }
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e) };
  }

  room.actions = (room.actions || 0) + 1;
  bump(room, type);
  return { ok: true, version: room.version, status: room.game.status };
}

/** 认输：直接判对方赢 */
function resign(room, player) {
  const g = room.game;
  if (g.status !== "playing") return { ok: false, error: "对局已结束" };
  g.status = "finished";
  g.winner = 1 - player;
  g.finishReason = "resign";
  bump(room, "resign");
  return { ok: true };
}

const TURN_IDLE_MS = Number(process.env.GOK_TURN_IDLE_MS || 90000);
const DISCONNECT_FORFEIT_MS = Number(process.env.GOK_DISCONNECT_FORFEIT_MS || 60000);

/** 巡检：超时自动结束回合；掉线太久判负 */
function sweep(now) {
  const t = now || Date.now();
  const events = [];
  for (const room of rooms.values()) {
    const g = room.game;
    if (g.status !== "playing") continue;
    // 掉线判负（两边都得有人，才谈得上掉线）
    const seated = room.seats.filter(Boolean).length;
    if (seated === 2) {
      for (const i of [0, 1]) {
        if (room.leftAt[i] && t - room.leftAt[i] > DISCONNECT_FORFEIT_MS) {
          g.status = "finished";
          g.winner = 1 - i;
          g.finishReason = "disconnect";
          bump(room, "forfeit");
          events.push({ room: room.id, type: "forfeit", seat: i });
          break;
        }
      }
      if (g.status !== "playing") continue;
    }
    // 回合超时：自动交给对方
    if (t - room.lastActionAt > TURN_IDLE_MS) {
      const cur = g.current;
      try { E.endTurn(g, cur); } catch (e) {}
      bump(room, "timeout");
      events.push({ room: room.id, type: "timeout", seat: cur });
    }
  }
  return events;
}

function stats() {
  return { rooms: rooms.size, list: [...rooms.values()].map((r) => ({ id: r.id, version: r.version, joined: r.seats.filter(Boolean).length, status: r.game.status })) };
}

function cleanup() {
  const now = Date.now();
  for (const [id, r] of rooms) if (now - r.touchedAt > ROOM_TTL) rooms.delete(id);
}

module.exports = { createRoom, getRoom, join, setDeck, act, resign, sweep, attachStream, snapshotFor, authorized, stats, cleanup, ROOM_TTL, TURN_IDLE_MS, DISCONNECT_FORFEIT_MS };
