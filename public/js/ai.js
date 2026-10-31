/* 《戈克世界：流脉牌局》AI v0.2
 *
 * 骨架沿用 v0.1（枚举候选 + 深度搜索 + 局面评估）——这套在基准里是最能赢的，
 * 所以不推倒重来，只补 v0.1 明确缺失的「知识」和「安全阀」：
 *
 *  1) 认知层：211 张卡的效果是 {type:"ops", ops:[...]}，v0.1 的 effectScore 里没有 "ops" 分支，
 *     等于看不懂 40% 的卡（只给兜底的 1.8 分、目标一律按「对面最贵的随从」挑）。
 *     现在有 ops 走树估值 + 按效果挑目标（冻结挑高攻、沉默挑带词条的、伤害挑能杀的）。
 *  2) 斩杀：v0.1 一有守备就整体 return false（引擎是按阵位挡刀的），rush 随从也被算进打脸；
 *     findLethalAction 只试前 36 条动作。现在按阵位算真实打脸线（含连携 +1、飓风两刀、手上直伤），
 *     并在克隆上验证出完整斩杀序列。
 *  3) 稳定：去掉 easy 档的 Math.random（同一 seed 必须同结果，UI 每步要调两次 chooseAction）；
 *     搜索成本按难度设硬上限（不再 depth3 × 22 候选 = 1474 次深克隆）；
 *     动作被规则拒绝 / 一步没推动时强制推进回合，绝不空转。
 *  4) 难度分层：easy/normal/hard/nightmare 用「能力开关 + 可量化的误判率」区分，
 *     不再靠「深度差 1」这种看不见也测不出来的东西。
 *  5) 遗漏项：欠债卡（28 张，抽到就永久堵手牌）、阵型/装备、发现/坟场按牌效挑。
 *
 * 只用公开信息 + 自己的手牌；绝密档沿用 v0.1 的设定，会额外估一下你手上的爆发。
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory(require("./data.js"), require("./engine.js"));
  else root.GokAI = factory(root.GokData, root.GokEngine);
})(typeof globalThis !== "undefined" ? globalThis : this, function (D, E) {
  "use strict";

  const ZONES = (E.ZONES || ["left", "center", "right"]).slice();
  const CARD = function (id) { return (id && D.CARDS[id]) || null; };

  /* ==================== 基础工具 ==================== */
  function enemyOf(state, p) { return state.players[1 - p.index]; }
  function live(m) { return !!m && !m.dead; }
  function ownMinions(p) { return E.allMinions(p).filter(live); }
  function enemyMinions(state, p) { return E.allMinions(enemyOf(state, p)).filter(live); }
  function sumOf(list, f) { let n = 0; for (let i = 0; i < list.length; i++) n += f(list[i]); return n; }

  function minionValue(m) {
    if (!m || m.dead) return 0;
    let v = m.attack * 2 + m.health;
    if (m.taunt) v += 2;
    if (m.divineShield) v += 3;
    if (m.windfury) v += Math.max(1, m.attack);
    if (m.poisonous) v += 2;
    if (m.lifesteal) v += 1;
    if (m.reborn) v += 1.5;
    if (m.stealth) v += 1;
    if (m.rush || m.charge) v += 1;
    if (m.combo && !m.hasAttacked) v += 1;
    if (m.attack <= 0) v -= 3;
    if (m.frozenTurns > 0) v -= 1;
    if (m.bounty != null) v -= 1;
    return v;
  }

  /* 确定性噪声：不许 Math.random，seed 决定一切 */
  function noiseUnit(state, p, salt) {
    let h = (state.seed >>> 0) ^ Math.imul(state.turnNumber | 0, 2654435761)
      ^ Math.imul((state.round | 0) + 1, 40503) ^ Math.imul(((p.hand || []).length + 1) * 97, 2246822519)
      ^ Math.imul(E.allMinions(p).length + 1, 3266489917) ^ Math.imul((salt | 0) + 7, 668265263);
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  /* ==================== 难度分档 ==================== */
  /* depth/limit 是搜索预算（0 = 只走贪心分层），noise 是「误判率」。
   * 每档的强度差都用配对消融量过：误判 0.28 ≈ -7%，0.1 ≈ -2%。 */
  const TIERS = {
    easy: {
      key: "easy", depth: 0, limit: 0, noise: 0.55, pickPool: 3,
      lethalPlan: false, lethalClear: false, endEarly: 0.18, playThreshold: 2.5, threat: false, debt: true
    },
    normal: {
      key: "normal", depth: 0, limit: 0, noise: 0.3, pickPool: 2,
      lethalPlan: true, lethalClear: false, endEarly: 0.12, playThreshold: 2.1, threat: false, debt: true
    },
    hard: {
      key: "hard", depth: 1, limit: 6, noise: 0.15, pickPool: 2,
      lethalPlan: true, lethalClear: true, endEarly: 0.06, playThreshold: 1.8, threat: false, debt: true
    },
    nightmare: {
      key: "nightmare", depth: 2, limit: 14, limit2: 7, noise: 0, pickPool: 1,
      lethalPlan: true, lethalClear: true, endEarly: 0, playThreshold: 1.8, threat: true, debt: true
    }
  };
  function tierOf(state, p) {
    const key = (p && p.aiDifficulty) || state.aiDifficulty || "normal";
    return TIERS[key] || TIERS.normal;
  }

  /* ==================== 阵型光环 ==================== */
  function formationAura(p, zone) {
    const out = { attack: 0, health: 0, attackVsFrozen: 0, taunt: false };
    const seen = Object.create(null);
    for (const f of (p.formations || [])) {
      if (!f || seen[f.cardId]) continue;
      seen[f.cardId] = true;
      if (f.zone !== zone) continue;
      if (f.turnsLeft != null && f.turnsLeft <= 0) continue;
      const d = CARD(f.cardId);
      const fm = d && d.formation;
      if (!fm) continue;
      out.attack += fm.attack || 0;
      out.health += fm.health || 0;
      out.attackVsFrozen += fm.attackVsFrozen || 0;
      out.taunt = out.taunt || !!fm.taunt;
    }
    return out;
  }

  /* 一次攻击的真实伤害（连携 +1、阵型对冻结加成）——v0.1 完全没算连携 */
  function attackDamage(state, p, a, target) {
    if (!a) return 0;
    let dmg = a.attack;
    if (a.combo || a.windfury) {
      for (const x of ownMinions(p)) {
        if (x.uid !== a.uid && x.zone === a.zone) { dmg += 1; break; }
      }
    }
    if (target && target.frozenTurns > 0) dmg += formationAura(p, a.zone).attackVsFrozen;
    return dmg;
  }

  /* ==================== 卡牌效果解读（ops） ==================== */
  function effectEntry(def) { return (def && (def.battlecry || def.spell)) || null; }
  function opsList(def) {
    const e = effectEntry(def);
    return e && e.type === "ops" && Array.isArray(e.ops) ? e.ops : null;
  }
  function flattenOps(list, out) {
    out = out || [];
    for (const op of (list || [])) {
      if (!op) continue;
      out.push(op);
      if (op.then) flattenOps(op.then, out);
      if (op.else) flattenOps(op.else, out);
      if (op.ops) flattenOps(op.ops, out);
    }
    return out;
  }
  function opAmount(list, name) {
    let n = 0;
    for (const op of flattenOps(list)) if (op.op === name) n += (op.amount || 1);
    return n;
  }
  function hasOp(list, names) {
    for (const op of flattenOps(list)) if (names.indexOf(op.op) >= 0) return true;
    return false;
  }
  function corpseCount(state) {
    let n = 0;
    for (const e of (state.discard || [])) if (e && e.wasBounty) n++;
    return n;
  }

  /* 条件估算：只判「现在成不成立」，判不了返回 null（两边取平均） */
  function condHolds(state, p, cond, target) {
    const mine = ownMinions(p), theirs = enemyMinions(state, p);
    switch (cond) {
      case "controlFormation": return (p.formations || []).length > 0;
      case "controlTaunt": return mine.some(function (m) { return m.taunt; });
      case "controlDemon": case "otherDemon":
        return theirs.concat(mine).some(function (m) { return /魔物|demon/i.test(m.name || ""); });
      case "controlBeast": case "controlFox":
        return theirs.concat(mine).some(function (m) { return /兽|狐|beast|fox/i.test(m.name || ""); });
      case "sameZoneAlly": return !!(target && mine.some(function (m) { return m.uid !== target.uid && m.zone === target.zone; }));
      case "sameZoneTaunt": return !!(target && mine.some(function (m) { return m.uid !== target.uid && m.zone === target.zone && m.taunt; }));
      case "vein": return (state.vein || 0) >= 4;
      case "tookDamage": return p.hp < p.maxHp;
      case "spells": return (p.spellsCastThisTurn || 0) > 0;
      case "spells2": return (p.spellsCastThisTurn || 0) >= 2;
      case "handSpell": return (p.hand || []).some(function (c) { const d = CARD(c.cardId); return d && d.type === "spell"; });
      case "armor": return (p.armor || 0) > 0;
      case "armorGained": return p.armorGainedTurn === state.turnNumber;
      case "bountyCompleted": return (p.bountyCompleted || 0) > 0;
      case "bountyExists": return theirs.some(function (m) { return m.bounty != null; });
      case "reflux": return (state.vein || 0) >= 3;
      case "refluxFull": return (state.vein || 0) >= 6;
      case "freezeCast": return (p.freezeCastsThisTurn || 0) > 0;
      case "healedHero": return p.healedTurn === state.turnNumber;
      case "zhenmaiFull": case "carveCard": case "targetDead": return false;
      case "targetFrozen": return !!(target && target.frozenTurns > 0);
      case "targetBounty": return !!(target && target.bounty != null);
      case "targetTaunt": return !!(target && target.taunt);
      case "targetDamaged": return !!(target && target.health < target.maxHealth);
      case "targetCostLow": return !!(target && ((CARD(target.cardId) || {}).cost || 0) <= 3);
      case "targetDemon": return !!(target && /魔物|demon/i.test(target.name || ""));
      case "enemyNoMinions": return theirs.length === 0;
      case "hand": case "handAtLeast": return (p.hand || []).length >= 4;
      case "otherCards": return (p.hand || []).length > 2;
      case "lostHealth": return p.hp < p.maxHp;
      default: return null;
    }
  }

  /* 牌库见底时抽牌＝自伤：第 1 张空抽打 1+疲劳、第 2 张打 2+疲劳……
   * 之前完全不看牌库，AI 会把抽牌引擎一直开到把自己抽死（模拟里 47~80% 的败局是空牌库倒地） */
  function fatigueCost(p, n) {
    const left = (p.deck || []).length;
    if (!n || n <= 0 || left >= n) return 0;
    const over = n - left;
    const f = p.fatigue || 0;
    let dmg = 0;
    for (let i = 1; i <= over; i++) dmg += f + i;
    return dmg * 1.15;
  }

  /* 单个 op 的价值（1 分 ≈ 1 点血 / 半个小随从） */
  function opValue(state, p, op, target) {
    const foe = enemyOf(state, p);
    const mine = ownMinions(p), theirs = enemyMinions(state, p);
    const amount = op.amount == null ? 1 : op.amount;
    switch (op.op) {
      case "draw": {
        const room = Math.max(0, 8 - (p.hand || []).length);
        const base = 2.15 * Math.min(amount, Math.max(amount - 1, room)) + 0.6 * amount;
        return base - fatigueCost(p, amount);
      }
      case "armor": return 0.95 * amount;
      case "healHero": return 0.8 * Math.min(amount, Math.max(0, p.maxHp - p.hp));
      case "freezeTarget": return target ? 2.4 + target.attack * 0.55 : 1.1;
      case "summon": {
        const td = CARD(op.token);
        const body = td ? (td.attack || 0) * 1.35 + (td.health || 0) * 1.05 : 3;
        return body * (op.count || 1) + 0.4;
      }
      case "damageTarget": {
        if (!target) return amount * 0.5;
        const shield = target.divineShield && !target.silenced;
        const kills = !shield && amount >= target.health;
        return amount * 0.75 + (kills ? minionValue(target) * 0.75 : 0) + (target.taunt ? 0.8 : 0);
      }
      case "damageAllEnemies": {
        let v = 0;
        for (const m of theirs) {
          const shield = m.divineShield && !m.silenced;
          v += shield ? amount * 0.4 : Math.min(amount, m.health) * 0.8 + (amount >= m.health ? minionValue(m) * 0.25 : 0);
        }
        return v;
      }
      case "damageHero": return amount * 1.25 * (foe.hp + (foe.armor || 0) <= amount + 6 ? 1.5 : 1);
      case "damageHeroSelf": return -amount * 1.5 * (p.hp <= 12 ? 1.7 : 1);
      case "destroyTarget": return target ? 2 + minionValue(target) * 0.95 : 1.5;
      case "silenceTarget": {
        if (!target) return 1.2;
        const kwCount = (target.keywords || []).length + (target.taunt ? 1 : 0) + (target.passive ? 1 : 0);
        return 1.4 + kwCount * 1.3 + (target.taunt ? 1.0 : 0);
      }
      case "buffSelf": return (op.attack || 0) * 1.6 + (op.health || 0) * 1.15;
      case "buffTarget": return target ? (op.attack || 0) * 1.5 + (op.health || 0) * 1.1 : 0.6;
      case "mana": return 1.55 * amount;
      case "nextMana": return 1.35 * amount;
      case "graveSummon": {
        const pile = (state.discard || []).filter(function (e) { return e && e.kind === "minion"; }).length;
        return pile ? 2.6 * (op.count || 1) : 0.3;
      }
      case "graveSummonTokens": return 2.2 * (op.count || 1);
      case "discover": return 2.5;
      case "markBountyTarget": return target ? 1.9 : 0.5;
      case "markRandomBounties": return 1.3;
      case "freezeAllEnemies": return 1.5 * theirs.length;
      case "damageFrozenEnemies": {
        let n = 0;
        for (const m of theirs) if (m.frozenTurns > 0) n += Math.min(amount, m.health) * 0.8;
        return n;
      }
      case "damageAllMinions": {
        let v = 0;
        for (const m of theirs) v += Math.min(amount, m.health) * 0.7 + (amount >= m.health ? 1.2 : 0);
        for (const m of mine) v -= Math.min(amount, m.health) * 0.95 + (amount >= m.health ? 1.6 : 0);
        return v;
      }
      case "tauntSelf": return 2.2;
      case "grantRushTarget": return target ? 2.2 : 1;
      case "grantWindfuryTarget": return target ? 1.5 + target.attack * 0.55 : 1;
      case "grantRebornTarget": return target ? 2.0 : 1;
      case "grantRushAll": return 2.0;
      case "takeControlRandomEnemy": return theirs.length ? 0.8 * (sumOf(theirs, minionValue) / theirs.length) : 0;
      case "returnTargetToHand": return 0.9;
      case "blockHeroPower": return 0.7;
      case "discardRandom": return -1.3;
      case "freezeImmune": return 0.9;
      case "handCostDown": return 1.9;
      case "zhenmai": return 1.7;
      case "flowDraw": return 2.0;
      case "bountyCorpseDraw": return 1.15 * Math.min(amount, corpseCount(state));
      case "bountyCorpseArmor": return 0.9 * Math.min(amount, corpseCount(state));
      case "bountyCorpseBuff": return 1.3 * Math.min(amount, corpseCount(state));
      case "bountyCorpseDamageHero": return 1.2 * Math.min(amount, corpseCount(state));
      case "grantDeathDraw": return 1.4;
      case "damageRandomEnemy": return amount * 0.95;
      case "if": {
        const cond = condHolds(state, p, op.cond, target);
        const thenV = opsValue(state, p, op.then, target);
        const elseV = opsValue(state, p, op.else, target);
        if (cond === true) return thenV;
        if (cond === false) return elseV;
        return (thenV + elseV) * 0.5 * 0.95;
      }
      case "ops": return opsValue(state, p, op.ops, target);
      default: return 0.55;   // 不认识的 op 给中性分，别当零
    }
  }
  function opsValue(state, p, list, target) {
    let s = 0;
    for (const op of (list || [])) s += opValue(state, p, op, target);
    return s;
  }

  /* 随从身材分（不含战吼） */
  function bodyValue(def) {
    let v = (def.attack || 0) * 1.35 + (def.health || 0) * 1.05;
    const kws = def.keywords || [];
    if (kws.indexOf("taunt") >= 0) v += 1.6;
    if (kws.indexOf("divineShield") >= 0) v += 2.2;
    if (kws.indexOf("windfury") >= 0) v += Math.max(1, def.attack || 0) * 0.7;
    if (kws.indexOf("poisonous") >= 0) v += 1.6;
    if (kws.indexOf("rush") >= 0) v += 1.2;
    if (kws.indexOf("charge") >= 0) v += 1.6;
    if (kws.indexOf("lifesteal") >= 0) v += 0.9;
    if (kws.indexOf("reborn") >= 0) v += 1.1;
    return v;
  }

  /* ==================== 目标选择（按效果挑，而不是只看血线） ==================== */
  function enemyTargetRank(state, p, def, m) {
    const ops = opsList(def);
    const amount = ops ? opAmount(ops, "damageTarget") : 0;
    const kills = amount > 0 && !(m.divineShield && !m.silenced) && amount >= m.health;
    let s = minionValue(m) * 0.6;
    if (kills) s += minionValue(m) * 0.5 + 2;
    if (m.taunt) s += 1.2;
    if (ops) {
      if (hasOp(ops, ["freezeTarget"]) && m.attack >= 3) s += 1.5;
      if (hasOp(ops, ["silenceTarget"])) s += ((m.keywords || []).length + (m.passive ? 1 : 0)) * 1.4 + (m.taunt ? 1 : 0);
      if (hasOp(ops, ["damageFrozenEnemies"]) && m.frozenTurns > 0) s += 2;
      if (hasOp(ops, ["destroyTarget"])) s += m.health * 0.5;
      if (hasOp(ops, ["markBountyTarget"])) s += 1.0;
    }
    return s;
  }
  function friendlyTargetRank(state, p, def, m) {
    const ops = opsList(def);
    const b = def.battlecry || def.spell || {};
    let s = minionValue(m) * 0.35 + m.attack * 0.6;
    if (m.taunt) s += 0.8;
    if (E.allMinions(p).some(function (x) { return x.uid !== m.uid && x.zone === m.zone; })) s += 0.6;
    if (ops) {
      if (hasOp(ops, ["buffTarget", "grantRushTarget", "grantWindfuryTarget", "grantRebornTarget"])) {
        s += m.attack * 0.9 + m.health * 0.2;
        if (!m.hasAttacked) s += 1.2;
        if (m.taunt) s += 0.8;
      }
      if (hasOp(ops, ["healTarget"])) s += Math.max(0, m.maxHealth - m.health) * 0.7;
    } else if (b.type === "heal" || b.type === "healDraw") {
      s = Math.max(0, m.maxHealth - m.health) * 1.2;
      if (s < 0.5) s = m.health * 0.1;
    } else if (b.type === "bloodDraw") {
      s = 20 - m.health * 2;
    }
    return s;
  }
  function bestTarget(state, p, def, opt) {
    if (!opt || !opt.targetType) return null;
    if (def.id === "miyuki" && state.vein >= 6) return null;
    const ids = opt.targets || [];
    if (!ids.length) return null;
    let best = null, bestScore = -1e9;
    for (const uid of ids) {
      const m = E.findMinion(state, uid);
      if (!live(m)) continue;
      const s = opt.targetType === "friendly" ? friendlyTargetRank(state, p, def, m) : enemyTargetRank(state, p, def, m);
      if (s > bestScore) { bestScore = s; best = m; }
    }
    return best;
  }

  /* ==================== 战场事实（一次算好） ==================== */
  function cardCostFor(state, p, c, def) {
    try {
      if (E.getCardCost) return E.getCardCost(state, p, c);
    } catch (e) { /* 兜底 */ }
    return Math.max(0, (def.cost || 0) - (c.discount || 0) - (p.nextCostReduction || 0));
  }

  function battleFacts(state, p) {
    const foe = enemyOf(state, p);
    const mine = ownMinions(p);
    const theirs = enemyMinions(state, p);
    const guards = theirs.filter(function (m) { return m.taunt && !m.stealth; });
    const facts = {
      foe: foe, mine: mine, theirs: theirs, guards: guards,
      foeHp: foe.hp, foeArmor: foe.armor || 0, foeHpArmor: foe.hp + (foe.armor || 0),
      guardZones: {},
      laneFaceIfClear: { left: 0, center: 0, right: 0 },
      faceDamage: 0, faceDamageIfClear: 0,
      burn: [], burnDamage: 0,
      boardAttackMine: 0, boardAttackTheirs: sumOf(theirs, function (m) { return Math.max(0, m.attack); })
    };
    for (const z of ZONES) facts.guardZones[z] = guards.some(function (g) { return g.zone === z; });
    for (const a of mine) {
      if (a.attacksLeft <= 0 || a.frozenTurns > 0 || a.attack <= 0) continue;
      facts.boardAttackMine += a.attack;
      if (!(a.charge || !a.rush)) continue;              // rush 随从本回合打不到脸
      const dmg = attackDamage(state, p, a, null) * ((a.windfury && !a.windfuryExtraUsed) ? 2 : 1);
      facts.laneFaceIfClear[a.zone] += dmg;
      if (!facts.guardZones[a.zone]) facts.faceDamage += dmg;
    }
    facts.faceDamageIfClear = facts.laneFaceIfClear.left + facts.laneFaceIfClear.center + facts.laneFaceIfClear.right;
    let mana = p.mana;
    for (const c of (p.hand || [])) {
      if (c.isDebt) continue;
      const d = CARD(c.cardId);
      if (!d) continue;
      const ops = opsList(d);
      if (!ops) continue;
      const amount = opAmount(ops, "damageHero");
      if (!amount) continue;
      const cost = cardCostFor(state, p, c, d);
      if (cost > mana) continue;
      mana -= cost;
      facts.burn.push({ uid: c.uid, amount: amount, cost: cost });
      facts.burnDamage += amount;
    }
    return facts;
  }

  /* ==================== 斩杀线 ==================== */
  function lethalActions(state, p) {
    const acts = [];
    for (const a of ownMinions(p)) {
      if (a.attacksLeft <= 0 || a.frozenTurns > 0 || a.attack <= 0) continue;
      const o = E.getAttackOptions(state, p.index, a.uid);
      if (!o || !o.ok) continue;
      for (const t of o.targets) acts.push({ type: "attack", attackerUid: a.uid, targetUid: t });
    }
    for (const c of (p.hand || [])) {
      if (c.isDebt) continue;
      const d = CARD(c.cardId);
      if (!d) continue;
      const ops = opsList(d);
      if (!ops) continue;
      const burn = opAmount(ops, "damageHero");
      const kws = d.keywords || [];
      const rushBody = d.type === "minion" && (kws.indexOf("charge") >= 0 || kws.indexOf("rush") >= 0);
      if (!burn && !rushBody) continue;
      const opt = E.getPlayOptions(state, p.index, c.uid);
      if (!opt || !opt.ok) continue;
      const target = bestTarget(state, p, d, opt);
      if (opt.targetType && !target && !d.optionalTarget) continue;
      let zone = null;
      if (d.type === "minion" || d.type === "formation") {
        const zones = opt.zones || [];
        if (!zones.length) continue;
        zone = zones[0];
      }
      acts.push({ type: "play", cardUid: c.uid, opts: { targetUid: target ? target.uid : null, zone: zone, payBlood: !!d.bloodCost } });
    }
    return acts;
  }
  function lethalStepScore(state, p, act) {
    if (act.type === "attack") {
      if (act.targetUid === "hero") return 1000 + attackDamage(state, p, E.findMinion(state, act.attackerUid), null);
      const t = E.findMinion(state, act.targetUid);
      return (t && t.taunt ? 500 : 100) + Math.min(minionValue(t), 20);
    }
    return 10;
  }
  /* 有斩杀路线就返回第一个动作（整条线在克隆上验证过），否则 null */
  function findLethalPlan(state, p, facts) {
    const need = facts.foeHpArmor;
    if (need <= 0) return null;
    if (facts.faceDamage + facts.burnDamage < need && facts.faceDamageIfClear + facts.burnDamage < need) return null;
    let nodes = 0;
    const seen = Object.create(null);
    function sig(s) {
      const me = s.players[p.index];
      let k = me.mana + "|" + (s.status || "") + "|" + me.heroPowerUsed + "|";
      for (const m of E.allMinions(me)) if (!m.dead) k += m.uid + ":" + m.attacksLeft + ",";
      return k;
    }
    function dfs(s, depth, acc) {
      if (s.status === "gameover") return s.winner === p.index ? acc : null;
      if (depth <= 0 || nodes > 64) return null;
      const sp = s.players[p.index];
      const acts = lethalActions(s, sp);
      if (!acts.length) return null;
      acts.sort(function (x, y) { return lethalStepScore(s, sp, y) - lethalStepScore(s, sp, x); });
      for (const act of acts.slice(0, 5)) {
        nodes++;
        const next = applyAction(s, p.index, act);
        if (!next) continue;
        const k = sig(next);
        if (seen[k]) continue;
        seen[k] = true;
        const r = dfs(next, depth - 1, acc.concat([act]));
        if (r) return r;
      }
      return null;
    }
    return dfs(state, 7, []);
  }
  function factLethal(facts) { return facts.faceDamage + facts.burnDamage >= facts.foeHpArmor; }

  /* ==================== 克隆 / 落子 ==================== */
  /* 搜索只需要规则数据，克隆前把日志/事件摘掉，深克隆成本直接砍一半（v0.1 最大的性能坑） */
  function cloneLight(state) {
    const keepLog = state.log;
    const keepEvents = state.events;
    state.log = [];
    state.events = [];
    let s;
    try {
      s = JSON.parse(JSON.stringify(state));
    } finally {
      state.log = keepLog;
      state.events = keepEvents;
    }
    return s;
  }

  function resolvePendingOn(s, playerIndex) {
    let guard = 0;
    while (s.pendingChoice && s.pendingChoice.player === playerIndex && guard++ < 8) {
      if (s.pendingChoice.type === "gravePick") {
        const pick = chooseGravePick(s);
        if (!pick) break;
        E.resolveGravePick(s, playerIndex, pick.cardId);
        continue;
      }
      const pick = chooseDiscover(s);
      if (!pick) break;
      E.resolveDiscover(s, playerIndex, pick.cardId);
    }
  }

  function applyAction(state, playerIndex, action) {
    let s;
    try {
      s = cloneLight(state);
    } catch (e) {
      return null;
    }
    let result;
    try {
      if (action.type === "play") result = E.playCard(s, playerIndex, action.cardUid, action.opts);
      else if (action.type === "repayDebt") result = E.repayDebt(s, playerIndex, action.cardUid);
      else if (action.type === "attack") result = E.attack(s, playerIndex, action.attackerUid, action.targetUid);
      else if (action.type === "heroPower") result = E.useHeroPower(s, playerIndex, action.targetUid);
      else if (action.type === "discover") result = E.resolveDiscover(s, playerIndex, action.cardId);
      else if (action.type === "gravePick") result = E.resolveGravePick(s, playerIndex, action.cardId);
      else return null;
    } catch (e) {
      return null;
    }
    if (result && result.ok !== false) resolvePendingOn(s, playerIndex);
    return result && result.ok !== false ? s : null;
  }

  /* ==================== 发现 / 坟场 ==================== */
  function discoverScore(state, p, def) {
    if (!def) return 0;
    let s = bodyValue(def) + (def.cost || 0) * 0.55;
    const ops = opsList(def);
    if (ops) {
      for (const op of flattenOps(ops)) {
        if (op.op === "draw") s += 1.6;
        else if (op.op === "damageHero") s += 1.0;
        else if (op.op === "damageTarget" || op.op === "destroyTarget") s += 2.2;
        else if (op.op === "damageAllEnemies") s += 2.0;
        else if (op.op === "summon") s += 1.5;
        else if (op.op === "discover" || op.op === "graveSummon") s += 1.2;
        else if (op.op === "armor" || op.op === "healHero") s += 0.8;
        else s += 0.35;
      }
    } else {
      s += effectScore(state, p, def, null, null);
    }
    if (def.type === "spell") s += 0.8;
    if (def.type === "minion") s += 1.0;
    if (p && def.faction === p.faction) s += 0.3;
    return s;
  }

  function chooseDiscover(state) {
    const pc = state.pendingChoice;
    if (!pc || pc.type !== "discover") return null;
    const pi = pc.player == null ? state.current : pc.player;
    const p = state.players[pi];
    let best = null, bestScore = -1e9;
    for (const id of (pc.options || [])) {
      const s = discoverScore(state, p, CARD(id));
      if (s > bestScore) { bestScore = s; best = id; }
    }
    return best ? { type: "discover", cardId: best, score: 99 } : null;
  }

  function chooseGravePick(state) {
    const pc = state.pendingChoice;
    if (!pc || pc.type !== "gravePick") return null;
    const pi = pc.player == null ? state.current : pc.player;
    const p = state.players[pi];
    const pile = state.discard || [];
    let best = null, bestScore = -1e9;
    for (const id of (pc.options || [])) {
      const def = CARD(id);
      if (!def) continue;
      let owned = false;
      for (let k = pile.length - 1; k >= 0; k--) {
        if (pile[k].cardId === id && !pile[k].token) { owned = true; break; }
      }
      if (!owned) continue;
      const s = discoverScore(state, p, def);
      if (s > bestScore) { bestScore = s; best = id; }
    }
    if (!best && (pc.options || []).length) best = pc.options[0];
    return best ? { type: "gravePick", cardId: best } : null;
  }

  /* ==================== 阵位 / 目标 ==================== */
  function zoneScore(state, p, def, zone) {
    const n = p.board[zone].length;
    if (p.faction === "pus") return (n === 1 ? 10 : 0) + (zone === "center" ? 1 : 0);
    return (n === 0 ? 3 : 0) + (zone === "center" ? 1 : 0);
  }
  function bestZone(state, p, def, opt) {
    const zones = (opt && opt.zones) || [];
    if (!zones.length) return null;
    let best = null, bestScore = -1e9;
    for (const z of zones) {
      const s = zoneScore(state, p, def, z);
      if (s > bestScore) { bestScore = s; best = z; }
    }
    return best;
  }

  function chooseTarget(state, p, def, opt) {
    if (!opt || !opt.targetType) return null;
    if (def.id === "miyuki" && state.vein >= 6) return null;
    return bestTarget(state, p, def, opt);
  }

  function shouldPayBlood(state, p, def) {
    if (!def.bloodCost) return false;
    if (p.hp <= def.bloodCost + 2) return false;
    if (def.id === "tiega") return p.hp > 8;
    return p.hp > 10;
  }

  /* 刻脉：延迟生效，按「期望伤害 × 命中率」估 */
  function pulseValue(state, p, def) {
    const spec = def.pulse || {};
    const cond = spec.cond || {};
    let value = 0;
    for (const op of (spec.penalty || [])) {
      if (op.op === "damageHero") value += (op.amount || 1) * 1.5;
      else if (op.op === "damageRandomEnemy") value += (op.amount || 1) * 1.0;
      else value += 1.2;
    }
    const grave = (state.discard || []).filter(function (x) { return x && x.kind === "minion"; }).length;
    const foe = enemyOf(state, p);
    const foeMinions = E.allMinions(foe).filter(function (m) { return !m.dead; });
    let hit = 0.5;
    if (cond.cond === "veinEven") hit = (state.vein || 0) % 2 === 1 ? 0.35 : 0.6;
    else if (cond.cond === "enemyHand") hit = (foe.hand || []).length >= (cond.value || 4) ? 0.8 : 0.4;
    else if (cond.cond === "enemyTaunt") hit = foeMinions.some(function (m) { return m.taunt; }) ? 0.75 : 0.35;
    else if (cond.cond === "graveCount") hit = grave >= (cond.value || 3) ? 0.85 : 0.35;
    return value * hit - (def.cost || 0) * 0.15;
  }

  /* 效果估值：ops 卡走 ops 树；其余沿用 v0.1 的效果表（那部分是对的） */
  function effectScore(state, p, def, target, zone) {
    const ops = opsList(def);
    if (ops) {
      let s = opsValue(state, p, ops, target);
      if (def.type === "minion") s += (def.attack || 0) * 0.7 + (def.health || 0) * 0.5;
      if (def.type === "formation" && def.formation) {
        const fm = def.formation;
        s += (fm.attack || 0) * 1.25 + (fm.health || 0) * 1.0 + 1.4;
        if (fm.taunt) s += 1.2;
      }
      if (def.type === "relic") s += 10;
      if (def.type === "equipment") s += 8;
      if (def.type === "spell" && s < 1.8) s += 1.8;
      if (def.faction === p.faction) s += 0.35;
      if (def.keywords && (def.keywords.indexOf("rush") >= 0 || def.keywords.indexOf("charge") >= 0)) s += 1.2;
      if (def.excavate) s -= 1.5;
      if (def.bloodCost) s += 1;
      if (target && target.health <= 0) s -= 100;
      return s;
    }

    const b = def.battlecry || def.spell || {};
    let s = 0;
    if (def.type === "pulse") s += pulseValue(state, p, def);
    switch (b.type) {
      case "heal": s += target ? Math.min(b.amount || 1, target.maxHealth - target.health) * 0.8 : 0; break;
      case "healDraw":
        s += target ? Math.min(b.amount || 1, target.maxHealth - target.health) * 0.8 : 0;
        if (target && target.health < target.maxHealth) s += 2;
        break;
      case "silence": s += target ? 3 + ((target.keywords || []).length * 1.2) + (target.taunt ? 2 : 0) : 0; break;
      case "nextCost": s += 2.3; break;
      case "drawVein": s += 2.3 + (state.vein >= (b.vein || 99) ? (b.bonus || 0) * 1.5 : 0); break;
      case "freeze":
        if (state.vein >= (b.allAtVein || 99)) s += 7 + enemyMinions(state, p).length * 1.4;
        else s += target ? 2.8 + target.attack * 0.6 : 1;
        break;
      case "bloodAttack": s += 2.8; break;
      case "summonTwo": s += 4.6; break;
      case "drawDamageAlly": s += 2.4; break;
      case "buffTaunt": s += 2 + (b.attack || 0) + (b.health || 0) + (state.vein >= (b.vein || 99) ? 2 : 0); break;
      case "summon": s += 3.0; break;
      case "stealth": s += 2.6; break;
      case "bloodBuff": s += 2.4; break;
      case "damage": s += target ? (b.amount || 1) + (target.health <= (b.amount || 1) ? 3 : 0) : 0; break;
      case "discover": s += 2.8; break;
      case "armor": s += (b.amount || 0) * 0.9; break;
      case "draw": s += (b.amount || 0) * 1.9 - fatigueCost(p, b.amount || 0); break;
      case "buffHeal": s += 2 + (b.attack || 0) + (b.health || 0); break;
      case "bloodDraw": s += 2.8; break;
      case "summonMonster": s += 3.6; break;
      case "buffCharge": s += 2.8 + (b.attack || 0); break;
      case "gainMana": s += 1.7; break;
      case "channelVein": s += 2 + Math.abs(b.amount || 2) * 0.5; break;
      case "freezeDraw": s += (target ? 2.8 + target.attack * 0.6 : 1) + 1.8; break;
      case "freezeAll": s += 5 + enemyMinions(state, p).length * 1.4; break;
      case "stripArmorDraw": s += 1 + Math.min(4, enemyOf(state, p).armor || 0) * 0.8 + 1.5; break;
      case "ignoreTauntBuff": s += 3.2 + (b.attack || 0); break;
      case "armorConditionalRush": s += 2.4 + (b.armor || 4) * 0.35; break;
      case "antiFreezeHeal": s += 2.3 + (b.heal || 2) * 0.5; break;
      case "damageHealBlock": s += 2.4 + (b.amount || 1); break;
      case "damageAllEnemies": {
        let v = 0;
        for (const m of enemyMinions(state, p)) v += Math.min(b.amount || 1, m.health) * 0.85;
        s += v;
        break;
      }
      case "damageAllEnemiesDraw": {
        let v = 0;
        for (const m of enemyMinions(state, p)) v += Math.min(b.amount || 1, m.health) * 0.75;
        s += v + 1.4;
        break;
      }
      case "damageAllEnemiesPerGameSpell": {
        const total = p.spellsCastThisGame || 0;
        s += total * 1.8 + enemyMinions(state, p).length * 0.6;
        if (total < 3) s -= 10;
        break;
      }
      case "damageAllEnemyUnitsPerGameSpell": {
        const total = p.spellsCastThisGame || 0;
        s += total * 1.1 + enemyMinions(state, p).length * 0.4;
        if (total < 2) s -= 7;
        break;
      }
      case "damageZone": s += 2.8; break;
      case "freezeZone": s += 4.6; break;
      case "copyLowestSpell": {
        const spells = p.hand.filter(function (c) { const d = CARD(c.cardId); return d && d.type === "spell"; });
        s += spells.length ? 3.4 + spells.length * 0.5 : 0;
        break;
      }
      case "recordIfEnemyZones": {
        let zones = 0;
        const enemy = enemyOf(state, p);
        for (const z of ZONES) if (enemy.board[z].length) zones++;
        if (zones === 3) s += 2.6;
        break;
      }
      case "drawCopyNextSpell": s += 3.6; break;
      default: s += 0.4; break;
    }
    if (def.type === "minion") s += def.attack * 0.7 + def.health * 0.5;
    if (def.type === "relic") s += 10;
    if (def.type === "equipment") s += 8;
    if (def.type === "formation" && def.formation) s += 1.4 + (def.formation.attack || 0) * 1.25 + (def.formation.health || 0);
    if (def.type === "spell" && s < 1.8) s += 1.8;
    if (def.faction === p.faction) s += 0.35;
    if (def.keywords && (def.keywords.indexOf("rush") >= 0 || def.keywords.indexOf("charge") >= 0)) s += 1.2;
    if (def.excavate) s -= 1.5;
    if (def.bloodCost) s += 1;
    if (target && target.health <= 0) s -= 100;
    return s;
  }

  function choosePlay(state, p) {
    let best = null;
    for (const c of p.hand) {
      if (c.isDebt) continue;
      const def = D.CARDS[c.cardId];
      if (!def) continue;
      if (def.type === "debt") {
        // 债务卡：洗进对方牌库，对方要么当回合完成任务、要么吃惩罚
        const optD = E.getPlayOptions(state, p.index, c.uid);
        if (!optD.ok) continue;
        const pen = (def.debt && def.debt.penalty) || {};
        const dmg = (pen.type === "damageHero" || pen.op === "damageHero") ? (pen.amount || 1) : 1;
        const reward = def.debt && def.debt.reward ? 0.6 : 0; // 对方完成会给奖励，折算成负分
        const scoreD = dmg * 0.5 - reward + 0.6 + 2.5 - (def.cost || 0) * 0.1;
        if (scoreD > 1.5 && (!best || scoreD > best.score)) {
          best = { type: "play", cardUid: c.uid, opts: {}, score: scoreD };
        }
        continue;
      }
      const opt = E.getPlayOptions(state, p.index, c.uid);
      if (!opt.ok) continue;
      const target = chooseTarget(state, p, def, opt);
      if (opt.targetType && !target && def.type !== "minion" && !def.optionalTarget) continue;
      const zone = (def.type === "minion" || def.type === "formation") ? bestZone(state, p, def, opt) : null;
      if ((def.type === "minion" || def.type === "formation") && !zone) continue;
      const payBlood = shouldPayBlood(state, p, def);
      const score = effectScore(state, p, def, target, zone) - (def.cost || 0) * 0.1 + 2.5;
      if (score <= 1.5) continue;
      if (!best || score > best.score) {
        best = {
          type: "play",
          cardUid: c.uid,
          opts: { targetUid: target ? target.uid : null, zone: zone, payBlood: payBlood },
          score: score
        };
      }
    }
    return best;
  }

  function chooseAttack(state, p) {
    const enemy = enemyOf(state, p);
    const taunts = enemyMinions(state, p).filter(function (m) { return m.taunt && !m.stealth; });
    const lethal = factLethal(battleFacts(state, p));
    let best = null;
    const attackers = ownMinions(p).filter(function (m) { return m.attacksLeft > 0 && m.frozenTurns <= 0 && m.attack > 0; });
    for (const a of attackers) {
      const o = E.getAttackOptions(state, p.index, a.uid);
      if (!o.ok) continue;
      for (const t of o.targets) {
        let score = 0;
        if (t === "hero") {
          score = attackDamage(state, p, a, null) + (lethal ? 100 : 0) + (enemy.hp <= a.attack ? 50 : 0);
        } else {
          const d = E.findMinion(state, t);
          if (!d) continue;
          const dmg = attackDamage(state, p, a, d);
          const shieldT = d.divineShield && !d.silenced;
          const targetDies = !shieldT && ((a.poisonous && dmg > 0) || dmg >= d.health);
          const shieldA = a.divineShield && !a.silenced;
          const attackerDies = !shieldA && ((d.poisonous && d.attack > 0) || d.attack >= a.health);
          score = (targetDies ? minionValue(d) : 0) + dmg * 0.6 + d.attack * 0.2;
          if (attackerDies) score -= minionValue(a) + 2;
          if (d.taunt) score += 2;
          if (taunts.length) score += 1;
        }
        if (!best || score > best.score) best = { type: "attack", attackerUid: a.uid, targetUid: t, score: score };
      }
    }
    if (!best) return null;
    if (best.targetUid === "hero" && best.score < 1 && !lethal) return null;
    if (best.targetUid !== "hero" && best.score < 0) return null;
    return best;
  }

  function heroPowerTarget(state, p, hp) {
    const ids = hp.targets || [];
    if (!ids.length) return null;
    let best = null, bestScore = -1e9;
    for (const uid of ids) {
      const m = E.findMinion(state, uid);
      if (!live(m)) continue;
      let s;
      if (hp.targetType === "friendly") {
        s = m.attack * 0.8 + m.health * 0.2 + (m.hasAttacked ? 0 : 1.2) + (m.taunt ? 0.6 : 0);
      } else {
        s = minionValue(m) * 0.5;
        if (p.heroId === "otto" && m.health <= 2 && !(m.divineShield && !m.silenced)) s += minionValue(m) * 0.9 + 2;
        if (p.heroId === "marta") s += (m.health <= 2 ? 2 : 0);
        if (p.heroId === "sernach") s += (m.frozenTurns > 0 ? -1.5 : 0) + m.attack * 0.3;
        if (p.heroId === "monarch") s += (m.bounty == null ? 1.5 : 0);
      }
      if (s > bestScore) { bestScore = s; best = m; }
    }
    return best;
  }

  function chooseHeroPower(state, p) {
    const o = E.getHeroPowerOptions(state, p.index);
    if (!o.ok) return null;
    if (p.hero.power && p.hero.power.id === "spell_codex") return { type: "heroPower", targetUid: null, score: 3.6 };
    if (p.heroId === "karna") {
      if (p.hp <= 8) return null;
      return { type: "heroPower", targetUid: null, score: 3 };
    }
    if (p.heroId === "balaena") return { type: "heroPower", targetUid: null, score: 3.4 };
    const target = heroPowerTarget(state, p, o);
    if (!target) return null;
    let score = 3.5;
    if (p.heroId === "otto") {
      score = (!(target.divineShield && !target.silenced) && target.health <= 2) ? minionValue(target) * 0.9 + 3.2 : 2.6;
    } else if (p.heroId === "wolfram") {
      score = 3.0 + (target.hasAttacked ? 0 : 1.0);
    } else if (p.heroId === "sernach") {
      score = target.attack >= 3 ? 3.4 : 2.2;
    }
    return { type: "heroPower", targetUid: target.uid, score: score };
  }

  /* ==================== 局面评估 ==================== */
  function handThreat(state, me) {
    const op = enemyOf(state, me);
    if (!op || !op.hand) return 0;
    let t = 0;
    for (const c of op.hand) {
      if (c.isDebt) continue;
      const d = CARD(c.cardId);
      if (!d) continue;
      const ops = opsList(d);
      if (ops) {
        t += opAmount(ops, "damageHero") * 1.1 + opAmount(ops, "damageAllEnemies") * 0.7;
        if (hasOp(ops, ["destroyTarget", "damageTarget"])) t += 1.0;
        if (hasOp(ops, ["buffTarget", "grantRushTarget"])) t += 1.0;
        continue;
      }
      const b = d.battlecry || d.spell || {};
      if (b.type === "damage") t += (b.amount || 1) * 1.15;
      else if (b.type === "damageAllEnemies" || b.type === "damageAllEnemiesDraw") t += 2.4;
      else if (b.type === "damageAllEnemiesPerGameSpell" || b.type === "damageAllEnemyUnitsPerGameSpell") t += 2.8;
      else if (b.type === "freeze" || b.type === "freezeAll") t += 1.1;
      else if (b.type === "silence") t += 0.8;
      else if (d.type === "minion" && (d.keywords || []).some(function (k) { return k === "rush" || k === "charge"; })) t += (d.attack || 1) * 0.7;
    }
    return t;
  }
  function boardValue(player) {
    return ownMinions(player).reduce(function (sum, m) { return sum + minionValue(m); }, 0);
  }
  function boardAttack(player) {
    return ownMinions(player).reduce(function (sum, m) { return sum + Math.max(0, m.attack); }, 0);
  }

  function evaluateState(state, playerIndex, tier) {
    if (state.status === "gameover") {
      if (state.winner === playerIndex) return 100000;
      if (state.winner == null) return 0;
      return -100000;
    }
    const me = state.players[playerIndex];
    const op = enemyOf(state, me);
    let score = 0;
    score += (me.hp + me.armor) * 1.3 - (op.hp + op.armor) * 2.4;
    score += boardValue(me) * 1.15 - boardValue(op) * 1.1;
    score += (boardAttack(me) - boardAttack(op)) * 0.75;
    score += (me.hand.length - op.hand.length) * 2.8;
    score += (me.mana - op.mana) * 0.18;
    score += (me.heroPowerUsed ? 0 : 1) * 1.4;
    score += (me.deck.length - op.deck.length) * 0.04;
    const myTaunts = ownMinions(me).filter(function (m) { return m.taunt; }).length;
    const opTaunts = ownMinions(op).filter(function (m) { return m.taunt; }).length;
    score += (myTaunts - opTaunts) * 0.8;
    // v0.1 漏掉的项：阵型光环 / 装备
    score += ((me.formations || []).length - (op.formations || []).length) * 1.1;
    score += ((me.equipment || []).length - (op.equipment || []).length) * 0.9;
    if (op.hp + op.armor <= boardAttack(me)) score += 30;
    if (me.hp + me.armor <= boardAttack(op)) score -= 30;
    if (op.hp <= 0) score += 5000;
    if (me.hp <= 0) score -= 5000;
    const t = tier || tierOf(state, me);
    if (t && t.threat) {
      const threat = handThreat(state, me);
      score -= threat * ((me.hp + me.armor) < 16 ? 1.35 : 0.45);
    }
    return score;
  }

  /* ==================== 动作枚举 ==================== */
  function targetChoices(state, p, def, opt) {
    if (!opt.targetType) return [null];
    const first = chooseTarget(state, p, def, opt);
    const ids = (opt.targets || []).slice();
    const minions = ids.map(function (uid) { return E.findMinion(state, uid); }).filter(Boolean);
    minions.sort(function (a, b) {
      return opt.targetType === "friendly"
        ? friendlyTargetRank(state, p, def, b) - friendlyTargetRank(state, p, def, a)
        : enemyTargetRank(state, p, def, b) - enemyTargetRank(state, p, def, a);
    });
    const ordered = [];
    if (first) ordered.push(first.uid);
    for (const m of minions) if (ordered.indexOf(m.uid) < 0) ordered.push(m.uid);
    if (!ordered.length) {
      if (def.type === "minion" || def.optionalTarget) return [null];
      return [];
    }
    return ordered.slice(0, 3);
  }

  function enumerateActions(state, p, tier) {
    const actions = [];
    const seen = new Set();
    const push = function (a) {
      const key = a.type + "|" + (a.cardUid || "") + "|" + (a.attackerUid || "") + "|" + (a.targetUid || "") + "|" + JSON.stringify(a.opts || null);
      if (seen.has(key)) return;
      seen.add(key);
      actions.push(a);
    };
    for (const c of p.hand) {
      if (c.isDebt) continue;
      const def = D.CARDS[c.cardId];
      if (!def) continue;
      if (def.type === "debt") {
        if (E.getPlayOptions(state, p.index, c.uid).ok) push({ type: "play", cardUid: c.uid, opts: {} });
        continue;
      }
      const opt = E.getPlayOptions(state, p.index, c.uid);
      if (!opt.ok) continue;
      const targets = targetChoices(state, p, def, opt);
      if (!targets.length) continue;
      const target2 = (def.target2 && (opt.target2Targets || []).length) ? E.findMinion(state, opt.target2Targets[0]) : null;
      if (def.target2 && !target2 && !def.optionalTarget2) continue;
      const zones = (def.type === "minion" || def.type === "formation")
        ? (opt.zones || []).slice().sort(function (a, b) { return zoneScore(state, p, def, b) - zoneScore(state, p, def, a); })
        : [null];
      if ((def.type === "minion" || def.type === "formation") && !zones.length) continue;
      let combos = 0;
      for (const targetUid of targets) {
        for (const zone of zones) {
          push({
            type: "play",
            cardUid: c.uid,
            opts: { targetUid: targetUid || null, targetUid2: target2 ? target2.uid : null, zone: zone, payBlood: shouldPayBlood(state, p, def) }
          });
          if (++combos >= 6) break;
        }
        if (combos >= 6) break;
      }
    }
    for (const m of ownMinions(p)) {
      if (m.attacksLeft <= 0 || m.frozenTurns > 0 || m.attack <= 0) continue;
      const o = E.getAttackOptions(state, p.index, m.uid);
      if (!o.ok) continue;
      for (const targetUid of o.targets) push({ type: "attack", attackerUid: m.uid, targetUid: targetUid });
    }
    const hpOpt = E.getHeroPowerOptions(state, p.index);
    if (hpOpt.ok) {
      if (!(hpOpt.targets || []).length) {
        push({ type: "heroPower", targetUid: null });
      } else {
        const t = heroPowerTarget(state, p, hpOpt);
        if (t) push({ type: "heroPower", targetUid: t.uid });
      }
    }
    // 债务卡现在抽到就进判定区、不占手牌，AI 不需要「偿还」这类清理动作
    return actions;
  }

  function applyCandidate(state, action, playerIndex) {
    let s;
    try {
      s = cloneLight(state);
    } catch (e) {
      return null;
    }
    let result;
    try {
      if (action.type === "play") result = E.playCard(s, playerIndex, action.cardUid, action.opts);
      else if (action.type === "repayDebt") result = E.repayDebt(s, playerIndex, action.cardUid);
      else if (action.type === "attack") result = E.attack(s, playerIndex, action.attackerUid, action.targetUid);
      else if (action.type === "heroPower") result = E.useHeroPower(s, playerIndex, action.targetUid);
      else if (action.type === "discover") result = E.resolveDiscover(s, playerIndex, action.cardId);
      else if (action.type === "gravePick") result = E.resolveGravePick(s, playerIndex, action.cardId);
      else return null;
    } catch (e) {
      return null;
    }
    if (result && result.ok !== false) resolvePendingOn(s, playerIndex);
    return result && result.ok !== false ? s : null;
  }

  function actionPriority(state, p, action) {
    if (action.type === "repayDebt") return 2.4 + (p.hand.length >= 7 ? 2.0 : 0);
    if (action.type === "play") {
      const card = p.hand.find(function (c) { return c.uid === action.cardUid; });
      const def = card && D.CARDS[card.cardId];
      if (!def) return 0;
      const target = action.opts && action.opts.targetUid ? E.findMinion(state, action.opts.targetUid) : null;
      return effectScore(state, p, def, target, action.opts && action.opts.zone) + (def.attack || 0) * 0.8 + (def.health || 0) * 0.6;
    }
    if (action.type === "attack") {
      const attacker = E.findMinion(state, action.attackerUid);
      if (!attacker) return 0;
      const foe = state.players[1 - p.index] || state.players[0];
      if (action.targetUid === "hero") {
        const dmg = attackDamage(state, p, attacker, null);
        const lethal = foe && dmg >= (foe.hp + (foe.armor || 0));
        return lethal ? 100 : 1.2 + dmg * 0.6;
      }
      const target = E.findMinion(state, action.targetUid);
      if (!target) return 0;
      const dmg = attackDamage(state, p, attacker, target);
      const shieldT = target.divineShield && !target.silenced;
      const kills = !shieldT && ((attacker.poisonous && dmg > 0) || dmg >= target.health);
      const shieldA = attacker.divineShield && !attacker.silenced;
      const dies = !shieldA && ((target.poisonous && target.attack > 0) || target.attack >= attacker.health);
      const ownValue = minionValue(attacker) * (dies ? 0.6 : 0);
      if (kills) return minionValue(target) * 1.3 - ownValue;
      return target.attack * 0.5 - ownValue;
    }
    if (action.type === "heroPower") return 3.5;
    return 0;
  }

  function findLethalAction(state, p, tier) {
    const facts = battleFacts(state, p);
    const need = facts.foeHpArmor;
    if (need <= 0) return null;
    const direct = factLethal(facts);
    const t = tier || tierOf(state, p);
    if (!direct && !t.lethalClear) return null;
    const plan = findLethalPlan(state, p, facts);
    return plan && plan.length ? plan[0] : null;
  }

  function searchBestAction(state, p, depth, limit, tier) {
    let actions = enumerateActions(state, p, tier);
    if (!actions.length) return null;
    actions.sort(function (a, b) { return actionPriority(state, p, b) - actionPriority(state, p, a); });
    if (limit) actions = actions.slice(0, limit);
    let best = null;
    for (const action of actions) {
      let next = applyCandidate(state, action, p.index);
      if (!next) continue;
      if ((depth || 1) > 1 && next.status === "playing" && next.current === p.index) {
        const nextP = next.players[p.index];
        const second = searchBestAction(next, nextP, Math.max(1, (depth || 1) - 1), limit ? Math.max(3, Math.floor(limit / 2)) : 4, tier);
        if (second) {
          const afterSecond = applyCandidate(next, second.action, p.index);
          if (afterSecond) next = afterSecond;
        }
      }
      const score = evaluateState(next, p.index, tier);
      if (!best || score > best.score) best = { action: action, score: score };
    }
    return best;
  }

  /* ==================== 主决策 ==================== */
  function chooseAction(state, playerIndex) {
    if (!state || state.status !== "playing") return { type: "end", reason: "gameover" };

    if (state.pendingChoice) {
      if (state.pendingChoice.type === "discover") {
        const pick = chooseDiscover(state);
        if (pick) return pick;
      } else if (state.pendingChoice.type === "gravePick") {
        const pick = chooseGravePick(state);
        if (pick) return pick;
      }
      return { type: "end" };
    }

    const p = state.players[playerIndex];
    if (!p || state.current !== playerIndex) return { type: "end" };
    const tier = tierOf(state, p);

    // ① 斩杀：能一回合打死就必须打死（拆守备后的斩杀只有绝密/机密档会算）
    if (tier.lethalPlan) {
      const lethalAction = findLethalAction(state, p, tier);
      if (lethalAction) return lethalAction;
    }

    // ①.5 低档的「提前收手」：手上有牌/有行动力也可能莫名其妙结束回合
    if (tier.endEarly > 0) {
      const facts = battleFacts(state, p);
      if (!factLethal(facts) && noiseUnit(state, p, 11) < tier.endEarly) return { type: "end", reason: "easy" };
    }

    // ② 带搜索的档位
    if (tier.depth > 0) {
      let actions = enumerateActions(state, p, tier);
      if (actions.length) {
        actions.sort(function (a, b) { return actionPriority(state, p, b) - actionPriority(state, p, a); });
        actions = actions.slice(0, tier.limit);
        // 把「贪心直觉」的出牌/攻击/技能也塞进候选：推演不该只看分数排序的前几名
        const extras = [choosePlay(state, p), chooseHeroPower(state, p), chooseAttack(state, p)];
        for (const e of extras) {
          if (!e) continue;
          const dup = actions.some(function (a) {
            return a.type === e.type && (a.cardUid || "") === (e.cardUid || "") && (a.attackerUid || "") === (e.attackerUid || "");
          });
          if (!dup) actions.push(e);
        }
        if (tier.noise > 0 && actions.length > 1 && noiseUnit(state, p, 7) < tier.noise) {
          const swap = actions[0]; actions[0] = actions[1]; actions[1] = swap;
        }
        const baseline = evaluateState(state, p.index, tier);
        let best = null, bestScore = -1e18;
        for (const action of actions) {
          let next = applyCandidate(state, action, p.index);
          if (!next) continue;
          if (tier.depth > 1 && next.status === "playing" && next.current === p.index) {
            const l2 = tier.limit2 == null ? Math.max(3, Math.floor(tier.limit / 2)) : tier.limit2;
            const second = searchBestAction(next, next.players[p.index], tier.depth - 1, l2, tier);
            if (second) {
              const afterSecond = applyCandidate(next, second.action, p.index);
              if (afterSecond) next = afterSecond;
            }
          }
          const score = evaluateState(next, p.index, tier);
          if (score > bestScore) { bestScore = score; best = { action: action, score: score }; }
        }
        if (best && best.action && bestScore > baseline + 0.35) {
          return Object.assign({}, best.action, { score: bestScore });
        }
      }
    }

    // ③ 贪心分层（normal/easy 走这条；搜索档没算出门道时也用它）
    const options = [];
    const play = choosePlay(state, p);
    if (play && play.score >= tier.playThreshold) options.push(play);
    const hp = chooseHeroPower(state, p);
    if (hp) options.push(hp);
    const atk = chooseAttack(state, p);
    if (atk) options.push(atk);
    if (play) options.push(play);
    const debts = p.hand.filter(function (c) { return c.isDebt; });
    if (debts.length) options.push({ type: "repayDebt", cardUid: debts[0].uid, score: 2.4 });
    if (!options.length) return { type: "end" };

    if (tier.noise > 0 && options.length > 1) {
      const pool = options.slice(0, Math.max(1, tier.pickPool));
      const u = noiseUnit(state, p, 13);
      let pick = pool[0];
      if (u < tier.noise) {
        const alt = pool[1 + Math.min(pool.length - 2, Math.floor(noiseUnit(state, p, 17) * (pool.length - 1)))];
        if (alt) pick = alt;
      }
      return pick;
    }
    return options[0];
  }

  function takeAction(state, playerIndex) {
    const action = chooseAction(state, playerIndex);
    if (!action || action.type === "end") {
      const result = E.endTurn(state, playerIndex);
      return { action: { type: "end" }, result: result };
    }
    let result;
    if (action.type === "play") result = E.playCard(state, playerIndex, action.cardUid, action.opts);
    else if (action.type === "repayDebt") result = E.repayDebt(state, playerIndex, action.cardUid);
    else if (action.type === "attack") result = E.attack(state, playerIndex, action.attackerUid, action.targetUid);
    else if (action.type === "heroPower") result = E.useHeroPower(state, playerIndex, action.targetUid);
    else if (action.type === "discover") result = E.resolveDiscover(state, playerIndex, action.cardId);
    else if (action.type === "gravePick") result = E.resolveGravePick(state, playerIndex, action.cardId);
    else result = { ok: false, reason: "unknown action" };
    if (result && result.ok === false) {
      // 保底：动作被规则拒绝就结束回合，绝不原地打转
      const fallback = E.endTurn(state, playerIndex);
      return { action: { type: "end", fallback: true }, result: fallback || result };
    }
    return { action: action, result: result };
  }

  function autoPlayGame(config) {
    const state = E.createGame(config || {});
    state.aiControlled = true;
    let steps = 0;
    let idle = 0;
    while (state.status === "playing" && steps < 1500) {
      const beforeCurrent = state.current;
      const beforeLog = state.log ? state.log.length : 0;
      const beforeStatus = state.status;
      takeAction(state, state.current);
      steps++;
      if (state.status !== beforeStatus) break;
      if (state.current === beforeCurrent && (state.log ? state.log.length : 0) === beforeLog) {
        idle++;
        const pushed = E.endTurn(state, state.current);
        if (!pushed || pushed.ok === false) {
          E.processDeaths(state);
          if (state.status === "playing" && idle > 2) break;
        }
      } else {
        idle = 0;
      }
    }
    return { state: state, steps: steps };
  }

  function runSimulations(count, config) {
    const results = [];
    for (let i = 0; i < count; i++) {
      const seed = ((config && config.seed) || 3000) + i;
      const r = autoPlayGame(Object.assign({}, config || {}, { seed: seed, mode: "sim", p1AI: true, p2AI: true }));
      results.push(r);
    }
    return results;
  }

  function lethalAvailable(state, p) { return factLethal(battleFacts(state, p)); }

  return {
    chooseAction: chooseAction,
    takeAction: takeAction,
    autoPlayGame: autoPlayGame,
    runSimulations: runSimulations,
    minionValue: minionValue,
    lethalAvailable: lethalAvailable,
    // 调试/基准用
    _debug: {
      tiers: TIERS,
      tierOf: tierOf,
      battleFacts: battleFacts,
      findLethalPlan: findLethalPlan,
      effectScore: effectScore,
      opsList: opsList,
      opsValue: opsValue
    }
  };
});




