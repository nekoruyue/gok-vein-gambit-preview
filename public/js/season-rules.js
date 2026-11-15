/* 赛季周规则 v1（2026-11-15）
 * 6 周一个循环，每周一 10:00（UTC+8）切换一条开局规则。
 * 服务端在开局时把规则写进 state；客户端用同一份文件算「本周是哪一条」用来展示。
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.GokSeason = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  // 锚点：2026-01-05（周一）10:00 +08:00
  const ANCHOR = Date.UTC(2026, 0, 5, 2, 0, 0);
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  const RULES = [
    { id: "veinStart2", name: "流脉周", desc: "开局流脉为 2。", apply(state) { state.vein = Math.max(state.vein || 0, 2); } },
    { id: "armorWeek", name: "护甲周", desc: "双方领袖开局获得 3 点护甲。", apply(state) { for (const p of state.players || []) p.armor = (p.armor || 0) + 3; } },
    { id: "hpWeek", name: "生命周", desc: "双方生命上限 +5。", apply(state) { for (const p of state.players || []) { p.maxHp = (p.maxHp || 30) + 5; p.hp += 5; } } },
    { id: "manaWeek", name: "行动力周", desc: "双方最大行动力 +1。", apply(state) { for (const p of state.players || []) { p.maxMana = Math.min(10, (p.maxMana || 1) + 1); p.mana = p.maxMana; } } },
    { id: "noPowerWeek", name: "封印周", desc: "本局双方不能使用领袖技能。", apply(state) { for (const p of state.players || []) p.heroPowerBlocked = true; } },
    { id: "finalWeek", name: "决赛周", desc: "没有额外规则，纯凭牌组。", apply() {} }
  ];

  function weekIndex(now) {
    const t = now == null ? Date.now() : now;
    return Math.floor((t - ANCHOR) / WEEK_MS);
  }
  function seasonWeek(now) { return ((weekIndex(now) % RULES.length) + RULES.length) % RULES.length; }
  function ruleFor(now) { return RULES[seasonWeek(now)]; }
  function nextChangeAt(now) {
    const t = now == null ? Date.now() : now;
    const start = ANCHOR + weekIndex(t) * WEEK_MS;
    return start + WEEK_MS;
  }
  function applyToGame(state, now) { if (state) ruleFor(now).apply(state); return state; }

  return { RULES: RULES, ANCHOR: ANCHOR, WEEK_MS: WEEK_MS, weekIndex: weekIndex, seasonWeek: seasonWeek, ruleFor: ruleFor, nextChangeAt: nextChangeAt, applyToGame: applyToGame };
});
