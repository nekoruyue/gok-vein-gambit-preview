/* 流脉自走棋 · 八人酒馆战棋 */
(function (global) {
  "use strict";

  const D = global.GokData;
  const STORE = "gok_content_v1";
  const TIER_COSTS = [5, 7, 8, 9, 10];
  const AI_NAMES = ["灰港账房", "铁序监军", "学院记录官", "雪镇医师", "断线佣兵", "血裔商人", "雾港领航员"];
  const HEROES = {
    pus: [
      { id: "lain", name: "莱恩·科斯特", skill: "buff", skillName: "协调", desc: "随机友方随从 +1/+1" },
      { id: "orlicas", name: "奥里卡斯", skill: "armor", skillName: "护脉", desc: "获得 3 点护甲" }
    ],
    xizhao: [
      { id: "karna", name: "卡尔纳", skill: "blood", skillName: "血祭", desc: "支付 2 生命，随机友方 +2/+2" },
      { id: "tiega", name: "铁牙·阿古", skill: "allAttack", skillName: "战吼", desc: "所有友方 +1 攻击" }
    ],
    academy: [
      { id: "marta", name: "玛尔塔", skill: "refresh", skillName: "记录", desc: "免费刷新酒馆一次" },
      { id: "quin", name: "奎因", skill: "discover", skillName: "检索", desc: "发现一张本阵营或中立随从" }
    ],
    republic: [
      { id: "wolfram", name: "沃尔夫拉姆", skill: "armor", skillName: "护幕", desc: "获得 3 点护甲" },
      { id: "stein", name: "施泰因", skill: "discount", skillName: "秩序", desc: "本次酒馆升级费用 -2" }
    ],
    empire: [
      { id: "otto", name: "奥托", skill: "bomb", skillName: "炮击", desc: "下轮战斗前对随机敌人造成 2 伤害" },
      { id: "eisenwald", name: "艾森瓦尔德", skill: "allAttack", skillName: "军令", desc: "所有友方 +1 攻击" }
    ],
    greyharbor: [
      { id: "monarch", name: "莫纳克", skill: "gold", skillName: "悬赏", desc: "获得 2 账" },
      { id: "seran", name: "瑟兰", skill: "discover", skillName: "记账", desc: "发现一张本阵营或中立随从" }
    ]
  };
  const SYNERGY = {
    pus: { attack: 0, health: 1 },
    academy: { attack: 1, health: 0 },
    xizhao: { attack: 1, health: 0 },
    republic: { attack: 0, health: 1 },
    empire: { attack: 1, health: 0 },
    greyharbor: { attack: 0, health: 1 },
    neutral: { attack: 1, health: 0 }
  };
  const DIFFICULTIES = {
    easy: { label: "简单", bonus: -1, size: -1, mark: 1 },
    normal: { label: "标准", bonus: 0, size: 0, mark: 2 },
    hard: { label: "困难", bonus: 1, size: 0, mark: 3 },
    nightmare: { label: "噩梦", bonus: 2, size: 1, mark: 4 }
  };
  const TAVERN_ODDS = {
    1: [100, 0, 0, 0, 0, 0],
    2: [65, 35, 0, 0, 0, 0],
    3: [45, 35, 20, 0, 0, 0],
    4: [30, 30, 25, 15, 0, 0],
    5: [20, 25, 25, 20, 10, 0],
    6: [10, 15, 20, 25, 20, 10]
  };
  const POOL_COPIES = 5;
  function cardTier(def) { const c = def.cost || 1; if (c <= 2) return 1; if (c === 3) return 2; if (c === 4) return 3; if (c === 5) return 4; if (c === 6) return 5; return 6; }
  function oddsText(tier) { const o = TAVERN_ODDS[tier] || TAVERN_ODDS[1]; return o.map((n, i) => n ? "T" + (i + 1) + " " + n + "%" : "").filter(Boolean).join(" · "); }
  function rollTavernTier(tier) {
    const odds = TAVERN_ODDS[tier] || TAVERN_ODDS[1];
    let r = Math.random() * 100;
    for (let i = 0; i < odds.length; i++) { r -= odds[i]; if (r <= 0) return i + 1; }
    return 1;
  }
  function initCardPool() { const p = {}; for (const c of allMinions()) p[c.id] = POOL_COPIES; return p; }
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const clear = (n) => { while (n && n.firstChild) n.removeChild(n.firstChild); };
  const uid = () => "u" + Math.random().toString(36).slice(2, 9);
  const randomOf = (list) => list[Math.floor(Math.random() * list.length)];
  const faction = (id) => D.FACTIONS[id] || D.FACTIONS.pus;
  const heroArt = (fac) => "assets/heroes/" + faction(fac).hero + ".webp";

  const RUN_KEY = "gok_battler_run_v1";
  function clearSavedRun() { try { localStorage.removeItem(RUN_KEY); } catch (e) {} }
  function getSavedRun() { try { return JSON.parse(localStorage.getItem(RUN_KEY) || "null"); } catch (e) { return null; } }
  function saveRun() {
    if (!battlerState || battlerState.phase === "done" || battlerState.phase === "fighting") return;
    try {
      const run = {
        v: 1, savedAt: Date.now(), round: battlerState.round, gold: battlerState.gold,
        phase: battlerState.phase, difficulty: battlerState.difficulty, log: battlerState.log.slice(-20), rank: battlerState.rank,
        rewarded: battlerState.rewarded, heroUsed: battlerState.heroUsed, upgradeDiscount: battlerState.upgradeDiscount,
        nextBomb: battlerState.nextBomb, lastBattle: battlerState.lastBattle,
        players: battlerState.players,
        shop: battlerState.shop.map(d => d.id),
        opponentId: battlerState.opponent ? battlerState.opponent.id : null,
        discoverOptions: battlerState.discoverOptions ? battlerState.discoverOptions.map(d => d.id) : null,
        discoverSource: battlerState.discoverSource || null,
        cardPool: battlerState.cardPool || null
      };
      localStorage.setItem(RUN_KEY, JSON.stringify(run));
    } catch (e) {}
  }
  function loadSavedRun() {
    const run = getSavedRun();
    if (!run || run.v !== 1 || !run.players || !run.players.length) return null;
    const players = run.players.map(p => Object.assign({}, p, { board: p.board || [] }));
    const player = players.find(p => p.you) || players[0];
    const opponent = run.opponentId ? players.find(p => p.id === run.opponentId) || null : null;
    const shop = (run.shop || []).map(id => D.CARDS[id]).filter(Boolean);
    const discoverOptions = run.discoverOptions ? run.discoverOptions.map(id => D.CARDS[id]).filter(Boolean) : null;
    return Object.assign({}, run, { player, players, opponent, shop, discoverOptions, cardPool: run.cardPool || initCardPool() });
  }
  function resumeSavedRun() {
    const run = loadSavedRun();
    if (!run) { openSetup(); return; }
    const gameScreen = $("screen-game"); if (gameScreen) gameScreen.classList.add("battler-mode");
    if (global.GokUI) global.GokUI.showScreen("game");
    battlerState = run;
    render();
  }
  let setupState = null;
  let battlerState = null;

  function loadData() { try { return JSON.parse(localStorage.getItem(STORE) || "null") || {}; } catch (e) { return {}; } }
  function saveData(data) { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) {} }
  function artPath(def) {
    if (!def) return "";
    if (def.art) return "assets/portraits/" + def.art + ".webp";
    if (def.noArtwork) return "";
    return "assets/generated/" + encodeURIComponent(def.id) + ".webp";
  }
  function allMinions() { return Object.values(D.CARDS).filter(c => !c.token && !c.disabled && !c.noArtwork && c.type === "minion"); }
  function pool(tier, fac) {
    return allMinions().filter(c => (c.cost || 0) <= (tier || 1) + 2 && (c.faction === fac || c.faction === "neutral"));
  }
  function makeUnit(def, golden) {
    const m = golden ? 2 : 1;
    const kw = (def.keywords || []).slice();
    return {
      uid: uid(), cardId: def.id, name: def.name, faction: def.faction,
      attack: (def.attack || 1) * m, health: (def.health || 1) * m, maxHealth: (def.health || 1) * m,
      golden: !!golden, keywords: kw, taunt: kw.indexOf("taunt") >= 0,
      divineShield: kw.indexOf("divineShield") >= 0, poisonous: kw.indexOf("poisonous") >= 0,
      reborn: kw.indexOf("reborn") >= 0
    };
  }
  function rollShop(s) {
    s.shop = [];
    const poolMap = s.cardPool || initCardPool();
    const factionPool = allMinions().filter(c => c.faction === s.player.faction || c.faction === "neutral");
    for (let i = 0; i < 3; i++) {
      const wantTier = rollTavernTier(s.player.tier);
      let candidates = factionPool.filter(c => cardTier(c) === wantTier && (poolMap[c.id] || 0) > 0);
      if (!candidates.length) candidates = factionPool.filter(c => (poolMap[c.id] || 0) > 0);
      if (!candidates.length) candidates = factionPool;
      s.shop.push(randomOf(candidates));
    }
  }
  function makeAI(name, idx) {
    return { id: "ai" + idx, name, hp: 30, tier: 1, board: [], alive: true, you: false, faction: randomOf(D.FACTION_IDS) };
  }
  function fillAI(ai, round, difficulty) {
    const diff = DIFFICULTIES[difficulty] || DIFFICULTIES.normal;
    ai.tier = Math.min(6, 1 + Math.floor(round / 2));
    const want = Math.max(1, Math.min(6, 1 + Math.floor(round / 2) + diff.size));
    const p = allMinions().filter(c => (c.cost || 0) <= ai.tier + 2);
    while (ai.board.length < want) {
      const u = makeUnit(randomOf(p), false);
      if (round >= 4) { u.attack += Math.floor(round / 3) + diff.bonus; u.health += Math.floor(round / 3) + diff.bonus; u.maxHealth += Math.floor(round / 3) + diff.bonus; }
      else if (diff.bonus > 0) { u.attack += diff.bonus; u.health += diff.bonus; u.maxHealth += diff.bonus; }
      ai.board.push(u);
    }
  }
  function matchOpponent(s) {
    const alive = s.players.filter(p => p.alive && !p.you);
    s.opponent = alive.length ? randomOf(alive) : null;
  }
  function start(config) {
    clearSavedRun();
    const difficulty = config && DIFFICULTIES[config.difficulty] ? config.difficulty : "normal";
    const fac = config && D.FACTIONS[config.faction] ? config.faction : "pus";
    const heroList = HEROES[fac] || HEROES.pus;
    const hero = heroList.find(h => h.id === (config && config.hero)) || heroList[0];
    const perks = loadData().perks || {};
    const you = { id: "you", name: "你", hp: 30, tier: 1, armor: perks.battler_armor ? 2 : 0, board: [], alive: true, you: true, faction: fac, hero, heroUsed: false };
    const starters = (config && config.starters || []).map(id => D.CARDS[id]).filter(Boolean).slice(0, 3);
    for (const def of starters) you.board.push(makeUnit(def, false));
    const ais = AI_NAMES.map((name, i) => makeAI(name, i));
    const s = {
      player: you, players: [you].concat(ais), round: 1, gold: 3 + (perks.battler_gold ? 2 : 0),
      shop: [], opponent: null, phase: "shop", lastBattle: null,
      log: ["八人入局。账在桌上，命在阵里。" + (perks.battler_gold ? " 战棋盘缠 +2 账。" : "") + (perks.battler_armor ? " 战棋护幕 +2。" : "")], rank: null, rewarded: false,
      heroUsed: false, upgradeDiscount: 0, nextBomb: 0, discoverOptions: null, difficulty, cardPool: initCardPool()
    };
    for (const ai of ais) fillAI(ai, 1, difficulty);
    rollShop(s); matchOpponent(s);
    battlerState = s;
  }
  function triple(player, def) {
    const same = player.board.filter(u => u.cardId === def.id && !u.golden);
    if (same.length < 2) return false;
    const remove = new Set(same.slice(0, 2).map(u => u.uid));
    player.board = player.board.filter(u => !remove.has(u.uid));
    player.board.push(makeUnit(def, true));
    return true;
  }
  function buy(s, i) {
    if (s.phase !== "shop" || s.discoverOptions || s.gold < 3 || s.player.board.length >= 6) return;
    const def = s.shop[i]; if (!def) return;
    if (s.cardPool && (s.cardPool[def.id] || 0) <= 0) { s.log.push("公共牌池里已经没有 " + def.name + "。"); return; }
    if (s.cardPool) s.cardPool[def.id] = (s.cardPool[def.id] || 0) - 1;
    s.gold -= 3; s.shop.splice(i, 1);
    if (triple(s.player, def)) { s.log.push("三连：" + def.name + " 合成了金色随从。"); openDiscover(s, "三连"); }
    else s.player.board.push(makeUnit(def, false));
    render();
  }
  function sell(s, i) {
    if (s.phase !== "shop") return;
    const u = s.player.board[i]; if (!u) return;
    s.player.board.splice(i, 1); s.gold += 1;
    if (s.cardPool) s.cardPool[u.cardId] = (s.cardPool[u.cardId] || 0) + 1;
    s.log.push("卖出 " + u.name + "，账 +1。"); render();
  }
  function upgrade(s) {
    if (s.phase !== "shop" || s.player.tier >= 6) return;
    const cost = Math.max(0, TIER_COSTS[s.player.tier - 1] - (s.upgradeDiscount || 0));
    if (s.gold < cost) return;
    s.gold -= cost; s.upgradeDiscount = 0; s.player.tier++; rollShop(s);
    s.log.push("酒馆升至 " + s.player.tier + " 级。"); render();
  }
  function reroll(s) {
    if (s.phase !== "shop" || s.gold < 1) return;
    s.gold--; rollShop(s); render();
  }
  function synergyBuff(board) {
    const counts = {};
    for (const u of board) if (u.faction) counts[u.faction] = (counts[u.faction] || 0) + 1;
    for (const u of board) {
      const n = counts[u.faction] || 0;
      if (n >= 3) { const b = SYNERGY[u.faction] || { attack: 0, health: 1 }; const m = n >= 6 ? 2 : 1; u.attack += b.attack * m; u.health += b.health * m; u.maxHealth += b.health * m; }
    }
  }
  function synergyText(board) {
    const counts = {};
    for (const u of board) if (u.faction) counts[u.faction] = (counts[u.faction] || 0) + 1;
    return Object.keys(counts).filter(f => counts[f] >= 3).map(f => faction(f).short + " " + counts[f]).join(" · ");
  }
  function openDiscover(s, source) {
    const p = allMinions().filter(c => (c.faction === s.player.faction || c.faction === "neutral") && (!s.cardPool || (s.cardPool[c.id] || 0) > 0));
    const chosen = [];
    const bag = p.slice();
    while (chosen.length < 3 && bag.length) {
      const i = Math.floor(Math.random() * bag.length);
      const c = bag.splice(i, 1)[0];
      if (!chosen.some(x => x.id === c.id)) chosen.push(c);
    }
    if (!chosen.length) {
      const fallback = allMinions().slice();
      while (chosen.length < 3 && fallback.length) chosen.push(fallback.splice(Math.floor(Math.random() * fallback.length), 1)[0]);
    }
    s.discoverOptions = chosen;
    s.discoverSource = source || "三连";
    render();
  }
  function chooseDiscover(s, i) {
    if (!s.discoverOptions) return;
    const def = s.discoverOptions[i]; if (!def) return;
    if (s.cardPool) s.cardPool[def.id] = Math.max(0, (s.cardPool[def.id] || 0) - 1);
    if (s.player.board.length < 6) s.player.board.push(makeUnit(def, false));
    s.log.push("发现：" + def.name + " 加入阵位。");
    s.discoverOptions = null; s.discoverSource = null; render();
  }
  function useHeroSkill(s) {
    if (s.phase !== "shop" || s.heroUsed || s.discoverOptions || !s.player.hero) return;
    const h = s.player.hero || (HEROES[s.player.faction] || HEROES.pus)[0];
    s.player.hero = h;
    const alive = s.player.board.slice();
    if (h.skill === "buff" && alive.length) { const u = randomOf(alive); u.attack += 1; u.health += 1; u.maxHealth += 1; s.log.push("协调：随机友方 +1/+1。"); }
    else if (h.skill === "blood" && alive.length) { s.player.hp = Math.max(1, s.player.hp - 2); const u = randomOf(alive); u.attack += 2; u.health += 2; u.maxHealth += 2; s.log.push("血祭：支付 2 生命，随机友方 +2/+2。"); }
    else if (h.skill === "armor") { s.player.armor = (s.player.armor || 0) + 3; s.log.push("获得 3 点护甲。"); }
    else if (h.skill === "refresh") { rollShop(s); s.log.push("记录：免费刷新酒馆。"); }
    else if (h.skill === "discover") { openDiscover(s, h.skillName); }
    else if (h.skill === "discount") { s.upgradeDiscount = 2; s.log.push("秩序：本次升级费用 -2。"); }
    else if (h.skill === "bomb") { s.nextBomb = (s.nextBomb || 0) + 2; s.log.push("炮击：下轮战斗前对随机敌人造成 2 伤害。"); }
    else if (h.skill === "allAttack") { for (const u of s.player.board) u.attack += 1; s.log.push("军令：所有友方 +1 攻击。"); }
    else if (h.skill === "gold") { s.gold += 2; s.log.push("悬赏：账 +2。"); }
    s.heroUsed = true; render();
  }
  function cloneBoard(board) { return board.map(u => Object.assign({}, u, { uid: uid(), keywords: (u.keywords || []).slice() })); }
  function targetFor(defenders) {
    const t = defenders.filter(u => u.taunt && u.health > 0);
    return t.length ? t[0] : defenders[0];
  }
  function strike(source, target, logs) {
    if (!source || !target) return;
    if (target.divineShield) {
      target.divineShield = false;
      logs.push(target.name + " 的护幕挡住了一次伤害。");
    } else {
      target.health -= source.attack;
      if (source.poisonous) target.health = 0;
      logs.push(source.name + " 击中 " + target.name + "，造成 " + source.attack + " 伤害。");
    }
    if (target.health <= 0 && target.reborn) { target.health = 1; target.reborn = false; logs.push(target.name + " 回潮，留下 1 点生命。"); }
    else if (target.health <= 0) logs.push(target.name + " 倒下。");
  }
  function simulate(aBoard, bBoard) {
    const a = cloneBoard(aBoard), b = cloneBoard(bBoard), logs = [];
    synergyBuff(a); synergyBuff(b);
    let side = Math.random() < 0.5 ? 0 : 1, guard = 0;
    while (a.length && b.length && guard++ < 80) {
      const atk = (side ? b : a)[0];
      const target = targetFor(side ? a : b);
      strike(atk, target, logs); strike(target, atk, logs);
      const da = a.filter(u => u.health > 0), db = b.filter(u => u.health > 0);
      a.length = 0; b.length = 0; a.push(...da); b.push(...db);
      side = side ? 0 : 1;
    }
    return { winner: a.length && !b.length ? 0 : b.length && !a.length ? 1 : -1, a, b, logs: logs.slice(-12) };
  }
  function damageHero(loser, winner, winnerBoard, tier) {
    let dmg = Math.max(1, (tier || 1) + winnerBoard.length);
    const armor = loser.armor || 0;
    if (armor > 0) { const absorb = Math.min(armor, dmg); loser.armor = armor - absorb; dmg -= absorb; }
    loser.hp -= dmg;
    if (loser.hp <= 0) { loser.hp = 0; loser.alive = false; }
    return dmg;
  }
  function resolveOtherBattles(s) {
    const poolPlayers = s.players.filter(p => p.alive && !p.you && p !== s.opponent);
    for (let i = 0; i + 1 < poolPlayers.length; i += 2) {
      const a = poolPlayers[i], b = poolPlayers[i + 1];
      const r = simulate(a.board, b.board);
      if (r.winner === 0) {
        const d = damageHero(b, a, r.a, a.tier);
        s.lastBattle.logs.push(a.name + " 击败 " + b.name + "，造成 " + d + " 伤害。");
      } else if (r.winner === 1) {
        const d = damageHero(a, b, r.b, b.tier);
        s.lastBattle.logs.push(b.name + " 击败 " + a.name + "，造成 " + d + " 伤害。");
      } else s.lastBattle.logs.push(a.name + " 与 " + b.name + " 打平。");
    }
    if (poolPlayers.length % 2 === 1) s.lastBattle.logs.push(poolPlayers[poolPlayers.length - 1].name + " 本轮没有对手。");
  }
  function award(s) {
    if (s.rewarded) return;
    s.rewarded = true;
    const data = loadData();
    const dm = DIFFICULTIES[s.difficulty] || DIFFICULTIES.normal;
    const gain = s.rank === 1 ? 5 : s.rank <= 4 ? 2 : 0;
    const extra = s.rank <= 4 ? dm.mark - 2 : 0;
    data.battler = data.battler || {};
    data.battler.best = Math.min(data.battler.best || 99, s.rank || 99);
    data.battler.runs = (data.battler.runs || 0) + 1;
    if ((s.rank || 99) <= 4) data.battler.top4 = (data.battler.top4 || 0) + 1;
    if (s.rank === 1) data.battler.wins = (data.battler.wins || 0) + 1;
    data.battler.last = { rank: s.rank, at: Date.now() };
    data.marks = (data.marks || 0) + gain + extra;
    saveData(data);
    s.rewardedGain = gain;
    let daily = 0;
    if ((s.rank || 99) <= 4 && global.GokContent && global.GokContent.grantDaily) daily = global.GokContent.grantDaily("battler", 2);
    if (daily) s.log.push("今日战棋首胜：档案印记 +" + daily + "。");
    s.log.push("最终排名第 " + s.rank + "，档案印记 +" + (gain + extra) + "。");
  }
  function finishIfNeeded(s) {
    const aliveAI = s.players.filter(p => p.alive && !p.you).length;
    if (s.player.hp <= 0) { s.phase = "done"; s.rank = aliveAI + 1; award(s); return true; }
    if (aliveAI === 0) { s.phase = "done"; s.rank = 1; award(s); return true; }
    return false;
  }
  function combat(s) {
    if (s.phase !== "shop" || s.fighting || !s.player.board.length || !s.opponent) return;
    s.phase = "fighting"; s.fighting = true;
    s.log.push("第 " + s.round + " 轮交战开始。");
    s.fightPreview = simulate(s.player.board, s.opponent.board).logs.slice(-7);
    render();
    const token = (s.fightToken || 0) + 1;
    s.fightToken = token;
    s.fightTimer = setTimeout(() => {
      if (battlerState !== s || s.fightToken !== token) return;
      resolveCombat(s);
    }, (global.GokApp && global.GokApp.battlerFx === "fast") ? 450 : 1100);
  }
  function resolveCombat(s) {
    if (!s.player.board.length || !s.opponent) return;
    s.fighting = false; s.fightPreview = null;
    if (s.nextBomb > 0 && s.opponent.board.length) {
      const bombTarget = randomOf(s.opponent.board);
      bombTarget.health -= s.nextBomb;
      s.log.push("炮击：对 " + bombTarget.name + " 造成 " + s.nextBomb + " 伤害。");
      s.nextBomb = 0;
      s.opponent.board = s.opponent.board.filter(u => u.health > 0);
    }
    const r = simulate(s.player.board, s.opponent.board);
    const logs = r.logs.slice();
    if (r.winner === 0) {
      const d = damageHero(s.opponent, s.player, r.a, s.player.tier);
      logs.push("你击败 " + s.opponent.name + "，造成 " + d + " 伤害。");
    } else if (r.winner === 1) {
      const d = damageHero(s.player, s.opponent, r.b, s.opponent.tier);
      logs.push(s.opponent.name + " 击败你，造成 " + d + " 伤害。");
    } else logs.push("双方打平，账不动。");
    s.phase = "result"; s.fighting = false; s.lastBattle = { logs };
    s.log = s.log.concat(logs.slice(-8));
    resolveOtherBattles(s); finishIfNeeded(s); render();
  }
  function nextRound(s) {
    if (s.phase !== "result") return;
    s.round++; s.gold = Math.min(10, 3 + s.round); s.heroUsed = false; s.upgradeDiscount = 0;
    for (const p of s.players) if (p.alive && !p.you) fillAI(p, s.round, s.difficulty);
    rollShop(s); matchOpponent(s);
    s.phase = s.opponent ? "shop" : "done";
    if (!s.opponent) finishIfNeeded(s);
    s.lastBattle = null; render();
  }

  /* ===== 备战 ===== */
  function restoreGameChrome() {
    const showIds = ["btn-rank-game", "btn-game-tutorial", "btn-keywords", "btn-game-settings", "btn-toggle-log", "btn-concede", "vein-row", "hand", "hand-meta", "hand-zone"];
    for (const id of showIds) { const n = $(id); if (n) n.hidden = false; }
    const help = document.querySelector(".game-help-actions"); if (help) help.hidden = false;
    const mana = $("mana-corner"); if (mana) mana.hidden = false;
    const enemyMana = $("enemy-mana-corner"); if (enemyMana) enemyMana.hidden = false;
    const deckIds = ["enemy-deck-corner", "deck-corner", "enemy-deck-rail", "player-deck-rail", "log-panel", "turn-banner", "vein-banner", "targeting-prompt", "tutorial-coach"];
    for (const id of deckIds) { const n = $(id); if (n) n.hidden = false; }
    for (const id of ["battler-controls", "battler-top-stats"]) { const n = $(id); if (n) n.remove(); }
    const home = $("btn-game-home"); if (home) { home.textContent = "← 退出"; home.onclick = () => { if (global.GokUI) global.GokUI.showScreen("home"); }; }
    const end = $("btn-end-turn"); if (end) { end.hidden = false; end.textContent = "结束回合"; }
  }
  function openSetup() {
    const feed = $("battler-fight-feed"); if (feed) feed.remove();
    if (battlerState) { battlerState.fightToken = (battlerState.fightToken || 0) + 1; if (battlerState.fightTimer) clearTimeout(battlerState.fightTimer); }
    if (battlerState && battlerState.phase !== "done") saveRun();
    const gameScreen = $("screen-game"); if (gameScreen) { gameScreen.classList.remove("battler-mode"); gameScreen.classList.remove("battler-fighting"); }
    restoreGameChrome();
    if (global.GokUI) global.GokUI.showScreen("battler-setup");
    const base = (global.GokApp && D.FACTIONS[global.GokApp.faction]) ? global.GokApp.faction : "pus";
    const hs = HEROES[base] || HEROES.pus;
    setupState = { faction: base, hero: hs[0].id, difficulty: "normal", starters: [], saved: loadSavedRun() };
    if (global.GokAudio) global.GokAudio.bgm((global.GokApp && global.GokApp.bgmMode === "generic") ? "bgm_game" : "bgm_faction_" + base);
    renderSetup();
  }
  function setupPool(fac) {
    return allMinions().filter(c => c.faction === fac || c.faction === "neutral").sort((a, b) => (a.cost || 0) - (b.cost || 0) || a.name.localeCompare(b.name));
  }
  function setupCard(def) {
    const card = el("button", "battler-pick-card" + (setupState.starters.indexOf(def.id) >= 0 ? " active" : ""));
    card.type = "button";
    const art = artPath(def);
    if (art) { const img = el("img"); img.src = art; img.alt = ""; card.appendChild(img); }
    card.appendChild(el("strong", null, def.name));
    card.appendChild(el("span", null, (def.attack || 1) + " / " + (def.health || 1) + " · " + (def.cost || 0) + " 费"));
    card.onclick = () => {
      const i = setupState.starters.indexOf(def.id);
      if (i >= 0) setupState.starters.splice(i, 1);
      else if (setupState.starters.length < 3) setupState.starters.push(def.id);
      renderSetup();
    };
    return card;
  }
  function renderSetup() {
    const box = $("battler-setup-root"); if (!box) return;
    if (!setupState) { openSetup(); return; }
    clear(box);
    const shell = el("div", "battler-setup-shell");
    const top = el("div", "battler-setup-top");
    const back = el("button", "btn btn-small btn-ghost", "← 返回其他模式");
    back.onclick = () => { if (global.GokUI) global.GokUI.showScreen("other"); };
    top.appendChild(back);
    const copy = el("div"); copy.appendChild(el("div", "eyebrow", "BATTLEGROUNDS / 备战")); copy.appendChild(el("h2", null, "战棋模式")); copy.appendChild(el("p", null, "选择阵营、英雄与三张起始随从。进入酒馆后，商店按酒馆概率刷出本阵营与中立随从。"));
    const stats = loadData().battler || {};
    if (stats.runs) copy.appendChild(el("p", "battler-run-stats", "战绩：最佳第 " + (stats.best === 1 ? "一" : stats.best) + " 名 · 前四 " + (stats.top4 || 0) + " · 冠军 " + (stats.wins || 0)));
    top.appendChild(copy); shell.appendChild(top);
    if (setupState.saved) {
      const resume = el("button", "battler-resume", "继续上次战棋 · 第 " + setupState.saved.round + " 轮 · " + setupState.saved.player.hp + " 生命");
      resume.onclick = () => resumeSavedRun();
      shell.appendChild(resume);
    }
    const factionRow = el("div", "battler-faction-row");
    for (const id of D.FACTION_IDS) {
      const f = faction(id);
      const b = el("button", "battler-faction" + (setupState.faction === id ? " active" : ""));
      b.type = "button";
      b.style.backgroundImage = "url('" + heroArt(id) + "')";
      b.appendChild(el("span", null, f.name));
      b.onclick = () => { setupState.faction = id; setupState.hero = (HEROES[id] || HEROES.pus)[0].id; setupState.starters = []; if (global.GokAudio) global.GokAudio.bgm((global.GokApp && global.GokApp.bgmMode === "generic") ? "bgm_game" : "bgm_faction_" + id); renderSetup(); };
      factionRow.appendChild(b);
    }
    shell.appendChild(factionRow);
    const heroRow = el("div", "battler-hero-row");
    for (const h of (HEROES[setupState.faction] || HEROES.pus)) {
      const b = el("button", "battler-hero-choice" + (setupState.hero === h.id ? " active" : ""));
      b.type = "button";
      b.appendChild(el("strong", null, h.name));
      b.appendChild(el("span", null, h.skillName));
      b.appendChild(el("small", null, h.desc));
      b.onclick = () => { setupState.hero = h.id; renderSetup(); };
      heroRow.appendChild(b);
    }
    shell.appendChild(heroRow);
    const diffRow = el("div", "battler-difficulty-row");
    for (const key of Object.keys(DIFFICULTIES)) {
      const d = DIFFICULTIES[key];
      const b = el("button", "battler-diff-choice" + (setupState.difficulty === key ? " active" : ""), d.label);
      b.type = "button"; b.onclick = () => { setupState.difficulty = key; renderSetup(); };
      diffRow.appendChild(b);
    }
    shell.appendChild(diffRow);
    const selected = el("div", "battler-setup-selected");
    selected.appendChild(el("span", null, "起始卡 " + setupState.starters.length + "/3"));
    const random = el("button", "btn btn-small btn-ghost", "随机三张");
    random.onclick = () => {
      const p = setupPool(setupState.faction).slice();
      const chosen = [];
      while (chosen.length < 3 && p.length) chosen.push(p.splice(Math.floor(Math.random() * p.length), 1)[0].id);
      setupState.starters = chosen; renderSetup();
    };
    selected.appendChild(random); shell.appendChild(selected);
    const grid = el("div", "battler-pick-grid");
    for (const def of setupPool(setupState.faction)) grid.appendChild(setupCard(def));
    shell.appendChild(grid);
    const actions = el("div", "battler-setup-actions");
    const startBtn = el("button", "btn btn-primary", setupState.starters.length === 3 ? "进入酒馆" : "再选 " + (3 - setupState.starters.length) + " 张");
    startBtn.disabled = setupState.starters.length !== 3;
    startBtn.onclick = () => openBattle({ faction: setupState.faction, hero: setupState.hero, difficulty: setupState.difficulty, starters: setupState.starters });
    actions.appendChild(startBtn); shell.appendChild(actions);
    box.appendChild(shell);
  }

  function openBattle(config) {
    const fac = config && D.FACTIONS[config.faction] ? config.faction : "pus";
    const gameScreen = $("screen-game"); if (gameScreen) gameScreen.classList.add("battler-mode");
    if (global.GokUI) global.GokUI.showScreen("game");
    if (global.GokAudio) global.GokAudio.bgm((global.GokApp && global.GokApp.bgmMode === "generic") ? "bgm_game" : "bgm_faction_" + fac);
    start(config);
    render();
  }

  function hideGameChrome() {
    const hide = ["btn-rank-game", "btn-game-tutorial", "btn-keywords", "btn-game-settings", "btn-toggle-log", "btn-concede", "btn-end-turn"];
    for (const id of hide) { const n = $(id); if (n) n.hidden = true; }
    const help = document.querySelector(".game-help-actions"); if (help) help.hidden = true;
    const deckIds = ["enemy-deck-corner", "deck-corner", "enemy-deck-rail", "player-deck-rail", "log-panel", "turn-banner", "vein-banner", "targeting-prompt", "tutorial-coach"];
    for (const id of deckIds) { const n = $(id); if (n) n.hidden = true; }
    const mana1 = $("mana-corner"); if (mana1) mana1.hidden = true;
    const mana2 = $("enemy-mana-corner"); if (mana2) mana2.hidden = true;
    const mobileHint = document.querySelector(".mobile-hint"); if (mobileHint) mobileHint.hidden = true;
  }
  function moveUnit(s, index, dir) {
    if (s.phase !== "shop") return;
    const j = index + dir;
    if (j < 0 || j >= s.player.board.length) return;
    const tmp = s.player.board[index];
    s.player.board[index] = s.player.board[j];
    s.player.board[j] = tmp;
    s.log.push("调整阵位：" + tmp.name + " 移到第 " + (j + 1) + " 位。");
    render();
  }
  function boardCard(u, sellIndex, s) {
    const def = D.CARDS[u.cardId] || {};
    const card = el("div", "board-card type-minion" + (u.taunt ? " taunt" : "") + (u.golden ? " battler-golden-card" : ""));
    card.title = u.name + (s && s.phase === "shop" ? " · 点击卖出" : "");
    const art = artPath(def);
    if (art) { const a = el("div", "card-art"); a.style.backgroundImage = "url('" + art + "')"; card.appendChild(a); }
    const nm = el("div", "board-name", u.name);
    nm.style.cssText = "position:absolute;left:3px;right:3px;bottom:24px;z-index:9999;color:#fff3cf;font-size:10px;line-height:1.2;background:rgba(2,9,10,.92);padding:2px 3px;text-shadow:0 1px 3px #000;";
    card.appendChild(nm);
    if (u.golden) card.appendChild(el("div", "battler-golden-mark", "金色"));
    const st = el("div", "card-stats");
    st.appendChild(el("span", "card-stat atk", String(u.attack)));
    st.appendChild(el("span", "card-stat hp", String(Math.max(0, u.health))));
    st.style.cssText = "position:absolute;left:3px;right:3px;bottom:3px;z-index:9999;display:flex;justify-content:space-between;gap:3px;background:rgba(2,9,10,.94);padding:2px;";
    st.querySelectorAll(".card-stat").forEach(x => x.style.cssText = "display:inline-flex;align-items:center;justify-content:center;min-width:25px;height:19px;border:1px solid rgba(217,164,65,.35);background:rgba(8,20,20,.9);font-size:10px;color:#f1dfb5;");
    card.appendChild(st);
    if (s && s.phase === "shop") {
      const sellBtn = el("button", "battler-board-sell", "卖 +1");
      sellBtn.onclick = (ev) => { ev.stopPropagation(); sell(s, sellIndex); };
      card.appendChild(sellBtn);
      const ord = el("div", "battler-order");
      const left = el("button", "battler-order-btn", "‹");
      left.title = "向前移动";
      left.onclick = (ev) => { ev.stopPropagation(); moveUnit(s, sellIndex, -1); };
      const right = el("button", "battler-order-btn", "›");
      right.title = "向后移动";
      right.onclick = (ev) => { ev.stopPropagation(); moveUnit(s, sellIndex, 1); };
      ord.append(left, right); card.appendChild(ord);
    }
    return card;
  }
  function heroPanel(container, player, fac, side) {
    if (!container) return;
    container.dataset.faction = fac;
    container.innerHTML = "";
    const portrait = el("div", "hs-hero-portrait");
    portrait.style.backgroundImage = "url('" + heroArt(fac) + "')";
    portrait.title = faction(fac).name;
    container.appendChild(portrait);
    const body = el("div", "hs-hero-body");
    const identity = el("div", "hs-hero-identity");
    identity.appendChild(el("strong", "hs-hero-name", side === "player" && player.hero ? player.hero.name : player.name));
    if (player.hero) identity.appendChild(el("small", "hs-hero-skill-line", player.hero.skillName));
    body.appendChild(identity);
    const vitals = el("div", "hs-hero-vitals");
    const hp = el("span", "hs-vital hs-hp");
    hp.appendChild(el("b", null, String(Math.max(0, player.hp))));
    hp.appendChild(el("small", null, "生命"));
    vitals.appendChild(hp);
    const tier = el("span", "hs-vital hs-armor");
    tier.appendChild(el("b", null, String(player.tier)));
    tier.appendChild(el("small", null, "酒馆"));
    vitals.appendChild(tier);
    if (player.you && (player.armor || 0) > 0) { const arm = el("span", "hs-vital hs-armor"); arm.appendChild(el("b", null, String(player.armor))); arm.appendChild(el("small", null, "护甲")); vitals.appendChild(arm); }
    body.appendChild(vitals);
    const track = el("div", "hs-hero-hpbar");
    const fill = el("i"); fill.style.width = Math.max(0, Math.min(100, player.hp / 30 * 100)) + "%";
    track.appendChild(fill); body.appendChild(track);
    container.appendChild(body);
  }
  function ensureClassicBars(s) {
    let stats = $("battler-top-stats");
    if (!stats) {
      stats = el("div", "battler-top-stats"); stats.id = "battler-top-stats";
      const top = document.querySelector("#screen-game .game-top");
      if (top) top.appendChild(stats);
    }
    stats.textContent = "账 " + s.gold + " · 酒馆 " + s.player.tier + " · 存活 " + s.players.filter(p => p.alive).length + "/8" + (synergyText(s.player.board) ? " · 协同 " + synergyText(s.player.board) : "") + " · " + (DIFFICULTIES[s.difficulty] || DIFFICULTIES.normal).label;
    stats.title = "酒馆概率：" + oddsText(s.player.tier);
    let bar = $("battler-controls");
    if (!bar) {
      bar = el("div", "battler-controls"); bar.id = "battler-controls";
      const screen = $("screen-game"); if (screen) screen.appendChild(bar);
    }
    clear(bar);
    if (s.discoverOptions) { bar.appendChild(el("span", "battler-discover-note", "三连发现：" + s.discoverSource + " · 从手牌选一张")); return; }
    if (s.phase === "shop") {
      const roll = el("button", "btn btn-small btn-ghost", "刷新 · 1 账"); roll.disabled = s.gold < 1; roll.onclick = () => reroll(s);
      const cost = s.player.tier >= 6 ? 0 : TIER_COSTS[s.player.tier - 1];
      const up = el("button", "btn btn-small btn-ghost", s.player.tier >= 6 ? "酒馆满级" : "升级 · " + cost + " 账"); up.disabled = s.player.tier >= 6 || s.gold < cost; up.onclick = () => upgrade(s);
      const fight = el("button", "btn btn-primary", "开战"); fight.disabled = !s.player.board.length || !s.opponent; fight.onclick = () => combat(s);
      const heroSkill = s.player.hero || (HEROES[s.player.faction] || HEROES.pus)[0];
      const skill = el("button", "btn btn-small btn-ghost", heroSkill.skillName + (s.heroUsed ? " · 已用" : ""));
      skill.disabled = !!s.heroUsed; skill.onclick = () => useHeroSkill(s);
      bar.append(skill, roll, up, fight);
    } else if (s.phase === "fighting") {
      bar.appendChild(el("span", "battler-discover-note", "交战中…"));
    } else if (s.phase === "result") {
      const next = el("button", "btn btn-primary", "下一轮"); next.onclick = () => nextRound(s); bar.appendChild(next);
    } else {
      const again = el("button", "btn btn-primary", "再开一桌"); again.onclick = () => openSetup(); bar.appendChild(again);
    }
  }

  function render() {
    if (!battlerState) { openSetup(); return; }
    const s = battlerState;
    hideGameChrome();
    const top = $("game-mode-label"); if (top) top.textContent = "战棋模式 · " + faction(s.player.faction).name + " · 八人酒馆";
    const turn = $("turn-badge"); if (turn) turn.textContent = "第 " + s.round + " 轮";
    const mini = $("log-mini"); if (mini) mini.textContent = s.log[s.log.length - 1] || "八人入局。";
    const exit = $("btn-game-home"); if (exit) { exit.hidden = false; exit.textContent = "← 退出战棋"; exit.onclick = () => openSetup(); }
    heroPanel($("opponent-hero"), s.opponent || s.player, s.opponent ? s.opponent.faction : s.player.faction, "enemy");
    heroPanel($("player-hero"), s.player, s.player.faction, "player");
    fillBoard("enemy-board", s.opponent ? s.opponent.board : [], null, null);
    fillBoard("player-board", s.player.board, s, true);
    const rail = $("vein-row"); if (rail) { rail.hidden = false; clear(rail); rail.className = "vein-row battler-classic-rail"; rail.appendChild(lobbyNode(s)); }
    fillShop(s);
    fillDock(s);
    const gameScreen = $("screen-game"); if (gameScreen) gameScreen.classList.toggle("battler-fighting", s.phase === "fighting");
    const hint = $("game-hint"); if (hint) hint.textContent = s.phase === "shop" ? "买入随从 · 点击己方随从可卖出 · 三连成金 · 开战" : s.phase === "result" ? "战斗结束，点下一轮继续。" : s.phase === "fighting" ? "交战结算中…" : "账已结清。";
    ensureClassicBars(s);
    if (s.phase === "fighting" && s.fightPreview && s.fightPreview.length) {
      const old = $("battler-fight-feed"); if (old) old.remove();
      const feed = el("div", "battler-fight-feed"); feed.id = "battler-fight-feed";
      feed.appendChild(el("div", "panel-label", "交战 / COMBAT"));
      s.fightPreview.forEach(x => feed.appendChild(el("div", null, x)));
      const screen = $("screen-game"); if (screen) screen.appendChild(feed);
    }
    if (s.phase !== "fighting") { const old = $("battler-fight-feed"); if (old) old.remove(); }
    const log = $("log-list"); if (log) { clear(log); s.log.slice(-10).forEach(x => log.appendChild(el("div", "log-line", x))); }
    if (s.phase === "done") clearSavedRun(); else saveRun();
  }
  function fillBoard(id, units, s, sell) {
    const box = $(id); if (!box) return;
    clear(box);
    box.classList.add("battler-classic-board");
    if (!units.length) box.appendChild(el("div", "battler-empty-board", "空阵位"));
    units.forEach((u, i) => box.appendChild(boardCard(u, i, sell ? s : null)));
  }
  function lobbyNode(s) {
    const wrap = el("div", "battler-classic-lobby");
    for (const p of s.players) {
      const row = el("div", "battler-classic-player" + (p.you ? " you" : "") + (p.alive ? "" : " dead") + (p === s.opponent ? " matched" : ""));
      row.appendChild(el("strong", null, p.you ? "你" : p.name));
      row.appendChild(el("span", null, Math.max(0, p.hp) + " 生命"));
      row.appendChild(el("small", null, p.alive ? (p === s.opponent ? "本轮对手" : "存活") : "淘汰"));
      wrap.appendChild(row);
    }
    return wrap;
  }
  function fillShop(s) {
    const hand = $("hand"); if (!hand) return;
    clear(hand);
    if (s.phase !== "shop") return;
    const discover = s.discoverOptions;
    const list = discover || s.shop;
    list.forEach((def, i) => {
      const card = el("div", "hand-card type-minion battler-classic-shop");
      const art = artPath(def);
      if (art) { const a = el("div", "card-art"); a.style.backgroundImage = "url('" + art + "')"; card.appendChild(a); }
      const cost = el("div", "battler-shop-cost", discover ? "发现" : "3"); cost.style.cssText = "position:absolute;left:4px;top:4px;z-index:9999;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(4,14,15,.95);border:1px solid rgba(127,211,200,.6);color:#bcece1;font-size:10px;"; card.appendChild(cost);
      const nm = el("div", "battler-shop-name", def.name); nm.style.cssText = "position:absolute;left:4px;right:4px;bottom:24px;z-index:9999;color:#fff3cf;font-size:10px;line-height:1.25;background:rgba(2,9,10,.94);padding:2px 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"; card.appendChild(nm);
      const st = el("div", "battler-shop-stats", (def.attack || 1) + " / " + (def.health || 1)); st.style.cssText = "position:absolute;left:4px;right:4px;bottom:5px;z-index:9999;color:#d5f0e7;font-size:10px;background:rgba(2,9,10,.94);padding:2px 3px;"; card.appendChild(st);
      card.onclick = () => discover ? chooseDiscover(s, i) : buy(s, i);
      hand.appendChild(card);
    });
  }
  function fillDock(s) {
    const dock = $("hero-power-dock"); if (!dock) return;
    dock.hidden = false; clear(dock);
    if (s.phase === "shop") {
      const roll = el("button", "btn btn-small btn-ghost", "刷新 · 1 账"); roll.disabled = s.gold < 1; roll.onclick = () => reroll(s);
      const tierCost = s.player.tier >= 6 ? 0 : TIER_COSTS[s.player.tier - 1];
      const up = el("button", "btn btn-small btn-ghost", s.player.tier >= 6 ? "酒馆满级" : "升级 · " + tierCost + " 账"); up.disabled = s.player.tier >= 6 || s.gold < tierCost; up.onclick = () => upgrade(s);
      dock.appendChild(roll); dock.appendChild(up);
    }
    const stats = el("span", "battler-classic-gold", "账 " + s.gold + " · 酒馆 " + s.player.tier + " · " + s.players.filter(p => p.alive).length + "/8" + (synergyText(s.player.board) ? " · 协同 " + synergyText(s.player.board) : ""));
    dock.appendChild(stats);
    dock.appendChild(el("span", "battler-odds-line", "概率 " + oddsText(s.player.tier)));
  }

  global.GokBattler = { open: openSetup, openSetup, openBattle };
})(typeof globalThis !== "undefined" ? globalThis : this);
