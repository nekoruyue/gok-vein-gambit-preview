/* 《戈克世界：流脉牌局》内容模式 v0.1
 * 远征 / 竞技场 / 每日挑战 / 残局 / 故事
 * 复用经典战斗引擎，不修改核心规则。
 */
(function (global) {
  "use strict";
  const D = global.GokData;
  const E = global.GokEngine;
  const app = global.GokApp;
  const STORE = "gok_content_v1";
  const root = () => document.getElementById("content-root");
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const clear = (n) => { while (n && n.firstChild) n.removeChild(n.firstChild); };
  const factionName = (f) => D.FACTIONS[f] ? D.FACTIONS[f].name : "中立";
  const fmtDate = () => new Date().toISOString().slice(0, 10);
  const rand = (arr, n) => arr.slice().sort(() => Math.random() - 0.5).slice(0, n);

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE) || "null") || {}; }
    catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) {}
    try { global.dispatchEvent(new CustomEvent("gok-content-changed")); } catch (e) {}
  }
  function grantDaily(key, amount) {
    const data = load();
    const today = fmtDate();
    data.dailyModes = data.dailyModes || {};
    if (data.dailyModes[key] === today) return 0;
    data.dailyModes[key] = today;
    data.marks = (data.marks || 0) + amount;
    save(data);
    return amount;
  }

  function factionDeck(faction) {
    const custom = app.customDecks && app.customDecks[faction];
    const list = custom && D.validateDeck(faction, custom).ok ? custom : D.DECKS[faction];
    const active = (app.activeRelics && app.activeRelics[faction]) || (list.find(id => D.CARDS[id] && D.CARDS[id].type === "relic"));
    return list.filter(id => D.CARDS[id] && D.CARDS[id].type !== "relic").concat(active ? [active] : []);
  }
  function poolFor(faction) {
    return Object.values(D.CARDS).filter(c => !c.token && !c.disabled && c.type !== "relic" && (c.faction === faction || c.faction === "neutral"));
  }
  function randomOpponent(faction) {
    const ids = D.FACTION_IDS.filter(f => f !== faction);
    return ids[Math.floor(Math.random() * ids.length)];
  }
  function seedFrom(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }
  function labelFor(mode) {
    return { expedition: "远征", arena: "竞技场", daily: "每日挑战", puzzle: "残局", story: "故事", mirror: "镜像对决" }[mode] || "模式";
  }
  function runMode(mode, label) {
    app.contentRun = { mode: mode, label: label || labelFor(mode) };
  }
  function leaveBattle() {
    app.contentRun = null;
    app.game = null;
    app.busy = false;
    app.aiRunning = false;
    if (global.GokUI) GokUI.showScreen("content");
  }
  function afterGame(state) {
    const run = app.contentRun;
    if (!run) return;
    app.contentRun = null;
    app.game = null;
    app.busy = false;
    app.aiRunning = false;
    if (global.GokUI) GokUI.showScreen("content");
    const data = load();
    if (run.mode === "expedition") expeditionAfter(data, state);
    else if (run.mode === "arena") arenaAfter(data, state);
    else if (run.mode === "daily") dailyAfter(data, state);
    else if (run.mode === "puzzle") puzzleAfter(data, state, run.puzzle);
    else if (run.mode === "story") storyAfter(data, state, run.chapter);
    else if (run.mode === "mirror") mirrorAfter(data, state);
    else renderHub();
  }

  /* ===== hub ===== */
  function open() {
    const enter = () => {
      if (global.GokUI) GokUI.showScreen("content");
      renderHub();
    };
    if (global.GokCinema) {
      global.GokCinema.playOnce("opening_v1", "opening.mp4", {
        eyebrow: "GOK WORLD · VEIN GAMBIT",
        title: "戈克降临",
        text: "地脉在群山之下翻身，巨影自风暴中醒来。档案室记录下这一切，等待下一位执脉者。"
      }).then(enter);
    } else {
      enter();
    }
  }
  function setBattlerChrome() {
    const head = document.querySelector('#screen-content .page-head');
    if (head) {
      const e = head.querySelector('.eyebrow'); if (e) e.textContent = '战棋 / 酒馆';
      const h = head.querySelector('h1'); if (h) h.textContent = '战棋模式';
    }
    const back = document.getElementById('btn-content-back');
    if (back) { back.textContent = '← 返回开始推演'; back.onclick = () => { if (global.GokUI) GokUI.showScreen('other'); }; }
  }
  function setLedgerChrome() {
    const head = document.querySelector('#screen-content .page-head');
    if (head) {
      const e = head.querySelector('.eyebrow'); if (e) e.textContent = '街机 / 灰港账牌';
      const h = head.querySelector('h1'); if (h) h.textContent = '街机模式';
    }
    const back = document.getElementById('btn-content-back');
    if (back) { back.textContent = '← 返回开始推演'; back.onclick = () => { if (global.GokUI) GokUI.showScreen('other'); }; }
  }
  function setOtherChrome() {
    const head = document.querySelector('#screen-content .page-head');
    if (head) {
      const e = head.querySelector('.eyebrow'); if (e) e.textContent = '街机 / 灰港账牌';
      const h = head.querySelector('h1'); if (h) h.textContent = '街机模式';
    }
    const back = document.getElementById('btn-content-back');
    if (back) { back.textContent = '← 返回其他模式'; back.onclick = () => { if (global.GokUI) GokUI.showScreen('other'); }; }
  }
  function resetContentChrome() {
    const head = document.querySelector('#screen-content .page-head');
    if (head) {
      const e = head.querySelector('.eyebrow'); if (e) e.textContent = '娱乐 / 模式';
      const h = head.querySelector('h1'); if (h) h.textContent = '娱乐模式';
    }
    const back = document.getElementById('btn-content-back');
    if (back) { back.textContent = '← 返回档案处'; back.onclick = () => { if (global.GokUI) GokUI.showScreen('home'); }; }
  }

  function renderHub() {
    resetContentChrome();
    const box = root();
    if (!box) return;
    clear(box);
    const data = load();
    const intro = el("div", "content-intro");
    intro.appendChild(el("div", "eyebrow", "经典之外 / BEYOND THE CLASSIC"));
    intro.appendChild(el("h2", null, "选择一条档案线"));
    intro.appendChild(el("p", null, "经典对战之外，档案室还记录了远征、竞技场、每日挑战、残局、旧日故事与镜像对决。所有模式复用同一套流脉规则。档案印记：" + (data.marks || 0)));
    box.appendChild(intro);
    const stats = el("div", "content-stats");
    stats.appendChild(el("span", null, "印记 " + (data.marks || 0)));
    stats.appendChild(el("span", null, "残局 " + Object.keys(data.puzzles || {}).length + "/" + PUZZLES.length));
    stats.appendChild(el("span", null, "故事 " + Object.keys(data.story && data.story.done || {}).length + "/5"));
    stats.appendChild(el("span", null, "镜像 " + (data.mirror ? (data.mirror.wins || 0) + " 胜" : "未开始")));
    box.appendChild(stats);
    const activeExpedition = data.expedition && !data.expedition.finished && data.expedition.node < data.expedition.nodes.length;
    const activeArena = data.arena && data.arena.active;
    if (activeExpedition || activeArena) {
      const resume = el("div", "content-resume");
      resume.appendChild(el("span", null, activeExpedition ? "远征进行中 · 节点 " + (data.expedition.node + 1) + "/" + data.expedition.nodes.length : "竞技场轮抽进行中 · " + data.arena.picks + "/10"));
      const btn = el("button", "btn btn-small btn-primary", "继续");
      btn.onclick = () => activeExpedition ? renderExpedition() : renderArena();
      resume.appendChild(btn);
      box.appendChild(resume);
    }
    const grid = el("div", "mode-grid");
    const modes = [
      {
        id: "expedition", title: "远征", tag: "单人肉鸽",
        desc: "带领当前阵营穿过 8 个节点，处理事件与商店，最后挑战章节首领。",
        status: data.expedition && data.expedition.node < data.expedition.nodes.length ? "远征进行中 · 节点 " + (data.expedition.node + 1) + "/" + data.expedition.nodes.length : "从当前阵营开始",
        action: () => renderExpedition()
      },
      {
        id: "arena", title: "竞技场", tag: "轮抽",
        desc: "十轮三选一，每张牌入队三份，组成 30 张轮抽牌组，然后连续作战。",
        status: data.arena && data.arena.active ? "轮抽中 · " + data.arena.picks + "/10" : data.arena && data.arena.finished ? "上轮 " + data.arena.wins + " 胜 · 印记 +" + (data.arena.reward || 0) : "开始一次轮抽",
        action: () => renderArena()
      },
      {
        id: "daily", title: "每日挑战", tag: "每日种子",
        desc: "每天固定种子、固定对手，使用当前阵营挑战噩梦 AI。每天只能结算一次。",
        status: data.daily && data.daily.date === fmtDate() ? (data.daily.result === "win" ? "今日已通关" : "今日已结算") : "今日尚未推演",
        action: () => renderDaily()
      },
      {
        id: "puzzle", title: "残局", tag: "残局",
        desc: "从固定局面寻找本回合斩杀。完成记录会保存在档案里。",
        status: "已完成 " + Object.keys(data.puzzles || {}).length + " / " + PUZZLES.length,
        action: () => renderPuzzles()
      },
      {
        id: "story", title: "旧日故事", tag: "剧情",
        desc: "五段与阵营有关的短战，先看档案，再进入战斗。",
        status: "已完成 " + Object.keys(data.story && data.story.done || {}).length + " / 5",
        action: () => renderStory()
      },
      {
        id: "mirror", title: "镜像对决", tag: "镜像",
        desc: "双方使用同一阵营、同一套预设牌组。没有克制借口，只看谁更懂这套牌。",
        status: data.mirror ? "战绩 " + (data.mirror.wins || 0) + " 胜 " + (data.mirror.losses || 0) + " 负" : "选择阵营",
        action: () => renderMirror()
      }
    ];
    if (global.GOK_IS_PREVIEW && typeof app.openLabPage === "function") {
      modes.splice(2, 0, {
        id: "lab",
        title: "疯狂实验",
        tag: "抢先版",
        desc: "自由组合流脉暴走、行动力沸腾、全员先遣、跨阵营乱斗、实验卡牌与随机事件。只影响本局，不进稳定版。",
        status: "抢先版实验玩法",
        action: () => app.openLabPage("content")
      });
    }
    const groups = [
      { title: "远征与故事", ids: ["expedition", "story"] },
      { title: "挑战与每日", ids: ["daily", "puzzle", "arena"] },
      { title: "实验与镜像", ids: ["lab", "mirror"] }
    ];
    const used = new Set();
    for (const group of groups) {
      const list = group.ids.map(id => modes.find(m => m.id === id)).filter(Boolean);
      if (!list.length) continue;
      const section = el("section", "content-mode-group");
      const heading = el("div", "content-mode-group-head");
      heading.appendChild(el("span", "eyebrow", "档案线"))
      heading.appendChild(el("h3", null, group.title));
      section.appendChild(heading);
      const grid = el("div", "mode-grid");
      for (const mode of list) {
        used.add(mode.id);
        const card = el("article", "mode-card mode-" + mode.id);
        card.appendChild(el("span", "mode-tag", mode.tag));
        card.appendChild(el("h3", null, mode.title));
        card.appendChild(el("p", null, mode.desc));
        card.appendChild(el("div", "mode-status", mode.status));
        const btn = el("button", "btn btn-primary", "进入");
        btn.onclick = mode.action;
        card.appendChild(btn);
        grid.appendChild(card);
      }
      section.appendChild(grid);
      box.appendChild(section);
    }
    const rest = modes.filter(m => !used.has(m.id));
    if (rest.length) {
      const section = el("section", "content-mode-group");
      section.appendChild(el("h3", null, "其他档案"));
      const grid = el("div", "mode-grid");
      for (const mode of rest) {
        const card = el("article", "mode-card mode-" + mode.id);
        card.appendChild(el("span", "mode-tag", mode.tag));
        card.appendChild(el("h3", null, mode.title));
        card.appendChild(el("p", null, mode.desc));
        card.appendChild(el("div", "mode-status", mode.status));
        const btn = el("button", "btn btn-primary", "进入");
        btn.onclick = mode.action; card.appendChild(btn); grid.appendChild(card);
      }
      section.appendChild(grid); box.appendChild(section);
    }
    renderMarket(box, data);
  }
  const LEDGER_SYMBOLS = ["灯", "账", "雾", "刀", "币", "血"];
  let ledgerState = null;

  function ledgerCard() {
    return { symbol: LEDGER_SYMBOLS[Math.floor(Math.random() * LEDGER_SYMBOLS.length)], value: 1 + Math.floor(Math.random() * 6) };
  }
  function ledgerScore(hand) {
    const counts = {};
    for (const c of hand) counts[c.symbol] = (counts[c.symbol] || 0) + 1;
    const best = Math.max(0, ...Object.values(counts));
    const base = hand.reduce((n, c) => n + c.value, 0);
    return base + (best >= 3 ? 8 : best >= 2 ? 3 : 0);
  }
  function ledgerDeal() {
    ledgerState.player = [ledgerCard(), ledgerCard(), ledgerCard()];
    ledgerState.dealer = [ledgerCard(), ledgerCard(), ledgerCard()];
    ledgerState.phase = "deal";
    ledgerState.revealed = false;
    ledgerState.swapped = false;
    ledgerState.swapping = false;
    ledgerState.result = null;
    ledgerState.round++;
  }
  function ledgerStart() {
    const data = load();
    const luck = (data.perks && data.perks.arcade_luck) ? 1 : 0;
    ledgerState = {
      bank: 5 + luck,
      startBank: 5 + luck,
      round: 0,
      best: data.ledger && data.ledger.best || 5,
      player: [],
      dealer: [],
      phase: "deal",
      revealed: false,
      swapped: false,
      swapping: false,
      result: null,
      log: ["账房开盘：底账 5，押 1。"]
    };
    ledgerDeal();
    renderLedger();
  }
  function renderLedger() {
    const box = root();
    if (!box) return;
    if (!ledgerState) { ledgerStart(); return; }
    clear(box);
    const shell = el("div", "ledger-shell");
    const head = el("div", "content-subhead");
    setLedgerChrome();
    const back = el("button", "btn btn-small btn-ghost", "← 返回街机");
    back.onclick = () => { if (global.GokArcade) global.GokArcade.open(); else if (global.GokUI) GokUI.showScreen("other"); };
    const title = el("div", null, "");
    title.appendChild(el("div", "eyebrow", "GREYHARBOR / LEDGER"));
    title.appendChild(el("h2", null, "账牌桌"));
    head.appendChild(back); head.appendChild(title);
    shell.appendChild(head);
    const stats = el("div", "ledger-stats");
    stats.appendChild(el("span", null, "账 " + ledgerState.bank));
    stats.appendChild(el("span", null, "第 " + ledgerState.round + " / 5 手"));
    stats.appendChild(el("span", null, "最佳 " + ledgerState.best));
    shell.appendChild(stats);
    const rule = el("p", "ledger-rule", "比点数；同符号一对 +3，三张同符号 +8。你可以在开牌前换一张。赢 +1，输 -1，平局不结账。");
    shell.appendChild(rule);

    const table = el("div", "ledger-table");
    const playerRow = el("div", "ledger-hand");
    playerRow.appendChild(el("div", "ledger-hand-label", "你 · " + ledgerScore(ledgerState.player)));
    const playerCards = el("div", "ledger-cards");
    ledgerState.player.forEach((card, i) => {
      const node = el("button", "ledger-card" + (ledgerState.swapping ? " swappable" : ""));
      node.type = "button";
      node.appendChild(el("span", "ledger-symbol", card.symbol));
      node.appendChild(el("b", null, String(card.value)));
      if (ledgerState.swapping) node.onclick = () => {
        ledgerState.player[i] = ledgerCard();
        ledgerState.swapped = true;
        ledgerState.swapping = false;
        ledgerState.log.push("换了一张：" + ledgerState.player[i].symbol + " " + ledgerState.player[i].value + "。");
        renderLedger();
      };
      playerCards.appendChild(node);
    });
    playerRow.appendChild(playerCards);
    table.appendChild(playerRow);

    const dealerRow = el("div", "ledger-hand dealer");
    dealerRow.appendChild(el("div", "ledger-hand-label", "庄家" + (ledgerState.revealed ? " · " + ledgerScore(ledgerState.dealer) : "")));
    const dealerCards = el("div", "ledger-cards");
    ledgerState.dealer.forEach((card) => {
      const node = el("div", "ledger-card" + (ledgerState.revealed ? "" : " back"));
      node.appendChild(el("span", "ledger-symbol", ledgerState.revealed ? card.symbol : "？"));
      node.appendChild(el("b", null, ledgerState.revealed ? String(card.value) : ""));
      dealerCards.appendChild(node);
    });
    dealerRow.appendChild(dealerCards);
    table.appendChild(dealerRow);
    shell.appendChild(table);

    if (ledgerState.result) {
      const result = el("div", "ledger-result " + ledgerState.result.kind, ledgerState.result.text);
      shell.appendChild(result);
    }
    const actions = el("div", "modal-actions");
    if (ledgerState.phase === "deal") {
      const swap = el("button", "btn btn-small btn-ghost", ledgerState.swapped ? "已换过" : "换一张");
      swap.disabled = ledgerState.swapped;
      swap.onclick = () => { ledgerState.swapping = true; renderLedger(); };
      const open = el("button", "btn btn-primary", "开牌");
      open.onclick = () => {
        ledgerState.revealed = true;
        ledgerState.phase = "reveal";
        const p = ledgerScore(ledgerState.player);
        const d = ledgerScore(ledgerState.dealer);
        if (p > d) { ledgerState.bank += 1; ledgerState.result = { kind: "win", text: "你赢了这一手：账 +1（" + p + " : " + d + "）" }; }
        else if (p < d) { ledgerState.bank -= 1; ledgerState.result = { kind: "lose", text: "这一手输了：账 -1（" + p + " : " + d + "）" }; }
        else { ledgerState.result = { kind: "push", text: "平局：账不动（" + p + " : " + d + "）" }; }
        ledgerState.log.push(ledgerState.result.text);
        const data = load();
        data.ledger = data.ledger || {};
        data.ledger.best = Math.max(data.ledger.best || 5, ledgerState.bank);
        save(data);
        renderLedger();
      };
      actions.appendChild(swap); actions.appendChild(open);
    } else if (ledgerState.phase === "reveal") {
      if (ledgerState.round < 5 && ledgerState.bank > 0) {
        const next = el("button", "btn btn-primary", "下一手");
        next.onclick = () => { ledgerDeal(); renderLedger(); };
        actions.appendChild(next);
      } else {
        const finish = el("button", "btn btn-primary", "结算离桌");
        finish.onclick = () => {
          const data = load();
          data.ledger = data.ledger || {};
          data.ledger.best = Math.max(data.ledger.best || 5, ledgerState.bank);
          const gain = Math.max(0, ledgerState.bank - ledgerState.startBank);
          if (gain) data.marks = (data.marks || 0) + gain;
          const daily = grantDaily("arcade", 1);
          if (daily) { data.marks = (data.marks || 0) + daily; ledgerState.reward = (ledgerState.reward || 0) + daily; }
          data.ledger.last = { bank: ledgerState.bank, at: Date.now(), reward: gain };
          save(data);
          ledgerState.phase = "done";
          ledgerState.result = { kind: ledgerState.bank > ledgerState.startBank ? "win" : "push", text: "离桌：账 " + ledgerState.bank + "，本局印记 +" + gain + "。" };
          renderLedger();
        };
        actions.appendChild(finish);
      }
    } else {
      const again = el("button", "btn btn-primary", "再开一桌");
      again.onclick = () => { ledgerStart(); };
      actions.appendChild(again);
    }
    shell.appendChild(actions);
    const log = el("div", "ledger-log");
    log.appendChild(el("div", "panel-label", "账本记录"));
    for (const line of ledgerState.log.slice(-6)) log.appendChild(el("div", null, line));
    shell.appendChild(log);
    box.appendChild(shell);
  }

  let battlerState = null;
  function battlerArt(def) {
    if (!def) return "";
    if (def.art) return "assets/portraits/" + def.art + ".webp";
    if (def.noArtwork) return "";
    return "assets/generated/" + encodeURIComponent(def.id) + ".webp";
  }
  function battlerPool() {
    return Object.values(D.CARDS).filter(c => !c.token && !c.disabled && c.type === "minion");
  }
  function battlerRollShop(state, n) {
    const pool = battlerPool().filter(c => (c.cost || 0) <= ((state.tier || 1) + 2));
    const shop = [];
    for (let i = 0; i < (n || 3); i++) shop.push(pool[Math.floor(Math.random() * pool.length)]);
    state.shop = shop;
  }
  function battlerUnit(def) {
    return { cardId: def.id, name: def.name, attack: def.attack || 1, health: def.health || 1, maxHealth: def.health || 1 };
  }
  function battlerGenEnemy(state) {
    const pool = battlerPool();
    const size = Math.min(6, Math.max(1, state.round));
    state.enemy = [];
    for (let i = 0; i < size; i++) {
      const def = pool[Math.floor(Math.random() * pool.length)];
      const u = battlerUnit(def);
      if (state.round >= 5) { u.attack += 1; u.health += 1; u.maxHealth += 1; }
      state.enemy.push(u);
    }
  }
  function battlerStart() {
    battlerState = { hp: 30, enemyHp: 30, round: 1, tier: 1, gold: 3, board: [], shop: [], enemy: [], phase: "shop", log: ["买人，布阵，开战。账会自己说话。"] };
    battlerRollShop(battlerState, 3);
    battlerGenEnemy(battlerState);
    renderAutoBattler();
  }
  function battlerCardNode(def, onBuy) {
    const card = el("div", "battler-card");
    const art = battlerArt(def);
    if (art) { const img = el("img", "battler-card-art"); img.src = art; img.alt = ""; card.appendChild(img); }
    const name = el("strong", null, def.name);
    card.appendChild(name);
    card.appendChild(el("span", "battler-card-stats", (def.attack || 1) + " / " + (def.health || 1)));
    if (onBuy) {
      const buy = el("button", "btn btn-small btn-primary", "买入 · 3 账");
      buy.onclick = onBuy;
      card.appendChild(buy);
    }
    return card;
  }
  function battlerUnitNode(u) {
    const node = el("div", "battler-unit");
    node.appendChild(el("strong", null, u.name));
    node.appendChild(el("span", null, u.attack + " / " + Math.max(0, u.health)));
    return node;
  }
  function battlerCombat(state) {
    const p = state.board.map(x => Object.assign({}, x));
    const e = state.enemy.map(x => Object.assign({}, x));
    const log = [];
    let guard = 0;
    while (p.length && e.length && guard++ < 60) {
      const pa = p[0], ea = e[0];
      ea.health -= pa.attack;
      log.push(pa.name + " 击中 " + ea.name + "，造成 " + pa.attack + " 伤害。");
      if (ea.health <= 0) { log.push(ea.name + " 倒下。"); e.shift(); }
      if (!e.length) break;
      pa.health -= ea.attack;
      log.push(ea.name + " 反击 " + pa.name + "，造成 " + ea.attack + " 伤害。");
      if (pa.health <= 0) { log.push(pa.name + " 倒下。"); p.shift(); }
    }
    let damage = 0;
    if (p.length && !e.length) { damage = 3 + p.length; state.enemyHp -= damage; log.push("你赢下这一局，敌方领袖受到 " + damage + " 点伤害。"); }
    else if (e.length && !p.length) { damage = 3 + e.length; state.hp -= damage; log.push("敌方赢下这一局，你的领袖受到 " + damage + " 点伤害。"); }
    else log.push("双方打平，账不动。");
    state.lastBattle = { player: p, enemy: e, log: log.slice(-8) };
    state.log = state.log.concat(log.slice(-8));
    state.phase = "result";
    if (state.hp <= 0 || state.enemyHp <= 0) {
      state.phase = "done";
      if (state.enemyHp <= 0) {
        const data = load(); data.marks = (data.marks || 0) + 3; save(data);
        state.log.push("你赢了自走棋，档案印记 +3。");
      }
    }
  }
  function renderAutoBattler() {
    const box = root();
    if (!box) return;
    if (!battlerState) { battlerStart(); return; }
    const s = battlerState;
    clear(box);
    const shell = el("div", "battler-shell");
    const head = el("div", "content-subhead");
    setBattlerChrome();
    const back = el("button", "btn btn-small btn-ghost", "← 返回开始推演");
    back.onclick = () => { if (GokUI) GokUI.showScreen("other"); };
    const title = el("div", null, "");
    title.appendChild(el("div", "eyebrow", "AUTO BATTLE / 流脉自走棋"));
    title.appendChild(el("h2", null, "流脉自走棋"));
    head.appendChild(back); head.appendChild(title);
    shell.appendChild(head);
    const stats = el("div", "battler-stats");
    stats.appendChild(el("span", null, "你 " + Math.max(0, s.hp) + " 生命"));
    stats.appendChild(el("span", null, "账 " + s.gold));
    stats.appendChild(el("span", null, "酒馆等级 " + s.tier));
    stats.appendChild(el("span", null, "第 " + s.round + " 轮"));
    stats.appendChild(el("span", null, "敌方 " + Math.max(0, s.enemyHp) + " 生命"));
    shell.appendChild(stats);
    const shop = el("div", "battler-shop");
    shop.appendChild(el("div", "panel-label", "酒馆 · 3 账买一个"));
    const shopRow = el("div", "battler-shop-row");
    s.shop.forEach((def, i) => shopRow.appendChild(battlerCardNode(def, s.phase !== "shop" ? null : () => {
      if (s.gold < 3 || s.board.length >= 6) { s.log.push(s.board.length >= 6 ? "阵位已满。" : "账不够。"); renderAutoBattler(); return; }
      s.gold -= 3; s.board.push(battlerUnit(def)); s.shop.splice(i, 1); s.log.push("买入 " + def.name + "。"); renderAutoBattler();
    })));
    shop.appendChild(shopRow); shell.appendChild(shop);
    const boards = el("div", "battler-boards");
    for (const [label, units, cls] of [["你的阵位", s.board, "player"], ["敌方阵位", s.enemy, "enemy"]]) {
      const side = el("div", "battler-side " + cls);
      side.appendChild(el("div", "panel-label", label + " · " + units.length + "/6"));
      const row = el("div", "battler-row");
      if (!units.length) row.appendChild(el("span", "muted", "空阵位"));
      if (cls === "player") {
        units.forEach((u, idx) => {
          const node = battlerUnitNode(u);
          if (s.phase === "shop") {
            const sell = el("button", "battler-sell", "卖 +2");
            sell.onclick = () => { s.board.splice(idx, 1); s.gold += 2; s.log.push("卖出 " + u.name + "，账 +2。"); renderAutoBattler(); };
            node.appendChild(sell);
          }
          row.appendChild(node);
        });
      } else {
        for (const u of units) row.appendChild(battlerUnitNode(u));
      }
      side.appendChild(row); boards.appendChild(side);
    }
    shell.appendChild(boards);
    const result = el("div", "battler-result");
    if (s.lastBattle) for (const line of s.lastBattle.log) result.appendChild(el("div", null, line));
    if (s.phase === "done") result.appendChild(el("strong", null, s.enemyHp <= 0 ? "账平了。你赢下自走棋。" : "这一桌，你输了。"));
    shell.appendChild(result);
    const actions = el("div", "modal-actions");
    if (s.phase === "shop") {
      const roll = el("button", "btn btn-small btn-ghost", "刷新 · 1 账");
      roll.disabled = s.gold < 1;
      roll.onclick = () => { if (s.gold < 1) return; s.gold--; battlerRollShop(s, 3); renderAutoBattler(); };
      const tierCost = [4, 6, 8, 10][s.tier - 1];
      const upgrade = el("button", "btn btn-small btn-ghost", s.tier >= 5 ? "酒馆满级" : "升级 · " + tierCost + " 账");
      upgrade.disabled = s.tier >= 5 || s.gold < tierCost;
      upgrade.onclick = () => { if (s.tier >= 5 || s.gold < tierCost) return; s.gold -= tierCost; s.tier++; battlerRollShop(s, 3); s.log.push("酒馆升至 " + s.tier + " 级。"); renderAutoBattler(); };
      const fight = el("button", "btn btn-primary", "开战");
      fight.disabled = !s.board.length;
      fight.onclick = () => { if (!s.board.length) return; battlerCombat(s); renderAutoBattler(); };
      actions.appendChild(roll); actions.appendChild(upgrade); actions.appendChild(fight);
    } else if (s.phase === "result") {
      const next = el("button", "btn btn-primary", "下一轮");
      next.onclick = () => {
        s.round++; s.gold = Math.min(10, 3 + s.round); s.lastBattle = null; s.phase = "shop";
        battlerRollShop(s, 3); battlerGenEnemy(s); renderAutoBattler();
      };
      actions.appendChild(next);
    } else {
      const again = el("button", "btn btn-primary", "再开一桌");
      again.onclick = () => battlerStart();
      actions.appendChild(again);
    }
    shell.appendChild(actions);
    const log = el("div", "battler-log");
    log.appendChild(el("div", "panel-label", "战报"));
    for (const line of s.log.slice(-6)) log.appendChild(el("div", null, line));
    shell.appendChild(log);
    box.appendChild(shell);
  }
  function openAutoBattler() {
    if (global.GokBattler) { global.GokBattler.open(); return; }
    if (global.GokUI) GokUI.showScreen("content");
    battlerState = null;
    renderAutoBattler();
  }
  function openLedger() {
    if (global.GokUI) GokUI.showScreen("content");
    ledgerState = null;
    renderLedger();
  }

  const MARKET = [
    { id: "exp_hp", name: "远征体魄", desc: "每次远征开局生命上限 +3。", cost: 2 },
    { id: "exp_armor", name: "远征护甲", desc: "每次远征开局护甲 +1。", cost: 1 },
    { id: "exp_gold", name: "远征盘缠", desc: "每次远征开局金币 +5。", cost: 1 },
    { id: "arena_armor", name: "竞技场护甲", desc: "竞技场战斗开局护甲 +2。", cost: 1 },
    { id: "battler_gold", name: "战棋盘缠", desc: "战棋开局额外 +2 账。", cost: 2 },
    { id: "battler_armor", name: "战棋护甲", desc: "战棋开局额外 +2 护甲。", cost: 1 },
    { id: "arcade_luck", name: "街机好运", desc: "账牌/三骰开局底账 +1。", cost: 1 }
  ];
  function renderMarket(box, data) {
    const panel = el("div", "mode-panel market-panel");
    panel.appendChild(el("div", "panel-label", "档案市场 / 印记消费"));
    panel.appendChild(el("p", null, "档案印记可以从竞技场获得。购买后的强化会永久记录在内容档案中。"));
    const row = el("div", "market-grid");
    for (const item of MARKET) {
      const owned = data.perks && data.perks[item.id];
      const card = el("div", "market-item" + (owned ? " owned" : ""));
      card.appendChild(el("strong", null, item.name));
      card.appendChild(el("p", null, item.desc));
      const b = el("button", "btn btn-small " + (owned ? "btn-ghost" : "btn-primary"), owned ? "已拥有" : "兑换 · " + item.cost + " 印记");
      b.disabled = owned || (data.marks || 0) < item.cost;
      b.onclick = () => { if ((data.marks || 0) < item.cost || (data.perks && data.perks[item.id])) return; data.marks -= item.cost; data.perks = data.perks || {}; data.perks[item.id] = true; save(data); renderHub(); };
      card.appendChild(b);
      row.appendChild(card);
    }
    panel.appendChild(row);
    box.appendChild(panel);
  }

  /* ===== expedition ===== */
  const BOSS_MODS = [
    { id: "warden", name: "守门人", desc: "首领开局获得 6 点护甲。", apply: (s) => { s.players[1].armor += 6; } },
    { id: "twin", name: "双生守卫", desc: "首领开局召唤两个 2/2 守备随从。", apply: (s) => { for (let i = 0; i < 2; i++) { const m = E.summonMinion(s, s.players[1], "shield_recruit", "center", null); if (m) { m.attack = 2; m.health = 2; m.maxHealth = 2; m.taunt = true; m.attacksLeft = 0; } } } },
    { id: "tide", name: "潮涌", desc: "开局流脉 +5。", apply: (s) => { s.vein = Math.min(11, (s.vein || 0) + 5); } }
  ];
  const ELITE_MODS = [
    { id: "bulwark", name: "铁壁", desc: "敌方领袖开局获得 4 点护甲。", apply: (s) => { s.players[1].armor += 4; } },
    { id: "bloodmoon", name: "血月", desc: "敌方领袖生命上限 +5。", apply: (s) => { const e = s.players[1]; e.maxHp += 5; e.hp += 5; } },
    { id: "overload", name: "行动力危机", desc: "敌方开局行动力 +1。", apply: (s) => { const e = s.players[1]; e.maxMana = Math.min(10, (e.maxMana || 10) + 1); e.mana = Math.min(e.maxMana, (e.mana || 0) + 1); } },
    { id: "rapid_vein", name: "湍流", desc: "开局流脉 +3。", apply: (s) => { s.vein = Math.min(11, (s.vein || 0) + 3); } }
  ];

  function renderExpedition() {
    const box = root(); clear(box);
    const data = load();
    const run = data.expedition;
    const head = el("div", "content-subhead");
    head.appendChild(el("button", "btn btn-small btn-ghost", "← 返回街机模式"));
    head.querySelector("button").onclick = renderHub;
    head.appendChild(el("div", "eyebrow", "远征 / RUN"));
    head.appendChild(el("h2", null, "地脉远征"));
    box.appendChild(head);
    if (!run || run.finished) {
      if (run && run.finished) {
        const summary = el("div", "mode-panel");
        summary.appendChild(el("div", "panel-label", run.victory ? "EXPEDITION COMPLETE" : "EXPEDITION ENDED"));
        summary.appendChild(el("h3", null, run.victory ? "远征完成" : "远征中止"));
        summary.appendChild(el("p", null, "阵营：" + factionName(run.faction) + " · 金币：" + (run.gold || 0) + " · 生命上限加成：" + (run.boons && run.boons.maxHp || 0) + " · 护甲加成：" + (run.boons && run.boons.armor || 0)));
        box.appendChild(summary);
      }
      box.appendChild(el("p", "muted", "选择当前构筑的阵营，开始一条八节点远征路线。战斗后可以从三张卡中选一张，替换牌组中的一张卡。"));
      const row = el("div", "mode-actions");
      for (const f of D.FACTION_IDS) {
        const b = el("button", "btn btn-small btn-ghost", factionName(f));
        b.onclick = () => { startExpedition(f); };
        row.appendChild(b);
      }
      box.appendChild(row);
      return;
    }
    const info = el("div", "mode-panel");
    info.appendChild(el("div", "panel-label", "当前远征"));
    info.appendChild(el("h3", null, factionName(run.faction) + " · 节点 " + (run.node + 1) + " / " + run.nodes.length));
    const nodeType = run.nodes[run.node];
    const eliteMod = nodeType === "elite" && run.eliteMod ? ELITE_MODS.find(m => m.id === run.eliteMod) : null;
    const bossMod = nodeType === "boss" && run.bossMod ? BOSS_MODS.find(m => m.id === run.bossMod) : null;
    info.appendChild(el("p", null, nodeType === "elite" && eliteMod ? "精英战 · " + eliteMod.name + "：" + eliteMod.desc : nodeType === "boss" && bossMod ? "首领 · " + bossMod.name + "：" + bossMod.desc : (run.node === run.nodes.length - 1 ? "前方是章节首领，准备最后一场战斗。" : "下一节点：" + nodeName(nodeType) + " · 金币 " + (run.gold || 0))));
    const bar = el("div", "mode-progress");
    const fill = el("i");
    fill.style.width = (run.node / run.nodes.length * 100) + "%";
    bar.appendChild(fill);
    info.appendChild(bar);
    renderNodeActions(box, data, run, info);
    box.appendChild(info);
    if (run.eliteBoon) renderEliteBoon(box, data, run);
    if (run.reward) renderReward(box, data, run);
  }
  function nodeName(n) {
    return { battle: "遭遇战", elite: "精英战", event: "档案事件", shop: "流脉商店", camp: "营地", boss: "章节首领" }[n] || "遭遇战";
  }
  function expeditionBoonText(run) {
    const b = run.boons || {};
    return "生命上限 +" + (b.maxHp || 0) + " · 开局护甲 " + (b.armor || 0) + " · 金币 " + (run.gold || 0);
  }
  function renderNodeActions(box, data, run, info) {
    const node = run.nodes[run.node];
    if (node === "battle" || node === "elite" || node === "boss") {
      const actions = el("div", "mode-actions");
      const fight = el("button", "btn btn-primary", "进入节点");
      fight.onclick = () => startExpeditionBattle(run);
      actions.appendChild(fight);
      const reset = el("button", "btn btn-small btn-ghost", "放弃远征");
      reset.onclick = () => { run.finished = true; save(data); renderExpedition(); };
      actions.appendChild(reset);
      info.appendChild(actions);
      return;
    }
    info.appendChild(el("p", "muted", "当前状态：" + expeditionBoonText(run)));
    const row = el("div", "mode-actions");
    if (node === "event") {
      const options = [
        { label: "地脉祭坛：生命上限 +2", apply: () => { run.boons = run.boons || {}; run.boons.maxHp = (run.boons.maxHp || 0) + 2; } },
        { label: "拾荒：金币 +8", apply: () => { run.gold = (run.gold || 0) + 8; } },
        { label: "旧盾：开局护甲 +2", apply: () => { run.boons = run.boons || {}; run.boons.armor = (run.boons.armor || 0) + 2; } }
      ];
      for (const o of options) {
        const b = el("button", "btn btn-small btn-ghost", o.label);
        b.onclick = () => { o.apply(); advanceExpedition(data, run); };
        row.appendChild(b);
      }
    } else if (node === "camp") {
      const options = [
        { label: "休整：生命上限 +3", apply: () => { run.boons = run.boons || {}; run.boons.maxHp = (run.boons.maxHp || 0) + 3; } },
        { label: "锻造：开局护甲 +2", apply: () => { run.boons = run.boons || {}; run.boons.armor = (run.boons.armor || 0) + 2; } },
        { label: "搜刮：金币 +6", apply: () => { run.gold = (run.gold || 0) + 6; } }
      ];
      for (const o of options) {
        const b = el("button", "btn btn-small btn-ghost", o.label);
        b.onclick = () => { o.apply(); advanceExpedition(data, run); };
        row.appendChild(b);
      }
    } else if (node === "shop") {
      const options = [
        { label: "生命上限 +3 · 6 金币", cost: 6, apply: () => { run.boons = run.boons || {}; run.boons.maxHp = (run.boons.maxHp || 0) + 3; } },
        { label: "开局护甲 +2 · 5 金币", cost: 5, apply: () => { run.boons = run.boons || {}; run.boons.armor = (run.boons.armor || 0) + 2; } },
        { label: "补给卡牌 · 6 金币", cost: 6, apply: () => { const id = rand(poolFor(run.faction), 1)[0]; if (id) addRunCard(run, id); } }
      ];
      for (const o of options) {
        const b = el("button", "btn btn-small btn-ghost", o.label);
        b.disabled = (run.gold || 0) < o.cost;
        b.onclick = () => {
          if ((run.gold || 0) < o.cost) return;
          run.gold -= o.cost; o.apply(); advanceExpedition(data, run);
        };
        row.appendChild(b);
      }
    }
    const leave = el("button", "btn btn-small btn-ghost", "离开");
    leave.onclick = () => advanceExpedition(data, run);
    row.appendChild(leave);
    info.appendChild(row);
  }
  function addRunCard(run, id) {
    const main = run.deck.filter(x => D.CARDS[x] && D.CARDS[x].type !== "relic");
    const relic = run.deck.find(x => D.CARDS[x] && D.CARDS[x].type === "relic");
    const counts = {};
    for (const x of main) counts[x] = (counts[x] || 0) + 1;
    const cut = main.find(x => counts[x] > 1) || main[main.length - 1];
    const idx = main.indexOf(cut);
    if (idx >= 0) main.splice(idx, 1);
    main.push(id);
    run.deck = main.slice(0, 30).concat(relic ? [relic] : []);
  }
  function advanceExpedition(data, run) {
    run.eliteMod = null;
    run.bossMod = null;
    run.node++;
    run.gold = (run.gold || 0) + 2;
    data.expedition = run;
    save(data);
    renderExpedition();
  }

  function startExpedition(faction) {
    const data = load();
    const perks = data.perks || {};
    data.expedition = { faction, deck: factionDeck(faction), nodes: ["battle", "event", "battle", "elite", "shop", "camp", "battle", "boss"], node: 0, finished: false, victory: false, reward: null, eliteBoon: false, eliteMod: null, bossMod: null, gold: perks.exp_gold ? 5 : 0, boons: { maxHp: perks.exp_hp ? 3 : 0, armor: perks.exp_armor ? 1 : 0 } };
    save(data);
    renderExpedition();
  }
  function startExpeditionBattle(run) {
    const opponent = randomOpponent(run.faction);
    const diff = run.node >= run.nodes.length - 1 ? "nightmare" : run.node >= 2 ? "hard" : "normal";
    const eliteMod = run.nodes[run.node] === "elite" ? ELITE_MODS[seedFrom(run.faction + ":" + run.node) % ELITE_MODS.length] : null;
    const bossMod = run.nodes[run.node] === "boss" ? BOSS_MODS[seedFrom(run.faction + ":boss:" + run.node) % BOSS_MODS.length] : null;
    run.eliteMod = eliteMod ? eliteMod.id : null;
    run.bossMod = bossMod ? bossMod.id : null;
    const data = load();
    data.expedition = run;
    save(data);
    runMode("expedition", "远征");
    global.GokUI.startGame({
      faction: run.faction,
      opponent: opponent,
      p1Deck: run.deck,
      p2Deck: factionDeck(opponent),
      aiDifficulty: diff,
      first: run.node % 2,
      seed: seedFrom(run.faction + ":" + run.node + ":" + Date.now()),
      setup: (state) => {
        const p = state.players[0];
        const b = run.boons || {};
        p.maxHp += b.maxHp || 0;
        p.hp = Math.min(p.maxHp, p.hp + (b.maxHp || 0));
        p.armor += b.armor || 0;
        if (eliteMod) eliteMod.apply(state);
        if (bossMod) bossMod.apply(state);
      }
    });
  }
  function expeditionAfter(data, state) {
    const run = data.expedition;
    if (!run) { renderHub(); return; }
    if (state.winner !== 0) {
      run.finished = true;
      data.expedition = run;
      save(data);
      renderExpedition();
      return;
    }
    const clearedType = run.nodes[run.node];
    run.gold = (run.gold || 0) + (clearedType === "boss" ? 10 : clearedType === "elite" ? 5 : 3);
    run.eliteMod = null;
    run.node++;
    if (run.node >= run.nodes.length) {
      run.finished = true;
      run.victory = true;
      data.expedition = run;
      save(data);
      renderExpedition();
      return;
    }
    if (clearedType === "battle" || clearedType === "elite") run.reward = rewardOptions(run);
    if (clearedType === "elite") run.eliteBoon = true;
    data.expedition = run;
    save(data);
    renderExpedition();
  }
  function renderEliteBoon(box, data, run) {
    const panel = el("div", "mode-panel elite-panel");
    panel.appendChild(el("div", "panel-label", "ELITE CACHE / 精英战利品"));
    panel.appendChild(el("p", null, "你击穿了精英守卫，从它的档案里取走一项强化。"));
    const row = el("div", "mode-actions");
    const options = [
      { label: "生命上限 +3", apply: () => { run.boons = run.boons || {}; run.boons.maxHp = (run.boons.maxHp || 0) + 3; } },
      { label: "开局护甲 +2", apply: () => { run.boons = run.boons || {}; run.boons.armor = (run.boons.armor || 0) + 2; } },
      { label: "金币 +8", apply: () => { run.gold = (run.gold || 0) + 8; } }
    ];
    for (const o of options) {
      const b = el("button", "btn btn-small btn-primary", o.label);
      b.onclick = () => { o.apply(); run.eliteBoon = false; data.expedition = run; save(data); renderExpedition(); };
      row.appendChild(b);
    }
    panel.appendChild(row);
    box.appendChild(panel);
  }

  function rewardOptions(run) {
    return rand(poolFor(run.faction), 3).map(c => c.id);
  }
  function renderReward(box, data, run) {
    const panel = el("div", "mode-panel reward-panel");
    panel.appendChild(el("div", "panel-label", "NODE CLEARED / 三选一"));
    panel.appendChild(el("p", null, "选择一张卡加入远征牌组，会自动替换一张主卡。"));
    const grid = el("div", "reward-grid");
    for (const id of run.reward || []) {
      const c = D.CARDS[id];
      if (!c) continue;
      const card = el("button", "reward-card");
      card.appendChild(el("strong", null, c.name));
      card.appendChild(el("small", null, (c.type === "spell" ? "战术" : "随从") + " · " + c.cost + " 行动力" + (c.type === "minion" ? " · " + c.attack + "/" + c.health : "")));
      card.appendChild(el("p", null, c.text || "—"));
      card.onclick = () => {
        addRunCard(run, id);
        run.reward = null;
        data.expedition = run;
        save(data);
        renderExpedition();
      };
      grid.appendChild(card);
    }
    panel.appendChild(grid);
    box.appendChild(panel);
  }

  function renderContentFactionPicker(selected, onPick) {
    const wrap = el("div", "content-faction-picker");
    for (const id of D.FACTION_IDS) {
      const b = el("button", "content-faction-btn" + (id === selected ? " active" : ""), factionName(id));
      b.type = "button";
      b.dataset.faction = id;
      b.onclick = () => onPick(id);
      wrap.appendChild(b);
    }
    return wrap;
  }

  /* ===== arena ===== */
  function renderArena() {
    const box = root(); clear(box);
    const data = load();
    const run = data.arena;
    const head = el("div", "content-subhead");
    head.appendChild(el("button", "btn btn-small btn-ghost", "← 返回街机模式"));
    head.querySelector("button").onclick = renderHub;
    if (run && run.active) {
      const cancelRun = el("button", "btn btn-small btn-ghost", "取消本轮轮抽");
      cancelRun.onclick = () => {
        const fresh = load();
        fresh.arena = null;
        save(fresh);
        renderHub();
      };
      head.appendChild(cancelRun);
    }
    head.appendChild(el("div", "eyebrow", "竞技场 / 轮抽"));
    head.appendChild(el("h2", null, "轮抽竞技场"));
    box.appendChild(head);
    if (!run || !run.active) {
      if (run && run.finished) {
        const panel = el("div", "mode-panel");
        panel.appendChild(el("h3", null, "本轮竞技场结束 · " + run.wins + " 胜 " + run.losses + " 负"));
        panel.appendChild(el("p", null, "获得档案印记 +" + (run.reward || 0) + "。印记会记录在内容档案中。"));
        const again = el("button", "btn btn-primary", "开始新一轮轮抽");
        again.onclick = () => { data.arena = null; save(data); renderArena(); };
        panel.appendChild(again);
        box.appendChild(panel);
        return;
      }
      box.appendChild(el("p", "muted", "十轮三选一，每张牌加入三份。选满 30 张主卡后开始三场连续战斗，三败出局。"));
      app.contentArenaFaction = D.FACTIONS[app.contentArenaFaction] ? app.contentArenaFaction : (D.FACTIONS[app.faction] ? app.faction : "pus");
      const panel = el("div", "mode-panel");
      panel.appendChild(el("h3", null, "选择轮抽阵营"));
      panel.appendChild(el("p", null, "本轮的卡池、装备和对手都会围绕这个阵营生成。"));
      panel.appendChild(renderContentFactionPicker(app.contentArenaFaction, (id) => {
        app.contentArenaFaction = id;
        renderArena();
      }));
      const btn = el("button", "btn btn-primary", "以" + factionName(app.contentArenaFaction) + "开始轮抽");
      btn.onclick = () => {
        data.arena = { faction: app.contentArenaFaction, deck: [], picks: 0, wins: 0, losses: 0, active: true };
        save(data);
        renderArena();
      };
      panel.appendChild(btn);
      box.appendChild(panel);
      return;
    }
    if (run.picks < 10) {
      const panel = el("div", "mode-panel");
      panel.appendChild(el("div", "panel-label", "DRAFT " + (run.picks + 1) + " / 10"));
      panel.appendChild(el("p", null, "选择一张牌，加入三份。当前牌组 " + (run.picks * 3) + " / 30。"));
      const grid = el("div", "draft-grid");
      for (const c of rand(poolFor(run.faction), 3)) {
        const card = el("button", "draft-card");
        card.appendChild(el("strong", null, c.name));
        card.appendChild(el("small", null, (c.type === "spell" ? "战术" : "随从") + " · " + c.cost + " 行动力" + (c.type === "minion" ? " · " + c.attack + "/" + c.health : "")));
        card.appendChild(el("p", null, c.text || "—"));
        card.onclick = () => {
          for (let i = 0; i < 3; i++) run.deck.push(c.id);
          run.picks++;
          save(data);
          renderArena();
        };
        grid.appendChild(card);
      }
      panel.appendChild(grid);
      box.appendChild(panel);
      return;
    }
    if (!run.deck.some(id => D.CARDS[id] && D.CARDS[id].type === "relic")) {
      const relic = factionDeck(run.faction).find(id => D.CARDS[id] && D.CARDS[id].type === "relic");
      if (relic) run.deck.push(relic);
      save(data);
    }
    const panel = el("div", "mode-panel");
    panel.appendChild(el("h3", null, "轮抽完成 · " + run.wins + " 胜 " + run.losses + " 负"));
    panel.appendChild(el("p", null, "牌组已锁定。对手是" + factionName(randomOpponent(run.faction)) + "推演体。"));
    const fight = el("button", "btn btn-primary", "开始战斗");
    fight.onclick = () => startArenaBattle(run);
    panel.appendChild(fight);
    box.appendChild(panel);
  }
  function startArenaBattle(run) {
    const opponent = randomOpponent(run.faction);
    const data = load(); data.arena = run; save(data);
    const perc = (data.perks || {}).arena_armor;
    runMode("arena", "竞技场");
    global.GokUI.startGame({
      faction: run.faction,
      opponent: opponent,
      p1Deck: run.deck,
      p2Deck: factionDeck(opponent),
      aiDifficulty: run.wins >= 2 ? "nightmare" : "hard",
      first: run.wins % 2,
      seed: seedFrom("arena:" + run.wins + ":" + run.losses + ":" + Date.now()),
      setup: perc ? (state) => { state.players[0].armor += 2; } : undefined
    });
  }
  function arenaAfter(data, state) {
    const run = data.arena;
    if (!run) { renderHub(); return; }
    if (state.winner === 0) run.wins++; else run.losses++;
    if (run.losses >= 3 || run.wins >= 3) {
      run.active = false;
      run.finished = true;
      run.reward = run.wins >= 3 ? 3 : run.wins === 2 ? 2 : run.wins === 1 ? 1 : 0;
      data.marks = (data.marks || 0) + run.reward;
    }
    data.arena = run;
    save(data);
    renderArena();
  }

  /* ===== daily ===== */
  const DAILY_MODS = [
    { id: "armor", name: "铁壁日", desc: "双方领袖开局获得 2 点护甲。", apply: (s) => { s.players[0].armor += 2; s.players[1].armor += 2; } },
    { id: "vein", name: "流脉湍急", desc: "开局流脉为 5。", apply: (s) => { s.vein = 5; } },
    { id: "blood", name: "血月", desc: "双方生命上限 -5。", apply: (s) => { for (const p of s.players) { p.maxHp = Math.max(10, p.maxHp - 5); p.hp = Math.min(p.hp, p.maxHp); } } },
    { id: "mana", name: "行动力危机", desc: "双方开局行动力 +1。", apply: (s) => { for (const p of s.players) { p.maxMana = Math.min(10, (p.maxMana || 10) + 1); p.mana = Math.min(p.maxMana, (p.mana || 0) + 1); } } }
  ];
  function dailyMod(date) {
    return DAILY_MODS[seedFrom("daily-mod:" + date) % DAILY_MODS.length];
  }

  function renderDaily() {
    const box = root(); clear(box);
    const data = load();
    const date = fmtDate();
    const result = data.daily && data.daily.date === date ? data.daily.result : null;
    const head = el("div", "content-subhead");
    head.appendChild(el("button", "btn btn-small btn-ghost", "← 返回街机模式"));
    head.querySelector("button").onclick = renderHub;
    head.appendChild(el("div", "eyebrow", "每日挑战 / 固定种子"));
    head.appendChild(el("h2", null, "每日挑战 · " + date));
    box.appendChild(head);
    const panel = el("div", "mode-panel");
    const mod = dailyMod(date);
    panel.appendChild(el("p", null, "今日固定种子：" + seedFrom("daily:" + date) + "。对手：噩梦 AI。阵营使用当前档案阵营。"));
    const modLine = el("p", "daily-mod", "今日规则 · " + mod.name + "：" + mod.desc);
    panel.appendChild(modLine);
    if (result) {
      panel.appendChild(el("h3", null, result === "win" ? "今日挑战已完成" : "今日挑战失败"));
      panel.appendChild(el("p", "muted", "连续完成：" + (data.daily.streak || 0) + " 天 · 最长连续：" + (data.daily.best || 0) + " 天。明日会刷新新的固定种子。"));
    } else {
      const b = el("button", "btn btn-primary", "进入每日挑战");
      b.onclick = () => {
        const f = app.faction || "pus";
        const other = randomOpponent(f);
        runMode("daily", "每日挑战");
        global.GokUI.startGame({
          faction: f, opponent: other,
          p1Deck: factionDeck(f), p2Deck: factionDeck(other),
          aiDifficulty: "nightmare",
          first: seedFrom(date) % 2,
          seed: seedFrom("daily:" + date),
          setup: (state) => mod.apply(state)
        });
      };
      panel.appendChild(b);
    }
    box.appendChild(panel);
  }
  function dailyAfter(data, state) {
    const today = fmtDate();
    const prev = data.daily;
    const win = state.winner === 0;
    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const prevStreak = prev && prev.date === y ? (prev.streak || 0) : 0;
    data.daily = { date: today, result: win ? "win" : "lose", streak: win ? prevStreak + 1 : 0, best: Math.max((prev && prev.best) || 0, win ? prevStreak + 1 : 0) };
    save(data);
    renderDaily();
  }

  /* ===== puzzles ===== */
  const PUZZLES = [
    { id: "last_hit", name: "最后一步", desc: "你的随从已经站在敌方领袖面前。本回合完成斩杀。", setup: (s) => setupPuzzle(s, [{ atk: 5, hp: 5 }], 5, false) },
    { id: "double_line", name: "双线齐发", desc: "两条阵线都准备好了。用两次攻击终结对手。", setup: (s) => setupPuzzle(s, [{ atk: 5, hp: 5 }, { atk: 5, hp: 5 }], 10, false) },
    { id: "through_wall", name: "越过盾墙", desc: "对方有守备。先用一次攻击拆盾，再补上最后一击。", setup: (s) => setupPuzzle(s, [{ atk: 7, hp: 7 }, { atk: 5, hp: 5 }], 5, true) },
    { id: "triple_line", name: "三线合围", desc: "三次攻击，正好覆盖敌方领袖的生命。", setup: (s) => setupPuzzle(s, [{ atk: 5, hp: 5 }, { atk: 5, hp: 5 }, { atk: 5, hp: 5 }], 15, false) },
    { id: "armor_break", name: "破甲", desc: "对手有 3 点护甲。算好两次攻击的溢出伤害。", setup: (s) => setupPuzzle(s, [{ atk: 5, hp: 5 }, { atk: 5, hp: 5 }], 7, false, 3) }
  ];
  function setupPuzzle(s, minions, enemyHp, enemyTaunt, enemyArmor) {
    s.mulliganPhase = false;
    s.mulliganDone = { 0: true, 1: true };
    s.current = 0;
    s.round = 3;
    const p = s.players[0], e = s.players[1];
    p.hand = []; e.hand = [];
    p.deck = []; e.deck = [];
    for (const z of E.ZONES) { p.board[z] = []; e.board[z] = []; }
    p.mana = 10; p.maxMana = 10; p.hp = 30; p.maxHp = 30; p.armor = 0;
    e.hp = enemyHp; e.maxHp = enemyHp; e.armor = enemyArmor || 0;
    let i = 0;
    for (const cfg of minions) {
      const m = E.summonMinion(s, p, "shield_recruit", ["left", "center", "right"][i] || "center", null);
      if (m) { m.attack = cfg.atk; m.health = cfg.hp; m.maxHealth = cfg.hp; m.attacksLeft = 1; m.taunt = false; }
      i++;
    }
    if (enemyTaunt) {
      const t = E.summonMinion(s, e, "shield_recruit", "center", null);
      if (t) { t.attack = 2; t.health = 2; t.maxHealth = 2; t.taunt = true; t.attacksLeft = 0; }
    }
    s.status = "playing";
  }
  function renderPuzzles() {
    const box = root(); clear(box);
    const data = load();
    const head = el("div", "content-subhead");
    head.appendChild(el("button", "btn btn-small btn-ghost", "← 返回街机模式"));
    head.querySelector("button").onclick = renderHub;
    head.appendChild(el("div", "eyebrow", "残局 / 斩杀"));
    head.appendChild(el("h2", null, "残局档案"));
    box.appendChild(head);
    const grid = el("div", "puzzle-grid");
    for (const p of PUZZLES) {
      const card = el("article", "mode-card puzzle-card");
      card.appendChild(el("span", "mode-tag", "LETHAL"));
      card.appendChild(el("h3", null, p.name));
      card.appendChild(el("p", null, p.desc));
      card.appendChild(el("div", "mode-status", data.puzzles && data.puzzles[p.id] ? "已完成" : "未完成"));
      const b = el("button", "btn btn-primary", "进入残局");
      b.onclick = () => {
        runMode("puzzle", "残局");
        app.contentRun.puzzle = p.id;
        global.GokUI.startGame({
          faction: "empire", opponent: "pus",
          p1Deck: factionDeck("empire"), p2Deck: factionDeck("pus"),
          aiDifficulty: "easy", mulligan: false,
          setup: p.setup,
          seed: seedFrom("puzzle:" + p.id)
        });
      };
      card.appendChild(b);
      grid.appendChild(card);
    }
    box.appendChild(grid);
  }
  function puzzleAfter(data, state, id) {
    if (state.winner === 0 && id) {
      data.puzzles = data.puzzles || {};
      data.puzzles[id] = true;
      save(data);
    }
    renderPuzzles();
  }

  /* ===== story ===== */
  const STORY = [
    { id: "ch1", title: "灰港的夜", faction: "pus", opponent: "xizhao", text: "潮雾压低了灯塔。档案里的第一段故事，从一个不肯熄灯的港口开始。" },
    { id: "ch2", title: "零点演算", faction: "academy", opponent: "empire", text: "学院塔顶的钟停在零点，记录员发现所有算式都指向同一个答案。" },
    { id: "ch3", title: "赤潮来客", faction: "xizhao", opponent: "republic", text: "血潮越过旧边墙。来客没有名字，只带着一枚被火烤黑的流脉徽记。" },
    { id: "ch4", title: "铁与誓约", faction: "republic", opponent: "academy", text: "共和国的议会厅里，铁誓军团等待一个不会被写进正史的决定。" },
    { id: "ch5", title: "最后一炉", faction: "empire", opponent: "pus", text: "帝国锻炉最后一次点火。守炉人知道，炉火熄灭之前必须有人做出选择。" }
  ];
  function renderStory() {
    const box = root(); clear(box);
    const data = load();
    const done = (data.story && data.story.done) || {};
    const head = el("div", "content-subhead");
    head.appendChild(el("button", "btn btn-small btn-ghost", "← 返回街机模式"));
    head.querySelector("button").onclick = renderHub;
    head.appendChild(el("div", "eyebrow", "剧情 / 支线档案"));
    head.appendChild(el("h2", null, "旧日故事"));
    box.appendChild(head);
    const list = el("div", "story-list");
    for (let i = 0; i < STORY.length; i++) {
      const ch = STORY[i];
      const unlocked = i === 0 || !!done[STORY[i - 1].id];
      const card = el("article", "story-card" + (done[ch.id] ? " done" : "") + (unlocked ? "" : " locked"));
      card.appendChild(el("span", "mode-tag", factionName(ch.faction)));
      card.appendChild(el("h3", null, ch.title));
      card.appendChild(el("p", null, ch.text));
      card.appendChild(el("div", "mode-status", done[ch.id] ? "已记录" : unlocked ? "未记录" : "完成上一段后解锁"));
      if (unlocked) {
        const b = el("button", "btn btn-small btn-primary", done[ch.id] ? "重读" : "进入故事");
        b.onclick = () => renderStoryDetail(ch);
        card.appendChild(b);
      }
      list.appendChild(card);
    }
    box.appendChild(list);
  }
  function renderStoryDetail(ch) {
    const box = root(); clear(box);
    const head = el("div", "content-subhead");
    head.appendChild(el("button", "btn btn-small btn-ghost", "← 返回故事"));
    head.querySelector("button").onclick = renderStory;
    head.appendChild(el("div", "eyebrow", "STORY / " + factionName(ch.faction)));
    head.appendChild(el("h2", null, ch.title));
    box.appendChild(head);
    const panel = el("div", "mode-panel story-detail");
    panel.appendChild(el("div", "panel-label", "ARCHIVE EXCERPT"));
    panel.appendChild(el("p", null, ch.text));
    panel.appendChild(el("p", "muted", "对手：" + factionName(ch.opponent) + " · 难度：困难 · 固定种子"));
    const row = el("div", "mode-actions");
    const start = el("button", "btn btn-primary", "进入战斗");
    start.onclick = () => {
      const begin = () => {
        runMode("story", "故事");
        app.contentRun.chapter = ch.id;
        global.GokUI.startGame({
          faction: ch.faction, opponent: ch.opponent,
          p1Deck: factionDeck(ch.faction), p2Deck: factionDeck(ch.opponent),
          aiDifficulty: "hard", first: 0,
          seed: seedFrom("story:" + ch.id)
        });
      };
      if (global.GokCinema) {
        global.GokCinema.play(ch.id + ".mp4", {
          eyebrow: "STORY · " + factionName(ch.faction),
          title: ch.title,
          text: ch.text
        }).then(begin);
      } else {
        begin();
      }
    };
    row.appendChild(start);
    panel.appendChild(row);
    box.appendChild(panel);
  }

  function storyAfter(data, state, id) {
    if (state.winner === 0 && id) {
      data.story = data.story || { done: {} };
      data.story.done = data.story.done || {};
      data.story.done[id] = true;
      save(data);
    }
    renderStory();
  }

  /* ===== mirror ===== */
  function renderMirror() {
    const box = root(); clear(box);
    const head = el("div", "content-subhead");
    const back = el("button", "btn btn-small btn-ghost", "← 返回街机模式");
    back.onclick = renderHub;
    head.appendChild(back);
    head.appendChild(el("div", "eyebrow", "MIRROR / SAME FACTION"));
    head.appendChild(el("h2", null, "镜像对决"));
    box.appendChild(head);
    app.contentMirrorFaction = D.FACTIONS[app.contentMirrorFaction] ? app.contentMirrorFaction : (D.FACTIONS[app.faction] ? app.faction : "pus");
    const panel = el("div", "mode-panel");
    panel.appendChild(el("h3", null, "选择镜像阵营"));
    panel.appendChild(el("p", null, "双方使用同一阵营、同一套预设牌组；没有克制借口，只看谁更懂这套牌。"));
    panel.appendChild(renderContentFactionPicker(app.contentMirrorFaction, (id) => {
      app.contentMirrorFaction = id;
      renderMirror();
    }));
    const start = el("button", "btn btn-primary", "以" + factionName(app.contentMirrorFaction) + "开始镜像");
    start.onclick = () => startMirror(app.contentMirrorFaction);
    panel.appendChild(start);
    box.appendChild(panel);
  }

  function startMirror(faction) {
    faction = D.FACTIONS[faction] ? faction : (D.FACTIONS[app.faction] ? app.faction : "pus");
    const deck = factionDeck(faction);
    runMode("mirror", "镜像对决 · " + factionName(faction));
    global.GokUI.startGame({
      faction: faction,
      opponent: faction,
      p1Deck: deck.slice(),
      p2Deck: deck.slice(),
      aiDifficulty: "hard",
      first: Math.floor(Math.random() * 2),
      seed: seedFrom("mirror:" + faction + ":" + Date.now())
    });
  }
  function mirrorAfter(data, state) {
    data.mirror = data.mirror || { wins: 0, losses: 0 };
    if (state.winner === 0) {
      data.mirror.wins = (data.mirror.wins || 0) + 1;
      data.marks = (data.marks || 0) + 1;
    } else {
      data.mirror.losses = (data.mirror.losses || 0) + 1;
    }
    data.mirror.last = { faction: app.contentMirrorFaction || app.faction, at: Date.now(), win: state.winner === 0 };
    save(data);
    renderHub();
  }

  function openDaily() {
    if (global.GokUI) GokUI.showScreen("content");
    renderDaily();
  }
  function resumeContent() {
    if (global.GokUI) GokUI.showScreen("content");
    const data = load();
    const expedition = data.expedition;
    if (expedition && !expedition.finished && expedition.nodes && expedition.node < expedition.nodes.length) {
      renderExpedition();
      return;
    }
    if (data.arena && data.arena.active) {
      renderArena();
      return;
    }
    renderHub();
  }

  function init() {
    const back = document.getElementById("btn-content-back");
    if (back) back.onclick = () => { if (global.GokUI) GokUI.showScreen("home"); };
  }
  init();
  global.GokContent = { open: open, afterGame: afterGame, renderHub: renderHub, openDaily: openDaily, resume: resumeContent, openAutoBattler: openAutoBattler, openLedger: openLedger, grantDaily: grantDaily };
})(typeof globalThis !== "undefined" ? globalThis : this);
