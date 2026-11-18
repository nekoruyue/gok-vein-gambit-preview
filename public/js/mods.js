/* 《戈克世界：流脉拼局》修饰器注册表 v1
 * 一套字段，三种用途：每日挑战 / 赛季周规则 / 疯狂实验。
 * 只做「开局状态」类修饰器；牌库约束用 kind:"deck"。
 */
(function (global) {
  "use strict";
  const registry = new Map();
  const CATEGORIES = ["生命", "资源", "规则", "流脉", "开场", "牌库"];

  function register(def) {
    if (!def || !def.id) throw new Error("mod 需要 id");
    registry.set(def.id, Object.assign({ scopes: [], category: "规则", kind: "state" }, def));
    return def;
  }
  function get(id) { return registry.get(id) || null; }
  function list(scope) {
    const all = Array.from(registry.values());
    return scope ? all.filter((m) => (m.scopes || []).indexOf(scope) >= 0) : all;
  }
  function ids(scope) { return list(scope).map((m) => m.id); }

  // 与 content.js 的 seedFrom 同一套 FNV-1a，保证「同一天同一组合」
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < String(str).length; i++) h = Math.imul(h ^ String(str).charCodeAt(i), 16777619);
    return h >>> 0;
  }

  /** 同一天：1 主 + 1 副，类别不同。
   *  7 天内主修饰器不重复（滑动窗口，不是自然周——自然周会在跨周时撞车）。
   *  做法：从锚点日推到现在，每天在「排除掉最近 6 天用过的主修饰器」的池子里挑一个。
   *  只用 hash 定序，不碰 Math.random，所以同一天任何时候算出来都一样。 */
  const DAILY_ANCHOR_DAY = Math.floor(Date.UTC(2026, 0, 1) / 86400000);
  const dailyPickCache = new Map();
  function mainModForDay(dayNum, pool) {
    const key = dayNum + "|" + pool.length;
    if (dailyPickCache.has(key)) return dailyPickCache.get(key);
    const start = Math.max(DAILY_ANCHOR_DAY, dayNum - 30);   // 回放 30 天足够把 6 天窗口填满
    const recent = [];
    let picked = pool[0];
    for (let d = start; d <= dayNum; d++) {
      const used = new Set(recent);
      const cands = pool.filter((m) => !used.has(m.id));
      picked = cands.length ? cands[hash("daily-slide:" + d) % cands.length] : pool[hash("daily:" + d) % pool.length];
      recent.push(picked.id);
      if (recent.length > 6) recent.shift();
    }
    dailyPickCache.set(key, picked);
    return picked;
  }
  function pickDaily(dateKey, count) {
    const pool = list("daily");
    if (!pool.length) return [];
    const dayNum = Math.floor(Date.parse(dateKey + "T00:00:00Z") / 86400000);
    const main = mainModForDay(dayNum, pool);
    const subPool = pool.filter((m) => m.id !== main.id && m.category !== main.category);
    const sub = subPool.length ? subPool[hash("daily-sub:" + dateKey) % subPool.length] : null;
    return [main].concat(sub ? [sub] : []).slice(0, count || 2);
  }

  /** 开局应用：state 类逐个 apply；deck 类由 content 在发牌前处理 */
  function applyState(state, modIds) {
    if (!state) return [];
    const applied = [];
    for (const id of modIds || []) {
      const mod = get(id);
      if (!mod || mod.kind === "deck" || typeof mod.apply !== "function") continue;
      try { mod.apply(state); applied.push(id); } catch (e) { /* 单个修饰器失败不能拖垮对局 */ }
    }
    return applied;
  }

  function eachPlayer(state, fn) {
    for (const p of (state && state.players) || []) if (p) fn(p);
  }

  /* ===== 生命 ===== */
  register({
    id: "bloodMoon", name: "血月", category: "生命", scopes: ["daily", "season", "lab"],
    desc: "双方生命上限 -5。",
    apply(state) { eachPlayer(state, (p) => { p.maxHp = Math.max(10, (p.maxHp || 30) - 5); p.hp = Math.min(p.hp, p.maxHp); }); }
  });
  register({
    id: "ironDay", name: "铁壁日", category: "生命", scopes: ["daily", "season"],
    desc: "双方领袖开局获得 2 点护甲。",
    apply(state) { eachPlayer(state, (p) => { p.armor = (p.armor || 0) + 2; }); }
  });
  register({
    id: "equalBlood", name: "同血", category: "生命", scopes: ["daily"],
    desc: "双方生命拉平到较低的一方。",
    apply(state) {
      const ps = (state && state.players) || [];
      if (ps.length < 2) return;
      const low = Math.min(ps[0].hp, ps[1].hp);
      ps.forEach((p) => { p.hp = low; });
    }
  });
  register({
    id: "thinBlood", name: "薄血", category: "生命", scopes: ["daily"],
    desc: "双方生命上限降到 20。",
    apply(state) { eachPlayer(state, (p) => { p.maxHp = 20; p.hp = Math.min(p.hp, 20); }); }
  });

  /* ===== 资源 ===== */
  register({
    id: "veinTide", name: "流脉湍急", category: "资源", scopes: ["daily", "season", "lab"],
    desc: "开局流脉为 5。",
    apply(state) { state.vein = 5; }
  });
  register({
    id: "manaFlood", name: "行动力沸腾", category: "资源", scopes: ["daily", "season", "lab"],
    desc: "双方最大行动力 +1，当前行动力补满。",
    apply(state) { eachPlayer(state, (p) => { p.maxMana = Math.min(10, (p.maxMana || 1) + 1); p.mana = p.maxMana; }); }
  });
  register({
    id: "shortHand", name: "起手少一", category: "资源", scopes: ["daily"],
    desc: "双方起手各少 1 张牌。",
    apply(state) {
      eachPlayer(state, (p) => {
        if (!Array.isArray(p.hand) || !p.hand.length) return;
        const c = p.hand.pop();
        p.discard = Array.isArray(p.discard) ? p.discard : [];
        p.discard.push(c);
      });
    }
  });
  register({
    id: "manaDrought", name: "行动力枯竭", category: "资源", scopes: ["daily"],
    desc: "双方最大行动力 -1（不低于 3）。",
    apply(state) { eachPlayer(state, (p) => { p.maxMana = Math.max(3, (p.maxMana || 1) - 1); p.mana = Math.min(p.mana, p.maxMana); }); }
  });

  /* ===== 规则 ===== */
  register({
    id: "noArmor", name: "赤身", category: "规则", scopes: ["daily", "season"],
    desc: "双方开局没有护甲。",
    apply(state) { eachPlayer(state, (p) => { p.armor = 0; }); }
  });
  register({
    id: "doubleArmor", name: "重甲", category: "规则", scopes: ["daily"],
    desc: "双方开局护甲翻倍。",
    apply(state) { eachPlayer(state, (p) => { p.armor = (p.armor || 0) * 2; }); }
  });
  register({
    id: "fatBlood", name: "厚血", category: "规则", scopes: ["daily", "season"],
    desc: "双方生命上限 +8。",
    apply(state) { eachPlayer(state, (p) => { p.maxHp = (p.maxHp || 30) + 8; p.hp += 8; }); }
  });
  register({
    id: "noHeroPower", name: "封印领袖", category: "规则", scopes: ["daily", "season"],
    desc: "本局双方都不能使用领袖技能。",
    apply(state) { eachPlayer(state, (p) => { p.heroPowerBlocked = true; }); }
  });
  register({
    id: "swapBlood", name: "换血", category: "规则", scopes: ["daily"],
    desc: "双方领袖生命在开局互换（各自不超过生命上限）。",
    apply(state) {
      const ps = (state && state.players) || [];
      if (ps.length < 2) return;
      const a = ps[0].hp, b = ps[1].hp;
      ps[0].hp = Math.max(1, Math.min(b, ps[0].maxHp || b));
      ps[1].hp = Math.max(1, Math.min(a, ps[1].maxHp || a));
    }
  });
  register({
    id: "burnDeck", name: "焚页", category: "规则", scopes: ["daily"],
    desc: "双方牌库开局各被烧掉 6 张进弃牌堆（牌库保底留 8 张）。",
    apply(state) {
      for (const p of (state && state.players) || []) {
        const deck = Array.isArray(p.deck) ? p.deck : [];
        const burn = Math.min(6, Math.max(0, deck.length - 8));
        p.discard = Array.isArray(p.discard) ? p.discard : [];
        for (let i = 0; i < burn; i++) {
          const idx = deck.length > 1 ? (hash("burn:" + state.seed + ":" + p.index + ":" + i) % deck.length) : 0;
          const c = deck.splice(idx, 1)[0];
          if (c) p.discard.push(c);
        }
      }
    }
  });

  /* ===== 流脉 ===== */
  register({
    id: "veinZero", name: "干脉", category: "流脉", scopes: ["daily"],
    desc: "开局流脉为 0。",
    apply(state) { state.vein = 0; }
  });
  register({
    id: "veinThree", name: "初脉", category: "流脉", scopes: ["daily", "season"],
    desc: "开局流脉为 3。",
    apply(state) { state.vein = 3; }
  });
  register({
    id: "veinEight", name: "丰脉", category: "流脉", scopes: ["daily"],
    desc: "开局流脉为 8。",
    apply(state) { state.vein = 8; }
  });
  register({
    id: "veinEleven", name: "满脉", category: "流脉", scopes: ["daily"],
    desc: "开局流脉为 11。",
    apply(state) { state.vein = 11; }
  });

  /* ===== 开场 ===== */
  register({
    id: "openingWound", name: "开场创伤", category: "开场", scopes: ["daily"],
    desc: "双方领袖开局各受到 3 点伤害。",
    apply(state) { eachPlayer(state, (p) => { p.hp = Math.max(1, p.hp - 3); }); }
  });
  register({
    id: "openingShield", name: "开场护盾", category: "开场", scopes: ["daily"],
    desc: "双方领袖开局获得 5 点护甲。",
    apply(state) { eachPlayer(state, (p) => { p.armor = (p.armor || 0) + 5; }); }
  });
  register({
    id: "openingMana", name: "开场余力", category: "开场", scopes: ["daily"],
    desc: "双方开局行动力 +3。",
    apply(state) { eachPlayer(state, (p) => { p.mana = Math.min(p.maxMana || 10, (p.mana || 0) + 3); }); }
  });
  register({
    id: "openingVein", name: "开场脉动", category: "开场", scopes: ["daily"],
    desc: "开盘流脉 +3。",
    apply(state) { state.vein = Math.min(12, (state.vein || 0) + 3); }
  });
  register({
    id: "reshuffleOpening", name: "重洗起手", category: "开场", scopes: ["daily"],
    desc: "双方起手全部洗回牌库，再按原张数重新抽（留牌不再由你决定）。",
    apply(state) {
      for (const p of (state && state.players) || []) {
        const hand = Array.isArray(p.hand) ? p.hand : [];
        if (!hand.length) continue;
        const n = hand.length;
        p.deck = (Array.isArray(p.deck) ? p.deck : []).concat(hand);
        p.hand = [];
        let s = hash("reshuffle:" + state.seed + ":" + p.index) || 1;
        for (let i = p.deck.length - 1; i > 0; i--) {
          s = Math.imul(s ^ (i + 1), 16777619) >>> 0;
          const j = s % (i + 1);
          const t = p.deck[i]; p.deck[i] = p.deck[j]; p.deck[j] = t;
        }
        for (let i = 0; i < n; i++) {
          const c = p.deck.shift();
          if (c) p.hand.push(c);
        }
      }
    }
  });

  /* ===== 牌库 =====
   * kind:"deck" 的修饰器不改 state，改的是发牌前那套牌：
   * filter(faction, ids) 返回新的牌组 id 数组，由 content.js 负责补齐到 30 张+装备。
   */
  register({
    id: "noLegendaryDeck", name: "无传说牌库", category: "牌库", kind: "deck", scopes: ["daily", "season"],
    desc: "双方牌组不带任何传说卡。",
    filter(faction, cards) { return cards.filter((id) => { const c = global.GokData && global.GokData.CARDS[id]; return !c || c.rarity !== "legendary"; }); }
  });
  register({
    id: "allCommonDeck", name: "全普通牌库", category: "牌库", kind: "deck", scopes: ["daily"],
    desc: "双方牌组只保留普通卡。",
    filter(faction, cards) { return cards.filter((id) => { const c = global.GokData && global.GokData.CARDS[id]; return !c || c.rarity === "common"; }); }
  });
  register({
    id: "minionsOnlyDeck", name: "随从牌库", category: "牌库", kind: "deck", scopes: ["daily"],
    desc: "双方牌组只保留随从。",
    filter(faction, cards) { return cards.filter((id) => { const c = global.GokData && global.GokData.CARDS[id]; return !c || c.type === "minion" || c.type === "equipment"; }); }
  });
  register({
    id: "highCostDeck", name: "高费牌库", category: "牌库", kind: "deck", scopes: ["daily"],
    desc: "双方牌组里 2 费以下的卡全部移除。",
    filter(faction, cards) { return cards.filter((id) => { const c = global.GokData && global.GokData.CARDS[id]; return !c || (c.cost || 0) >= 2; }); }
  });
  register({
    id: "lowCostDeck", name: "快攻牌库", category: "牌库", kind: "deck", scopes: ["daily"],
    desc: "双方牌组只保留 3 费及以下的卡。",
    filter(faction, cards) { return cards.filter((id) => { const c = global.GokData && global.GokData.CARDS[id]; return !c || (c.cost || 0) <= 3; }); }
  });
  register({
    id: "noEquipmentDeck", name: "轻装牌库", category: "牌库", kind: "deck", scopes: ["daily"],
    desc: "双方牌组不带装备与阵型，只剩随从与战术。",
    filter(faction, cards) { return cards.filter((id) => { const c = global.GokData && global.GokData.CARDS[id]; return !c || (c.type !== "equipment" && c.type !== "formation"); }); }
  });

  global.GokMods = {
    register: register,
    get: get,
    list: list,
    ids: ids,
    byScope: list,
    pickDaily: pickDaily,
    applyState: applyState,
    hash: hash,
    CATEGORIES: CATEGORIES
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
