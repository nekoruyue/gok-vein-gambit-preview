/* 街机模式 · 灰港账牌 / 铁序三骰 / 黑签分诊 */
(function (global) {
  "use strict";
  const D = global.GokData;
  const STORE = "gok_content_v1";
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const clear = (n) => { while (n && n.firstChild) n.removeChild(n.firstChild); };
  const root = () => $("arcade-root");
  function load() { try { return JSON.parse(localStorage.getItem(STORE) || "null") || {}; } catch (e) { return {}; } }
  function save(data) { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) {} }
  function recordArcade(key, patch) { const d = load(); d.arcade = d.arcade || {}; d.arcade[key] = Object.assign({}, d.arcade[key] || {}, patch); save(d); }
  function marks(gain) { const d = load(); d.marks = (d.marks || 0) + gain; save(d); return gain; }
  function header(box, title, eyebrow, backFn) {
    const head = el("div", "content-subhead");
    const back = el("button", "btn btn-small btn-ghost", "← 返回街机");
    back.onclick = backFn;
    head.appendChild(back);
    const copy = el("div");
    copy.appendChild(el("div", "eyebrow", eyebrow));
    copy.appendChild(el("h2", null, title));
    head.appendChild(copy);
    box.appendChild(head);
  }
  function open() { if (global.GokUI) global.GokUI.showScreen("arcade"); renderHub(); }
  function renderHub() {
    const box = root(); if (!box) return;
    clear(box);
    const head = el("div", "content-subhead");
    const back = el("button", "btn btn-small btn-ghost", "← 返回其他模式");
    back.onclick = () => { if (global.GokUI) global.GokUI.showScreen("other"); };
    head.appendChild(back);
    const title = el("div");
    title.appendChild(el("div", "eyebrow", "ARCADE / 灰港街机"));
    title.appendChild(el("h2", null, "街机模式"));
    head.appendChild(title);
    box.appendChild(head);
    const intro = el("div", "content-intro");
    intro.appendChild(el("div", "eyebrow", "ARCADE / 灰港街机"));
    intro.appendChild(el("h2", null, "街机模式"));
    intro.appendChild(el("p", null, "灰港的灯柱下不只有账牌。三张桌子，三套规矩，印记各算各的。"));
    box.appendChild(intro);
    const grid = el("div", "mode-grid arcade-grid");
    const archive = load();
    const diceBest = archive.arcade && archive.arcade.dice || {};
    const triageBest = archive.arcade && archive.arcade.triage || {};
    const ledgerBest = archive.ledger && archive.ledger.best;
    const games = [
      { id: "ledger", title: "灰港账牌桌", tag: "账牌 · 五手", desc: "比点数、换一张、结算账本。底账 5，五手定输赢。", status: ledgerBest ? "最佳账 " + ledgerBest : "尚未开桌", action: () => { if (global.GokContent) global.GokContent.openLedger(); } },
      { id: "dice", title: "铁序三骰", tag: "帝国 · 三点赌", desc: "掷三颗骰子，重掷最低的一颗，和庄家比点数。连胜会提高赔率。", status: diceBest.bestBank ? "最佳账 " + diceBest.bestBank + (diceBest.bestStreak ? " · 连胜 " + diceBest.bestStreak : "") : "尚未开赌", action: openDice },
      { id: "triage", title: "黑签分诊", tag: "医疗 · 三剂药", desc: "六个病人，三剂药。谁先救，谁拿黑签，由你决定。", status: triageBest.bestSaved ? "最佳救回 " + triageBest.bestSaved + " 人" : "尚未分诊", action: openTriage }
    ];
    for (const game of games) {
      const card = el("article", "mode-card mode-" + game.id);
      card.appendChild(el("span", "mode-tag", game.tag));
      card.appendChild(el("h3", null, game.title));
      card.appendChild(el("p", null, game.desc));
      card.appendChild(el("div", "mode-status", game.status));
      const btn = el("button", "btn btn-primary", "进入");
      btn.onclick = game.action;
      card.appendChild(btn);
      grid.appendChild(card);
    }
    box.appendChild(grid);
    const note = el("p", "arcade-note", "街机模式是抢先版实验桌线；账牌和分诊共用一份档案印记。");
    box.appendChild(note);
  }

  /* ===== 铁序三骰 ===== */
  let diceState = null;
  const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  function rollDie() { return 1 + Math.floor(Math.random() * 6); }
  function diceFace(v) {
    const d = el("div", "arcade-die");
    for (let i = 0; i < 9; i++) {
      const cell = el("i");
      if (PIPS[v].indexOf(i) >= 0) cell.className = "pip";
      d.appendChild(cell);
    }
    return d;
  }
  function openDice() {
    if (global.GokUI) global.GokUI.showScreen("arcade");
    const archive = load(); const prev = (archive.arcade && archive.arcade.dice) || {};
    const luck = (archive.perks && archive.perks.arcade_luck) ? 1 : 0;
    diceState = { bank: 5 + luck, start: 5 + luck, round: 1, phase: "roll", player: [], dealer: [], used: false, log: ["铁序三点赌开盘：底账 5，押 1。"], bestBank: prev.bestBank || 0, bestStreak: prev.bestStreak || 0, streak: 0, runs: prev.runs || 0 };
    rollRound(); renderDice();
  }
  function rollRound() {
    diceState.player = [rollDie(), rollDie(), rollDie()];
    diceState.dealer = [rollDie(), rollDie(), rollDie()];
    diceState.phase = "roll"; diceState.used = false;
  }
  function renderDice() {
    const box = root(); if (!box) return;
    clear(box);
    header(box, "铁序三骰", "IRON ORDER / THREE DICE", renderHub);
    const shell = el("div", "arcade-game-shell");
    const stats = el("div", "arcade-stats");
    stats.appendChild(el("span", null, "账 " + diceState.bank));
    stats.appendChild(el("span", null, "第 " + diceState.round + " / 5 局"));
    stats.appendChild(el("span", null, "连胜 " + diceState.streak + " · 最佳 " + diceState.bestStreak));
    shell.appendChild(stats);
    shell.appendChild(el("p", "arcade-rule", "三颗骰子比总点数；开牌前可以重掷最低的一颗。赢 +1，输 -1，平局不结账。"));
    const table = el("div", "arcade-table");
    const you = el("div", "arcade-hand");
    you.appendChild(el("span", "arcade-hand-label", "你 · " + diceState.player.reduce((a, b) => a + b, 0)));
    const yu = el("div", "arcade-dice-row"); diceState.player.forEach(v => yu.appendChild(diceFace(v))); you.appendChild(yu);
    table.appendChild(you);
    const dealer = el("div", "arcade-hand");
    dealer.appendChild(el("span", "arcade-hand-label", "庄家" + (diceState.phase === "roll" ? "" : " · " + diceState.dealer.reduce((a, b) => a + b, 0))));
    const dr = el("div", "arcade-dice-row");
    diceState.dealer.forEach(v => {
      if (diceState.phase === "roll") { const back = el("div", "arcade-die back"); back.appendChild(el("b", null, "?")); dr.appendChild(back); }
      else dr.appendChild(diceFace(v));
    });
    dealer.appendChild(dr); table.appendChild(dealer);
    shell.appendChild(table);
    if (diceState.phase === "result") {
      shell.appendChild(el("div", "ledger-result " + (diceState.last.kind || "push"), diceState.last.text));
    }
    if (diceState.phase === "done") {
      shell.appendChild(el("div", "ledger-result win", "离桌：账 " + diceState.bank + "。印记 +" + diceState.reward + "。"));
    }
    const actions = el("div", "modal-actions");
    if (diceState.phase === "roll") {
      const rr = el("button", "btn btn-small btn-ghost", diceState.used ? "已重掷" : "重掷最低");
      rr.disabled = diceState.used;
      rr.onclick = () => {
        if (diceState.used) return;
        let idx = 0; for (let i = 1; i < 3; i++) if (diceState.player[i] < diceState.player[idx]) idx = i;
        diceState.player[idx] = rollDie(); diceState.used = true;
        diceState.log.push("重掷最低骰：" + diceState.player[idx] + "。");
        renderDice();
      };
      const open = el("button", "btn btn-primary", "开牌");
      open.onclick = () => {
        const p = diceState.player.reduce((a, b) => a + b, 0);
        const d = diceState.dealer.reduce((a, b) => a + b, 0);
        if (p > d) {
          diceState.streak++;
          diceState.bestStreak = Math.max(diceState.bestStreak, diceState.streak);
          const mult = 1 + Math.min(2, diceState.streak - 1);
          diceState.bank += mult;
          diceState.last = { kind: "win", text: "你赢下这一局：账 +" + mult + " · 连胜 " + diceState.streak + "（" + p + " : " + d + "）" };
        }
        else if (p < d) { diceState.bank--; diceState.streak = 0; diceState.last = { kind: "lose", text: "这一局输了：账 -1（" + p + " : " + d + "）" }; }
        else diceState.last = { kind: "push", text: "平局：账不动（" + p + " : " + d + "）" };
        diceState.phase = "result"; diceState.log.push(diceState.last.text);
        renderDice();
      };
      actions.appendChild(rr); actions.appendChild(open);
    } else if (diceState.phase === "result") {
      if (diceState.round < 5 && diceState.bank > 0) {
        const next = el("button", "btn btn-primary", "下一局");
        next.onclick = () => { diceState.round++; rollRound(); renderDice(); };
        actions.appendChild(next);
      } else {
        const done = el("button", "btn btn-primary", "结算离桌");
        done.onclick = () => {
          diceState.phase = "done";
          diceState.reward = Math.max(0, diceState.bank - diceState.start);
          recordArcade("dice", { bestBank: Math.max(diceState.bank, diceState.bestBank || 0), bestStreak: diceState.bestStreak, runs: (diceState.runs || 0) + 1 });
          if (diceState.reward) marks(diceState.reward);
          if (global.GokContent && global.GokContent.grantDaily) { const d = global.GokContent.grantDaily("arcade", 1); if (d) diceState.reward += d; }
          renderDice();
        };
        actions.appendChild(done);
      }
    } else {
      const again = el("button", "btn btn-primary", "再开一局");
      again.onclick = openDice; actions.appendChild(again);
    }
    shell.appendChild(actions);
    const log = el("div", "ledger-log"); log.appendChild(el("div", "panel-label", "赌桌记录")); diceState.log.slice(-5).forEach(x => log.appendChild(el("div", null, x)));
    shell.appendChild(log);
    box.appendChild(shell);
  }

  /* ===== 黑签分诊 ===== */
  const PATIENTS = [
    { name: "雪镇矿工", faction: "共和国", condition: "雪盲与断腿", critical: true },
    { name: "铁序炉工", faction: "帝国", condition: "吸入了黑脊尘", critical: true },
    { name: "灰港信使", faction: "灰港", condition: "封口行刀伤", critical: false },
    { name: "学院记录员", faction: "学院", condition: "记录弹灼伤", critical: false },
    { name: "断线佣兵", faction: "灰港", condition: "断裂锁链压伤", critical: false },
    { name: "洛斯汰幼体", faction: "洛斯汰", condition: "潮汐脱水", critical: false }
  ];
  let triageState = null;
  function openTriage() {
    if (global.GokUI) global.GokUI.showScreen("arcade");
    const archive = load(); const prev = (archive.arcade && archive.arcade.triage) || {};
    triageState = { treated: [], done: false, reward: 0, bestSaved: prev.bestSaved || 0, bestCritical: prev.bestCritical || 0, runs: prev.runs || 0 };
    renderTriage();
  }
  function renderTriage() {
    const box = root(); if (!box) return;
    clear(box);
    header(box, "黑签分诊", "MEDICAL / BLACK SIGN", renderHub);
    const shell = el("div", "arcade-game-shell");
    const stats = el("div", "arcade-stats");
    stats.appendChild(el("span", null, "药 " + (3 - triageState.treated.length) + " / 3"));
    stats.appendChild(el("span", null, "已收治 " + triageState.treated.length));
    shell.appendChild(stats);
    shell.appendChild(el("p", "arcade-rule", "三剂药，六个病人。点选病人使用一剂药；药可以给任何人，剩下的会拿到黑签。重伤者优先，但黑签不看对错。"));
    const grid = el("div", "triage-grid");
    for (const p of PATIENTS) {
      const treated = triageState.treated.indexOf(p.name) >= 0;
      const card = el("button", "triage-patient" + (treated ? " treated" : "") + (triageState.done && !treated ? " lost" : "") + (p.critical ? " critical" : ""));
      card.type = "button";
      card.appendChild(el("strong", null, p.name));
      card.appendChild(el("span", null, p.faction));
      card.appendChild(el("p", null, p.condition));
      card.appendChild(el("small", null, p.critical ? "重伤 · 优先" : "可等待"));
      if (triageState.done && !treated) card.appendChild(el("em", null, "黑签"));
      card.onclick = () => {
        if (triageState.done || treated || triageState.treated.length >= 3) return;
        triageState.treated.push(p.name);
        if (triageState.treated.length === 3) {
          triageState.done = true;
          const saved = PATIENTS.filter(x => triageState.treated.indexOf(x.name) >= 0);
          const crit = saved.filter(x => x.critical).length;
          triageState.reward = crit >= 2 ? 2 : crit >= 1 ? 1 : 0;
          recordArcade("triage", { bestSaved: Math.max(saved.length, triageState.bestSaved || 0), bestCritical: Math.max(crit, triageState.bestCritical || 0), runs: (triageState.runs || 0) + 1 });
          if (triageState.reward) marks(triageState.reward);
          if (global.GokContent && global.GokContent.grantDaily) { const d = global.GokContent.grantDaily("arcade", 1); if (d) triageState.reward += d; }
        }
        renderTriage();
      };
      grid.appendChild(card);
    }
    shell.appendChild(grid);
    if (triageState.done) {
      const saved = PATIENTS.filter(x => triageState.treated.indexOf(x.name) >= 0);
      const crit = saved.filter(x => x.critical).length;
      shell.appendChild(el("div", "ledger-result " + (crit >= 2 ? "win" : "push"), "分诊结束：救下 " + saved.length + " 人，其中重伤 " + crit + " 人。印记 +" + triageState.reward + "。"));
    }
    const actions = el("div", "modal-actions");
    if (triageState.done) {
      const again = el("button", "btn btn-primary", "重新分诊"); again.onclick = openTriage; actions.appendChild(again);
    }
    shell.appendChild(actions);
    box.appendChild(shell);
  }

  global.GokArcade = { open, openDice, openTriage };
})(typeof globalThis !== "undefined" ? globalThis : this);
