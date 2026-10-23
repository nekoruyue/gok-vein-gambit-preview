/* 《戈克世界：流脉牌局》测试版 UI
 * 原生 DOM，无框架；负责屏幕切换、渲染、输入与音效。
 */
(function (global) {
  "use strict";
  const D = global.GokData;
  const E = global.GokEngine;
  const AI = global.GokAI;
  const ART_VERSION = "20261021art9";

  // 经典模式：每个阵营首次开局播放一段对应 CG（可跳过）
  const CLASSIC_CG = {
    pus: { clip: "ch1.mp4", title: "地脉与潮雾", text: "普卫岛守着地脉的入口，也守着最后一座不熄灯的港。" },
    academy: { clip: "ch2.mp4", title: "钟塔的算式", text: "学院的钟停在零点，所有算式都指向同一个答案。" },
    xizhao: { clip: "ch3.mp4", title: "赤潮的来客", text: "血潮越过旧边墙，来客没有名字，只带着一枚烧黑的流脉徽记。" },
    republic: { clip: "ch4.mp4", title: "铁誓与议会", text: "共和国把誓言铸进铁里，也把代价写进议案。" },
    empire: { clip: "ch5.mp4", title: "最后一炉", text: "帝国锻炉再次点火，炉火照亮每一张等待命令的脸。" }
  };

  const $ = (id) => document.getElementById(id);
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function factionIcon(f) { return D.FACTIONS[f] ? D.FACTIONS[f].icon : "旅"; }
  function factionName(f) { return D.FACTIONS[f] ? D.FACTIONS[f].name : "中立"; }
  function genericArtStyle(def) {
    const f = def.faction || "neutral";
    const bg = f === "xizhao" ? "xizhao" : f === "academy" ? "menu" : "battle";
    const tint = f === "pus" ? "rgba(12,48,48,0.24)" : f === "academy" ? "rgba(18,36,66,0.26)" : f === "xizhao" ? "rgba(58,16,20,0.22)" : f === "republic" ? "rgba(52,42,18,0.22)" : f === "empire" ? "rgba(48,36,18,0.24)" : "rgba(5,10,15,0.18)";
    return "linear-gradient(180deg, rgba(5,10,15,0.12), " + tint + " 55%, rgba(5,10,15,0.7)), url('assets/backgrounds/" + bg + ".webp')";
  }

  function genericGlyph(def) {
    if (!def) return "minion";
    const kw = def.keywords || [];
    if (kw.indexOf("battlecry") >= 0) return "battlecry";
    if (kw.indexOf("deathrattle") >= 0) return "deathrattle";
    if (kw.indexOf("taunt") >= 0) return "taunt";
    if (kw.indexOf("charge") >= 0) return "charge";
    if (def.passive) return "passive";
    if (def.type === "spell" && def.spell) {
      if (["damage"].indexOf(def.spell.type) >= 0) return "charge";
      if (["freeze", "freezeAll", "freezeDraw"].indexOf(def.spell.type) >= 0) return "freeze";
      if (["buffHeal", "buffTaunt", "buffCharge"].indexOf(def.spell.type) >= 0) return "passive";
      if (["draw", "drawVein", "discover"].indexOf(def.spell.type) >= 0) return "excavate";
      if (["bloodDraw"].indexOf(def.spell.type) >= 0) return "blood";
      return "spell";
    }
    return def.type === "spell" ? "spell" : "minion";
  }

  function addGenericGlyph(art, def) {
    const img = el("img", "generic-glyph");
    img.src = "/assets/icons/" + genericGlyph(def) + ".svg";
    img.alt = "";
    art.classList.add("has-glyph");
    art.appendChild(img);
  }

  const CUSTOM_CARD_ART_KEY = "gok_custom_card_art_v1";
  function loadCustomCardArt() {
    if (app.customCardArt && typeof app.customCardArt === "object") return app.customCardArt;
    app.customCardArt = {};
    try { const raw = localStorage.getItem(CUSTOM_CARD_ART_KEY); if (raw) app.customCardArt = JSON.parse(raw) || {}; } catch (e) { app.customCardArt = {}; }
    return app.customCardArt;
  }
  function customCardArtFor(id) {
    const map = loadCustomCardArt();
    return map[id] || "";
  }
  function persistCustomCardArt() {
    try { localStorage.setItem(CUSTOM_CARD_ART_KEY, JSON.stringify(app.customCardArt || {})); } catch (e) {}
  }
  function clearCustomCardArt(id) {
    loadCustomCardArt(); delete app.customCardArt[id]; persistCustomCardArt();
  }
  function storeCustomCardArt(id, dataUrl) {
    loadCustomCardArt(); app.customCardArt[id] = dataUrl; persistCustomCardArt();
  }
  function replaceCardArtFromFile(id, file, done) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const w = 300, h = 420; const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d"); const scale = Math.max(w / img.width, h / img.height);
        const dw = img.width * scale, dh = img.height * scale;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
        storeCustomCardArt(id, canvas.toDataURL("image/webp", 0.84));
        if (done) done();
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  }

  function cardArtUrl(def) {
    if (!def) return "";
    if (def.art) return portraitImage(def.art);
    if (def.noArtwork) return "";
    return "assets/generated/" + encodeURIComponent(def.id) + (def.noGeneratedArt ? ".svg" : ".webp") + "?v=" + ART_VERSION;
  }

  function addCardFrame(card) {
    if (!card) return;
    const frame = el("img", "card-frame-art");
    frame.alt = "";
    frame.src = "assets/ui/card-frame.webp?v=" + ART_VERSION;
    card.appendChild(frame);
  }

  function addHeroFrame(container) {
    if (!container) return;
    const frame = el("img", "hero-frame-art");
    frame.alt = "";
    frame.src = "assets/ui/hero-frame.webp?v=" + ART_VERSION;
    container.appendChild(frame);
  }

  function addGeneratedArt(art, def) {
    if (!art || !def || def.art || def.noArtwork) return;
    const img = el("img", "generated-art-img");
    img.alt = "";
    img.loading = "eager";
    img.src = cardArtUrl(def);
    img.onload = () => { if (img.naturalWidth > 2 && img.naturalHeight > 2) art.classList.add("has-custom-art"); };
    img.onerror = () => {
      if (!img.dataset.retried) {
        img.dataset.retried = "1";
        img.src = "/api/art/" + encodeURIComponent(def.id);
      } else if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    };
    art.appendChild(img);
  }
  function heroImage(id) { if (id === "balaena" || id === "sernach") return portraitImage(id); const file = id === "otto" ? "otto_centered" : id; return "assets/heroes/" + file + ".webp"; }
  function portraitImage(id) { return "assets/portraits/" + id + ".webp?v=" + ART_VERSION; }
  const HERO_SKILL_ICONS = {
    balaena: "assets/icons/skills/balaena-skill.svg?v=" + ART_VERSION,
    sernach: "assets/icons/skills/sernach-skill.svg?v=" + ART_VERSION
  };
  function heroSkillIcon(id) { return HERO_SKILL_ICONS[id] || ("assets/icons/skills/" + id + ".webp?v=" + ART_VERSION); }
  function escapeText(s) { return s == null ? "" : String(s); }

  const SAVED_HAND_MODE = (() => { try { return localStorage.getItem("gok_hand_play_mode"); } catch (e) { return null; } })();
  const COARSE_POINTER = (() => {
    try {
      if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return true;
      return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
    } catch (e) { return false; }
  })();

  const app = {
    screen: "home",
    mode: "ai",
    faction: "pus",
    game: null,
    local: false,
    human: 0,
    aiPlayer: 1,
    viewer: 0,
    busy: false,
    modalOpen: false,
    simRunning: false,
    selectedCard: null,
    targetInfo: null,
    zoneSelect: null,
    attacker: null,
    payBloodChoice: null,
    pendingBloodCard: null,
    draggingUid: null,
    draggingAttacker: null,
    dragAttackTargets: [],
    pendingDragZone: null,
    suppressClick: 0,
    animating: false,
    net: null,
    customDecks: {},
    deckLibrary: {},
    activeDeckId: {},
    deckEditingId: null,
    deckReadOnly: false,
    deckDraftName: "",
    customCardArt: null,
    activeRelics: {},
    tutorial: false,
    tutorialStep: 1,
    codexFaction: "all",
    codexFilter: "all",
    codexSearch: "",
    codexCost: "all",
    codexKeyword: "all",
    codexSort: "faction",
    codexLimit: 60,
    achievements: {},
    profile: null,
    auth: { user: null },
    authGate: false,
    cloudSaveVersion: 0,
    cloudSaveAt: 0,
    cloudConflict: null,
    cloudSyncState: "idle",
    cloudSyncError: "",
    pendingRecoveryCode: "",
    recoveryReturn: "profile",
    profileTab: "personal",
    profileRecorded: false,
    mulliganOpen: false,
    mulliganSubmitted: false,
    mulliganSelected: new Set(),
    settlementAchievements: null,
    settlementRecorded: false,
    rankChange: null,
    rankReturn: "home",
    deckBuildFaction: "pus",
    deckBuildList: [],
    deckBuildFilter: "all",
    deckBuildRarity: "all",
    deckBuildOwned: "all",
    deckPoolScope: "faction",
    deckDrafts: {},
    lanHostPage: false,
    lanAutoMatch: false,
    lanAutoStarted: false,
    hostKeepAliveTimer: null,
    logGameSeed: null,
    logCursor: null,
    eventSeed: null,
    eventCursor: null,
    roomCode: "",
    roomRules: { hp: 28, maxRounds: 0, first: "random" },
    onlineMode: false,
    lanGuestOnline: false,
    lanGuestFaction: null,
    lanGuestReady: false,
    lanPublicUrl: null,
    lanGuestDecks: null,
    lanGuestDecksReady: false,
    lanHostUseCustom: true,
    lanGuestUseCustom: true,
    lanFaction: "pus",
    lanRanked: false,
    lanStatusTimer: null,
    lanHeartbeatTimer: null,
    lanPollTimer: null,
    lanSince: 0,
    lanPollBusy: false,
    lanWaitTimer: null,
    lanEndShown: false,
    lastVein: 0,
    lastThresholds: null,
    audioOn: true,
    audioVolume: 0.7,
    bgmVolume: 0.22,
    sfxVolume: 0.42,
    bgmOn: true,
    sfxOn: true,
    bgAnimOn: true,
    bgVideoOn: false,
    motionOn: true,
    damageNumbers: true,
    fxOn: true,
    aiSpeed: isPhoneLayout() ? "slow" : "normal",
    aiDifficulty: "normal",
    firstChoice: "random",
    aiOpponent: null,
    aiOpponentChoice: null,
    screenShake: true,
    textLarge: false,
    bgDim: 0,
    uiDensity: "comfortable",
    handSort: "none",
      highContrast: false,
    zoneLabels: true,
    battlerFx: "normal",
    lastAutoStrategy: null,
    lastLegendary: null,
    logOpen: false,
    aiRunning: false,
    lastConfig: null,
    seriesMode: "bo1",
    series: null,
    settingsReturn: "home",
    tutorialReturn: "home",
    codexReturn: "home",
    handPlayMode: isPhoneLayout() ? "click" : (SAVED_HAND_MODE === "double" ? "double" : "drag"),
    mobileClickArmed: null,
    mobileWelcomeShown: false,
    mobilePreviewUid: null,
    animSpeed: isPhoneLayout() ? 1.25 : (parseFloat(localStorage.getItem("gok_anim_speed")) || 0.7),
    tutorialCoachCollapsed: false,
    opponentOnline: true,
    onlineTurnKey: "",
    onlineTurnDeadline: 0,
    onlineClockTimer: null,
    onlineTurnTimeoutArmed: false,
    onlineTurnWarned: false
  };
  global.GokApp = app;

  function animMs(ms) { return Math.max(1, Math.round(Number(ms || 0) * (app.animSpeed || 1))); }

  /* ===== audio ===== */
  const MAIN_BGM = "bgm_gok_title";
  const PREP_BGM = "bgm_faction_greyharbor";
  const BATTLE_BGM = "bgm_gok_game";
  const ARCHIVE_BGM = "bgm_title";
  const SCREEN_BGM = {
    arcade: MAIN_BGM,
    other: MAIN_BGM,
    lab: MAIN_BGM,
    battler: MAIN_BGM,
    "battler-setup": MAIN_BGM
  };
  const SFX_FILES = {
    click: "click.wav", hover: "hover.wav", select: "select.wav", cancel: "cancel.wav",
    coin: "coin.wav", battle: "battle.wav", wave: "wave.wav", end_turn: "end_turn.wav",
    victory: "victory.wav", error: "error.wav", ui_open: "ui_open.wav",
    damage: "damage.wav", hero_hit: "hero_hit.wav", death: "death.wav", deathrattle: "deathrattle.wav",
    heal: "heal.wav", draw: "draw.wav", armor: "armor.wav", freeze: "freeze.wav",
    summon: "summon.wav", spell: "spell.wav", buff: "buff.wav", discover: "discover.wav",
    hero_power: "hero_power.wav", turn_start: "turn_start.wav", relic: "relic.wav", equipment: "relic.wav",
    shield: "shield.wav", poison: "poison.wav",
    victory_jingle: "victory_jingle.wav", defeat_jingle: "defeat_jingle.wav"
  };
  const SFX_GAIN = {
    click: 0.9, hover: 0.6, select: 1.2, cancel: 0.72, coin: 1.0, battle: 1.05,
    wave: 0.7, end_turn: 1.05, victory: 0.95, error: 0.7, ui_open: 1.2,
    damage: 0.95, hero_hit: 0.85, death: 1.0, deathrattle: 1.05, heal: 0.95,
    draw: 0.8, armor: 1.15, freeze: 1.05, summon: 0.78, spell: 0.55, buff: 1.15,
    discover: 0.8, hero_power: 0.92, turn_start: 0.58, relic: 1.3, shield: 1.1,
    poison: 0.9, victory_jingle: 0.95, defeat_jingle: 1.05
  };
  const SFX_RATE = 0.82;
  const BGM_RATE = 1.0;
  const BGM_ASSET_VERSION = "20261022amb8";
  function cardSoundHash(id) {
    let h = 2166136261;
    for (const ch of String(id || "")) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }
  const AudioBox = {
    sfx: {},
    gains: {},
    lastPlayAt: {},
    lastAnyAt: 0,
    failed: [],
    bgmEl: null,
    bgmName: null,
    unlocked: false,
    init() {
      const saved = localStorage.getItem("gok_sound");
      app.audioOn = saved == null ? true : saved === "1";
      const savedVol = parseFloat(localStorage.getItem("gok_volume"));
      app.audioVolume = isNaN(savedVol) ? 0.82 : Math.max(0, Math.min(1, savedVol));
      const savedBgmVol = parseFloat(localStorage.getItem("gok_bgm_volume"));
      app.bgmVolume = isNaN(savedBgmVol) ? 0.16 : Math.max(0, Math.min(1, savedBgmVol));
      const savedSfxVol = parseFloat(localStorage.getItem("gok_sfx_volume"));
      app.sfxVolume = isNaN(savedSfxVol) ? 0.68 : Math.max(0, Math.min(1, savedSfxVol));
      if (app.sfxVolume > 0 && app.sfxVolume < 0.55) app.sfxVolume = 0.55;
      app.bgmOn = localStorage.getItem("gok_bgm") !== "0";
      app.sfxOn = localStorage.getItem("gok_sfx") !== "0";
      app.bgAnimOn = localStorage.getItem("gok_bg_anim") !== "0";
      app.bgVideoOn = localStorage.getItem("gok_bg_video") === "1";
      app.motionOn = localStorage.getItem("gok_motion") !== "0";
      app.damageNumbers = localStorage.getItem("gok_damage_numbers") !== "0";
      app.fxOn = localStorage.getItem("gok_fx") !== "0";
      if (isPhoneLayout() && !localStorage.getItem("gok_screen_shake")) app.screenShake = false;
      app.aiSpeed = localStorage.getItem("gok_ai_speed") || (isPhoneLayout() ? "slow" : "normal");
      app.screenShake = localStorage.getItem("gok_screen_shake") !== "0";
      app.textLarge = localStorage.getItem("gok_text_large") === "1";
      const savedDim = parseInt(localStorage.getItem("gok_bg_dim") || "0", 10);
      app.bgDim = isNaN(savedDim) ? 0 : Math.max(0, Math.min(55, savedDim));
      app.uiDensity = localStorage.getItem("gok_ui_density") === "compact" ? "compact" : "comfortable";
      app.handSort = ["cost", "type"].indexOf(localStorage.getItem("gok_hand_sort")) >= 0 ? localStorage.getItem("gok_hand_sort") : "none";
      app.highContrast = localStorage.getItem("gok_high_contrast") === "1";
      app.zoneLabels = localStorage.getItem("gok_zone_labels") !== "0";
      app.battlerFx = localStorage.getItem("gok_battler_fx") === "fast" ? "fast" : "normal";
      if (isPhoneLayout()) {
        app.bgAnimOn = false;
        app.bgVideoOn = false;
        app.motionOn = false;
        app.fxOn = false;
        app.textLarge = true;
      }
      this.bgmEl = new Audio();
      this.bgmEl.loop = true;
      this.bgmEl.volume = app.bgmVolume * app.audioVolume;
      this.bgmEl.preservesPitch = true;
      this.bgmEl.mozPreservesPitch = true;
      this.bgmEl.webkitPreservesPitch = true;
      this.bgmEl.playbackRate = BGM_RATE;
      const phone = isPhoneLayout();
      const critical = ["click", "draw", "end_turn", "summon", "turn_start"];
      Object.keys(SFX_FILES).forEach((name) => {
        this.gains[name] = SFX_GAIN[name] || 1;
        // 手机端只预建必要音效，其余首次播放时再创建，避免刷新时同时解码几十个音频。
        if (!phone || critical.indexOf(name) >= 0) this.makeSfx(name);
      });
      const unlock = () => {
        if (this.unlocked) return;
        this.unlocked = true;
        if (app.audioOn) this.bgm(this.bgmName || MAIN_BGM);
      };
      document.addEventListener("pointerdown", unlock, { once: true });
      document.addEventListener("keydown", unlock, { once: true });
      this.updateButton();
    },
    makeSfx(name) {
      let a = this.sfx[name];
      if (a) return a;
      if (!SFX_FILES[name]) return null;
      a = new Audio("audio/" + SFX_FILES[name] + "?v=" + ART_VERSION);
      a.preload = "auto";
      a.preservesPitch = true;
      a.mozPreservesPitch = true;
      a.webkitPreservesPitch = true;
      a.playbackRate = SFX_RATE;
      a.addEventListener("error", () => { if (this.failed.indexOf(name) < 0) this.failed.push(name); }, { once: true });
      this.gains[name] = this.gains[name] || SFX_GAIN[name] || 1;
      a.volume = Math.min(1, app.sfxVolume * app.audioVolume * this.gains[name]);
      this.sfx[name] = a;
      return a;
    },
    play(name, opts) {
      if (!app.audioOn || !app.sfxOn) return;
      opts = opts || {};
      const a = this.makeSfx(name);
      if (!a) return;
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const gap = name === "damage" || name === "hero_hit" ? 45 : 70;
      if (this.lastPlayAt[name] && now - this.lastPlayAt[name] < gap) return;
      // 战斗事件允许少量重叠，但避免伤害、死亡、召唤连续刷成噪音。
      const uiSound = name === "click" || name === "select" || name === "cancel" || name === "error" || name === "ui_open" || name === "hero_power" || name === "turn_start" || name === "end_turn" || name === "victory" || name === "victory_jingle" || name === "defeat_jingle";
      const urgent = name === "death" || name === "hero_hit" || name === "deathrattle";
      if (!uiSound && !urgent && this.lastAnyAt && now - this.lastAnyAt < 55) return;
      if (!uiSound) this.lastAnyAt = now;
      this.lastPlayAt[name] = now;
      this.lastPlayedAt = now;
      try {
        a.playbackRate = opts.rate || SFX_RATE;
        a.volume = Math.min(1, app.sfxVolume * app.audioVolume * (opts.gain == null ? (this.gains[name] || 1) : opts.gain));
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch (e) {}
      if (this.bgmEl && ["battle", "hero_hit", "spell", "hero_power", "victory_jingle", "defeat_jingle"].indexOf(name) >= 0 && !this.bgmFade) {
        const target = Math.min(1, app.bgmVolume * app.audioVolume);
        this.bgmEl.volume = Math.min(1, target * 0.74);
        if (this.duckTimer) clearTimeout(this.duckTimer);
        this.duckTimer = setTimeout(() => { if (this.bgmEl && !this.bgmFade) this.bgmEl.volume = Math.min(1, app.bgmVolume * app.audioVolume); }, 260);
      }
    },
    playCard(def, side) {
      if (!def) return;
      const hash = cardSoundHash(def.id);
      const rate = 0.90 + (hash % 13) / 100;
      const type = def.type;
      const base = type === "spell" ? "spell" : type === "formation" ? "wave" : type === "equipment" ? "relic" : type === "debt" ? "coin" : "summon";
      // 战术牌执行时音效更轻，避免盖过日志与目标反馈。
      const gain = type === "spell" ? 0.38 : type === "formation" ? 0.46 : type === "equipment" ? 0.62 : 0.56;
      this.play(base, { rate, gain });
      if (type === "spell") {
        this.duckBgm(0.42, 900);
      }
      const keywords = def.keywords || [];
      if (type === "minion" && (keywords.indexOf("charge") >= 0 || keywords.indexOf("rush") >= 0)) {
        this.play("battle", { rate: rate + 0.05, gain: 0.34 });
      }
      if (type === "minion" && keywords.indexOf("taunt") >= 0) {
        this.play("shield", { rate: rate - 0.04, gain: 0.28 });
      }
    },
    duckBgm(factor, ms) {
      if (!this.bgmEl || this.bgmFade) return;
      if (this.duckTimer) clearTimeout(this.duckTimer);
      const target = Math.min(1, app.bgmVolume * app.audioVolume);
      this.bgmEl.volume = Math.max(0, target * factor);
      this.duckTimer = setTimeout(() => {
        if (this.bgmEl && !this.bgmFade) this.bgmEl.volume = target;
      }, ms || 600);
    },
    bgm(name) {
      if (!name) return;
      this.bgmName = name;
      if (!this.unlocked) return;
      if (!app.audioOn || !app.bgmOn) { if (this.bgmEl) this.bgmEl.pause(); return; }
      const src = "audio/" + name + ".ogg?v=" + BGM_ASSET_VERSION;
      const target = Math.min(1, app.bgmVolume * app.audioVolume);
      if (this.bgmEl && this.bgmEl.getAttribute("data-bgm") === name) {
        this.bgmEl.volume = target;
        if (this.bgmEl.paused) this.bgmEl.play().catch(() => {});
        return;
      }
      if (this.bgmFadeTimer) { clearInterval(this.bgmFadeTimer); this.bgmFadeTimer = null; }
      if (this.bgmEl) {
        try { this.bgmEl.pause(); this.bgmEl.removeAttribute("src"); this.bgmEl.load(); } catch (e) {}
      }
      const next = new Audio(src);
      next.loop = true;
      next.preservesPitch = true;
      next.mozPreservesPitch = true;
      next.webkitPreservesPitch = true;
      next.playbackRate = BGM_RATE;
      next.volume = target;
      next.setAttribute("data-bgm", name);
      next.addEventListener("error", () => {
        if (next.__fallback) return;
        next.__fallback = true;
        this.bgm(MAIN_BGM);
      }, { once: true });
      this.bgmEl = next;
      this.bgmFade = null;
      next.play().catch(() => {});
    },
    applyVolumes() {
      if (this.bgmEl && !this.bgmFade) this.bgmEl.volume = Math.min(1, app.bgmVolume * app.audioVolume);
      for (const k of Object.keys(this.sfx || {})) {
        this.sfx[k].volume = Math.min(1, app.sfxVolume * app.audioVolume * (this.gains[k] || 1));
      }
    },
    setVolume(value) {
      app.audioVolume = Math.max(0, Math.min(1, Number(value) || 0));
      try { localStorage.setItem("gok_volume", String(app.audioVolume)); } catch (e) {}
      this.applyVolumes();
      updateSettingsUI();
    },
    setBgmVolume(value) {
      app.bgmVolume = Math.max(0, Math.min(1, Number(value) || 0));
      try { localStorage.setItem("gok_bgm_volume", String(app.bgmVolume)); } catch (e) {}
      this.applyVolumes();
      updateSettingsUI();
    },
    setSfxVolume(value) {
      app.sfxVolume = Math.max(0, Math.min(1, Number(value) || 0));
      try { localStorage.setItem("gok_sfx_volume", String(app.sfxVolume)); } catch (e) {}
      this.applyVolumes();
      updateSettingsUI();
    },
    toggle() {
      app.audioOn = !app.audioOn;
      localStorage.setItem("gok_sound", app.audioOn ? "1" : "0");
      if (!app.audioOn) {
        if (this.bgmEl) this.bgmEl.pause();
        if (this.bgmFade && this.bgmFade.old) this.bgmFade.old.pause();
      } else if (app.bgmOn) {
        if (this.bgmEl && this.bgmEl.src) this.bgmEl.play().catch(() => {});
        else this.bgm(this.bgmName || MAIN_BGM);
      }
      this.updateButton();
      updateSettingsUI();
    },
    toggleBgm() {
      app.bgmOn = !app.bgmOn;
      localStorage.setItem("gok_bgm", app.bgmOn ? "1" : "0");
      if (!app.bgmOn) { if (this.bgmEl) this.bgmEl.pause(); }
      else if (app.audioOn) this.bgm(this.bgmName || MAIN_BGM);
      updateSettingsUI();
    },
    toggleSfx() {
      app.sfxOn = !app.sfxOn;
      localStorage.setItem("gok_sfx", app.sfxOn ? "1" : "0");
      updateSettingsUI();
    },
    updateButton() {
      const b = $("btn-sound");
      if (b) b.textContent = app.audioOn ? "声音：开" : "声音：关";
    }
  };
  global.GokAudio = AudioBox;

  function playPageTurn() {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (AudioBox.lastPlayAt && AudioBox.lastPlayAt.end_turn && now - AudioBox.lastPlayAt.end_turn < 450) return;
    AudioBox.play("end_turn");
  }

  function factionBgm(id) { return BATTLE_BGM; }

  /* ===== screens ===== */
  function showScreen(name) {
    app.screen = name;
    app.lastHandClick = null;
    document.body.dataset.screen = name;
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    const target = $("screen-" + name);
    if (target) target.classList.add("active");
    const screenBgm = SCREEN_BGM[name];
    if (screenBgm) AudioBox.bgm(screenBgm);
    else if (name === "game") AudioBox.bgm(BATTLE_BGM);
    else if (name === "setup" || name === "lan" || name === "match" || name === "room") AudioBox.bgm(PREP_BGM);
    else if (name === "codex" || name === "deck" || name === "achievements") AudioBox.bgm(ARCHIVE_BGM);
    else if (name === "home" || name === "mode" || name === "sim" || name === "tutorial" || name === "settings" || name === "rank" || name === "rules") AudioBox.bgm(MAIN_BGM);
    if (name !== "home") { closeStartMenu(); hideMobileWelcome(); }
    if (name !== "home") removeOnboardingCoach();
    if (name === "home") { updateHomeLegendary(); updateHomeAccount(); updateHomeTaskWidget(); renderHomeDash(); startHomeQuoteRotation(); setTimeout(startOnboardingIfNeeded, 300); }
    if (name === "profile") renderProfilePage();
    if (name === "appearance") renderAppearancePage();
    if (name === "login") renderLoginPage();
    if (name === "recovery") renderRecoveryPage();
    if (name === "tasks") renderTasksPage();
    if (name === "levelup") renderLevelRewardPage();
    if (name === "lesson") renderLessonPage();
    if (name === "rules") renderRulesKeywords();
    if (name === "other") renderOtherModes();
    applyVideoPrefs();
    closeModal(true);
    hideKeywordTip();
    hidePreviewNow();
    hideDeckHover();
    hideMobileCardSheet();
    clearToast();
    if (name !== "game") app.busy = false;
  }

  function returnFromTutorial() {
    const back = app.tutorialReturn === "game" && app.game ? "game" : (app.tutorialReturn || "home");
    app.tutorialReturn = "home";
    showScreen(back);
    if (back === "game") renderGame();
    else if (back === "mode") showModeSelect();
  }

  function goBack() {
    const sm = $("start-menu");
    if (sm && !sm.hidden) { closeStartMenu(); return; }
    if (app.modalOpen) { closeModal(true); app.busy = false; if (app.screen === "game") renderGame(); return; }
    if (app.logOpen) { app.logOpen = false; $("log-panel").classList.remove("open"); return; }
    if (app.settingsReturn === "game" && app.screen === "settings" && app.game) {
      app.settingsReturn = null; showScreen("game"); renderGame(); return;
    }
    switch (app.screen) {
      case "mode": {
        const lan = $("mode-lan-panel");
        const multi = $("mode-multi-panel");
        if (lan && !lan.hidden) showModeLan(false);
        else if (multi && !multi.hidden) showModeMulti(false);
        else showScreen("home");
        return;
      }
      case "setup": showModeSelect(); return;
      case "lan": stopNet(true); showScreen("mode"); showModeMulti(true); return;
      case "deck": $("btn-deck-back").click(); return;
      case "settings": {
        const back = app.settingsReturn === "game" && app.game ? "game" : "home";
        app.settingsReturn = null; showScreen(back); if (back === "game") renderGame(); return;
      }
      case "tutorial": returnFromTutorial(); return;
      case "codex": showScreen("home"); return;
      case "achievements": showScreen("home"); return;
      case "content": showScreen("home"); return;
      case "rank": showScreen("home"); return;
      case "match": showScreen("mode"); showModeMulti(true); return;
      case "room": showScreen("mode"); showModeMulti(true); return;
      case "lab": showScreen("home"); return;
      case "sim": showScreen("home"); return;
      case "rules": closeRulesScreen(); return;
      case "game":
        if (app.targetInfo || app.zoneSelect || app.attacker || app.selectedCard) cancelSelection(true);
        else confirmExit();
        return;
      default: return;
    }
  }

  /* ===== setup ===== */
  const HOME_TIPS = [
    "每个阵位最多放 3 个随从，全场最多 6 个。",
    "点击手牌，再点阵位或目标出牌；桌面端也可以直接拖拽。",
    "守备随从会保护同阵位的其他友方随从。",
    "先遣随从登场当回合可以攻击，但不能攻击敌方领袖。",
    "连携需要同阵位有另一个友方随从。",
    "冻结会让目标失去下一次攻击。",
    "4 震荡：所有随从受到 1 点伤害。",
    "7 裂隙：双方领袖受到 2 点伤害。",
    "10 魔物潮：所有随从受到 3 点伤害，双方领袖受到 5 点伤害。",
    "12 回流：共享流脉清空，重新开始积累。",
    "装备槽最多 2 个，阵位槽最多 3 个。",
    "鼠标悬停卡牌可以查看关键词说明。",
    "手机长按卡牌查看完整卡牌详情。",
    "预兆会从牌库顶 3 张里选 1 张置入手牌。",
    "采掘会抽牌并增加共享流脉。",
    "引脉只在共享流脉达到标注数字时触发。",
    "牌库抽空会进入疲劳，过牌也要算代价。",
    "结束回合前先确认行动力和可攻击随从。",
    "一套牌组固定 30 张，装备最多 2 件，阵型最多 3 张。",
    "自动构筑只是起点，建议再手动改 3–5 张。",
    "未拥有的传说卡会显示灰色标记，仍然可以查看效果。",
    "每个阵营可以保存多套不同流派的牌组。",
    "给牌组起名字，准备阶段更容易找到它。",
    "登录后档案可以跨设备同步。",
    "访客也能玩，但换设备不会自动带走档案。",
    "云存档冲突时会让你选择保留哪一份。",
    "服务器位于新加坡，网络波动时优先检查加速器。",
    "鼠标悬停卡牌可以查看完整关键词。",
    "手机长按卡牌可以打开详情。",
    "守备随从会挡住敌方对领袖的攻击。",
    "连携需要同阵位有另一个友方随从。",
    "流脉 4 / 7 / 10 / 12 会触发不同事件。",
    "牌库抽空后进入疲劳，过牌也要付代价。",
    "对局中不会自动跳转到教程页。",
    "普卫岛相信秩序应该像潮汐一样可预测。",
    "学院把流脉当作可以拆解的公式。",
    "灰港同盟不问你从哪来，只问你付不付得起。",
    "雪都的极光会记录每一个路过的名字。"
  ];
  let homeQuoteTimer = null;
  let homeQuoteIndex = 0;
  function setHomeQuote(text) {
    const quote = $("home-quote");
    if (!quote || !text) return;
    quote.classList.remove("swap");
    void quote.offsetWidth;
    quote.textContent = text;
    quote.classList.add("swap");
  }
  function applyFactionChipColors() {
    const palette = { pus:"#63A79F", academy:"#6D8FC4", xizhao:"#B45B5B", republic:"#C7A24D", empire:"#A45C48", greyharbor:"#5F8390", losutai:"#709B68", snow:"#9EC7D9" };
    document.querySelectorAll("[data-faction-chip]").forEach((chip) => {
      const id = chip.dataset.factionChip;
      const color = (D.FACTIONS[id] && D.FACTIONS[id].color) || palette[id] || "#f2c66d";
      chip.style.setProperty("--faction-color", color);
      chip.title = "查看 " + (D.FACTIONS[id] ? D.FACTIONS[id].name : id) + " 图鉴";
      chip.style.cursor = "pointer";
      chip.onclick = () => { app.codexFaction = id; AudioBox.play("ui_open"); openCodex(); };
    });
  }

  function startHomeQuoteRotation() {
    if (homeQuoteTimer) clearInterval(homeQuoteTimer);
    setHomeQuote(HOME_TIPS[homeQuoteIndex % HOME_TIPS.length]);
    homeQuoteTimer = setInterval(() => {
      homeQuoteIndex = (homeQuoteIndex + 1) % HOME_TIPS.length;
      setHomeQuote(HOME_TIPS[homeQuoteIndex]);
    }, 6200);
  }
  function updateHomeLegendary() {
    const candidates = Object.values(D.CARDS).filter(c => !c.disabled && c.name);
    if (!candidates.length) return;
    let pick = candidates[Math.floor(Math.random() * candidates.length)];
    if (app.lastLegendary && candidates.length > 1) {
      let guard = 0;
      while (pick.id === app.lastLegendary && guard++ < 8) pick = candidates[Math.floor(Math.random() * candidates.length)];
    }
    app.lastLegendary = pick.id;
    const img = $("home-legendary-img");
    if (img) {
      img.onerror = () => { img.src = "assets/backgrounds/menu.webp"; };
      const url = cardArtUrl(pick);
      img.src = url || "assets/backgrounds/menu.webp";
      img.alt = pick.name;
      const art = $("home-legendary-art");
      if (art) {
        art.classList.remove("swap");
        void art.offsetWidth;
        art.classList.add("swap");
      }
    }
    const name = $("home-legendary-name");
    if (name) name.textContent = pick.name;
    const faction = $("home-legendary-faction");
    const typeText = pick.type === "spell" ? "战术" : pick.type === "formation" ? "阵型" : pick.type === "equipment" ? "装备" : pick.type === "debt" ? "债务" : "随从";
    const rarityText = pick.token ? "衍生卡" : (RARITY_NAMES[pick.rarity] || "档案卡");
    if (faction) faction.textContent = factionName(pick.faction) + " · " + rarityText + " · " + typeText + " · " + (pick.cost || 0) + " 行动力";
    const aside = $("home-legendary");
    if (aside) {
      aside.title = "点击随机换一张卡牌";
      aside.style.cursor = "pointer";
      aside.onclick = updateHomeLegendary;
    }
  }

  function renderOtherModes() {
    const box = $("other-page-root");
    if (!box) return;
    clear(box);
    const intro = el("div", "content-intro");
    intro.appendChild(el("div", "eyebrow", "OTHER / 其他桌线"));
    intro.appendChild(el("h2", null, "其他模式"));
    intro.appendChild(el("p", null, "八人战棋、旧街机档案，以及灰港账牌桌。三条桌线，各算各的账。"));
    box.appendChild(intro);
    const grid = el("div", "mode-grid start-mode-grid");
    const modes = [
      { id: "battler", title: "战棋模式", tag: "酒馆 · 八人战棋", desc: "买人、升级酒馆、三连、自动战斗，和七位 AI 争夺最后的账。", status: "八人酒馆 · 抢先测试", action: () => { if (global.GokContent) global.GokContent.openAutoBattler(); } },
      { id: "entertainment", title: "娱乐模式", tag: "旧街机 · 档案线", desc: "远征、竞技场、每日挑战、残局、旧日故事、镜像对决与疯狂实验。", status: "原街机档案内容", action: () => { if (global.GokContent) global.GokContent.open(); } },
      { id: "arcade", title: "街机模式", tag: "灰港 · 三张赌桌", desc: "灰港账牌、铁序三骰、黑签分诊。三条街机桌线，各算各的账。", status: "账牌 · 三骰 · 分诊", action: () => { if (global.GokArcade) global.GokArcade.open(); else if (global.GokContent) global.GokContent.openLedger(); } }
    ];
    for (const mode of modes) {
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
    box.appendChild(grid);
  }

  function showModeSelect() {
    closeStartMenu();
    const main = $("mode-main");
    const multi = $("mode-multi-panel");
    const lan = $("mode-lan-panel");
    if (main) main.hidden = false;
    if (multi) multi.hidden = true;
    if (lan) lan.hidden = true;
    showScreen("mode");
    AudioBox.play("ui_open");
  }

  function showModeMulti(open) {
    const main = $("mode-main");
    if (open) showScreen("mode");
    const multi = $("mode-multi-panel");
    const lan = $("mode-lan-panel");
    if (main) main.hidden = !!open;
    if (multi) multi.hidden = !open;
    if (lan && open) lan.hidden = true;
    AudioBox.play(open ? "select" : "cancel");
  }

  function showModeLan(open) {
    const main = $("mode-main");
    const multi = $("mode-multi-panel");
    const lan = $("mode-lan-panel");
    if (main) main.hidden = !!open;
    if (multi) multi.hidden = !!open;
    if (lan) lan.hidden = !open;
    AudioBox.play(open ? "select" : "cancel");
  }

  function openStartMenu() {
    const show = () => {
      const menu = $("start-menu");
      if (!menu) return;
      menu.hidden = false;
      const root = $("start-menu-root");
      const multi = $("start-menu-multi");
      if (root) root.hidden = false;
      if (multi) multi.hidden = true;
      AudioBox.play("ui_open");
    };
    if (global.GokCinema) {
      global.GokCinema.playOnce("opening_classic_v1", "opening.mp4", {
        eyebrow: "经典模式 / 进入档案",
        title: "戈克降临",
        text: "地脉在群山之下翻身，巨影自风暴中醒来。档案室记录下这一切，等待下一位执脉者。"
      }).then(show);
    } else {
      show();
    }
  }

  function closeStartMenu() {
    const menu = $("start-menu");
    if (menu) menu.hidden = true;
  }

  function setStartSubmenu(open) {
    const root = $("start-menu-root");
    const multi = $("start-menu-multi");
    if (root) root.hidden = !!open;
    if (multi) multi.hidden = !open;
    AudioBox.play(open ? "select" : "cancel");
  }

  function setupState() {
    if (!levelUnlocked("hard") && app.aiDifficulty === "hard") app.aiDifficulty = "normal";
    if (!levelUnlocked("nightmare") && app.aiDifficulty === "nightmare") app.aiDifficulty = "normal";
    app.mode = "ai";
    if (app.screen === "setup") AudioBox.bgm(PREP_BGM);
    if (!["normal","hard","nightmare"].includes(app.aiDifficulty)) app.aiDifficulty = "normal";
    document.querySelectorAll("[data-first]").forEach(b => b.classList.toggle("active", b.dataset.first === (app.firstChoice || "random")));
    document.querySelectorAll("[data-ai-diff]").forEach(b => b.classList.toggle("active", b.dataset.aiDiff === app.aiDifficulty));
    document.querySelectorAll("#setup-faction .faction-card").forEach((b) => { b.classList.toggle("active", b.dataset.faction === app.faction); b.style.setProperty("--emblem", "url('" + D.FACTIONS[b.dataset.faction].emblem + "')"); });
    const opponents = D.FACTION_IDS.filter((id) => id !== app.faction);
    if (app.aiOpponentChoice && opponents.indexOf(app.aiOpponentChoice) < 0) app.aiOpponentChoice = null;
    if (!app.aiOpponent || opponents.indexOf(app.aiOpponent) < 0) app.aiOpponent = opponents[Math.floor(Math.random() * opponents.length)];
    const aiOther = app.aiOpponentChoice || app.aiOpponent;
    const aiFactionWrap = $("setup-ai-factions");
    if (aiFactionWrap) {
      clear(aiFactionWrap);
      const addChoice = (id, label) => {
        const b = el("button", "ai-diff-btn ai-faction-btn" + ((id === "random" && !app.aiOpponentChoice) || app.aiOpponentChoice === id ? " active" : ""), label);
        b.type = "button";
        b.onclick = () => {
          app.aiOpponentChoice = id === "random" ? null : id;
          app.aiOpponent = id === "random" ? null : id;
          AudioBox.play("click");
          setupState();
        };
        aiFactionWrap.appendChild(b);
      };
      addChoice("random", "随机");
      for (const id of opponents) addChoice(id, factionName(id));
    }
    const firstLabel = app.firstChoice === "0" ? "先手" : app.firstChoice === "1" ? "后手" : "随机先手";
    const levelLabel = app.aiDifficulty === "hard" ? "机密" : app.aiDifficulty === "nightmare" ? "绝密" : "普通";
    $("setup-summary").textContent = "单人推演 · " + factionName(app.faction) + " vs " + (app.aiOpponentChoice ? factionName(aiOther) : "随机对手（" + factionName(aiOther) + "）") + " · 档案等级 " + levelLabel + " · " + firstLabel;
    const hero = D.HEROES[D.FACTIONS[app.faction].hero];
    const art = $("setup-hero-art");
    art.style.backgroundImage = "url('" + heroImage(hero.id) + "')";
    $("setup-hero-name").textContent = hero.name;
    $("setup-hero-quote").textContent = "“" + hero.quote + "”";
    const setupPowerIcon = $("setup-power-icon");
    if (setupPowerIcon) setupPowerIcon.src = heroSkillIcon(hero.id);
    $("setup-power-name").textContent = hero.power.passive ? "被动 · " + hero.power.name : hero.power.name + " · " + hero.power.cost + " 行动力";
    $("setup-power-text").textContent = hero.power.text;
    const passiveEl = $("setup-passive-text");
    if (passiveEl) { passiveEl.textContent = ""; passiveEl.hidden = true; }
    updateSetupDeck();
  }

  /* ===== game start ===== */
  const BOOT_ASSETS = [
    "assets/backgrounds/menu.webp",
    "assets/backgrounds/battle.webp",
    "assets/heroes/lain.webp",
    "assets/heroes/marta.webp",
    "assets/heroes/karna.webp",
    "assets/heroes/wolfram.webp",
    "assets/heroes/otto_centered.webp"
  ];
  let bootBusy = false;
  let bootTipTimer = null;
  function startBootTips(initialTip) {
    if (bootTipTimer) clearInterval(bootTipTimer);
    const tips = HOME_TIPS;
    let index = Math.floor(Math.random() * tips.length);
    const show = (text) => {
      const el = $("boot-tip");
      if (el) el.textContent = text;
    };
    show(initialTip || tips[index]);
    bootTipTimer = setInterval(() => {
      index = (index + 1) % tips.length;
      show(tips[index]);
    }, 3800);
  }
  function stopBootTips() {
    if (bootTipTimer) clearInterval(bootTipTimer);
    bootTipTimer = null;
  }

  function preloadImages(list, onProgress) {
    let done = 0;
    const total = list.length || 1;
    return Promise.all(list.map((src) => new Promise((resolve) => {
      const img = new Image();
      const finish = () => { done++; if (onProgress) onProgress(done / total); resolve(); };
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
    })));
  }

  function setBootProgress(value, tip) {
    const pct = Math.max(0, Math.min(100, Math.round(value)));
    const fill = $("boot-progress");
    if (fill) fill.style.width = pct + "%";
    const percent = $("boot-percent");
    if (percent) percent.textContent = pct + "%";
    if (tip) {
      const tipEl = $("boot-tip");
      if (tipEl) tipEl.textContent = tip;
    }
  }

  function runBootLoading(title, tip, list, done) {
    const box = $("boot-loading");
    if (!box) { if (done) done(); return; }
    bootBusy = true;
    box.classList.remove("hidden");
    const titleEl = $("boot-title");
    if (titleEl) titleEl.textContent = title || "正在展开流脉档案";
    setBootProgress(0, tip || "正在校准地脉与阵位…");
    startBootTips(tip || "正在校准地脉与阵位…");
    const started = Date.now();
    preloadImages(list || BOOT_ASSETS, (p) => setBootProgress(p * 92)).then(() => {
      setBootProgress(100);
      const wait = Math.max(0, 1800 - (Date.now() - started));
      setTimeout(() => {
        stopBootTips();
        setBootProgress(100, "推演准备完成");
        box.classList.add("hidden");
        bootBusy = false;
        if (done) done();
      }, wait);
    });
  }

  function startGame(config) {
    config = config || {};
    document.body.classList.remove("game-over-cinematic", "low-hp-warning");
    const mode = "ai";
    const faction = config.faction || app.faction;
    const other = config.opponent || (app.aiOpponentChoice && app.aiOpponentChoice !== faction ? app.aiOpponentChoice : null) || app.aiOpponent || D.nextFaction(faction);
    app.aiOpponent = null;
    const p1AI = false;
    const p2AI = true;
    app.tutorial = !!config.tutorial;
    app.settlementAchievements = null;
    app.settlementRecorded = false;
    app.profileRecorded = false;
    stopNet(true);
    const requestedDifficulty = config.aiDifficulty || app.aiDifficulty || "hard";
    const safeDifficulty = (requestedDifficulty === "hard" && !levelUnlocked("hard")) || (requestedDifficulty === "nightmare" && !levelUnlocked("nightmare")) ? "normal" : requestedDifficulty;
    const state = E.createGame({
      faction1: faction,
      faction2: other,
      p1AI: p1AI,
      p2AI: p2AI,
      mode: mode,
      aiDifficulty: safeDifficulty,
      mulligan: config.mulligan !== false && !app.tutorial,
      p1Deck: config.p1Deck || getPlayDeck(faction),
      p2Deck: config.p2Deck || getPlayDeck(other),
      first: config.first,
      seed: config.seed == null ? ((Date.now() >>> 0) ^ Math.floor(Math.random() * 0x7fffffff)) : config.seed
    });
    if (typeof config.setup === "function") config.setup(state);
    if (config.experimental && config.experimental.length) applyExperimentalMods(state, config.experimental);
    state.ranked = !!config.ranked;
    state.aiSubstitute = !!config.aiSubstitute;
    app.aiSubstitute = !!config.aiSubstitute;
    app.matchmaking = !!config.matchmaking;
    const onlineNames = !!(config.matchmaking || config.ranked || config.online);
    state.players[0].name = app.tutorial ? "你（学员）" : (onlineNames ? accountDisplayName() : "你");
    state.players[1].name = app.tutorial ? "教程对手" : (config.opponentName || (app.matchmaking ? "匹配对手" : factionName(other) + "推演体"));
    app.human = 0;
    app.aiPlayer = 1;
    app.local = false;
    app.net = null;
    app.game = state;
    if (state.mulliganPhase) autoMulliganAI(state, 1);
    app.mode = mode;
    app.faction = faction;
    app.viewer = state.current;
    app.busy = false;
    app.mulliganOpen = false;
    app.mulliganSubmitted = false;
    app.mulliganSelected = new Set();
    app.simRunning = false;
    app.aiRunning = false;
    app.selectedCard = null;
    app.targetInfo = null;
    app.zoneSelect = null;
    app.attacker = null;
    app.payBloodChoice = null;
    app.pendingBloodCard = null;
    app.lastVein = state.vein;
    app.lastThresholds = Object.assign({}, state.stats.thresholds);
    const series = config.series === "bo3" ? Object.assign({ wins: [0, 0], game: 1, recorded: false }, config.seriesState || {}) : null;
    app.series = series;
    app.lastConfig = {
      mode: mode,
      faction: faction,
      opponent: other,
      aiDifficulty: config.aiDifficulty || app.aiDifficulty || "hard",
      ranked: !!config.ranked,
      matchmaking: !!config.matchmaking,
      series: series ? "bo3" : "bo1",
      seriesState: series ? Object.assign({}, series) : null
    };
    app.endCGPlayed = false;
    app.endCGPending = false;
    closeModal(true);
    showScreen("game");
    AudioBox.bgm(factionBgm(faction));
    AudioBox.play("ui_open");
    renderGame();
    const beginAfterIntro = () => {
      if (app.game !== state) return;
      renderGame();
      if (!state.mulliganPhase) {
        if (state.current === app.aiPlayer) beginAiTurn();
        else { showTurnBanner("你的回合"); }
      }
    };
    if (app.tutorial || (app.contentRun && app.contentRun.mode === "puzzle") || config.skipIntro) beginAfterIntro();
    else showTurnOrderIntro(state, beginAfterIntro);
  }

  function updateOnlineGameHud() {
    const room = $("game-room-code");
    const conn = $("game-connection-status");
    if (room) {
      room.hidden = !(app.net && app.roomCode);
      if (app.net && app.roomCode) {
        room.innerHTML = "组队码 <b>" + app.roomCode.toUpperCase() + "</b> <span>点击复制</span>";
        room.onclick = () => {
          const link = location.origin + "/?room=" + encodeURIComponent(app.roomCode);
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(() => toast("组队链接已复制。")).catch(() => toast(link));
          else toast(link);
        };
      }
    }
    if (conn) conn.hidden = !(app.net && app.opponentOnline === false);
    const emoteBtn = $("btn-emote");
    if (emoteBtn) emoteBtn.hidden = !(app.net && app.net.active);
  }

  function setOpponentOnline(online) {
    const was = app.opponentOnline;
    app.opponentOnline = online !== false;
    updateOnlineGameHud();
    if (was !== app.opponentOnline && app.net) {
      if (!app.opponentOnline) {
        gameWarn("对方已断线，等待重连…");
        toast("对方已断线，正在等待重连。");
      } else {
        toast("对方已重新连接。");
      }
    }
  }

  const ONLINE_TURN_LIMIT_MS = 60000;
  function resetOnlineTurnClock() {
    const active = !!(app.net && app.game && app.game.status === "playing" && !app.game.mulliganPhase);
    const timer = $("game-turn-timer");
    if (!active) {
      if (app.onlineClockTimer) { clearInterval(app.onlineClockTimer); app.onlineClockTimer = null; }
      app.onlineTurnKey = "";
      app.onlineTurnDeadline = 0;
      app.onlineTurnTimeoutArmed = false;
      if (timer) timer.hidden = true;
      return;
    }
    const key = app.game.current + ":" + app.game.round;
    if (app.onlineTurnKey !== key) {
      app.onlineTurnKey = key;
      app.onlineTurnDeadline = Date.now() + ONLINE_TURN_LIMIT_MS;
      app.onlineTurnTimeoutArmed = false;
      app.onlineTurnWarned = false;
      if (app.net.role === "host") { app.game.turnRemainingMs = null; }
    }
    // 重连时以房主广播的剩余时间为准，避免双方倒计时不同步。
    if (app.net.role === "guest" && typeof app.game.turnRemainingMs === "number") {
      app.onlineTurnDeadline = Date.now() + Math.max(0, app.game.turnRemainingMs);
      delete app.game.turnRemainingMs;
    }
    if (timer) { timer.hidden = false; timer.title = "本回合出牌倒计时，超时自动结束回合"; }
    if (!app.onlineClockTimer) app.onlineClockTimer = setInterval(tickOnlineTurnClock, 250);
    tickOnlineTurnClock();
  }

  function tickOnlineTurnClock() {
    const timer = $("game-turn-timer");
    if (!timer || !app.net || !app.game || app.game.status !== "playing") return;
    const left = Math.max(0, app.onlineTurnDeadline - Date.now());
    timer.textContent = Math.ceil(left / 1000) + "s";
    timer.classList.toggle("urgent", left <= 10000);
    if (left > 0 && left <= 10000 && !app.onlineTurnWarned) {
      app.onlineTurnWarned = true;
      gameWarn("只剩 10 秒，请尽快出牌。");
      if (navigator.vibrate) { try { navigator.vibrate(20); } catch (e) {} }
    }
    if (left <= 0 && !app.onlineTurnTimeoutArmed) {
      app.onlineTurnTimeoutArmed = true;
      handleOnlineTurnTimeout();
    }
  }

  function handleOnlineTurnTimeout() {
    if (!app.net || !app.game || app.game.status !== "playing" || app.game.mulliganPhase) return;
    const s = app.game;
    if (s.current === app.viewer) {
      gameWarn("出牌超时，自动结束回合。");
      endTurn();
      return;
    }
    if (app.net.role === "host") {
      gameWarn("对方出牌超时，自动结束其回合。");
      const r = E.endTurn(s, s.current);
      sendNet({ type: "state", state: redactStateForGuest(s) });
      renderGame();
      if (r && r.ok && s.status === "playing") showTurnBanner(s.current === app.viewer ? "你的回合" : "对方回合");
    } else {
      gameWarn("对方出牌超时。");
    }
  }

  function resetSelection() {
    app.selectedCard = null;
    app.targetInfo = null;
    app.zoneSelect = null;
    app.attacker = null;
    app.payBloodChoice = null;
    app.pendingBloodCard = null;
    hidePreview();
    renderGame();
  }

  /* ===== rendering ===== */
  function renderGame() {
    if (!app.game) return;
    app.skillArmed = false;
    app.mobileClickArmed = null;
    updateOnlineGameHud();
    resetOnlineTurnClock();
    hidePreviewNow();
    hideDeckHover();
    const s = app.game;
    if (app.net) app.viewer = app.net.player;
    else if (app.local) app.viewer = s.current;
    else app.viewer = app.human;
    const viewer = s.players[app.viewer];
    const top = s.players[1 - app.viewer];
    const gameShell = document.querySelector(".game-shell");
    if (gameShell) gameShell.classList.toggle("enemy-turn", s.current !== app.viewer && s.status === "playing");
    const oppSide = document.querySelector(".opponent-side");
    const mySide = document.querySelector(".player-side");
    if (oppSide) { oppSide.dataset.faction = top.faction; oppSide.dataset.icon = factionIcon(top.faction); const l = oppSide.querySelector(".board-label"); if (l) l.textContent = top.factionName + " · 敌方阵位"; }
    if (mySide) { mySide.dataset.faction = viewer.faction; mySide.dataset.icon = factionIcon(viewer.faction); const l = mySide.querySelector(".board-label"); if (l) l.textContent = viewer.factionName + " · 我方阵位"; }
    const oppEmblem = $("opponent-emblem");
    const myEmblem = $("player-emblem");
    if (oppEmblem) oppEmblem.style.backgroundImage = "url('" + (D.FACTIONS[top.faction].emblem || "") + "')";
    if (myEmblem) myEmblem.style.backgroundImage = "url('" + (D.FACTIONS[viewer.faction].emblem || "") + "')";
    $("game-mode-label").textContent = s.players[0].factionName + " 对阵 " + s.players[1].factionName + (s.ranked ? " · 排位" : app.net ? " · 在线房间" : " · 单人 AI");
    const experimentBadge = $("game-experiment-badge");
    if (experimentBadge) {
      const mods = s.experimental || [];
      experimentBadge.hidden = !mods.length;
      if (mods.length) experimentBadge.textContent = "实验：" + mods.map(id => (LAB_MODS.find(m => m.id === id) || {}).name || id).join(" · ");
    }
    const turnBadge = $("turn-badge");
    if (turnBadge) {
      if (s.status === "gameover") turnBadge.textContent = "推演结束";
      else turnBadge.innerHTML = "第 " + s.round + " 轮 · " + (s.current === app.viewer ? "你的回合" : "对方回合") + "<span class=\"turn-mana\">" + viewer.mana + "/" + viewer.maxMana + " 行动力</span>";
    }
    renderHero($("opponent-hero"), top, "top");
    renderHero($("player-hero"), viewer, "bottom");
    renderBoard($("enemy-board"), top, "top", 1 - app.viewer);
    renderBoard($("player-board"), viewer, "bottom", app.viewer);
    renderVein(s);
    renderHand(viewer, s);
    renderControls(viewer, s);
    renderLog(s);
    renderOpponentEvents(s);
    processStateEvents(s);
    renderMana(viewer);
    renderTargetingPrompt(s, viewer);
    renderTutorialCoach();
    syncMulliganUI();
    if (s.status === "gameover") $("game-hint").textContent = "推演已结束。";
    else if (app.busy) $("game-hint").textContent = app.currentHint || "推演中…";
    else if (app.targetInfo) $("game-hint").textContent = app.targetInfo.kind === "heroPower" ? "选择领袖技能目标" : app.targetInfo.kind === "minionTarget" ? "选择登场强化目标" : "选择目标";
    else if (app.zoneSelect) $("game-hint").textContent = "选择一个阵位放置随从或阵型";
    else if (app.attacker) $("game-hint").textContent = "选择攻击目标";
    else $("game-hint").textContent = "点击或拖动卡牌；点击我方随从攻击。";
    enforceBattleCardPresentation();
    if (app.net && app.net.role === "host" && app.net.active) { scheduleNetBroadcast(); scheduleHostSave(); }
  }

  function autoMulliganAI(state, playerIndex) {
    const p = state.players[playerIndex];
    if (!p) return;
    const diff = state.aiDifficulty || "hard";
    const scored = p.hand.map(c => {
      const d = D.CARDS[c.cardId];
      if (!d) return { c, s: -99 };
      const cost = E.getCardCost(state, p, c);
      let s = 0;
      if (cost <= 1) s += 5;
      else if (cost === 2) s += 4;
      else if (cost === 3) s += 2.5;
      else if (cost === 4) s -= 2;
      else s -= 5;
      if (d.type === "spell") s += 1.6;
      if (d.type === "minion" && (d.attack || 1) + (d.health || 1) >= 6) s += 1;
      if (d.type === "relic") s += 4;
      if (d.keywords && d.keywords.indexOf("rush") >= 0) s += 0.8;
      if (d.faction === p.faction) s += 0.5;
      if (diff === "easy" && cost >= 4) s -= 2;
      if (diff === "nightmare" && cost >= 4) s -= 2;
      return { c, s };
    });
    scored.sort((a, b) => a.s - b.s);
    const replace = scored.filter(x => x.s < (diff === "nightmare" ? 2.2 : 1.5)).slice(0, diff === "nightmare" ? 3 : 2).map(x => x.c.uid);
    E.mulliganPlayer(state, playerIndex, replace);
  }

  function showMulliganFor(playerIndex) {
    const s = app.game;
    if (!s || !s.mulliganPhase || s.mulliganDone[playerIndex] || app.mulliganOpen) return;
    const player = s.players[playerIndex];
    if (!player) return;
    app.mulliganOpen = true;
    app.mulliganSelected = new Set();
    openModal((content) => {
      content.classList.add("mulligan-modal");
      content.appendChild(el("div", "eyebrow", "开局 / 调度"));
      content.appendChild(el("h3", null, "起手调度"));
      content.appendChild(el("p", null, "选择要换掉的牌。换掉的牌会洗回牌库，再抽同样数量。也可以全部保留。"));
      const grid = el("div", "mulligan-grid");
      for (const c of player.hand) {
        const d = D.CARDS[c.cardId];
        if (!d || d.token) continue;
        const card = el("div", "mulligan-card");
        const art = el("div", "mulligan-art");
        if (d.art) art.style.backgroundImage = "url('" + portraitImage(d.art) + "')";
        else {
          art.classList.add("placeholder");
          art.dataset.icon = d.type === "spell" ? "术" : factionIcon(d.faction);
          art.style.backgroundImage = genericArtStyle(d);
          addGenericGlyph(art, d);
          addGeneratedArt(art, d);
        }
        card.appendChild(art);
        card.appendChild(el("div", "mulligan-cost", String(E.getCardCost(s, player, c))));
        card.appendChild(el("div", "mulligan-name", d.name));
        card.appendChild(el("div", "mulligan-meta", typeLine(d) + " · " + d.cost + " 行动力"));
        card.appendChild(el("div", "mulligan-text", d.text || "—"));
        if (d.type === "minion") {
          const stats = el("div", "mulligan-stats");
          stats.appendChild(el("span", "mulligan-atk", "攻 " + d.attack));
          stats.appendChild(el("span", "mulligan-hp", "血 " + d.health));
          card.appendChild(stats);
        }

        card.onclick = () => {
          if (app.mulliganSelected.has(c.uid)) app.mulliganSelected.delete(c.uid);
          else app.mulliganSelected.add(c.uid);
          card.classList.toggle("selected");
        };
        grid.appendChild(card);
      }
      content.appendChild(grid);
      const actions = el("div", "modal-actions");
      const keep = el("button", "btn btn-ghost", "全部保留");
      keep.onclick = () => { app.mulliganSelected = new Set(); confirmMulligan(); };
      const swap = el("button", "btn btn-primary", "确认换牌");
      swap.onclick = () => confirmMulligan();
      actions.appendChild(keep);
      actions.appendChild(swap);
      content.appendChild(actions);
      const hint = el("div", "mulligan-hint", "换牌不消耗行动力；先手/后手都会进入调度。");
      content.appendChild(hint);
    });
  }

  function confirmMulligan() {
    if (!app.game || !app.game.mulliganPhase || app.mulliganSubmitted) return;
    markMainTask("mulligan");
    const uids = Array.from(app.mulliganSelected);
    app.mulliganSelected = new Set();
    app.mulliganOpen = false;
    app.mulliganSubmitted = true;
    closeModal(true);
    if (app.net && app.net.role === "guest") {
      app.busy = true;
      guestSendAction({ kind: "mulligan", uids: uids });
      return;
    }
    E.mulliganPlayer(app.game, app.viewer, uids);
    app.busy = false;
    renderGame();
  }

  function syncMulliganUI() {
    const s = app.game;
    if (!s) return;
    if (s.mulliganPhase) {
      if (!s.mulliganDone[app.viewer] && !app.mulliganSubmitted && !app.mulliganOpen) showMulliganFor(app.viewer);
      return;
    }
    if (app.mulliganOpen) {
      app.mulliganOpen = false;
      closeModal(true);
    }
    if (app.mulliganSubmitted) {
      app.mulliganSubmitted = false;
      app.busy = false;
      if (s.current === app.aiPlayer) beginAiTurn();
      else if (s.current === app.viewer) showTurnBanner("你的回合");
    }
  }

  function renderTargetingPrompt(s, viewer) {
    const box = $("targeting-prompt");
    if (!box) return;
    clear(box);
    document.body.classList.toggle("targeting-mode", !!(app.targetInfo && (app.targetInfo.kind === "card" || app.targetInfo.kind === "minionTarget")));
    if (!app.targetInfo) { box.classList.remove("show"); return; }
    if (app.targetInfo.kind === "minionTarget") {
      box.appendChild(el("span", "targeting-title", "登场「" + (app.targetInfo.defName || "随从") + "」"));
      box.appendChild(el("span", "targeting-sub", "随从已登场，点击高亮目标选择强化"));
    } else if (app.targetInfo.kind === "card") {
      const card = viewer.hand.find((c) => c.uid === app.targetInfo.cardUid);
      const def = card ? D.CARDS[card.cardId] : null;
      if (!def) { box.classList.remove("show"); return; }
      const isBattlecry = def.keywords && def.keywords.indexOf("battlecry") >= 0;
      box.appendChild(el("span", "targeting-title", (isBattlecry ? "登场「" : "施放「") + def.name + "」"));
      box.appendChild(el("span", "targeting-sub", isBattlecry ? "点击发光的友方随从" : "点击高亮随从施放"));
    } else {
      box.appendChild(el("span", "targeting-title", "领袖技能"));
      box.appendChild(el("span", "targeting-sub", "点击高亮随从施放"));
    }
    const cancel = el("button", "targeting-cancel", "取消选择");
    cancel.onclick = () => cancelSelection();
    box.appendChild(cancel);
    box.classList.add("show");
  }

  function cancelSelection(silent) {
    if (app.targetInfo && app.targetInfo.kind === "minionTarget" && app.game && app.game.pendingMinionTarget) {
      E.cancelPendingMinionTarget(app.game);
    }
    app.targetInfo = null;
    app.zoneSelect = null;
    app.attacker = null;
    app.selectedCard = null;
    app.pendingDragZone = null;
    app.payBloodChoice = null;
    app.pendingBloodCard = null;
    app.mobileGoldCard = null;
    app.mobileClickArmed = null;
    hidePreview();
    hideSimpleCardPreview();
    clearCardDropHints();
    if (!silent) toast("已取消选择。");
    if (app.game) renderGame();
  }

  function renderTutorialCoach() {
    const coach = $("tutorial-coach");
    if (!coach) return;
    if (!app.tutorial || !app.game) { coach.hidden = true; return; }
    coach.hidden = false;
    coach.classList.toggle("collapsed", !!app.tutorialCoachCollapsed);
    const s = app.game;
    coach.classList.toggle("coach-bottom", s.current !== app.viewer);
    const title = $("tutorial-coach-title");
    const text = $("tutorial-coach-text");
    if (s.status === "gameover") {
      title.textContent = "演练结束";
      text.textContent = "这局结束了。点右上角「退出教程」回到档案处，或再开一局新手演练。";
      return;
    }
    if (s.current !== app.viewer) {
      title.textContent = "对手回合";
      text.textContent = "先观察对手怎么使用行动力和随从。轮到你时，再按提示操作。";
      return;
    }
    if (app.targetInfo) {
      title.textContent = "第 3/6 步 · 选择目标";
      text.textContent = "点击高亮随从完成施放；点同卡、右键、Esc 或提示条上的「取消选择」可以取消。指向牌先选目标，再结算。";
      return;
    }
    if (app.zoneSelect) {
      title.textContent = "第 2/6 步 · 选择阵位";
      text.textContent = "左翼 / 中枢 / 右翼最多各站 3 个随从，全场最多 6 个。把牌点进或拖进高亮阵位；同阵位会触发连携和守备保护。";
      return;
    }
    const own = s.players[app.viewer];
    const heroPower = E.getHeroPowerOptions(s, app.viewer);
    const playedThisTurn = own.cardsPlayedThisTurn || 0;
    const attackers = E.allMinions(own).filter(m => m.attacksLeft > 0 && m.frozenTurns === 0 && m.attack > 0);
    const canAttack = attackers.some(m => {
      const o = E.getAttackOptions(s, app.viewer, m.uid);
      return o.ok && o.targets.length > 0;
    });
    if (canAttack) {
      title.textContent = "第 4/6 步 · 攻击";
      text.textContent = "把攻击力大于 0 的我方随从拖到敌方随从或领袖上；也可以先点随从，再点目标。先遣随从本回合不能打脸；守备会保护同阵位。";
      return;
    }
    const playable = own.hand.filter(c => {
      const o = E.getPlayOptions(s, app.viewer, c.uid);
      return o.ok;
    });
    if (playable.length) {
      title.textContent = playedThisTurn ? "第 5/6 步 · 领袖技能" : "第 1/6 步 · 看手牌";
      text.textContent = playedThisTurn ? "点左下角领袖技能，确认行动力和目标；技能每回合只能用一次。也可以先继续出牌。" : "先看手牌的行动力、卡面效果和关键词标签：守备、先遣、预兆、连携、血偿都能点开说明。点击一张手牌，再点高亮阵位。";
      return;
    }
    if (heroPower.ok) {
      title.textContent = "第 5/6 步 · 领袖技能";
      text.textContent = "点左下角领袖技能，确认行动力和目标；技能每回合只能用一次。当前流脉：" + s.vein + "。";
      return;
    }
    title.textContent = "第 6/6 步 · 结束回合";
    text.textContent = "现在没有可打出的牌。点右下角「结束回合」把回合交给对手，观察流脉自然 +1。";
  }

  function startTutorial() {
    unlockAchievement("tutorial");
    app.tutorialCoachCollapsed = false;
    app.tutorial = true;
    app.tutorialStep = 1;
    startGame({ faction: "pus", opponent: "academy", tutorial: true, first: 0, seed: 424242 });
    showTurnBanner("新手演练");
    toast("新手演练：跟着左侧提示操作。");
  }

  function endTutorial() {
    markMainTask("tutorial");
    app.tutorial = false;
    app.tutorialCoachCollapsed = false;
    const coach = $("tutorial-coach");
    if (coach) coach.hidden = true;
    const onboarding = onboardingState();
    if (!onboarding.completed) { onboarding.step = ONBOARDING_STEPS.length; onboarding.completed = true; persistAccount(); }
    leaveGame();
    toast("恭喜你过关教程。现在开始你的第一把推演吧。");
  }

  function fillManaBox(box, player, label) {
    if (!box || !player) return;
    clear(box);
    box.classList.add("mana-row", "mana-hud", "mana-corner-display");
    box.title = label + "：本回合可用于出牌和领袖技能的资源";
    const main = el("span", "mana-main");
    const manaIcon = el("img", "mana-icon");
    manaIcon.alt = "";
    manaIcon.src = "assets/ui/mana-crystal.webp?v=" + ART_VERSION;
    main.appendChild(manaIcon);
    main.appendChild(el("span", "mana-label", "行动力"));
    box.appendChild(main);
    const pips = el("span", "mana-pips");
    const slots = Math.max(1, player.maxMana);
    for (let i = 0; i < slots; i++) {
      const filled = i < player.mana;
      const pip = el("span", "mana-pip" + (filled ? " filled" : ""));
      pip.style.setProperty("width", "12px", "important");
      pip.style.setProperty("height", "22px", "important");
      pip.style.setProperty("flex", "0 0 12px", "important");
      pip.style.setProperty("transform", "none", "important");
      pip.style.setProperty("clip-path", "polygon(50% 0, 100% 28%, 80% 100%, 20% 100%, 0 28%)", "important");
      pip.style.setProperty("border", "1px solid " + (filled ? "rgba(182,238,226,.95)" : "rgba(142,190,183,.5)"), "important");
      pip.style.setProperty("background", filled ? "linear-gradient(180deg,#b5f4e7,#55c9ba 55%,#1b8278)" : "rgba(3,14,16,.82)", "important");
      pip.style.setProperty("box-shadow", filled ? "0 0 9px rgba(95,211,196,.5)" : "none", "important");
      const crystal = el("img", "mana-crystal-art");
      crystal.alt = "";
      crystal.loading = "eager";
      crystal.src = "assets/ui/mana-crystal-pip.webp?v=" + ART_VERSION;
      crystal.style.setProperty("width", "100%", "important");
      crystal.style.setProperty("height", "100%", "important");
      pip.appendChild(crystal);
      pips.appendChild(pip);
    }
    box.appendChild(pips);
    box.appendChild(el("strong", "mana-total", player.mana + " / " + Math.max(player.maxMana, player.mana)));
    box.setAttribute("aria-label", label + " " + player.mana + " / " + player.maxMana);
  }

  function renderMana(player) {
    fillManaBox($("mana-display"), player, "行动力");
    if (app.game && app.game.players[1]) fillManaBox($("enemy-mana-display"), app.game.players[1], "对手行动力");
    const pm = $("mobile-mana-player"), em = $("mobile-mana-enemy");
    if (pm) pm.innerHTML = "◈ <b>" + player.mana + " / " + Math.max(player.maxMana, player.mana) + "</b>";
    if (em && app.game && app.game.players[1]) { const ep = app.game.players[1]; em.innerHTML = "◈ <b>" + ep.mana + " / " + Math.max(ep.maxMana, ep.mana) + "</b>"; }
  }

  function buildHeroMana(player, side) {
    const wrap = el("div", "hs-mana " + (side === "top" ? "hs-mana-opponent" : "hs-mana-player"));
    const head = el("div", "hs-mana-head");
    head.appendChild(el("span", "hs-mana-label", "行动力"));
    head.appendChild(el("strong", "hs-mana-value", player.mana + " / " + Math.max(player.maxMana, player.mana)));
    wrap.appendChild(head);
    const pips = el("div", "hs-mana-pips");
    for (let i = 0; i < 10; i++) {
      const pip = el("i", "hs-mana-pip");
      if (i < player.mana) pip.classList.add("filled");
      else if (i < player.maxMana) pip.classList.add("available");
      else pip.classList.add("locked");
      pips.appendChild(pip);
    }
    wrap.appendChild(pips);
    wrap.title = "行动力 " + player.mana + " / " + player.maxMana + "：本回合可用于出牌与领袖技能";
    wrap.setAttribute("aria-label", "行动力 " + player.mana + " / " + player.maxMana);
    return wrap;
  }

  let heroTooltipEl = null;
  function hideHeroTooltip() {
    if (heroTooltipEl && heroTooltipEl.parentNode) heroTooltipEl.parentNode.removeChild(heroTooltipEl);
    heroTooltipEl = null;
  }
  function showHeroTooltip(container, player) {
    hideHeroTooltip();
    const hero = player.hero;
    if (!hero) return;
    const tip = el("div", "hero-tooltip");
    const head = el("div", "hero-tooltip-head");
    head.appendChild(el("span", null, "LEADER / " + factionName(player.faction)));
    head.appendChild(el("strong", null, hero.name));
    tip.appendChild(head);
    const power = el("div", "hero-tooltip-row");
    const powerPassive = !!(hero.power.passive || hero.power.target === "passive");
    power.appendChild(el("span", "hero-tooltip-label", powerPassive ? "被动技能" : "领袖技能 · " + hero.power.cost + (player.heroPowerUsed ? " · 本回合已用" : "")));
    power.appendChild(el("strong", null, hero.power.name));
    power.appendChild(el("p", null, hero.power.text || ""));
    tip.appendChild(power);
    const equippedIds = Array.isArray(player.equipments) && player.equipments.length ? player.equipments : (player.relic ? [player.relic] : []);
    for (const eid of equippedIds) {
      const rd = D.CARDS[eid];
      if (!rd) continue;
      const row = el("div", "hero-tooltip-row relic");
      row.appendChild(el("span", "hero-tooltip-label", "已装备"));
      row.appendChild(el("strong", null, rd.name));
      row.appendChild(el("p", null, rd.text || ""));
      tip.appendChild(row);
    }
    if (player.formations && player.formations.length) {
      const row = el("div", "hero-tooltip-row");
      row.appendChild(el("span", "hero-tooltip-label", "阵型"));
      for (const f of player.formations) {
        const fd = D.CARDS[f.cardId];
        if (fd) row.appendChild(el("p", null, fd.name + " · " + E.ZONE_NAMES[f.zone] + " · " + (fd.text || "")));
      }
      tip.appendChild(row);
    }
    document.body.appendChild(tip);
    const r = container.getBoundingClientRect();
    const width = Math.min(340, Math.max(250, innerWidth * 0.3));
    tip.style.width = width + "px";
    const left = Math.max(12, Math.min(innerWidth - width - 12, r.left + r.width / 2 - width / 2));
    const above = r.top > innerHeight * 0.5;
    tip.style.left = left + "px";
    tip.style.top = (above ? r.top - tip.offsetHeight - 10 : r.bottom + 10) + "px";
    heroTooltipEl = tip;
  }

  function openHeroInfo(player) {
    if (!player || !player.hero) return;
    hideHeroTooltip();
    openModal((content) => {
      content.classList.add("hero-info-modal");
      content.appendChild(el("div", "eyebrow", "LEADER / " + factionName(player.faction)));
      content.appendChild(el("h3", null, player.name));
      content.appendChild(el("p", "muted", player.hero.name + " · 生命 " + player.hp + " · 护甲 " + player.armor + " · 行动力 " + player.mana + "/" + player.maxMana));

      const power = el("div", "hero-info-block");
      const powerPassive = !!(player.hero.power.passive || player.hero.power.target === "passive");
      power.appendChild(el("span", "hero-info-kicker", powerPassive ? "被动技能" : "领袖技能 · " + player.hero.power.cost + " 行动力"));
      power.appendChild(el("strong", null, player.hero.power.name));
      power.appendChild(el("p", null, player.hero.power.text || ""));
      content.appendChild(power);

      const equippedIds = Array.isArray(player.equipments) && player.equipments.length ? player.equipments : (player.relic ? [player.relic] : []);
      const equipBlock = el("div", "hero-info-block");
      equipBlock.appendChild(el("span", "hero-info-kicker", "已装备"));
      if (!equippedIds.length) equipBlock.appendChild(el("p", "muted", "暂无装备。"));
      for (const eid of equippedIds) {
        const rd = D.CARDS[eid];
        if (!rd) continue;
        const row = el("div", "hero-info-row");
        row.appendChild(el("strong", null, rd.name));
        row.appendChild(el("span", null, rd.text || ""));
        equipBlock.appendChild(row);
      }
      content.appendChild(equipBlock);

      const formations = (player.formations || []).filter((f) => f.turnsLeft == null || f.turnsLeft > 0);
      const formBlock = el("div", "hero-info-block");
      formBlock.appendChild(el("span", "hero-info-kicker", "阵位效果"));
      if (!formations.length) formBlock.appendChild(el("p", "muted", "暂无阵位效果。"));
      for (const f of formations) {
        const fd = D.CARDS[f.cardId];
        if (!fd) continue;
        const row = el("div", "hero-info-row");
        row.appendChild(el("strong", null, (E.ZONE_NAMES[f.zone] || f.zone) + " · " + fd.name));
        row.appendChild(el("span", null, fd.text || ""));
        formBlock.appendChild(row);
      }
      content.appendChild(formBlock);

      const debtCards = (player.hand || []).filter((c) => c.isDebt);
      if (debtCards.length) {
        const debtBlock = el("div", "hero-info-block");
        debtBlock.appendChild(el("span", "hero-info-kicker", "债务卡"));
        for (const dc of debtCards) {
          const dd = D.CARDS[dc.cardId];
          if (!dd) continue;
          const row = el("div", "hero-info-row");
          row.appendChild(el("strong", null, dd.name));
          row.appendChild(el("span", null, dd.text || ""));
          debtBlock.appendChild(row);
        }
        content.appendChild(debtBlock);
      }
      const debtTasks = Array.isArray(player.debtTasks) ? player.debtTasks : [];
      if (debtTasks.length) {
        const taskBlock = el("div", "hero-info-block");
        taskBlock.appendChild(el("span", "hero-info-kicker", "债务任务"));
        for (const task of debtTasks) {
          const td = D.CARDS[task.cardId];
          const taskName = task.type === "summon" ? "摆放 " + (task.amount || 1) + " 个随从"
            : task.type === "spell" ? "使用 " + (task.amount || 1) + " 张战术卡"
            : task.type === "attack" ? "发起 " + (task.amount || 1) + " 次攻击"
            : task.type === "playCards" ? "再打出 " + (task.amount || 1) + " 张牌"
            : task.type === "noCards" ? "不能再使用卡牌"
            : task.type === "noSummon" ? "不能再摆放随从"
            : task.type === "noAttack" ? "不能攻击"
            : task.type === "noSpell" ? "不能再使用战术卡" : "完成债务任务";
          const negative = ["noCards", "noSummon", "noAttack", "noSpell"].includes(task.type);
          const progress = negative ? "遵守中" : (task.progress || 0) + " / " + (task.amount || 1);
          const row = el("div", "hero-info-row");
          row.appendChild(el("strong", null, (td ? td.name : "债务卡") + " · " + taskName));
          row.appendChild(el("span", null, "进度：" + progress + "；未完成回合结束受到 " + (task.penalty && task.penalty.amount || 2) + " 点伤害。"));
          taskBlock.appendChild(row);
        }
        content.appendChild(taskBlock);
      }

      const actions = el("div", "modal-actions");
      const close = el("button", "btn btn-primary", "知道了");
      close.onclick = () => closeModal(true);
      actions.appendChild(close);
      content.appendChild(actions);
    });
  }

  function centerHeroDeckBadge(container) {
    if (!container || isPhoneLayout()) return;
    const badge = container.querySelector(".hs-hero-deck");
    const portrait = container.querySelector(".hs-hero-portrait");
    const side = container.querySelector(".hs-hero-side");
    if (!badge || !portrait || !side) return;
    const cr = container.getBoundingClientRect();
    const pr = portrait.getBoundingClientRect();
    const sr = side.getBoundingClientRect();
    const freeLeft = pr.right;
    const freeRight = sr.left;
    if (freeRight <= freeLeft) return;
    const gap = freeRight - freeLeft;
    const width = Math.max(72, gap - 22);
    const height = Math.max(48, container.clientHeight - 24);
    badge.style.setProperty("width", width + "px", "important");
    badge.style.setProperty("min-width", width + "px", "important");
    badge.style.setProperty("height", height + "px", "important");
    badge.style.setProperty("padding", "4px 10px", "important");
    const art = badge.querySelector(".hs-hero-deck-art");
    if (art) {
      const artH = Math.max(28, height - 16);
      const artW = Math.round(artH * 0.68);
      art.style.setProperty("height", artH + "px", "important");
      art.style.setProperty("width", artW + "px", "important");
      art.style.setProperty("flex-basis", artW + "px", "important");
    }
    const left = (freeLeft + freeRight) / 2 - width / 2 - cr.left;
    badge.style.left = Math.max(0, left) + "px";
    badge.style.right = "auto";
    badge.style.transform = "translateY(-50%)";
  }

  function renderHero(container, player, side) {
    if (!container) return;
    hideHeroTooltip();
    clear(container);
    container.dataset.faction = player.faction;
    container.classList.toggle("current-turn", app.game.current === player.index && app.game.status === "playing");

    const portrait = el("div", "hs-hero-portrait");
    portrait.style.backgroundImage = "url('" + heroImage(player.heroId) + "')";
    portrait.title = player.hero.name;
    container.appendChild(portrait);

    const body = el("div", "hs-hero-body");
    const identity = el("div", "hs-hero-identity");
    identity.appendChild(el("strong", "hs-hero-name", player.name));
    const heroBadges = el("span", "hs-hero-badges");
    const heroEquipped = Array.isArray(player.equipments) && player.equipments.length ? player.equipments : (player.relic ? [player.relic] : []);
    const heroFormationCount = (player.formations || []).filter((f) => f.turnsLeft == null || f.turnsLeft > 0).length;
    const heroDebtCount = (player.hand || []).filter((c) => c.isDebt).length;
    const heroDebtTasks = Array.isArray(player.debtTasks) ? player.debtTasks : [];
    const debtTaskText = (task) => {
      const n = task.amount || 1;
      if (task.type === "summon") return "摆放 " + n + " 个随从";
      if (task.type === "spell") return "使用 " + n + " 张战术卡";
      if (task.type === "attack") return "发起 " + n + " 次攻击";
      if (task.type === "playCards") return "再打出 " + n + " 张牌";
      if (task.type === "noCards") return "不能再使用卡牌";
      if (task.type === "noSummon") return "不能再摆放随从";
      if (task.type === "noAttack") return "不能攻击";
      if (task.type === "noSpell") return "不能再使用战术卡";
      return "完成债务任务";
    };
    if (heroEquipped.length) {
      const b = el("span", "hs-status-badge eq");
      const firstEq = D.CARDS[heroEquipped[0]];
      if (firstEq && cardArtUrl(firstEq)) {
        const img = el("img", "hs-status-badge-art");
        img.alt = "";
        img.src = cardArtUrl(firstEq);
        b.appendChild(img);
      } else {
        b.appendChild(el("span", null, "⚙"));
      }
      b.appendChild(el("small", null, String(heroEquipped.length)));
      b.title = "已装备 " + heroEquipped.map((id) => (D.CARDS[id] && D.CARDS[id].name) || id).join("、");
      heroBadges.appendChild(b);
    }
    if (heroFormationCount) {
      const b = el("span", "hs-status-badge fm");
      const activeFormation = (player.formations || []).find((f) => f.turnsLeft == null || f.turnsLeft > 0) || {};
      const fdef = D.CARDS[activeFormation.cardId];
      if (fdef && cardArtUrl(fdef)) {
        const img = el("img", "hs-status-badge-art");
        img.alt = "";
        img.src = cardArtUrl(fdef);
        b.appendChild(img);
      }
      b.appendChild(el("small", null, String(heroFormationCount)));
      b.title = "已部署 " + heroFormationCount + " 个阵型";
      heroBadges.appendChild(b);
    }
    if (heroDebtCount || heroDebtTasks.length) {
      const b = el("span", "hs-status-badge debt" + (heroDebtTasks.length ? " debt-task" : ""));
      const debtCard = (player.hand || []).find((c) => c.isDebt);
      const taskCard = heroDebtTasks.length ? D.CARDS[heroDebtTasks[0].cardId] : null;
      const ddef = debtCard ? D.CARDS[debtCard.cardId] : taskCard;
      if (ddef && cardArtUrl(ddef)) {
        const img = el("img", "hs-status-badge-art");
        img.alt = "";
        img.src = cardArtUrl(ddef);
        b.appendChild(img);
      }
      const total = heroDebtCount + heroDebtTasks.length;
      b.appendChild(el("small", null, String(total)));
      const taskLines = heroDebtTasks.map((t) => {
        const name = (D.CARDS[t.cardId] && D.CARDS[t.cardId].name) || "债务卡";
        const progress = (t.type === "noCards" || t.type === "noSummon" || t.type === "noAttack" || t.type === "noSpell")
          ? "（遵守中）" : "（" + (t.progress || 0) + "/" + (t.amount || 1) + "）";
        return name + "：" + debtTaskText(t) + progress;
      });
      b.title = (heroDebtCount ? "手里有 " + heroDebtCount + " 张债务卡。" : "") + (taskLines.length ? "债务任务：" + taskLines.join("；") : "");
      b.setAttribute("aria-label", b.title);
      heroBadges.appendChild(b);
    }
    if (isPhoneLayout() && side === "bottom") {
      const hint = el("span", "hs-hero-longpress-hint", "长按此条看信息");
      heroBadges.appendChild(hint);
    }
    body.appendChild(identity);

    const vitals = el("div", "hs-hero-vitals");
    const hp = el("span", "hs-vital hs-hp");
    const hpArt = el("img", "hs-vital-art hs-hp-art");
    hpArt.alt = "";
    hpArt.src = "assets/ui/stat-hp.webp?v=" + ART_VERSION;
    hp.appendChild(hpArt);
    hp.appendChild(el("b", null, String(Math.max(0, player.hp))));
    hp.appendChild(el("small", null, "生命"));
    vitals.appendChild(hp);
    const armor = el("span", "hs-vital hs-armor");
    const armorArt = el("img", "hs-vital-art hs-armor-art");
    armorArt.alt = "";
    armorArt.src = "assets/ui/stat-armor.webp?v=" + ART_VERSION;
    armor.appendChild(armorArt);
    armor.appendChild(el("b", null, String(player.armor)));
    armor.appendChild(el("small", null, "护甲"));
    vitals.appendChild(armor);
    vitals.appendChild(heroBadges);
    const meta = el("span", "hs-hero-counts");
    const handMeta = el("span", "hs-hero-count hs-hero-hand");
    const handIcon = el("img", "hs-hero-hand-icon");
    handIcon.alt = "";
    handIcon.src = cardBackUrl();
    handMeta.appendChild(handIcon);
    handMeta.appendChild(el("small", null, "手牌"));
    handMeta.appendChild(el("b", null, String(player.hand.length)));
    handMeta.title = "手牌 " + player.hand.length + " 张";
    meta.appendChild(handMeta);
    vitals.appendChild(meta);
    body.appendChild(vitals);

    if (side === "top") {
      const crystals = el("span", "hs-enemy-crystals");
      const icon = el("img", "hs-enemy-crystal-icon");
      icon.alt = "";
      icon.src = "assets/ui/mana-crystal.webp?v=" + ART_VERSION;
      crystals.appendChild(icon);
      const value = el("b", "hs-enemy-crystal-value", player.mana + " / " + Math.max(player.maxMana, player.mana));
      crystals.appendChild(value);
      crystals.title = "对手行动力 " + player.mana + " / " + Math.max(player.maxMana, player.mana);
      crystals.setAttribute("aria-label", "对手行动力 " + player.mana + " / " + player.maxMana);
      vitals.insertBefore(crystals, vitals.firstChild);
    } else {
      const crystals = el("span", "hs-player-crystals");
      const icon = el("img", "hs-player-crystal-icon");
      icon.alt = "";
      icon.src = "assets/ui/mana-crystal.webp?v=" + ART_VERSION;
      crystals.appendChild(icon);
      const value = el("b", "hs-player-crystal-value", player.mana + " / " + Math.max(player.maxMana, player.mana));
      crystals.appendChild(value);
      crystals.title = "行动力 " + player.mana + " / " + Math.max(player.maxMana, player.mana);
      crystals.setAttribute("aria-label", "行动力 " + player.mana + " / " + player.maxMana);
      vitals.insertBefore(crystals, vitals.firstChild);
    }

    const hpTrack = el("div", "hs-hero-hpbar");
    const hpFill = el("i");
    const hpPct = Math.max(0, Math.min(100, player.hp / Math.max(1, player.maxHp) * 100));
    hpFill.style.width = hpPct + "%";
    if (hpPct <= 25) hpFill.classList.add("low");
    else if (hpPct <= 55) hpFill.classList.add("mid");
    hpTrack.appendChild(hpFill);

    // 手机端把行动力槽整合进英雄栏，避免场外两个浮动条挡视野。
    const manaBar = el("div", "hs-hero-mana");
    manaBar.appendChild(el("span", "hs-hero-mana-label", "行动"));
    const manaPips = el("div", "hs-hero-mana-pips");
    for (let i = 0; i < 10; i++) {
      const pip = el("i", "hs-hero-mana-pip");
      if (i < player.mana) pip.classList.add("filled");
      else if (i < player.maxMana) pip.classList.add("available");
      manaPips.appendChild(pip);
    }
    manaBar.appendChild(manaPips);
    manaBar.appendChild(el("b", "hs-hero-mana-value", player.mana + "/" + Math.max(player.maxMana, player.mana)));
    const deckInline = el("span", "hs-hero-deck-inline", "牌库 " + (player.deck ? player.deck.length : 0));
    deckInline.title = "牌库剩余 " + (player.deck ? player.deck.length : 0) + " 张";
    deckInline.setAttribute("aria-label", deckInline.title);
    manaBar.appendChild(deckInline);
    manaBar.title = "行动力 " + player.mana + " / " + player.maxMana + " · 牌库 " + (player.deck ? player.deck.length : 0) + " 张";
    body.appendChild(manaBar);
    container.classList.toggle("low-hp", hpPct <= 25);
    const equippedIds = Array.isArray(player.equipments) && player.equipments.length ? player.equipments : (player.relic ? [player.relic] : []);
    container.classList.toggle("has-relic", equippedIds.length > 0);
    if (side === "bottom") document.body.classList.toggle("low-hp-warning", hpPct <= 25 && app.screen === "game");
    container.appendChild(body);
    if (!isPhoneLayout()) {
      equippedIds.forEach((eid, idx) => {
        const rd = D.CARDS[eid];
        if (!rd) return;
        const chip = el("div", "hs-relic-chip");
        chip.style.right = (76 + idx * 26) + "px";
        const chipArt = el("img", "hs-relic-chip-art");
        chipArt.alt = "";
        chipArt.src = cardArtUrl(rd) || factionIcon(rd.faction);
        chip.appendChild(chipArt);
        chip.appendChild(el("span", "hs-relic-chip-label", rd.name));
        chip.title = "已装备：" + rd.name + "\n" + (rd.text || "");
        chip.setAttribute("aria-label", "已装备 " + rd.name);
        container.appendChild(chip);
      });
    }

    const sideCol = el("div", "hs-hero-side");
    const skill = el("button", "hs-skill");
    const powerPassive = !!(player.hero.power.passive || player.hero.power.target === "passive");
    skill.type = "button";
    const codexMarta = player.heroId === "marta" && player.hero.power.id === "spell_codex";
    skill.title = (powerPassive ? "被动技能 · " : "领袖技能 · ") + player.hero.power.name + (powerPassive ? "" : " · " + player.hero.power.cost + " 行动力") + "\n" + (player.hero.power.text || "") + (codexMarta ? "\n被动：每回合第一张战术牌行动力消耗 -1。" : "");
    const icon = el("i", "hs-skill-icon");
    icon.style.backgroundImage = "url('" + heroSkillIcon(player.heroId) + "')";
    skill.appendChild(icon);
    const costBadge = el("b", "hs-skill-cost", powerPassive ? "被" : String(player.hero.power.cost));
    if (powerPassive) { costBadge.classList.add("passive"); costBadge.style.display = "none"; }
    skill.appendChild(costBadge);
    const ready = !powerPassive && app.game.status === "playing" && app.game.current === player.index && !player.heroPowerUsed && player.mana >= (player.hero.power.cost || 2) && (player.hero.power.id !== "spell_codex" || player.hand.some(c => D.CARDS[c.cardId] && D.CARDS[c.cardId].type === "spell"));
    const reason = powerPassive ? "被动" : player.heroPowerUsed ? "已用" : app.game.current !== player.index ? "等待" : player.mana < (player.hero.power.cost || 2) ? "行动力不足" : (player.hero.power.id === "spell_codex" && !player.hand.some(c => D.CARDS[c.cardId] && D.CARDS[c.cardId].type === "spell")) ? "无战术牌" : "可用";
    skill.appendChild(el("small", "hs-skill-state", reason));
    skill.classList.toggle("ready", ready);
    skill.classList.toggle("used", !!player.heroPowerUsed);
    skill.disabled = !ready || side !== "bottom";
    if (side === "bottom") skill.onclick = () => { const b = $("btn-hero-power"); if (b && !b.disabled) b.click(); };
    sideCol.appendChild(skill);

    if (side !== "bottom") {
      const hand = el("div", "hs-opp-hand");
      const backs = el("div", "hs-opp-hand-backs");
      const shown = Math.min(5, player.hand.length);
      for (let i = 0; i < shown; i++) {
        const back = el("i", "hs-opp-hand-back");
        back.style.backgroundImage = "url('" + cardBackUrl() + "')";
        backs.appendChild(back);
      }
      if (player.hand.length > shown) backs.appendChild(el("span", "hs-opp-hand-more", "+" + (player.hand.length - shown)));
      hand.appendChild(backs);
      hand.appendChild(el("span", "hs-opp-hand-label", "手牌 " + player.hand.length));
      sideCol.appendChild(hand);
    }
    container.appendChild(sideCol);
    const heroDeckBadge = el("span", "hs-hero-deck");
    heroDeckBadge.id = side === "bottom" ? "player-hero-deck" : "opponent-hero-deck";
    heroDeckBadge.innerHTML = "<img class=\"hs-hero-deck-art\" alt=\"\" src=\"" + cardBackUrl() + "\"><span class=\"hs-hero-deck-copy\"><span class=\"hs-hero-deck-label\">牌库</span><b>" + player.deck.length + "</b></span>";
    heroDeckBadge.title = "牌库剩余 " + player.deck.length + " 张";
    heroDeckBadge.setAttribute("aria-label", "牌库剩余 " + player.deck.length + " 张");
    container.appendChild(heroDeckBadge);
    if (!isPhoneLayout()) { centerHeroDeckBadge(container); requestAnimationFrame(() => centerHeroDeckBadge(container)); }

    if (side === "bottom" || side === "top") {
      const loadout = el("div", "hs-loadout-strip");
      const makeGroup = (label, kind, count, cards) => {
        const group = el("div", "hs-loadout-group");
        group.appendChild(el("span", "hs-loadout-label", label));
        const slots = el("div", "hs-loadout-slots");
        for (let i = 0; i < count; i++) {
          const def = cards[i];
          const slot = el("div", "hs-loadout-slot " + kind + (def ? " filled" : " empty"));
          if (def) {
            const art = el("img", "hs-loadout-art");
            art.alt = "";
            art.src = cardArtUrl(def) || factionIcon(def.faction);
            slot.appendChild(art);
            slot.title = label + "槽 " + (i + 1) + "：" + def.name + "\n" + (def.text || "");
            slot.setAttribute("aria-label", label + "：" + def.name);
          } else {
            slot.appendChild(el("b", null, kind === "equip" ? "※" : kind === "debt" ? "债" : "◇"));
            slot.title = label + "槽 " + (i + 1) + "：空";
            slot.setAttribute("aria-label", label + "空槽");
          }
          if (kind === "formation") slot.appendChild(el("small", "hs-loadout-slot-label", ["左翼", "中枢", "右翼"][i] || ""));
          slots.appendChild(slot);
        }
        group.appendChild(slots);
        return group;
      };
      const equipCards = equippedIds.map((eid) => D.CARDS[eid]).filter(Boolean);
      const zoneOrder = ["left", "center", "right"];
      const formationCards = zoneOrder.map((zone) => {
        const active = (player.formations || []).find((f) => f.zone === zone);
        return active ? D.CARDS[active.cardId] : null;
      });
      const debtEntry = (player.hand || []).find((c) => c.isDebt);
      const debtCards = debtEntry ? [D.CARDS[debtEntry.cardId]].filter(Boolean) : [];
      loadout.appendChild(makeGroup("装备", "equip", 2, equipCards));
      loadout.appendChild(makeGroup("阵位", "formation", 3, formationCards));
      if (debtCards.length) loadout.appendChild(makeGroup("债务卡", "debt", 1, debtCards));
      container.appendChild(loadout);

      const action = el("div", "hs-action-slot");
      action.appendChild(el("span", "hs-action-label", "行动力"));
      const crystals = el("div", "hs-action-crystals");
      for (let i = 0; i < 10; i++) {
        const pip = el("i", "hs-action-pip");
        if (i < player.mana) pip.classList.add("filled");
        else if (i < player.maxMana) pip.classList.add("available");
        crystals.appendChild(pip);
      }
      action.appendChild(crystals);
      action.appendChild(el("strong", "hs-action-value", player.mana + " / " + Math.max(player.maxMana, player.mana)));
      action.title = "行动力 " + player.mana + " / " + Math.max(player.maxMana, player.mana);
      action.setAttribute("aria-label", "行动力 " + player.mana + " / " + Math.max(player.maxMana, player.mana));
      container.appendChild(action);
    }

    const powerNote = el("div", "hs-hero-power-note");
    powerNote.appendChild(el("span", "hs-hero-power-kicker", powerPassive ? "被动技能" : "领袖技能"));
    powerNote.appendChild(el("strong", "hs-hero-power-name", player.hero.power.name));
    powerNote.appendChild(el("span", "hs-hero-power-text", player.hero.power.text || ""));
    container.appendChild(powerNote);

    container.title = player.name;
    container.setAttribute("aria-label", player.name + "，生命 " + player.hp + "，护甲 " + player.armor + "，行动力 " + player.mana + " / " + player.maxMana);

    if (side === "bottom") {
      const deckBadge = $("deck-left-value");
      if (deckBadge) deckBadge.textContent = String(player.deck.length);
      const deckDock = $("deck-dock-value");
      if (deckDock) deckDock.textContent = String(player.deck.length);
      const playerRailValue = $("player-deck-rail-value");
      if (playerRailValue) playerRailValue.textContent = String(player.deck.length);
      const playerRail = $("player-deck-rail");
      if (playerRail) {
        playerRail.classList.toggle("low", player.deck.length <= 8);
        if (app.lastDeckLength != null && player.deck.length < app.lastDeckLength) {
          playerRail.classList.remove("deck-draw");
          void playerRail.offsetWidth;
          playerRail.classList.add("deck-draw");
          setTimeout(() => playerRail.classList.remove("deck-draw"), 620);
        }
      }
      const deckBadgeBox = $("deck-corner");
      if (deckBadgeBox) {
        deckBadgeBox.classList.toggle("low", player.deck.length <= 8);
        if (app.lastDeckLength != null && player.deck.length < app.lastDeckLength) {
          deckBadgeBox.classList.remove("deck-draw");
          void deckBadgeBox.offsetWidth;
          deckBadgeBox.classList.add("deck-draw");
          setTimeout(() => deckBadgeBox.classList.remove("deck-draw"), 460);
        }
      }
      app.lastDeckLength = player.deck.length;
      const enemyDeck = $("enemy-deck-value");
      const enemyRailValue = $("enemy-deck-rail-value");
      if (enemyDeck && app.game && app.game.players[1]) {
        enemyDeck.textContent = String(app.game.players[1].deck.length);
        const enemyDeckBox = $("enemy-deck-corner");
        if (enemyDeckBox) enemyDeckBox.classList.toggle("low", app.game.players[1].deck.length <= 8);
      }
      if (enemyRailValue && app.game && app.game.players[1]) {
        enemyRailValue.textContent = String(app.game.players[1].deck.length);
        const enemyRail = $("enemy-deck-rail");
        if (enemyRail) enemyRail.classList.toggle("low", app.game.players[1].deck.length <= 8);
      }
    }

    container.onmouseenter = () => { if (!isPhoneLayout()) showHeroTooltip(container, player); };
    container.onmouseleave = hideHeroTooltip;
    let heroPress = null;
    let heroPressTimer = null;
    const clearHeroPress = () => {
      if (heroPressTimer) clearTimeout(heroPressTimer);
      heroPressTimer = null;
      heroPress = null;
    };
    container.addEventListener("pointerdown", (ev) => {
      if (!isPhoneLayout() || ev.button !== 0 || app.modalOpen) return;
      if (ev.target && ev.target.closest && ev.target.closest(".hs-skill,.hs-relic-chip")) return;
      if (app.selectedCard || app.targetInfo || app.zoneSelect || app.attacker || app.draggingUid) return;
      clearHeroPress();
      heroPress = { x: ev.clientX, y: ev.clientY, at: Date.now(), fired: false };
      heroPressTimer = setTimeout(() => {
        if (!heroPress || !isPhoneLayout() || app.modalOpen) return;
        if (app.selectedCard || app.targetInfo || app.zoneSelect || app.attacker || app.draggingUid) return;
        heroPress.fired = true;
        app.suppressClick = Date.now();
        if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
        openHeroInfo(player);
      }, 450);
    });
    container.addEventListener("pointermove", (ev) => {
      if (!heroPress) return;
      if (Math.abs(ev.clientX - heroPress.x) > 14 || Math.abs(ev.clientY - heroPress.y) > 14) clearHeroPress();
    });
    container.addEventListener("pointerup", () => { clearHeroPress(); });
    container.addEventListener("pointercancel", clearHeroPress);
    container.addEventListener("contextmenu", (ev) => { if (isPhoneLayout()) ev.preventDefault(); });

    if (side === "top") {
      const targets = targetList();
      const heroTargetable = targets.indexOf("hero") >= 0;
      container.classList.toggle("targetable", heroTargetable);
      if (heroTargetable) container.dataset.targetType = (app.targetInfo && app.targetInfo.targetType) || "attack";
      else delete container.dataset.targetType;
      container.onclick = () => {
        if (targetList().indexOf("hero") >= 0) onTargetClick("hero");
      };
      container.classList.toggle("drag-target", !!(app.draggingAttacker && canDropAttackOn("hero")));
      container.addEventListener("dragover", (ev) => {
        const attackOk = app.draggingAttacker && canDropAttackOn("hero");
        const cardDef = app.draggingUid ? handDef(app.draggingUid) : null;
        const cardOk = !!(cardDef && (cardDef.type === "spell" || cardDef.type === "equipment") &&
          E.getPlayOptions(app.game, app.game.current, app.draggingUid).ok);
        if (!attackOk && !cardOk) return;
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
        container.classList.add("drop-hover");
      });
      container.addEventListener("dragleave", () => container.classList.remove("drop-hover"));
      container.addEventListener("drop", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        container.classList.remove("drop-hover");
        if (app.draggingAttacker && canDropAttackOn("hero")) { performDragAttack("hero"); return; }
        const cardDef = app.draggingUid ? handDef(app.draggingUid) : null;
        if (cardDef && (cardDef.type === "spell" || cardDef.type === "equipment")) {
          playCardFromDrop(app.draggingUid);
          return;
        }
        finishCardDrag();
      });
    }
  }
  function retreatBoardMinion(uid) {
    if (!app.game || app.game.status !== "playing") return;
    if (app.net && app.net.role === "guest") {
      guestSendAction({ kind: "retreat", uid: uid });
      return;
    }
    const r = E.retreatMinion(app.game, app.viewer, uid);
    if (!r.ok) { toast(r.reason || "无法撤退。"); renderGame(); return; }
    AudioBox.play("select");
    renderGame();
  }

  function playerZones(player) {
    return D.CARDS && E.ZONES ? E.ZONES : ["left", "center", "right"];
  }

  function renderBoard(container, player, side, ownerIndex) {
    if (!container) return;
    clear(container);
    for (const z of playerZones()) {
      const zone = el("div", "zone");
      zone.dataset.zone = z;
      zone.dataset.zoneKey = z;
      zone.dataset.zoneName = E.ZONE_NAMES[z];
      zone.setAttribute("data-zone", E.ZONE_NAMES[z]);
      zone.appendChild(el("i", "zone-diamond"));
      const zonesOpen = app.zoneSelect && side === "bottom" && app.game.current === player.index;
      zone.classList.toggle("zone-open", !!zonesOpen);
      if (zonesOpen) zone.onclick = () => onZoneClick(z);
      if ((side === "bottom" && app.game.current === player.index) || side === "top") {
        zone.addEventListener("dragover", (ev) => {
          if (!canDropCardToZone(z, side)) return;
          ev.preventDefault();
          ev.dataTransfer.dropEffect = "move";
          zone.classList.add("drop-ready");
        });
        zone.addEventListener("dragleave", () => zone.classList.remove("drop-ready"));
        zone.addEventListener("drop", (ev) => {
          if (!canDropCardToZone(z, side)) return;
          ev.preventDefault();
          zone.classList.remove("drop-ready");
          onDropCardToZone(z);
        });
      }
      for (let i = 0; i < 3; i++) {
        const slot = el("div", "zone-slot");
        slot.dataset.slot = String(i);
        zone.appendChild(slot);
      }
      const minions = player.board[z] || [];
      const laneName = E.ZONE_NAMES[z];
      zone.classList.add("lane-" + z);
      zone.setAttribute("aria-label", laneName + "阵位，" + minions.length + " / 3 个随从");
      if (!minions.length) {
        const empty = el("div", "empty-slot");
        zone.appendChild(empty);
      } else {
        if (isPhoneLayout() && minions.length >= 2) zone.classList.add(minions.length >= 3 ? "zone-crowded" : "zone-two");
        for (const m of minions) {
          const card = createBoardCard(m, player, ownerIndex);
          zone.appendChild(card);
        }
      }
      container.appendChild(zone);
    }
  }

  function handDef(cardUid) {
    if (!app.game) return null;
    const hand = app.game.players[app.viewer].hand;
    const instance = hand.find((c) => c.uid === cardUid);
    return instance ? D.CARDS[instance.cardId] : null;
  }

  function makeDragImage(def, kind) {
    const ghost = el("div", "drag-ghost " + (kind || "card"));
    if (kind === "attack") {
      ghost.appendChild(el("div", "drag-sword", "⚔"));
      ghost.appendChild(el("span", null, def ? def.name : "攻击"));
    } else {
      if (def) { const url = cardArtUrl(def); if (url) ghost.style.backgroundImage = "url('" + url + "')"; }
      ghost.appendChild(el("span", null, def ? def.name : ""));
    }
    document.body.appendChild(ghost);
    return ghost;
  }

  function setCustomDragImage(ev, def, kind) {
    if (!ev.dataTransfer || !ev.dataTransfer.setDragImage) return;
    const ghost = makeDragImage(def, kind);
    const rect = ghost.getBoundingClientRect();
    try { ev.dataTransfer.setDragImage(ghost, Math.max(1, rect.width / 2), Math.max(1, rect.height / 2)); } catch (e) {}
    setTimeout(() => { if (ghost.parentNode) ghost.parentNode.removeChild(ghost); }, 80);
  }

  function clearBoardDragClasses() {
    document.querySelectorAll(".drag-target, .drop-hover, .spell-target, .attacker-drag").forEach((n) => {
      n.classList.remove("drag-target", "drop-hover", "spell-target", "attacker-drag");
    });
  }

  function highlightAttackTargets() {
    clearBoardDragClasses();
    for (const uid of app.dragAttackTargets || []) {
      if (uid === "hero") {
        const hero = $("opponent-hero");
        if (hero) hero.classList.add("drag-target");
      } else {
        const node = document.querySelector('[data-minion="' + uid + '"]');
        if (node) node.classList.add("drag-target");
      }
    }
    const src = document.querySelector('[data-minion="' + app.draggingAttacker + '"]');
    if (src) src.classList.add("attacker-drag");
  }

  function highlightSpellTargets(cardUid) {
    clearBoardDragClasses();
    const def = handDef(cardUid);
    if (!def || def.type !== "spell") return;
    const opt = E.getPlayOptions(app.game, app.game.current, cardUid);
    if (!opt || !opt.targetType) return;
    for (const uid of opt.targets || []) {
      const node = document.querySelector('[data-minion="' + uid + '"]');
      if (node) node.classList.add("spell-target");
    }
  }

  let dragTrailEl = null;
  let dragTrailSource = null;

  function beginDragTrail(sourceEl) {
    if (!sourceEl) return;
    const r = sourceEl.getBoundingClientRect();
    dragTrailSource = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    if (!dragTrailEl) {
      dragTrailEl = el("div", "drag-trail");
      document.body.appendChild(dragTrailEl);
    }
    dragTrailEl.className = "drag-trail";
    dragTrailEl.style.left = dragTrailSource.x + "px";
    dragTrailEl.style.top = dragTrailSource.y + "px";
    dragTrailEl.style.width = "4px";
    document.addEventListener("dragover", updateDragTrail, true);
    document.addEventListener("dragend", endDragTrail, true);
  }

  function dropValidationAt(target) {
    if (!target || !target.closest) return null;
    const minion = target.closest(".board-card[data-minion]");
    if (minion) {
      const uid = minion.dataset.minion;
      if (app.draggingAttacker) return canDropAttackOn(uid);
      if (app.draggingUid) return canDropSpellOn(uid);
      return null;
    }
    if (target.closest(".hero-panel")) {
      if (app.draggingAttacker) return canDropAttackOn("hero");
      if (app.draggingUid) return canDropSpellOn("hero");
      return null;
    }
    const zone = target.closest(".zone");
    if (zone && app.draggingUid) {
      const def = handDef(app.draggingUid);
      return def ? canDropCardToZone(zone.dataset.zoneKey, zone.closest("#player-board") ? "bottom" : "top") : null;
    }
    return null;
  }

  function updateDragTrail(ev) {
    if (!dragTrailEl || !dragTrailSource) return;
    const x = ev.clientX, y = ev.clientY;
    const dx = x - dragTrailSource.x, dy = y - dragTrailSource.y;
    const dist = Math.max(0, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    dragTrailEl.style.width = dist + "px";
    dragTrailEl.style.transform = "rotate(" + angle + "deg)";
    const valid = dropValidationAt(ev.target);
    dragTrailEl.classList.toggle("show", dist > 8);
    dragTrailEl.classList.toggle("valid", valid === true);
    dragTrailEl.classList.toggle("invalid", valid === false);
  }

  function endDragTrail() {
    if (dragTrailEl && dragTrailEl.parentNode) dragTrailEl.parentNode.removeChild(dragTrailEl);
    dragTrailEl = null;
    dragTrailSource = null;
    document.removeEventListener("dragover", updateDragTrail, true);
    document.removeEventListener("dragend", endDragTrail, true);
  }

  function finishCardDrag() {
    app.draggingUid = null;
    app.draggingAttacker = null;
    app.dragAttackTargets = [];
    app.suppressClick = Date.now();
    clearBoardDragClasses();
    endDragTrail();
  }

  function playCardFromDrop(uid) {
    const def = handDef(uid);
    const opt = def ? E.getPlayOptions(app.game, app.game.current, uid) : null;
    finishCardDrag();
    if (!def || !opt || !opt.ok) {
      if (opt && opt.reason) toast(opt.reason);
      return;
    }
    if (opt.targetType) beginCard(uid);
    else commitPlay(uid, null, null);
  }

  function performDragAttack(targetUid) {
    const attacker = app.draggingAttacker;
    if (!attacker || !app.game || app.game.current !== app.viewer) { finishCardDrag(); return; }
    const opts = E.getAttackOptions(app.game, app.game.current, attacker);
    if (!opts.ok || (opts.targets || []).indexOf(targetUid) < 0) { finishCardDrag(); return; }
    app.draggingAttacker = null;
    app.dragAttackTargets = [];
    clearBoardDragClasses();
    app.suppressClick = Date.now();
    if (app.net && app.net.role === "guest") {
      guestSendAction({ kind: "attack", attackerUid: attacker, targetUid: targetUid });
      return;
    }
    animateAttack(attacker, targetUid, app.game.current, () => checkGameOverAfterAction());
  }

  function canDropAttackOn(targetUid) {
    if (!app.draggingAttacker) return false;
    const opts = E.getAttackOptions(app.game, app.game.current, app.draggingAttacker);
    return opts.ok && (opts.targets || []).indexOf(targetUid) >= 0;
  }

  function canDropSpellOn(targetUid) {
    if (!app.draggingUid) return false;
    const def = handDef(app.draggingUid);
    if (!def || (def.type !== "spell" && def.type !== "equipment")) return false;
    const opt = E.getPlayOptions(app.game, app.game.current, app.draggingUid);
    if (!opt || !opt.ok) return false;
    return !opt.targetType || (opt.targets || []).indexOf(targetUid) >= 0;
  }

  function dropOnMinion(ev, targetUid) {
    if (!app.draggingAttacker && !app.draggingUid) return;
    ev.preventDefault();
    ev.stopPropagation();
    if (app.draggingAttacker && canDropAttackOn(targetUid)) {
      if (app.net && app.net.role === "guest") {
        const attacker = app.draggingAttacker;
        clearBoardDragClasses();
        app.draggingAttacker = null;
        app.dragAttackTargets = [];
        guestAnimateAttack(attacker, targetUid);
      } else {
        performDragAttack(targetUid);
      }
      return;
    }
    if (app.draggingUid) {
      const uid = app.draggingUid;
      const def = handDef(uid);
      const opt = def ? E.getPlayOptions(app.game, app.game.current, uid) : null;
      if (def && (def.type === "spell" || def.type === "equipment") && opt && opt.ok) {
        if (!opt.targetType) {
          finishCardDrag();
          commitPlay(uid, null, null);
          return;
        }
        if ((opt.targets || []).indexOf(targetUid) >= 0) {
          finishCardDrag();
          commitPlay(uid, targetUid, null);
          return;
        }
      }
    }
    finishCardDrag();
  }

  function skillBadge(def) {
    if (!def) return null;
    const kw = def.keywords || [];
    let key = null;
    let label = "";
    if (kw.indexOf("battlecry") >= 0) { key = "battlecry"; label = "登场"; }
    else if (kw.indexOf("deathrattle") >= 0) { key = "deathrattle"; label = "余响"; }
    else if (kw.indexOf("taunt") >= 0) { key = "taunt"; label = "守备"; }
    else if (kw.indexOf("charge") >= 0) { key = "charge"; label = "先遣"; }
    else if (def.passive) { key = "passive"; label = "被动"; }
    if (!key) return null;
    const badge = el("div", "skill-badge " + key);
    const icon = el("img", "skill-icon");
    icon.src = "/assets/icons/" + key + ".svg";
    icon.alt = "";
    badge.appendChild(icon);
    badge.appendChild(el("span", null, label));
    return badge;
  }

  function createBoardCard(m, player, ownerIndex) {
    const def = D.CARDS[m.cardId];
    const healthText = m.health < m.maxHealth ? m.health + "/" + m.maxHealth : String(m.health);
    const card = buildLibraryCard(def, {
      variant: "mini",
      faction: true,
      cost: def.cost,
      attack: m.attack,
      health: healthText,
      typeText: typeLine(def, m)
    });
    card.classList.add("board-card", "library-board", "type-minion");
    card.dataset.faction = def.faction;
    card.dataset.minion = m.uid;
    const pieceBase = el("div", "piece-base");
    card.insertBefore(pieceBase, card.firstChild);
    const atkEl = card.querySelector(".gok-lib-atk");
    const hpEl = card.querySelector(".gok-lib-hp");
    if (atkEl && m.attack > m.baseAttack) atkEl.classList.add("stat-buffed");
    if (hpEl && m.health < m.maxHealth) hpEl.classList.add("stat-damaged");
    if (hpEl && m.health > m.maxHealth) hpEl.classList.add("stat-buffed");
    if (m.taunt) card.classList.add("taunt");
    if (m.frozenTurns > 0) card.classList.add("frozen");
    if (m.stealth) card.classList.add("stealthed");
    if (m.silenced) card.classList.add("silenced");
    if (m.bounty != null) {
      const seal = el("div", "bounty-seal");
      seal.title = "悬赏名单：该随从已被标记为悬赏目标";
      seal.setAttribute("aria-label", "悬赏目标");
      seal.innerHTML =
        '<svg viewBox="0 0 40 40" aria-hidden="true">' +
          '<circle cx="20" cy="20" r="18" fill="rgba(5,13,14,.94)" stroke="rgba(242,198,109,.9)" stroke-width="1.4"/>' +
          '<circle cx="20" cy="20" r="14.6" fill="none" stroke="rgba(255,232,170,.28)" stroke-width=".7"/>' +
          '<polygon points="20,4.4 24.8,15.4 36.7,16.1 27.3,23.9 30.2,35.5 20,28.9 9.8,35.5 12.7,23.9 3.3,16.1 15.2,15.4" fill="url(#bountyGold)" stroke="#4a2c08" stroke-width="1"/>' +
          '<polygon points="20,9.2 23,16.3 30.5,16.8 24.8,21.6 26.5,28.8 20,24.8 13.5,28.8 15.2,21.6 9.5,16.8 17,16.3" fill="rgba(255,244,198,.38)"/>' +
          '<defs><linearGradient id="bountyGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b6"/><stop offset=".5" stop-color="#e8b85c"/><stop offset="1" stop-color="#9b651f"/></linearGradient></defs>' +
        '</svg><b>悬赏</b>';
      card.classList.add("has-bounty");
      card.appendChild(seal);
    }
    const nameplate = el("div", "board-name", def.name);
    nameplate.title = def.name;
    card.appendChild(nameplate);
    const keywordLabels = boardKeywordLabels(def, m);
    if (keywordLabels.length) {
      const keywordBar = el("div", "board-keyword-bar");
      for (const label of keywordLabels) keywordBar.appendChild(el("span", null, label));
      card.appendChild(keywordBar);
    }
    if (app.attacker === m.uid) card.classList.add("selected");
    if (targetList().indexOf(m.uid) >= 0) {
      card.classList.add("targetable");
      card.dataset.targetType = (app.targetInfo && app.targetInfo.targetType) || "attack";
    }
    if (app.targetInfo && (app.targetInfo.kind === "card" || app.targetInfo.kind === "minionTarget") && targetList().indexOf(m.uid) >= 0) {
      const tPlayer = app.game.players[app.viewer];
      const tInst = tPlayer && tPlayer.hand.find(c => c.uid === app.targetInfo.cardUid);
      const tDef = tInst ? D.CARDS[tInst.cardId] : null;
      if (tDef && tDef.keywords && tDef.keywords.indexOf("battlecry") >= 0) card.classList.add("battlecry-target");
    }
    card.title = def.name + " · " + m.attack + "/" + m.health;
    card.onmouseenter = () => showPreview(def, m);
    card.onmouseleave = hidePreview;
    card.onclick = (ev) => {
      ev.stopPropagation();
      if (app.suppressClick && Date.now() < app.suppressClick) return;
      if (targetList().indexOf(m.uid) >= 0) { onTargetClick(m.uid); return; }
      if (app.zoneSelect) return;
      if (ownerIndex === app.viewer && app.game.current === app.viewer && app.game.status === "playing") {
        const opts = E.getAttackOptions(app.game, app.game.current, m.uid);
        if (opts.ok && opts.targets.length) {
          if (app.attacker === m.uid) app.attacker = null;
          else app.attacker = m.uid;
          renderGame();
        } else {
          toast("该随从本回合无法攻击。");
        }
      }
    };
    const canAttackNow = ownerIndex === app.viewer && app.game.current === app.viewer && app.game.status === "playing" && m.attacksLeft > 0 && m.frozenTurns === 0 && m.attack > 0 && !app.busy;
    const ownTurn = ownerIndex === app.viewer && app.game.current === app.viewer && app.game.status === "playing";
    let attackStatus = null;
    let attackStatusClass = "";
    if (m.frozenTurns > 0) { attackStatus = "冻结"; attackStatusClass = "frozen-status"; }
    else if (ownTurn) {
      if (canAttackNow) { attackStatus = "可攻击"; attackStatusClass = "ready"; card.classList.add("attackable"); }
      else if (m.attacksLeft <= 0) { attackStatus = m.justPlayed ? "沉睡" : "已行动"; attackStatusClass = "spent"; card.classList.add("spent"); }
      else if (m.attack <= 0) { attackStatus = "无法攻击"; attackStatusClass = "spent"; card.classList.add("spent"); }
      else { attackStatus = "待命"; attackStatusClass = "waiting"; }
    } else if (ownerIndex === app.viewer) {
      attackStatus = m.attacksLeft > 0 ? "待命" : "已行动";
      attackStatusClass = "waiting";
    }
    if (attackStatus) card.appendChild(el("div", "attack-status " + attackStatusClass, attackStatus));
    if (m.frozenTurns > 0) {
      const ice = el("div", "ice-shards");
      for (let i = 0; i < 5; i++) ice.appendChild(el("i", null, ""));
      card.appendChild(ice);
    }
    if (canAttackNow) {
      card.draggable = true;
      card.classList.add("draggable-attacker");
      card.addEventListener("dragstart", (ev) => {
        if (!ev.dataTransfer) return;
        app.draggingAttacker = m.uid;
        app.suppressClick = Date.now();
        beginDragTrail(card);
        const opts = E.getAttackOptions(app.game, app.game.current, m.uid);
        app.dragAttackTargets = (opts.targets || []).slice();
        setCustomDragImage(ev, D.CARDS[m.cardId], "attack");
        highlightAttackTargets();
        ev.dataTransfer.effectAllowed = "move";
        try { ev.dataTransfer.setData("text/plain", "attack:" + m.uid); } catch (e) {}
      });
      card.addEventListener("dragend", () => finishCardDrag());
    }
    card.addEventListener("dragover", (ev) => {
      const attackOk = app.draggingAttacker && canDropAttackOn(m.uid);
      const spellOk = app.draggingUid && canDropSpellOn(m.uid);
      if (attackOk || spellOk) {
        ev.preventDefault();
        ev.stopPropagation();
        card.classList.add("drop-hover");
      }
    });
    card.addEventListener("dragleave", () => card.classList.remove("drop-hover"));
    card.addEventListener("drop", (ev) => {
      card.classList.remove("drop-hover");
      dropOnMinion(ev, m.uid);
    });
    attachMobilePreview(card, def, m);
    return card;
  }

  function typeLine(def, m) {
    return def.type === "spell" ? "战术" : (def.type === "equipment" || def.type === "relic") ? "装备" : def.type === "formation" ? "阵型" : def.type === "debt" ? "债务卡" : def.type === "leader" ? "领袖" : "随从";
  }

  function renderVein(s) {
    $("vein-value").textContent = String(s.vein);
    const sigil = document.querySelector("#vein-row .vein-sigil");
    if (sigil) {
      sigil.style.backgroundImage = "url('assets/ui/vein-core.webp?v=" + ART_VERSION + "')";
      sigil.textContent = "";
    }
    const track = $("vein-track");
    clear(track);
    const pct = (Math.max(0, Math.min(12, s.vein)) / 12) * 100;
    track.style.setProperty("--vein-pct", pct.toFixed(2) + "%");
    const thresholdInfo = { 4: "4 震荡", 7: "7 裂隙", 10: "10 魔物潮", 12: "12 回流" };
    const thresholdNames = { 4: "震荡", 7: "裂隙", 10: "魔物潮", 12: "回流" };
    const thresholdTone = { 4: "calm", 7: "hot", 10: "danger", 12: "return" };
    const nextThreshold = [4, 7, 10, 12].find((n) => n > s.vein);
    for (let i = 1; i <= 12; i++) {
      const pip = el("div", "vein-pip");
      pip.classList.add("seg" + (i <= 4 ? 1 : i <= 7 ? 2 : i <= 10 ? 3 : 4));
      if (i <= s.vein) {
        pip.classList.add("active");
        if (i >= 7) pip.classList.add("hot");
        if (i >= 10) pip.classList.add("danger");
      }
      if ([4, 7, 10, 12].indexOf(i) >= 0) {
        pip.classList.add("threshold");
        pip.dataset.threshold = String(i);
        pip.dataset.label = thresholdInfo[i];
        pip.dataset.tone = thresholdTone[i];
        if (i === nextThreshold) pip.classList.add("next");
        if (i <= s.vein) pip.classList.add("reached");
      }
      track.appendChild(pip);
    }
    const cursor = el("i", "vein-cursor");
    cursor.style.left = (Math.max(0, Math.min(12, s.vein)) / 12 * 100).toFixed(2) + "%";
    cursor.title = "当前流脉：" + s.vein + " / 12";
    track.appendChild(cursor);
    track.setAttribute("aria-label", "共享流脉 " + s.vein + " / 12，当前阈值进度 " + Math.round(pct) + "%");
    const nextEl = $("vein-next");
    if (nextEl) {
      if (nextThreshold) {
        nextEl.textContent = "距 " + nextThreshold + " " + thresholdNames[nextThreshold] + " 还差 " + (nextThreshold - s.vein) + " 点";
        nextEl.dataset.tone = thresholdTone[nextThreshold];
      } else {
        nextEl.textContent = "所有阈值已触发 · 再前进将回流";
        nextEl.dataset.tone = "return";
      }
    }
    const thresholds = s.stats.thresholds || { 4: 0, 7: 0, 10: 0 };
    const oldT = app.lastThresholds || { 4: 0, 7: 0, 10: 0 };
    let bannerText = "";
    let tone = "";
    if ((thresholds[10] || 0) > (oldT[10] || 0)) {
      bannerText = "魔物潮！所有随从 -3 生命，双方领袖 -5 生命";
      tone = "danger";
    } else if ((thresholds[7] || 0) > (oldT[7] || 0)) {
      bannerText = "流脉裂隙！双方领袖受到 2 点伤害";
      tone = "hot";
    } else if ((thresholds[4] || 0) > (oldT[4] || 0)) {
      bannerText = "流脉震荡！所有随从受到 1 点伤害";
      tone = "hot";
    } else if (s.vein > app.lastVein) {
      bannerText = "流脉提升：" + app.lastVein + " → " + s.vein;
      tone = s.vein >= 7 ? "hot" : "";
    } else if (app.lastVein >= 12 && s.vein < app.lastVein) {
      bannerText = "流脉回流：12 → 0";
      tone = "hot";
    } else if (s.vein < app.lastVein) {
      bannerText = "流脉疏导：" + app.lastVein + " → " + s.vein;
    }
    app.lastThresholds = { 4: thresholds[4] || 0, 7: thresholds[7] || 0, 10: thresholds[10] || 0 };
    if (bannerText) {
      // 流脉变化只保留轨道脉冲与顶部日志，不再弹中央文字框。
      const row = $("vein-row");
      if (row) {
        row.classList.remove("vein-threshold-hit", "tone-hot", "tone-danger");
        void row.offsetWidth;
        row.classList.add("vein-threshold-hit");
        if (tone) row.classList.add("tone-" + tone);
        setTimeout(() => { row.classList.remove("vein-threshold-hit", "tone-hot", "tone-danger"); }, 760);
      }
      AudioBox.play(tone === "danger" ? "wave" : "coin");
    }
    if (s.vein !== app.lastVein) {
      const row = $("vein-row");
      row.classList.remove("vein-pulse");
      void row.offsetWidth;
      row.classList.add("vein-pulse");
      if (app.lastVein != null) {
        const gain = s.vein > app.lastVein;
        track.classList.remove("vein-gain", "vein-loss");
        void track.offsetWidth;
        track.classList.add(gain ? "vein-gain" : "vein-loss");
        setTimeout(() => track.classList.remove("vein-gain", "vein-loss"), 420);
      }
      app.lastVein = s.vein;
    }
  }

  function renderOpponentEvents(s) {
    // 对手动作不再弹中央浮层；统一由顶部推演日志呈现，避免遮挡战场。
    app.logCursor = s.log.length;
  }

  function eventPoint(uid) {
    let node = null;
    if (uid && String(uid).indexOf("hero:") === 0) {
      const idx = Number(String(uid).slice(5));
      node = document.getElementById(idx === app.viewer ? "player-hero" : "opponent-hero");
    } else if (uid) {
      node = document.querySelector('.board-card[data-minion="' + uid + '"]');
    }
    if (!node) return { x: innerWidth / 2, y: innerHeight * 0.45, hero: false };
    const r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, hero: String(uid || "").indexOf("hero:") === 0, node };
  }

  function showHeroImpact(x, y) {
    const ring = el("div", "hero-impact");
    ring.style.left = x + "px";
    ring.style.top = y + "px";
    document.body.appendChild(ring);
    setTimeout(() => { if (ring.parentNode) ring.parentNode.removeChild(ring); }, 1500);
  }

  function zonePoint(playerIndex, zone) {
    const zones = ["left", "center", "right"];
    const board = document.getElementById(playerIndex === app.viewer ? "player-board" : "enemy-board");
    const node = board ? board.querySelectorAll(".zone")[zones.indexOf(zone)] : null;
    const r = node ? node.getBoundingClientRect() : null;
    return { x: r ? r.left + r.width / 2 : innerWidth / 2, y: r ? r.top + r.height / 2 : innerHeight / 2, node };
  }

  function showDeathPuff(ev) {
    const pt = zonePoint(ev.player, ev.zone);
    if (global.GokVFX) global.GokVFX.death(pt.x, pt.y);
    const puff = el("div", "death-puff");
    puff.style.left = pt.x + "px";
    puff.style.top = pt.y + "px";
    document.body.appendChild(puff);
    setTimeout(() => { if (puff.parentNode) puff.parentNode.removeChild(puff); }, 650);
  }

  // 目标随从死亡时，卡牌本体已经从 DOM 移除；保留一张短暂的“遗影”让击杀看得清。
  function showDeathGhost(source, rect) {
    if (!source || !rect) return;
    const ghost = source.cloneNode(true);
    ghost.classList.remove("selected", "targetable", "attackable", "drag-target", "hit");
    ghost.classList.add("vfx-death-ghost");
    ghost.removeAttribute("data-minion");
    ghost.setAttribute("aria-hidden", "true");
    Object.assign(ghost.style, {
      position: "fixed",
      left: rect.left + "px",
      top: rect.top + "px",
      width: rect.width + "px",
      height: rect.height + "px",
      margin: "0",
      pointerEvents: "none",
      zIndex: "195"
    });
    document.body.appendChild(ghost);
    setTimeout(() => { if (ghost.parentNode) ghost.parentNode.removeChild(ghost); }, 720);
  }

  function flashScreen(kind) {
    const cls = kind + "-flash";
    document.body.classList.remove(cls);
    void document.body.offsetWidth;
    document.body.classList.add(cls);
    setTimeout(() => document.body.classList.remove(cls), 650);
  }

  function pulseStatus(uid, tone) {
    if (!uid) return;
    const node = document.querySelector('.board-card[data-minion="' + uid + '"]');
    if (!node) return;
    const cls = "status-fx-" + tone;
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
    setTimeout(() => node.classList.remove(cls), 520);
  }

  function processStateEvents(s) {
    if (app.eventSeed !== s.seed) {
      app.eventSeed = s.seed;
      app.eventCursor = s.events.length;
      return;
    }
    if (app.eventCursor == null || app.eventCursor > s.events.length) app.eventCursor = 0;
    const fresh = s.events.slice(app.eventCursor);
    app.eventCursor = s.events.length;
    let eventSound = null;
    const soundPriority = { hero_hit: 90, death: 80, deathrattle: 70, damage: 60, freeze: 50, shield: 40, poison: 40, armor: 30, heal: 20, summon: 10, draw: 5 };
    const chooseSound = (name) => {
      if (!eventSound || (soundPriority[name] || 0) > (soundPriority[eventSound] || 0)) eventSound = name;
    };
    for (const ev of fresh) {
      if (!ev.structured) continue;
      if (ev.kind === "damage") {
        if (ev.label === "战斗") continue;
        chooseSound(String(ev.targetUid || "").indexOf("hero:") === 0 ? "hero_hit" : "damage");
        if (!app.damageNumbers) continue;
        const pt = eventPoint(ev.targetUid);
        showFloatingNumber("-" + (ev.amount || 0), pt.x, pt.y, pt.hero ? "damage hero-damage" : "damage");
        if (pt.node) { pt.node.classList.add("hit"); setTimeout(() => pt.node.classList.remove("hit"), 360); }
        if (pt.hero) { pt.node.classList.add("hero-hit"); setTimeout(() => pt.node.classList.remove("hero-hit"), 420); shakeScreen(); flashScreen("damage"); showHeroImpact(pt.x, pt.y); }
        else if ((ev.amount || 0) >= 4) flashScreen("damage");
      } else if (ev.kind === "armor") {
        chooseSound("armor");
        if (!app.damageNumbers) continue;
        const pt = eventPoint("hero:" + ev.player);
        showFloatingNumber("+" + (ev.amount || 0) + " 护甲", pt.x, pt.y, "heal");
        flashScreen("armor");
      } else if (ev.kind === "heal") {
        chooseSound("heal");
        if (!app.damageNumbers) continue;
        const pt = eventPoint(ev.targetUid);
        showFloatingNumber("+" + (ev.amount || 0), pt.x, pt.y, "heal");
        flashScreen("heal");
      } else if (ev.kind === "freeze") {
        document.body.classList.add("freeze-flash");
        setTimeout(() => document.body.classList.remove("freeze-flash"), 380);
        const pt = eventPoint(ev.targetUid);
        showKeywordPop("冻结", pt.x, pt.y, "freeze");
        pulseStatus(ev.targetUid, "freeze");
        chooseSound("freeze");
      } else if (ev.kind === "shield") {
        const pt = eventPoint(ev.targetUid);
        showKeywordPop("格挡", pt.x, pt.y, "shield");
        pulseStatus(ev.targetUid, "shield");
        chooseSound("shield");
      } else if (ev.kind === "poison") {
        const pt = eventPoint(ev.targetUid);
        showKeywordPop("蚀毒", pt.x, pt.y, "poison");
        pulseStatus(ev.targetUid, "poison");
        chooseSound("poison");
      } else if (ev.kind === "death") {
        showDeathPuff(ev);
        chooseSound("death");
      } else if (ev.kind === "deathrattle") {
        const pt = ev.zone ? zonePoint(ev.player, ev.zone) : eventPoint(ev.targetUid);
        showKeywordPop("余响", pt.x, pt.y - 24, "death");
        chooseSound("deathrattle");
      } else if (ev.kind === "draw") {
        chooseSound("draw");
        AudioBox.play("select");
      } else if (ev.kind === "summon") {
        const pt = zonePoint(ev.player, ev.zone);
        const summonOwner = app.game && app.game.players[ev.player];
        if (global.GokVFX) global.GokVFX.summon(pt.x, pt.y, { count: 7, landingDelay: 90, faction: summonOwner && summonOwner.faction });
        showKeywordPop("登场", pt.x, pt.y - 38, "summon");
        chooseSound("summon");
      }
    }
    if (eventSound) AudioBox.play(eventSound);
  }

  function showVeinBanner(text, tone) {
    const b = $("vein-banner");
    if (!b) return;
    b.className = "vein-banner" + (tone ? " " + tone : "");
    b.textContent = text;
    b.classList.remove("show");
    void b.offsetWidth;
    b.classList.add("show");
  }

  function isPhoneLayout() {
    return !!(window.matchMedia && window.matchMedia("(max-width: 820px), (orientation: landscape) and (max-width: 950px) and (max-height: 500px)").matches);
  }

  function fitHandToWidth() {
    const hand = $("hand");
    if (!hand) return;
    hand.style.setProperty("--hand-zoom", "1");
    const cards = Array.from(hand.querySelectorAll(".hand-card"));
    if (!cards.length) return;
    if (isPhoneLayout()) {
      // 手机端把手牌在一条横排内铺开：数量少时不重叠，多了自动收紧，避免用户左右翻找新牌。
      const available = Math.max(160, hand.clientWidth - 12);
      const cardW = cards[0].getBoundingClientRect().width || 92;
      const step = cards.length > 1 ? Math.max(34, Math.min(cardW + 5, (available - cardW) / (cards.length - 1))) : cardW;
      hand.style.setProperty("--hand-shift", (step - cardW).toFixed(2) + "px");
      hand.classList.toggle("compact-hand", cards.length > 5);
      requestAnimationFrame(() => { hand.scrollLeft = hand.scrollWidth; });
      return;
    }
    const available = hand.clientWidth;
    if (!available) return;
    const total = cards.reduce((sum, c) => sum + c.offsetWidth, 0) + (cards.length - 1) * 6;
    const scale = Math.max(0.52, Math.min(1, (available - 2) / Math.max(1, total)));
    hand.style.setProperty("--hand-zoom", scale.toFixed(3));
  }

  function renderHand(player, s) {
    const hand = $("hand");
    clear(hand);
    if (!player) return;
    const previous = Array.isArray(app.lastHandUids) ? app.lastHandUids : null;
    hand.classList.toggle("dense", player.hand.length >= 7);
    const display = player.hand.slice();
    if (app.handSort === "cost") display.sort((a, b) => E.getCardCost(s, player, a) - E.getCardCost(s, player, b) || String(a.uid).localeCompare(String(b.uid)));
    if (app.handSort === "type") {
      const order = { minion: 0, spell: 1, formation: 2, equipment: 3, relic: 4, debt: 5 };
      display.sort((a, b) => (order[D.CARDS[a.cardId]?.type] ?? 9) - (order[D.CARDS[b.cardId]?.type] ?? 9));
    }
    const total = display.length;
    let freshIndex = 0;
    for (let i = 0; i < total; i++) {
      const c = display[i];
      const def = D.CARDS[c.cardId];
      const cost = E.getCardCost(s, player, c);
      const card = createHandCard(def, c, player, cost, s);
      const offset = i - (total - 1) / 2;
      const fan = Math.max(-3, Math.min(3, offset * (total >= 6 ? 0.9 : 1.6)));
      card.style.setProperty("--fan", fan.toFixed(2) + "deg");
      const isNew = !!(previous && previous.indexOf(c.uid) < 0);
      if (isNew) {
        card.classList.add("draw-in");
        if (isPhoneLayout()) {
          const badge = el("span", "new-card-badge", "新");
          card.appendChild(badge);
          setTimeout(() => { if (badge.parentNode) badge.parentNode.removeChild(badge); }, 2400);
        }
      }
      hand.appendChild(card);
      if (isNew) {
        const delay = freshIndex * 150;
        freshIndex++;
        setTimeout(() => animateDrawToCard(card), delay);
      }
    }
    app.lastHandUids = display.map((c) => c.uid);
    requestAnimationFrame(() => { fitHandToWidth(); enforceBattleCardPresentation(); });
    if (!player.hand.length) {
      const empty = el("div", "hand-empty", "手牌已空");
      hand.appendChild(empty);
    }
  }

  function enforceBattleCardPresentation() {
    if (!app.game || app.screen !== "game") return;
    document.querySelectorAll(".board-card").forEach((card) => {
      const type = card.querySelector(".card-type-badge");
      if (type) type.style.setProperty("display", "none", "important");
      const art = card.querySelector(".card-art");
      if (art) art.style.setProperty("inset", "0 0 34px 0", "important");
      const name = card.querySelector(".card-name");
      if (name) {
        name.style.setProperty("bottom", "30px", "important");
        name.style.setProperty("font-size", "12px", "important");
      }
      const stats = card.querySelector(".card-stats");
      if (stats) {
        stats.style.setProperty("left", "4px", "important");
        stats.style.setProperty("right", "4px", "important");
        stats.style.setProperty("justify-content", "space-between", "important");
      }
      const tags = card.querySelector(".card-tags");
      if (tags) {
        tags.style.setProperty("top", "27px", "important");
        tags.style.setProperty("left", "3px", "important");
        tags.style.setProperty("right", "auto", "important");
        tags.style.setProperty("transform", "none", "important");
      }
    });
  }

  function appendKeywordText(node, text) {
    if (!text) return;
    const re = /(登场|余响|守备|先遣|冻结|隐匿|采掘|引脉|血祭|沉默|预兆|格挡|连携|蚀毒|血偿|先遣|回潮|封口|顺势|吞噬|阵位|对位|行动力|战术|阵型)/g;
    let last = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      const span = el("span", "kw", m[0]);
      if (["采掘", "引脉"].indexOf(m[0]) >= 0) span.classList.add("vein-kw");
      if (m[0] === "血祭") span.classList.add("danger-kw");
      applyKeywordColor(span, m[0]);
      node.appendChild(span);
      last = m.index + m[0].length;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
  }

  const RARITY_NAMES = { common: "普通", rare: "稀有", epic: "史诗", legendary: "传说", token: "衍生物" };
  const RARITY_COLORS = { common: "#aebac2", rare: "#78b6ef", epic: "#c08bff", legendary: "#f2c66d", token: "#7de8d5" };

  const KEYWORD_HELP = {
    "登场": "打出时触发一次。",
    "余响": "死亡时触发一次。",
    "守备": "保护同阵位其他友方随从；自身仍可被攻击。",
    "先遣": "登场当回合可攻击，但不能攻击敌方领袖。",
    "被动": "满足条件时自动生效。",
    "冻结": "目标失去下一次攻击。",
    "沉默": "移除强化和卡牌效果。",
    "隐匿": "敌方无法选中；攻击后解除。",
    "引脉": "共享流脉达到数字时触发；多个阈值只结算最高。",
    "预兆": "从牌库顶 3 张选 1 张。",
    "采掘": "抽 X 张牌，流脉 +X。",
    "血祭": "支付生命来触发。",
    "吞噬": "消灭一个友方随从，获得其攻击和生命。",
    "格挡": "下一次伤害 -2，然后移除。",
    "连携": "同阵位有友方随从时，本回合首次攻击 +1；不增加攻击次数。",
    "蚀毒": "伤害直接消灭随从。",
    "血偿": "溢出伤害转化为护甲。",
    "回潮": "第一次死亡后以 1 血回场一次。",
    "固定": "不随条件消失，之后进入该阵位的随从也获得。",
    "逆流": "消耗流脉触发；不足时消耗到 0 仍可触发，0 点无效。",
    "镇脉": "消耗流脉换等量护甲；不足时只获得剩余部分。",
    "压脉": "消耗流脉对敌方领袖造成等量伤害；不足时整张无效。",
    "悬赏": "将一个目标标记为悬赏名单；该标记本身不触发死亡效果。",
    "装备": "持续生效；最多可同时装备两件。"
  };
  const KEYWORD_ICONS = {
    "登场": "battlecry", "余响": "deathrattle", "守备": "taunt", "先遣": "charge",
    "被动": "passive", "冻结": "freeze", "沉默": "silence", "隐匿": "stealth",
    "引脉": "vein", "预兆": "discover", "采掘": "excavate", "血祭": "blood",
    "吞噬": "damage", "格挡": "armor", "连携": "charge", "蚀毒": "deathrattle",
    "血偿": "heal", "回潮": "passive", "固定": "passive", "逆流": "vein",
    "镇脉": "armor", "压脉": "damage", "悬赏": "damage", "装备": "passive"
  };
  const KEYWORD_COLORS = {
    "登场": "#f2c66d", "余响": "#c49bff", "守备": "#82b7ff", "先遣": "#ff9b5e",
    "被动": "#8fd9cd", "冻结": "#8de8ff", "沉默": "#b6c0cc", "隐匿": "#d1a1ff",
    "引脉": "#4fe0c0", "预兆": "#9cc7ff", "采掘": "#ffc86b", "血祭": "#ff7a7a",
    "吞噬": "#d88cff", "格挡": "#8fb5d9", "连携": "#ffd36d", "蚀毒": "#9be36f",
    "血偿": "#ff9db1", "回潮": "#74e7d8", "固定": "#a7bdd0", "逆流": "#65d4ff",
    "镇脉": "#7fe0cf", "压脉": "#ff8666", "悬赏": "#ffb36b", "装备": "#d8b96f",
    "阵位": "#e6c06a", "对位": "#e6c06a", "行动力": "#8ec5ff", "战术": "#c49bff", "阵型": "#7fd8c5"
  };
  function keywordColor(label) { return KEYWORD_COLORS[label] || "#f0c878"; }
  function applyKeywordColor(node, label) {
    if (!node) return;
    const color = keywordColor(label);
    node.dataset.keyword = label;
    node.style.setProperty("--kw", color);
    node.style.setProperty("--kw-bg", color + "24");
    node.style.setProperty("--kw-border", color + "99");
    if (node.classList.contains("keyword-tag") || node.classList.contains("preview-keyword")) {
      node.style.setProperty("color", color, "important");
      node.style.setProperty("border-color", color + "99", "important");
      node.style.setProperty("background", color + "1f", "important");
      const icon = node.querySelector(".keyword-tag-icon");
      if (icon) icon.style.filter = "none";
    }
  }
  let keywordTipTimer = null;

  const TUTORIAL_KEYWORD_ORDER = [
    "格挡", "守备", "先遣", "连携", "血偿", "蚀毒", "隐匿", "回潮", "冻结", "沉默",
    "登场", "余响", "引脉", "采掘", "血祭", "预兆", "吞噬",
    "逆流", "镇脉", "压脉", "悬赏", "固定", "装备", "被动"
  ];
  const CARD_TAG_ALLOWLIST = new Set(TUTORIAL_KEYWORD_ORDER);
  const TUTORIAL_KEYWORD_ALIASES = {};

  function renderTutorialKeywords() {
    const host = $("tutorial-keywords");
    if (!host) return;
    clear(host);
    for (const label of TUTORIAL_KEYWORD_ORDER) {
      const desc = KEYWORD_HELP[label];
      if (!desc) continue;
      const item = el("div", "keyword-glossary-item");
      const iconName = KEYWORD_ICONS[label];
      if (iconName) {
        const img = el("img", "keyword-glossary-icon");
        img.src = "/assets/icons/" + iconName + ".svg";
        img.alt = "";
        item.appendChild(img);
      }
      const body = el("div", "keyword-glossary-copy");
      const alias = TUTORIAL_KEYWORD_ALIASES[label];
      const glossaryName = el("strong", null, label + (alias ? "（" + alias + "）" : ""));
      applyKeywordColor(glossaryName, label);
      applyKeywordColor(item, label);
      body.appendChild(glossaryName);
      body.appendChild(el("span", null, desc));
      item.appendChild(body);
      host.appendChild(item);
    }
  }

  function tutorialSeen() {
    try { return JSON.parse(localStorage.getItem("gok_tutorial_seen") || "{}") || {}; } catch (e) { return {}; }
  }

  function markTutorialSeen(key) {
    if (!key) return;
    const seen = tutorialSeen();
    seen[key] = true;
    try { localStorage.setItem("gok_tutorial_seen", JSON.stringify(seen)); } catch (e) {}
    renderTutorialRoute();
  }

  function renderTutorialRoute() {
    const seen = tutorialSeen();
    document.querySelectorAll(".tutorial-route-step").forEach((b) => {
      const key = b.dataset.tutorialJump || "drill";
      b.classList.toggle("done", !!seen[key]);
    });
  }

  function positionKeywordTip(e) {
    const tip = $("keyword-tip");
    if (!tip) return;
    const pad = 10;
    const w = 240;
    const h = Math.max(86, tip.offsetHeight || 96);
    const card = e.target && e.target.closest ? e.target.closest(".hand-card, .board-card, .codex-card") : null;
    let x, y;
    if (card) {
      const r = card.getBoundingClientRect();
      x = r.left + r.width / 2 - w / 2;
      y = r.top - h - 10;
      if (y < pad) y = r.bottom + 10;
    } else {
      x = (e.clientX || 0) + 16;
      y = (e.clientY || 0) + 16;
      if (y + h > window.innerHeight - pad) y = (e.clientY || 0) - h - 12;
    }
    x = Math.max(pad, Math.min(window.innerWidth - w - pad, x));
    y = Math.max(pad, Math.min(window.innerHeight - h - pad, y));
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }

  function showKeywordTip(e, label, autoHide) {
    const text = KEYWORD_HELP[label];
    if (!text) return;
    keepPreviewOpen();
    const tip = $("keyword-tip");
    if (!tip) return;
    clearTimeout(keywordTipTimer);
    tip.innerHTML = "";
    tip.appendChild(el("strong", null, label));
    tip.appendChild(el("span", null, text));
    tip.hidden = false;
    positionKeywordTip(e);
    if (autoHide) keywordTipTimer = setTimeout(hideKeywordTip, 1800);
  }

  function hideKeywordTip() {
    clearTimeout(keywordTipTimer);
    const tip = $("keyword-tip");
    if (tip) tip.hidden = true;
  }

  const KEYWORD_ALIASES = {
    "战吼": "登场", "亡语": "余响", "嘲讽": "守备", "冲锋": "先遣",
    "潜行": "隐匿", "发现": "预兆", "圣盾": "格挡", "风怒": "连携",
    "剧毒": "蚀毒", "吸血": "血偿", "突袭": "先遣", "复生": "回潮",
  };
  function keywordLabelFromTarget(target) {
    if (!target || !target.closest) return null;
    const node = target.closest(".kw, .preview-keyword, .keyword-tag");
    if (!node) return null;
    const raw = (node.dataset.tag || node.textContent || "").trim().replace(/^[✦☠盾⚔]\s*/, "");
    const label = KEYWORD_ALIASES[raw] || raw;
    return KEYWORD_HELP[label] ? label : null;
  }

  function effectTags(def) {
    const tags = [];
    if (def.keywords) {
      if (def.keywords.indexOf("battlecry") >= 0) tags.push("✦ 登场");
      if (def.keywords.indexOf("deathrattle") >= 0) tags.push("☠ 余响");
      if (def.keywords.indexOf("taunt") >= 0) tags.push("盾 守备");
      if (def.keywords.indexOf("charge") >= 0) tags.push("⚔ 先遣");
      if (def.keywords.indexOf("divineShield") >= 0) tags.push("格挡");
      if (def.keywords.indexOf("windfury") >= 0) tags.push("连携");
      if (def.keywords.indexOf("poisonous") >= 0) tags.push("蚀毒");
      if (def.keywords.indexOf("lifesteal") >= 0) tags.push("血偿");
      if (def.keywords.indexOf("rush") >= 0) tags.push("先遣");
      if (def.keywords.indexOf("stealth") >= 0) tags.push("隐匿");
      if (def.keywords.indexOf("reborn") >= 0) tags.push("回潮");
    }
    if (def.excavate) tags.push("采掘");
    if (def.text && def.text.indexOf("采掘") >= 0 && tags.indexOf("采掘") < 0) tags.push("采掘");
    if ((def.reflux || (def.text && def.text.indexOf("逆流") >= 0)) && tags.indexOf("逆流") < 0) tags.push("逆流");
    if (def.bloodCost) tags.push("血祭");
    if (def.text && def.text.indexOf("引脉") >= 0) tags.push("引脉");
    if (def.text && def.text.indexOf("阵位") >= 0) tags.push("阵位");
    if (def.text && def.text.indexOf("顺势") >= 0 && tags.indexOf("顺势") < 0) tags.push("顺势");
    if (def.text && def.text.indexOf("吞噬") >= 0) tags.push("吞噬");
    if (def.text && def.text.indexOf("对位") >= 0) tags.push("对位");
    if (def.text && def.text.indexOf("借脉") >= 0) tags.push("借脉");
    if (def.text && def.text.indexOf("逆流") >= 0) tags.push("逆流");
    if (def.text && def.text.indexOf("镇脉") >= 0) tags.push("镇脉");
    if (def.text && def.text.indexOf("压脉") >= 0) tags.push("压脉");
    if (def.text && def.text.indexOf("沉默") >= 0 && tags.indexOf("沉默") < 0) tags.push("沉默");
    if (def.text && def.text.indexOf("格挡") >= 0 && tags.indexOf("格挡") < 0) tags.push("格挡");
    if (def.text && def.text.indexOf("蚀毒") >= 0 && tags.indexOf("蚀毒") < 0) tags.push("蚀毒");
    if (def.text && def.text.indexOf("先遣") >= 0 && tags.indexOf("先遣") < 0) tags.push("先遣");
    if (def.text && (def.text.indexOf("悬赏") >= 0 || def.text.indexOf("名单") >= 0) && tags.indexOf("悬赏") < 0) tags.push("悬赏");
    if (def.type === "equipment" || def.type === "relic") tags.push("装备");
    return tags;
  }

  function boardKeywordLabels(def, m) {
    const labels = [];
    const add = (v) => { if (v && labels.indexOf(v) < 0) labels.push(v); };
    const map = { battlecry: "登场", deathrattle: "余响", taunt: "守备", charge: "先遣", rush: "先遣", divineShield: "格挡", windfury: "连携", poisonous: "蚀毒", lifesteal: "血偿", reborn: "回潮", stealth: "隐匿" };
    for (const k of (def.keywords || [])) add(map[k]);
    if (def.passive) add("被动");
    if (def.bloodCost != null) add("血祭");
    if (m) {
      if (m.silenced) add("沉默");
      if (m.frozenTurns > 0) add("冻结");
      if (m.taunt) add("守备");
      if (m.divineShield) add("格挡");
      if (m.windfury) add("连携");
      if (m.poisonous) add("蚀毒");
      if (m.lifesteal) add("血偿");
      if (m.reborn) add("回潮");
      if (m.rush) add("先遣");
      if (m.charge) add("先遣");
      if (m.stealth) add("隐匿");
    }
    return labels.slice(0, 4);
  }

  function cardTags(def, m) {
    const tags = effectTags(def).map(t => t.replace(/^[✦☠盾⚔]\s*/, ""));
    if (def.passive) tags.push("被动");
    if (def.text && def.text.indexOf("被动：") >= 0) tags.push("被动");
    if (def.battlecry) {
      const bt = def.battlecry.type;
      if (bt === "copyFriendly") tags.push("复制");
      if (bt === "returnToHand") tags.push("回手");
      if (bt === "freezeAllEnemies") tags.push("冻结");
      if (bt === "veinBuff") tags.push("引脉");
      if (bt === "veinDraw") { tags.push("引脉"); tags.push("抽牌"); }
      if (bt === "damageAllEnemies") tags.push("伤害");
      if (bt === "destroy") tags.push("消灭");
      if (bt === "summonTokenBuff") tags.push("召唤");
      if (bt === "buffAllTaunt") tags.push("守备");
      if (bt === "spellDraw" || bt === "drawSpell" || bt === "drawHandCondition") tags.push("抽牌");
      if (bt === "silenceVeinBuff") { tags.push("沉默"); tags.push("引脉"); }
      if (bt === "buffTauntZone" || bt === "buffIfIronclad") tags.push("守备");
      if (bt === "healHero" || bt === "healVein") tags.push("恢复");
      if (bt === "healVein") tags.push("引脉");
      if (bt === "spellDiscover") tags.push("预兆");
      if (bt === "armor" || bt === "armorPerTaunt") tags.push("护甲");
      if (bt === "veinOnly") tags.push("引脉");
      if (bt === "rampMana") tags.push("行动力");
      if (bt === "discountSpell") tags.push("战术");
      if (bt === "devour") tags.push("吞噬");
      if (bt === "armorDamage") { tags.push("护甲"); tags.push("伤害"); }
      if (bt === "veinBuff") tags.push("引脉");
      if (bt === "silenceDraw") { tags.push("沉默"); tags.push("抽牌"); }
      if (bt === "summonSelfCopy") tags.push("复制");
      if (bt === "damageAllEnemiesDraw") { tags.push("伤害"); tags.push("抽牌"); }
    }
    if (def.spell && def.spell.type === "comboDamage") tags.push("顺势");
    if (def.deathrattle && def.deathrattle.type === "summon") tags.push("召唤");
    if (def.deathrattle && def.deathrattle.type === "damageAllEnemies") tags.push("伤害");
    if (m) {
      if (m.silenced) tags.push("沉默");
      if (m.frozenTurns > 0) tags.push("冻结");
      if (m.stealth) tags.push("隐匿");
      if (m.taunt) tags.push("守备");
      if (m.charge) tags.push("先遣");
    } else if (def.spell) {
      const st = def.spell.type;
      if (st === "silence") tags.push("沉默");
      if (["freeze", "freezeAll", "freezeDraw"].indexOf(st) >= 0) tags.push("冻结");
      if (st === "damage") tags.push("伤害");
      if (["heal", "buffHeal"].indexOf(st) >= 0) tags.push("恢复");
      if (["draw", "drawVein", "bloodDraw", "healDraw", "freezeDraw"].indexOf(st) >= 0) tags.push("抽牌");
      if (st === "discover") tags.push("预兆");
      if ([ "summon", "summonMonster" ].indexOf(st) >= 0) tags.push("召唤");
      if (["armor"].indexOf(st) >= 0) tags.push("护甲");
      if (["healDraw"].indexOf(st) >= 0) tags.push("恢复");
      if (["channelVein"].indexOf(st) >= 0) tags.push("引脉");
      if (["freezeDraw"].indexOf(st) >= 0) tags.push("冻结");
      if (["buffTaunt"].indexOf(st) >= 0) tags.push("守备");
      if (["buffCharge"].indexOf(st) >= 0) tags.push("先遣");
      if (st === "gainMana") tags.push("行动力");
      if (st === "damageAllEnemiesDraw") { tags.push("伤害"); tags.push("抽牌"); }
      if (st === "damageAll") tags.push("伤害");
      if (st === "returnAllEnemies") tags.push("回手");
      if (st === "summonTwoTokens") tags.push("召唤");
      if (st === "armorVeinDraw") { tags.push("护甲"); tags.push("引脉"); tags.push("抽牌"); }
      if (st === "damagePerSpell") tags.push("伤害");
      if (st === "damageAllPerSpell") tags.push("伤害");
      if (st === "healVein") { tags.push("恢复"); tags.push("引脉"); }
      if (st === "sacrificeSummon") { tags.push("血祭"); tags.push("召唤"); }
      if (st === "buffAllTaunt") tags.push("守备");
      if (st === "armorAoe") { tags.push("护甲"); tags.push("伤害"); }
      if (st === "rampSpell") tags.push("行动力");
      if (st === "bloodSummon") { tags.push("血祭"); tags.push("召唤"); }
    }
    return Array.from(new Set(tags)).filter(t => CARD_TAG_ALLOWLIST.has(t));
  }

  function addCardTags(card, def, m, cls) {
    const tags = cardTags(def, m);
    if (!tags.length) return;
    const box = el("div", "card-tags" + (cls ? " " + cls : ""));
    for (const tag of tags) {
      const span = el("span", "keyword-tag");
      span.dataset.tag = tag;
      applyKeywordColor(span, tag);
      const iconName = KEYWORD_ICONS[tag];
      if (iconName) {
        const img = el("img", "keyword-tag-icon");
        img.src = "/assets/icons/" + iconName + ".svg";
        img.alt = "";
        img.style.filter = "none";
        span.appendChild(img);
      }
      span.appendChild(el("b", null, tag));
      span.title = KEYWORD_HELP[tag] || tag;
      span.addEventListener("mouseenter", (e) => showKeywordTip(e, tag));
      span.addEventListener("mousemove", positionKeywordTip);
      span.addEventListener("mouseleave", hideKeywordTip);
      span.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") { e.stopPropagation(); showKeywordTip(e, tag, true); } });
      box.appendChild(span);
    }
    card.appendChild(box);
  }

  function addKeywordChips(box, def, m) {
    const tags = cardTags(def, m);
    if (!tags.length) return;
    const row = el("div", "preview-keywords");
    for (const tag of tags) {
      const chip = el("span", "preview-keyword");
      applyKeywordColor(chip, tag);
      const iconName = KEYWORD_ICONS[tag];
      if (iconName) {
        const img = el("img", "keyword-tag-icon");
        img.src = "/assets/icons/" + iconName + ".svg";
        img.alt = "";
        img.style.filter = "none";
        chip.appendChild(img);
      }
      chip.appendChild(el("b", null, tag));
      chip.title = KEYWORD_HELP[tag] || tag;
      chip.addEventListener("mouseenter", (e) => showKeywordTip(e, tag));
      chip.addEventListener("mousemove", positionKeywordTip);
      chip.addEventListener("mouseleave", hideKeywordTip);
      chip.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") { e.stopPropagation(); showKeywordTip(e, tag, true); } });
      row.appendChild(chip);
    }
    box.appendChild(row);
  }

  function openKeywordGlossary() {
    openModal((content) => {
      if (isPhoneLayout()) {
        const closeX = el("button", "keyword-glossary-close", "×");
        closeX.type = "button";
        closeX.setAttribute("aria-label", "关闭关键词说明");
        closeX.onclick = () => closeModal(true);
        content.appendChild(closeX);
      }
      content.appendChild(el("div", "eyebrow", "档案 / 关键词"));
      content.appendChild(el("h3", null, "关键词说明"));
      content.appendChild(el("p", null, "把鼠标移到卡牌上的效果标签，也会显示同样的说明。"));
      const grid = el("div", "keyword-glossary");
      for (const [label, desc] of Object.entries(KEYWORD_HELP)) {
        const item = el("div", "keyword-glossary-item");
        const iconName = KEYWORD_ICONS[label];
        if (iconName) {
          const img = el("img", "keyword-glossary-icon");
          img.src = "/assets/icons/" + iconName + ".svg";
          img.alt = "";
          item.appendChild(img);
        }
        const body = el("div", "keyword-glossary-copy");
        body.appendChild(el("strong", null, label));
        body.appendChild(el("span", null, desc));
        item.appendChild(body);
        grid.appendChild(item);
      }
      content.appendChild(grid);
      const actions = el("div", "modal-actions");
      const rulesBtn = el("button", "btn btn-ghost", "游戏规则");
      rulesBtn.onclick = () => { closeModal(true); openRulesScreen(app.screen === "game" ? "game" : "home"); };
      const close = el("button", "btn btn-primary", "返回对局");
      close.onclick = () => closeModal(true);
      actions.appendChild(rulesBtn);
      actions.appendChild(close);
      content.appendChild(actions);
    });
  }

  function renderRulesKeywords() {
    const host = $("rules-keywords");
    if (!host) return;
    clear(host);
    for (const [label, desc] of Object.entries(KEYWORD_HELP)) {
      const item = el("div", "keyword-glossary-item");
      const iconName = KEYWORD_ICONS[label];
      if (iconName) {
        const img = el("img", "keyword-glossary-icon");
        img.src = "/assets/icons/" + iconName + ".svg";
        img.alt = "";
        item.appendChild(img);
      }
      const body = el("div", "keyword-glossary-copy");
      body.appendChild(el("strong", null, label));
      body.appendChild(el("span", null, desc));
      item.appendChild(body);
      host.appendChild(item);
    }
  }

  function openRulesScreen(returnScreen) {
    app.rulesReturn = returnScreen || (app.screen === "game" ? "game" : "home");
    AudioBox.play("ui_open");
    showScreen("rules");
    const rulesTutorial = $("btn-rules-tutorial");
    if (rulesTutorial) rulesTutorial.hidden = app.rulesReturn === "game" && !!app.game;
  }

  function closeRulesScreen() {
    const back = app.rulesReturn === "game" && app.game ? "game" : (app.rulesReturn || "home");
    AudioBox.play("ui_open");
    showScreen(back);
    if (back === "game") renderGame();
  }

  function debtRepayText(def) {
    const r = def.debt && def.debt.repay || { type: "mana", amount: 0 };
    return r.type === "hp" ? ("支付 " + (r.amount || 0) + " 生命") : ("支付 " + (r.amount || 0) + " 行动力");
  }

  function openDebtRepayModal(instance) {
    const s = app.game;
    const viewer = s && s.players[app.viewer];
    const def = D.CARDS[instance.cardId];
    if (!s || !viewer || !def || !def.debt) return;
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "债务"));
      content.appendChild(el("h3", null, def.name));
      content.appendChild(el("p", null, def.text || ""));
      content.appendChild(el("p", "muted", "偿还：" + debtRepayText(def)));
      const actions = el("div", "modal-actions");
      const repay = el("button", "btn btn-primary", "偿还债务");
      repay.onclick = () => {
        const r = E.repayDebt(s, app.viewer, instance.uid);
        if (!r.ok) { toast(r.reason || "无法偿还。"); return; }
        closeModal(true);
        renderGame();
      };
      const cancel = el("button", "btn btn-ghost", "先不还");
      cancel.onclick = () => closeModal(true);
      actions.appendChild(repay);
      actions.appendChild(cancel);
      content.appendChild(actions);
    });
  }

  function openDebtSideModal(instance, def) {
    const s = app.game;
    if (!s) return;
    const opt = E.getPlayOptions(s, app.viewer, instance.uid);
    if (!opt.ok) { toast(opt.reason || "现在不能打出债务。"); return; }
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "债务 / 选择方向"));
      content.appendChild(el("h3", null, def.name));
      content.appendChild(el("p", null, def.text || ""));
      content.appendChild(el("p", "muted", "每名玩家最多持有 1 张债务。"));
      const actions = el("div", "modal-actions");
      if (opt.enemyDebt) {
        const enemy = el("button", "btn btn-primary", "给对手（手牌压力）");
        enemy.onclick = () => { closeModal(true); commitPlay(instance.uid, null, null, null, { debtSide: "enemy" }); };
        actions.appendChild(enemy);
      }
      if (opt.selfDebt) {
        const self = el("button", "btn btn-ghost", "给自己（任务奖励）");
        self.onclick = () => { closeModal(true); commitPlay(instance.uid, null, null, null, { debtSide: "self" }); };
        actions.appendChild(self);
      }
      const cancel = el("button", "btn btn-small btn-ghost", "取消");
      cancel.onclick = () => closeModal(true);
      actions.appendChild(cancel);
      content.appendChild(actions);
    });
  }

  function createHandCard(def, instance, player, cost, s) {
    const card = buildLibraryCard(def, { variant: "hand", faction: true, cost: cost });
    card.classList.add("hand-card", "type-" + def.type);
    if (instance.isDebt) {
      card.classList.add("debt-card");
      card.appendChild(el("div", "debt-status", "债务卡 · 打出后开始任务"));
    }
    card.dataset.faction = def.faction;
    card.dataset.cardId = def.id;
    card.dataset.type = def.type;
    const back = el("div", "card-back-edge");
    back.style.backgroundImage = "url('" + cardBackUrl() + "')";
    card.insertBefore(back, card.firstChild);
    const backSeal = el("div", "card-back-seal");
    backSeal.style.backgroundImage = "url('" + cardBackUrl() + "')";
    backSeal.title = "卡背：" + (app.account && app.account.cardBack ? cardBackDefinition(app.account.cardBack).name : "档案原版");
    card.appendChild(backSeal);
    if (app.selectedCard === instance.uid) card.classList.add("selected");
    if (app.mobileGoldCard === instance.uid) card.classList.add("mobile-gold");
    const powerTarget = !!(app.targetInfo && app.targetInfo.kind === "heroPower" && targetList().indexOf(instance.uid) >= 0);
    if (powerTarget) card.classList.add("targetable");
    const playable = s.status === "playing" && !s.mulliganPhase && s.current === player.index && player.mana >= cost && !app.busy;
    if (!playable) card.classList.add("disabled");
    attachMobilePreview(card, def, null, instance);
    card.onmouseenter = () => showPreview(def, null);
    card.onmouseleave = hidePreview;
    if (playable) {
      card.draggable = !isPhoneLayout() && def.type !== "debt" && !instance.isDebt;
      card.title = instance.isDebt ? "打出债务卡：本回合开始债务任务，完成免罚" : def.type === "debt" ? "打出后洗入对手牌库" : def.type === "spell" ? "点击选择目标施放，或直接拖到目标" : def.type === "equipment" ? "点击打出装备" : "点击出牌，或拖到阵位";
      card.addEventListener("dragstart", (ev) => {
        if (!ev.dataTransfer) return;
        app.draggingUid = instance.uid;
        app.suppressClick = Date.now();
        beginDragTrail(card);
        card.classList.add("dragging", "card-dragging");
        setCustomDragImage(ev, def, "card");
        hidePreview();
        if (def.type === "spell") highlightSpellTargets(instance.uid);
        ev.dataTransfer.effectAllowed = "move";
        try { ev.dataTransfer.setData("text/plain", instance.uid); } catch (e) {}
      });
      card.addEventListener("dragend", () => {
        card.classList.remove("dragging", "card-dragging");
        finishCardDrag();
        clearDropHints();
      });
    }
    card.onclick = (ev) => {
      ev.stopPropagation();
      if (app.suppressClick && Date.now() - app.suppressClick < 300) return;
      if (instance.isDebt) {
        if (!playable) { toast(s.current !== player.index ? "还没轮到你。" : player.mana < cost ? "行动力不足。" : "现在不能打出这张债务卡。"); return; }
        commitPlay(instance.uid, null, null);
        return;
      }
      if (def.type === "debt") {
        if (!playable) { toast(s.current !== player.index ? "还没轮到你。" : player.mana < cost ? "行动力不足。" : "现在不能打出这张债务卡。"); return; }
        commitPlay(instance.uid, null, null);
        return;
      }
      if (powerTarget) { onTargetClick(instance.uid); return; }
      if (isPhoneLayout() && app.mobilePreviewUid === instance.uid) {
        app.mobileClickArmed = null;
        app.mobileGoldCard = null;
        hideSimpleCardPreview();
        clearCardDropHints();
        return;
      }
      if ((app.targetInfo && app.targetInfo.kind === "card" && app.targetInfo.cardUid === instance.uid) || (app.zoneSelect && app.zoneSelect.cardUid === instance.uid)) {
        cancelSelection();
        return;
      }
      if (!playable) {
        if (isPhoneLayout()) {
          const why = s.current !== player.index ? "还没轮到你" : player.mana < cost ? "行动力不足" : "现在不能打出";
          if (app.mobilePreviewUid === instance.uid) {
            hideSimpleCardPreview();
            return;
          }
          app.mobileClickArmed = null;
          app.mobileGoldCard = null;
          app.mobilePreviewUid = instance.uid;
          markMobilePreview(card);
          showSimpleCardPreview(def, why);
          return;
        }
        if (s.current !== player.index) toast("还没轮到你。");
        else if (player.mana < cost) toast("行动力不足。");
        else toast("现在不能打出这张牌。");
        return;
      }
      if (isPhoneLayout()) {
        const wasArmed = app.mobileClickArmed === instance.uid;
        app.mobileClickArmed = null;
        app.mobileGoldCard = null;
        document.querySelectorAll(".hand-card.mobile-gold").forEach((x) => x.classList.remove("mobile-gold"));
        hideSimpleCardPreview();
        clearCardDropHints();
        if (wasArmed) return;
        app.mobileClickArmed = instance.uid;
        app.mobilePreviewUid = instance.uid;
        markMobilePreview(card);
        const tip = def.type === "minion" || def.type === "formation"
          ? "预览中：再点此卡收起；点击阵位摆放"
          : "预览中：点手牌区外任意位置释放；再点此卡收起";
        showSimpleCardPreview(def, tip);
        return;
      }
      const now = Date.now();
      if (app.handPlayMode === "double") {
        if (app.lastHandClick && app.lastHandClick.uid === instance.uid && now - app.lastHandClick.at < 520) {
          app.lastHandClick = null;
          hidePreviewNow();
          beginCard(instance.uid);
          return;
        }
        app.lastHandClick = { uid: instance.uid, at: now };
        app.selectedCard = instance.uid;
        app.targetInfo = null;
        app.zoneSelect = null;
        app.attacker = null;
        hidePreviewNow();
        renderGame();
        toast("再次点击确认出牌，或直接拖动。");
        return;
      }
      // drag 模式：单击只选中，不会误放；拖到阵位/目标才出牌
      app.lastHandClick = null;
      app.selectedCard = instance.uid;
      app.targetInfo = null;
      app.zoneSelect = null;
      app.attacker = null;
      hidePreviewNow();
      renderGame();
      toast(app.handPlayMode === "double" ? "再次点击确认出牌，或直接拖动。" : "拖动到阵位或目标出牌；可在设置切换拖拽/双击。");
    };
    return card;
  }

  function canDropCardToZone(zone, side) {
    if (!app.game || !app.draggingUid) return false;
    if (app.game.status !== "playing" || app.game.current !== app.viewer) return false;
    const p = app.game.players[app.viewer];
    const c = p.hand.find((x) => x.uid === app.draggingUid);
    if (!c) return false;
    const def = D.CARDS[c.cardId];
    if (!zone || E.ZONES.indexOf(zone) < 0) return false;
    if (side === "top") return def.type === "spell" || def.type === "equipment";
    if (def.type === "minion") return p.board[zone].length < 3 && p.mana >= E.getCardCost(app.game, p, c);
    if (def.type === "formation") return (p.formations || []).length < 2 && p.mana >= E.getCardCost(app.game, p, c);
    return true;
  }

  function clearDropHints() {
    document.querySelectorAll(".zone.drop-ready").forEach((z) => z.classList.remove("drop-ready"));
  }

  function onDropCardToZone(zone) {
    const cardUid = app.draggingUid;
    app.draggingUid = null;
    app.suppressClick = Date.now();
    clearDropHints();
    if (!cardUid || !app.game || app.game.current !== app.viewer) return;
    const s = app.game;
    const p = s.players[s.current];
    const c = p.hand.find((x) => x.uid === cardUid);
    if (!c) return;
    const def = D.CARDS[c.cardId];
    const opt = E.getPlayOptions(s, s.current, cardUid);
    if (!opt.ok) { toast(opt.reason || "现在不能打出这张牌。"); return; }
    if (def.type === "minion" || def.type === "formation") {
      if (opt.targetType && opt.targets.length) {
        app.pendingDragZone = zone;
        app.selectedCard = cardUid;
        app.targetInfo = { kind: "card", cardUid: cardUid, targetType: opt.targetType, targets: opt.targets };
        renderGame();
        return;
      }
      commitPlay(cardUid, null, zone);
    } else {
      app.pendingDragZone = null;
      if (opt.targetType && opt.targets.length) beginCard(cardUid);
      else if (opt.targetType) toast("没有可选的合法目标，无法施放这张战术牌。");
      else commitPlay(cardUid, null, null);
    }
  }

  function renderControls(viewer, s) {
    const power = $("btn-hero-power");
    const o = E.getHeroPowerOptions(s, app.viewer);
    const powerPassive = !!o.passive;
    const codexMarta = viewer.heroId === "marta" && viewer.hero.power.id === "spell_codex";
    const icon = viewer.heroId === "lain" ? "协" : viewer.heroId === "karna" ? "血" : viewer.heroId === "marta" ? "演" : viewer.heroId === "wolfram" ? "律" : viewer.heroId === "monarch" ? "悬" : "炮";
    const current = s.current === app.viewer;
    const disabled = powerPassive || !current || s.status !== "playing" || s.mulliganPhase || !o.ok || app.busy || app.modalOpen;
    const actionText = powerPassive ? "被动技能，自动生效" : !current ? "等待你的回合" : o.used ? "本回合已用" : (o.targetType === "hand" ? "点击选择一张手牌" : o.targetType === "enemy" ? "点击选择敌方目标" : o.targetType === "none" ? "点击发动" : "点击选择友方目标");
    const stateText = powerPassive ? "被动" : o.used ? "已用" : !current ? "对方回合" : !o.ok ? "不可用" : "可用";
    power.innerHTML = "<span class=\"hp-btn-icon\">" + icon + "<img class=\"hp-skill-icon\" src=\"/" + heroSkillIcon(viewer.heroId) + "\" alt=\"\"></span><span class=\"hp-btn-copy\"><strong>" + (powerPassive ? "被动技能 · " : "领袖技能 · ") + viewer.hero.power.name + "</strong><small>" + (powerPassive ? "每回合自动生效" : (viewer.hero.power.cost || 2) + " 行动力 · " + actionText) + "</small></span><span class=\"hp-btn-state\">" + stateText + "</span>";
    const iconEl = power.querySelector(".hp-btn-icon");
    if (iconEl) iconEl.style.backgroundImage = "linear-gradient(180deg, rgba(5,10,15,0.08), rgba(5,10,15,0.48)), url('" + heroImage(viewer.heroId) + "')";
    power.disabled = disabled;
    power.tabIndex = -1;
    power.setAttribute("aria-hidden", "true");
    power.classList.toggle("ready", !disabled);
    power.classList.toggle("used", !!o.used);
    power.classList.toggle("passive", powerPassive);
    power.title = viewer.hero.power.text + (codexMarta ? "\n被动：每回合第一张战术牌行动力消耗 -1。" : "");
    power.onclick = () => {
      if (power.disabled) return;
      if (!o.targets.length) {
        app.targetInfo = { kind: "heroPower", targets: [], player: app.viewer };
        app.selectedCard = null;
        app.zoneSelect = null;
        app.attacker = null;
        onTargetClick(null);
        return;
      }
      app.targetInfo = { kind: "heroPower", targets: o.targets, player: app.viewer };
      app.selectedCard = null;
      app.zoneSelect = null;
      app.attacker = null;
      renderGame();
    };
    const heroSkill = document.querySelector("#player-hero .hs-skill");
    if (heroSkill) {
      heroSkill.disabled = disabled;
      heroSkill.classList.toggle("ready", !disabled);
      heroSkill.classList.toggle("passive", powerPassive);
      heroSkill.classList.toggle("used", !!o.used);
      heroSkill.title = (powerPassive ? "被动技能 · " : "") + viewer.hero.power.name + (powerPassive ? "" : " · " + (viewer.hero.power.cost || 2) + " 行动力") + "\n" + (viewer.hero.power.text || "") + (codexMarta ? "\n被动：每回合第一张战术牌行动力消耗 -1。" : "");
      const hs = heroSkill.querySelector(".hs-skill-state");
      if (hs) hs.textContent = powerPassive ? "被动" : o.used ? "已用" : !current ? "等待" : !o.ok ? "不可用" : "可用";
      heroSkill.onclick = (ev) => {
        ev.stopPropagation();
        if (power.disabled) return;
        if (!isPhoneLayout()) { power.click(); return; }
        if (app.suppressSkillClick && Date.now() - app.suppressSkillClick < 700) return;
        const now = Date.now();
        const isDouble = !!(app.lastSkillClick && now - app.lastSkillClick < 480);
        hideSimpleCardPreview();
        if (app.handPlayMode === "drag") {
          if (isDouble) {
            app.lastSkillClick = null;
            heroSkill.classList.add("mobile-gold");
            showSkillPreview(viewer.hero.power, "双击预览 · 点击关闭");
          } else {
            app.lastSkillClick = now;
            heroSkill.classList.add("mobile-gold");
            gameWarn("仅高亮预览。再次点击查看技能详情。");
          }
          return;
        }
        if (app.skillArmed) {
          app.skillArmed = false;
          heroSkill.classList.remove("mobile-gold");
          power.click();
          return;
        }
        app.skillArmed = true;
        app.lastSkillClick = now;
        heroSkill.classList.add("mobile-gold");
        gameWarn("再次点击「" + (viewer.hero.power.name || "领袖技能") + "」释放。");
      };
      let skillHoldTimer = null;
      let skillDragging = false;
      const finishSkillDrag = (ev) => {
        if (!skillDragging) return;
        skillDragging = false;
        const x = ev && ev.clientX, y = ev && ev.clientY;
        const node = (x != null && y != null) ? document.elementFromPoint(x, y) : null;
        const minion = node && node.closest && node.closest(".board-card[data-minion]");
        const hero = node && node.closest && node.closest(".hero-panel");
        if (minion) onTargetClick(minion.dataset.minion);
        else if (hero) onTargetClick("hero");
      };
      heroSkill.onpointerdown = (ev) => {
        if (ev.pointerType === "mouse" || ev.button !== 0 || power.disabled) return;
        skillHoldTimer = setTimeout(() => {
          skillHoldTimer = null;
          app.suppressSkillClick = Date.now();
          if (app.handPlayMode === "drag" && o.targets && o.targets.length) {
            skillDragging = true;
            document.addEventListener("pointerup", finishSkillDrag, { once: true });
            app.targetInfo = { kind: "heroPower", targets: o.targets, player: app.viewer };
            app.selectedCard = null;
            app.zoneSelect = null;
            app.attacker = null;
            renderGame();
            gameWarn("拖到高亮目标上释放技能。");
          } else {
            showSkillPreview(viewer.hero.power, app.handPlayMode === "drag" ? "拖到目标上释放" : "松手关闭");
          }
          if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
        }, 450);
      };
      const endSkillHold = () => {
        if (skillHoldTimer) { clearTimeout(skillHoldTimer); skillHoldTimer = null; }
        hideSimpleCardPreview();
      };
      heroSkill.onpointerup = endSkillHold;
      heroSkill.onpointercancel = endSkillHold;
      heroSkill.onpointerleave = endSkillHold;
    }
    const end = $("btn-end-turn");
    end.disabled = !current || s.status !== "playing" || s.mulliganPhase || app.busy || !!app.modalOpen;
    clear(end);
    end.appendChild(el("span", "end-turn-fill"));
    end.appendChild(el("span", "end-turn-label", current ? "结束回合" : "对方回合"));
    end.classList.toggle("my-phase", current);
    end.classList.toggle("enemy-phase", !current);
    end.onclick = () => endTurn();
  }

  function renderLog(s) {
    const list = $("log-list");
    if (!list) return;
    clear(list);
    const privateTypes = ["draw", "discover", "burn", "mulligan"];
    const icons = { turn: "◈", play: "▸", summon: "▣", buff: "↑", attack: "⚔", damage: "✸", heal: "✚", armor: "◈", death: "✝", deathrattle: "◌", trigger: "◇", vein: "≈", draw: "▤", discover: "◇", mulligan: "↻", burn: "✕", blood: "♨", heroPower: "✦", spell: "✦" };
    const entries = s.log.slice(-20).map((entry) => {
      const hidden = entry.player != null && entry.player !== app.viewer && privateTypes.indexOf(entry.type) >= 0;
      if (!hidden) return entry;
      const hiddenText = entry.type === "draw" ? "对手抽了一张牌。"
        : entry.type === "discover" ? "对手预兆了一张牌。"
        : entry.type === "mulligan" ? "对手完成了起手调度。"
        : "对手手牌已满，一张牌被烧掉。";
      return Object.assign({}, entry, { text: hiddenText, hidden: true });
    });
    const before = app.logEntriesSeen == null ? s.log.length : app.logEntriesSeen;
    const fresh = Math.max(0, Math.min(entries.length, s.log.length - before));
    app.logEntriesSeen = s.log.length;
    entries.forEach((entry, index) => {
      const row = el("div", "log-entry " + (entry.type || "") + (entry.hidden ? " hidden-info" : "") + (index >= entries.length - fresh ? " log-new" : ""));
      row.appendChild(el("span", "log-icon", icons[entry.type] || "·"));
      row.appendChild(el("span", "log-round", "R" + entry.round));
      row.appendChild(document.createTextNode(entry.text));
      const logDef = entry.cardId && D.CARDS[entry.cardId];
      if (logDef) {
        const info = el("button", "log-card-btn", "查看效果");
        info.title = logDef.name + "：\n" + (logDef.text || "—");
        info.onclick = (ev) => { ev.stopPropagation(); openCodexCard(logDef, "关闭"); };
        row.appendChild(info);
      }
      list.appendChild(row);
    });
    list.scrollTop = list.scrollHeight;
    const mini = $("log-mini");
    if (mini) {
      const latest = entries[entries.length - 1];
      const prev = entries[entries.length - 2];
      mini.textContent = "";
      mini.appendChild(el("b", null, "日志"));
      if (latest) {
        const main = el("span", "log-ticker-main");
        main.appendChild(el("i", "log-ticker-icon", icons[latest.type] || "·"));
        main.appendChild(document.createTextNode(latest.text));
        mini.appendChild(main);
        if (prev) {
          const old = el("span", "log-ticker-prev");
          old.appendChild(el("i", "log-ticker-icon", icons[prev.type] || "·"));
          old.appendChild(document.createTextNode("R" + prev.round + " · " + prev.text));
          mini.appendChild(old);
        }
      } else {
        mini.appendChild(el("span", "log-ticker-main", "等待第一条推演记录…"));
      }
      mini.title = "点击查看完整推演日志";
    }
  }

  function targetList() {
    if (app.targetInfo) return app.targetInfo.targets || [];
    if (app.attacker) {
      const opts = E.getAttackOptions(app.game, app.game.current, app.attacker);
      return opts.ok ? opts.targets : [];
    }
    return [];
  }

  function showFloatingNumber(text, x, y, cls) {
    const n = el("div", "floating-number" + (cls ? " " + cls : ""), text);
    const safeX = Math.max(20, Math.min(window.innerWidth - 20, x));
    const safeY = Math.max(54, Math.min(window.innerHeight - 18, y));
    n.style.left = safeX + "px";
    n.style.top = safeY + "px";
    document.body.appendChild(n);
    setTimeout(() => { if (n.parentNode) n.parentNode.removeChild(n); }, animMs(2400));
  }

  function capturePlayPoint(zone, targetUid) {
    let node = null;
    if (targetUid && targetUid !== "hero") node = document.querySelector('[data-minion="' + targetUid + '"]');
    else if (zone) {
      const zones = ["left", "center", "right"];
      const list = document.querySelectorAll("#player-board .zone");
      node = list[zones.indexOf(zone)] || null;
    }
    const r = node ? node.getBoundingClientRect() : null;
    return {
      x: r ? r.left + r.width / 2 : window.innerWidth / 2,
      y: r ? r.top + r.height / 2 : window.innerHeight * 0.5
    };
  }

  function showKeywordPop(label, x, y, tone) {
    if (global.GokVFX) global.GokVFX.keyword(label, x, y, tone);
    const pop = el("div", "keyword-pop" + (tone ? " " + tone : ""), label);
    pop.style.left = x + "px";
    pop.style.top = y + "px";
    document.body.appendChild(pop);
    setTimeout(() => { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 900);
  }

  function animateDrawToCard(card) {
    if (!card || !document.body.contains(card)) return;
    AudioBox.play("draw", { gain: 0.42 });
    if (isPhoneLayout()) return;
    if (document.body.classList.contains("simple-fx") || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    const deck = $("player-hero-deck") || $("player-deck-rail") || $("deck-corner");
    if (!deck) return;
    const d = deck.getBoundingClientRect();
    const h = card.getBoundingClientRect();
    if (!d.width || !h.width) return;
    const ghost = el("div", "draw-fly");
    ghost.style.backgroundImage = "url('" + cardBackUrl() + "')";
    ghost.style.left = (d.left + d.width / 2) + "px";
    ghost.style.top = (d.top + d.height / 2) + "px";
    ghost.style.width = "38px";
    ghost.style.height = "54px";
    document.body.appendChild(ghost);
    requestAnimationFrame(() => {
      ghost.style.left = (h.left + h.width / 2) + "px";
      ghost.style.top = (h.top + h.height / 2) + "px";
      ghost.style.transform = "translate(-50%, -50%) scale(1.18) rotate(-3deg)";
      ghost.style.opacity = "0";
    });
    setTimeout(() => { if (ghost.parentNode) ghost.parentNode.removeChild(ghost); }, animMs(2000));
    deck.classList.remove("deck-draw");
    void deck.offsetWidth;
    deck.classList.add("deck-draw");
    setTimeout(() => deck.classList.remove("deck-draw"), animMs(900));
  }

  function showPlayArc(def, sourceRect, point) {
    if (!sourceRect) return;
    const ghost = el("div", "play-ghost type-" + def.type);
    ghost.style.width = Math.min(120, sourceRect.width) + "px";
    ghost.style.height = Math.min(156, sourceRect.height) + "px";
    ghost.style.left = sourceRect.left + "px";
    ghost.style.top = sourceRect.top + "px";
    { const url = cardArtUrl(def); if (url) ghost.style.backgroundImage = "url('" + url + "')"; }
    ghost.appendChild(el("span", null, def.name));
    document.body.appendChild(ghost);
    requestAnimationFrame(() => {
      ghost.style.left = (point.x - 28) + "px";
      ghost.style.top = (point.y - 38) + "px";
      ghost.style.transform = "scale(.34) rotate(-8deg)";
      ghost.style.opacity = "0";
    });
    setTimeout(() => { if (ghost.parentNode) ghost.parentNode.removeChild(ghost); }, animMs(def.type === "spell" ? 1800 : 1000));
  }

  function playRevealType(def) {
    return def.type === "spell" ? "战术" : (def.type === "equipment" || def.type === "relic") ? "装备" : def.type === "formation" ? "阵型" : def.type === "debt" ? "债务卡" : "随从";
  }

  function showCardReveal(def, side) {
    if (!def) return;
    const old = document.querySelector(".play-reveal");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const enemy = side === "enemy";
    const isMinion = def.type === "minion";
    const box = el("div", "play-reveal" + (enemy ? " enemy" : "") + (isMinion ? " minion" : ""));
    box.appendChild(el("div", "play-reveal-label", enemy ? "对手打出" : "你打出了"));
    const card = el("div", "play-reveal-card");
    const art = el("div", "play-reveal-art");
    const artUrl = cardArtUrl(def);
    if (artUrl) art.style.backgroundImage = "url('" + artUrl + "')";
    card.appendChild(art);
    const name = el("div", "play-reveal-name");
    name.appendChild(el("span", null, def.name));
    name.appendChild(el("span", "play-reveal-cost", String(def.cost == null ? 0 : def.cost)));
    card.appendChild(name);
    card.appendChild(el("div", "play-reveal-type", playRevealType(def) + (enemy ? " · 对手行动" : "")));
    if (isMinion && (def.attack != null || def.health != null)) {
      const stats = el("div", "play-reveal-stats");
      stats.appendChild(el("span", null, "攻击 " + (def.attack == null ? "-" : def.attack)));
      stats.appendChild(el("span", null, "生命 " + (def.health == null ? "-" : def.health)));
      card.appendChild(stats);
    }
    const effect = el("div", "play-reveal-effect");
    effect.appendChild(el("span", "play-reveal-effect-label", isMinion ? "随从登场" : def.type === "spell" ? "战术效果" : def.type === "equipment" ? "装备效果" : "阵型效果"));
    if (def.text) effect.appendChild(el("p", null, def.text));
    card.appendChild(effect);
    box.appendChild(card);
    document.body.appendChild(box);
    setTimeout(() => { if (effect.parentNode) effect.classList.add("show"); }, 430);
    setTimeout(() => { if (box.parentNode) box.classList.add("out"); }, 2800);
    setTimeout(() => { if (box.parentNode) box.parentNode.removeChild(box); }, 3400);
  }

  function showManaSpend(playerIndex, amount) {
    amount = Math.max(0, Number(amount) || 0);
    if (!amount) return;
    const isPlayer = playerIndex === app.viewer;
    const hud = isPlayer ? ($("mana-display") || document.querySelector(".hs-player-crystals")) : ($("enemy-mana-display") || document.querySelector(".hs-enemy-crystals"));
    const crystals = isPlayer ? document.querySelector(".player-hero .hs-player-crystals") : document.querySelector(".opponent-hero .hs-enemy-crystals");
    for (const node of [hud, crystals]) {
      if (!node) continue;
      node.classList.remove("mana-spend");
      void node.offsetWidth;
      node.classList.add("mana-spend");
      setTimeout(() => node.classList.remove("mana-spend"), 700);
    }
    const anchor = isPlayer ? ($("player-hero") || hud) : ($("opponent-hero") || hud);
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    showFloatingNumber("-" + amount + " 行动力", r.left + r.width * 0.5, r.top + Math.min(34, r.height * 0.4), "mana-cost");
  }

  function showRelicEquipped(def, playerIndex) {
    if (!def || def.type !== "equipment") return;
    const isPlayer = playerIndex === app.viewer;
    const hero = document.getElementById(isPlayer ? "player-hero" : "opponent-hero");
    if (hero) {
      hero.classList.remove("relic-just-equipped");
      void hero.offsetWidth;
      hero.classList.add("relic-just-equipped");
      setTimeout(() => hero.classList.remove("relic-just-equipped"), 1000);
    }
    flashScreen("equipment");
  }

  function showPlayFeedback(def, point, sourceRect, side) {
    side = side || "player";
    showPlayArc(def, sourceRect, point);
    const ring = el("div", "cast-ring" + (def.type === "minion" ? " summon-ring" : "") + (def.type === "spell" ? " spell-ring" : ""));
    ring.style.left = point.x + "px";
    ring.style.top = point.y + "px";
    document.body.appendChild(ring);
    setTimeout(() => { if (ring.parentNode) ring.parentNode.removeChild(ring); }, animMs(def.type === "spell" ? 1800 : 1100));
    const st = (def.spell && def.spell.type) || "";
    AudioBox.playCard(def, side);
    if (global.GokVFX) {
      const isFreeze = st.indexOf("freeze") >= 0;
      const isBlood = st.indexOf("blood") >= 0 || def.bloodCost != null;
      const land = () => {
        if (def.type === "spell") global.GokVFX.cast(point.x, point.y, { freeze: isFreeze, blood: isBlood });
        else if (def.type === "equipment") global.GokVFX.landing(point.x, point.y, { faction: def.faction, count: 9 });
      };
      // 随从的传送门/落地由强化后的 summon 事件统一触发，避免同一阵位叠两层。
      if (def.type !== "minion") land();
    }
    showCardReveal(def, side);
    playSemanticFx(def, point, side);
  }

  function playSemanticFx(def, point, side) {
    if (!def) return;
    const st = def.spell && def.spell.type || "";
    if (def.type === "equipment") {
      flashScreen("equipment");
      const burst = el("div", "relic-burst");
      burst.style.left = point.x + "px";
      burst.style.top = point.y + "px";
      document.body.appendChild(burst);
      setTimeout(() => { if (burst.parentNode) burst.parentNode.removeChild(burst); }, 900);
      const hero = document.getElementById(side === "enemy" ? "opponent-hero" : "player-hero");
      if (hero) { hero.classList.add("relic-equipped"); setTimeout(() => hero.classList.remove("relic-equipped"), 900); }
      return;
    }
    if (st.indexOf("freeze") >= 0) { flashScreen("freeze"); return; }
    if (st.indexOf("blood") >= 0 || def.bloodCost != null) { flashScreen("blood"); return; }
    if (st.indexOf("heal") >= 0 || st.indexOf("Vein") >= 0) { flashScreen("heal"); return; }
    if (st.indexOf("armor") >= 0) { flashScreen("armor"); return; }
    if (st.indexOf("damage") >= 0 || st.indexOf("destroy") >= 0) { flashScreen("damage"); return; }
    if (st.indexOf("draw") >= 0 || st.indexOf("discover") >= 0) { flashScreen("draw"); }
  }

  function showAbilityFeedback(name, point) {
    if (global.GokVFX) global.GokVFX.cast(point.x, point.y, {});
    const ring = el("div", "cast-ring summon-ring");
    ring.style.left = point.x + "px";
    ring.style.top = point.y + "px";
    document.body.appendChild(ring);
    setTimeout(() => { if (ring.parentNode) ring.parentNode.removeChild(ring); }, 700);
    AudioBox.play("hero_power");
  }

  function showImpact(x, y, opts) {
    if (global.GokVFX && !(opts && opts.vfx === false)) global.GokVFX.impact(x, y, opts || {});
    const n = el("div", "impact-flash");
    n.style.left = x + "px";
    n.style.top = y + "px";
    document.body.appendChild(n);
    setTimeout(() => { if (n.parentNode) n.parentNode.removeChild(n); }, 1050);
  }

  function shakeScreen() {
    if (!app.screenShake) return;
    const shell = document.querySelector(".game-shell");
    if (!shell) return;
    shell.classList.remove("screen-shake");
    void shell.offsetWidth;
    shell.classList.add("screen-shake");
    setTimeout(() => shell.classList.remove("screen-shake"), 550);
  }

  let turnBannerText = "";
  let turnBannerAt = 0;
  function showTurnBanner(text) {
    const banner = $("turn-banner");
    if (!banner) return;
    const now = Date.now();
    if (text === turnBannerText && now - turnBannerAt < 900) return;
    turnBannerText = text;
    turnBannerAt = now;
    if (text === "你的回合" || text === "对方回合") playPageTurn();
    banner.textContent = text;
    banner.classList.remove("show");
    const veinRow = $("vein-row");
    if (veinRow) {
      veinRow.classList.remove("turn-sweep");
      void veinRow.offsetWidth;
      veinRow.classList.add("turn-sweep");
      setTimeout(() => veinRow.classList.remove("turn-sweep"), animMs(760));
    }
    void banner.offsetWidth;
    banner.classList.add("show");
  }

  function showTurnOrderIntro(state, done) {
    const human = app.human == null ? 0 : app.human;
    const firstIndex = state.current;
    const sides = [0, 1].map((i) => {
      const p = state.players[i];
      const first = i === firstIndex;
      const isHuman = i === human;
      const side = el("div", "turn-order-side " + (first ? "first" : "second") + (isHuman ? " human" : " enemy"));
      const art = el("div", "turn-order-art");
      if (p && p.heroId) art.style.backgroundImage = "url('" + portraitImage(p.heroId) + "')";
      side.appendChild(art);
      side.appendChild(el("div", "turn-order-role", first ? "先手" : "后手"));
      side.appendChild(el("div", "turn-order-name", isHuman ? "你" : (p ? p.name : "对手")));
      if (p) side.appendChild(el("div", "turn-order-faction", factionName(p.faction)));
      return side;
    });
    const overlay = el("div", "turn-order-intro");
    const panel = el("div", "turn-order-panel");
    panel.appendChild(el("div", "eyebrow", "TURN ORDER / 流脉判定"));
    panel.appendChild(el("h2", null, "谁先落子？"));
    const row = el("div", "turn-order-row");
    row.appendChild(sides[0]);
    const center = el("div", "turn-order-center");
    center.appendChild(el("div", "turn-order-rune"));
    center.appendChild(el("span", null, "判定"));
    row.appendChild(center);
    row.appendChild(sides[1]);
    panel.appendChild(row);
    const result = el("div", "turn-order-result", (firstIndex === human ? "你先手 · 后手是" + state.players[1 - human].name : "对手先手 · 你是后手"));
    panel.appendChild(result);
    const btn = el("button", "btn btn-primary turn-order-start", "开始对局");
    btn.onclick = () => finish();
    panel.appendChild(btn);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    app.introActive = true;
    requestAnimationFrame(() => overlay.classList.add("in"));
    const revealTimer = setTimeout(() => {
      overlay.classList.add("revealed");
      AudioBox.play("coin");
    }, animMs(650));
    const finish = () => {
      if (!app.introActive) return;
      app.introActive = false;
      clearTimeout(autoTimer);
      clearTimeout(revealTimer);
      overlay.classList.add("out");
      overlay.style.pointerEvents = "none";
      overlay.style.visibility = "hidden";
      setTimeout(() => { const parent = overlay.parentNode; if (parent) parent.removeChild(overlay); done(); }, 300);
    };
    const autoTimer = setTimeout(finish, animMs(3900));
  }

  function showAttackLine(ax, ay, bx, by) {
    if (global.GokVFX) global.GokVFX.attack(ax, ay, bx, by);
    const distance = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
    const angle = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
    const line = el("div", "attack-overlay-line");
    line.style.left = ax + "px";
    line.style.top = ay + "px";
    line.style.width = distance + "px";
    line.style.transform = "rotate(" + angle + "deg)";
    document.body.appendChild(line);
    setTimeout(() => { if (line.parentNode) line.parentNode.removeChild(line); }, animMs(1050));
  }

  function animateAttack(attackerUid, targetUid, attackerOwner, done) {
    if (app.animating || !app.game) return;
    const s = app.game;
    const attacker = E.findMinion(s, attackerUid);
    if (!attacker) { if (done) done({ ok: false, reason: "攻击者已不在场" }); return; }
    const damage = attacker.attack;
    const targetMinion = targetUid === "hero" ? null : E.findMinion(s, targetUid);
    const counterDamage = targetMinion ? targetMinion.attack : 0;
    const attackerElBefore = document.querySelector('.board-card[data-minion="' + attackerUid + '"]');
    const attackerRect = attackerElBefore ? attackerElBefore.getBoundingClientRect() : null;
    const targetHeroId = attackerOwner === app.viewer ? "opponent-hero" : "player-hero";
    const targetElBefore = targetUid === "hero"
      ? document.getElementById(targetHeroId)
      : document.querySelector('.board-card[data-minion="' + targetUid + '"]');
    const targetGhost = targetUid !== "hero" && targetElBefore ? targetElBefore.cloneNode(true) : null;
    const rect = targetElBefore ? targetElBefore.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    app.animating = true;
    app.busy = true;
    app.attacker = null;
    app.targetInfo = null;
    renderGame();

    const attackerEl = document.querySelector('.board-card[data-minion="' + attackerUid + '"]');
    const targetEl = targetUid === "hero"
      ? document.getElementById(targetHeroId)
      : document.querySelector('.board-card[data-minion="' + targetUid + '"]');
    if (attackerEl) attackerEl.classList.add(attackerOwner === app.viewer ? "attack-up" : "attack-down");
    if (targetEl) { showTargetMarker(targetEl, targetUid === "hero" ? "领袖" : (targetMinion && targetMinion.name) || "目标"); setTimeout(() => targetEl.classList.add("hit"), 180); }

    if (attackerRect) {
      const ax = attackerRect.left + attackerRect.width / 2;
      const ay = attackerRect.top + attackerRect.height / 2;
      setTimeout(() => showAttackLine(ax, ay, cx, cy), 100);
    }
    if (targetMinion && targetMinion.taunt) setTimeout(() => showKeywordPop("守备", cx, cy, ""), 190);
    if (targetMinion && targetMinion.divineShield) setTimeout(() => showKeywordPop("格挡", cx, cy, "shield"), 205);
    if (attacker.poisonous) setTimeout(() => showKeywordPop("蚀毒", cx, cy, "poison"), 220);
    if (attacker.lifesteal) setTimeout(() => showKeywordPop("血偿", cx, cy, "heal"), 220);

    // 命中帧才结算，伤害数字和引擎状态在同一拍出现；之后只播回收和余波。
    setTimeout(() => {
      const impactPoint = { x: cx, y: cy };
      if (global.GokVFX) {
        global.GokVFX.impact(cx, cy, { freeze: !!targetMinion && targetMinion.frozenTurns > 0 });
        if (attacker.lifesteal && attackerRect) {
          const ax = attackerRect.left + attackerRect.width / 2;
          const ay = attackerRect.top + attackerRect.height / 2;
          global.GokVFX.drain(cx, cy, ax, ay, { color: [110, 220, 150] });
        }
      }
      showImpact(cx, cy, { vfx: false });
      if (targetUid === "hero") {
        const heroEl = document.getElementById(targetHeroId);
        if (heroEl) {
          heroEl.classList.add("hero-hit");
          setTimeout(() => heroEl.classList.remove("hero-hit"), 700);
        }
        showHeroImpact(cx, cy);
        flashScreen("damage");
      }
      AudioBox.play("battle");
      if (app.screenShake) shakeScreen();

      const r = E.attack(s, attackerOwner, attackerUid, targetUid);
      renderGame();
      if (targetMinion && targetMinion.dead && targetGhost) showDeathGhost(targetGhost, rect);
      if (r.ok) {
        showFloatingNumber("-" + damage, cx, cy, targetUid === "hero" ? "damage hero-damage" : "damage");
        if (counterDamage > 0 && attackerRect) {
          showFloatingNumber("-" + counterDamage, attackerRect.left + attackerRect.width / 2, attackerRect.top + attackerRect.height / 2, "damage");
          const attackerNow = document.querySelector('.board-card[data-minion="' + attackerUid + '"]');
          if (attackerNow && !attacker.dead) {
            const ax = attackerRect.left + attackerRect.width / 2;
            const ay = attackerRect.top + attackerRect.height / 2;
            const dx = ax - cx, dy = ay - cy;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            attackerNow.style.setProperty("--recoil-x", (dx / len * 9).toFixed(1) + "px");
            attackerNow.style.setProperty("--recoil-y", (dy / len * 9).toFixed(1) + "px");
            attackerNow.classList.remove("vfx-counter-recoil");
            void attackerNow.offsetWidth;
            attackerNow.classList.add("vfx-counter-recoil");
            setTimeout(() => attackerNow.classList.remove("vfx-counter-recoil"), 300);
            if (global.GokVFX) global.GokVFX.impact(ax, ay, { count: 5 });
          }
        }
      } else {
        toast(r.reason || "攻击失败。");
      }
      if (showPendingDiscoverIfNeeded()) {
        setTimeout(() => finishAttack(r), 120);
      } else {
        finishAttack(r);
      }
    }, 270);

    function finishAttack(r) {
      setTimeout(() => {
        app.animating = false;
        app.busy = false;
        // 命中帧 renderGame 时 busy 仍为 true，按钮会被渲染成 disabled。
        // 动画结束必须再重绘一次控件，否则结束回合会一直卡灰。
        if (app.game && app.screen === "game") renderGame();
        if (done) done(r);
      }, 300);
    }
  }

  function showPendingDiscoverIfNeeded() {
    const s = app.game;
    if (!s || !s.pendingChoice || s.pendingChoice.type !== "discover") return false;
    if (s.pendingChoice.player !== app.viewer) return false;
    if (!app.modalOpen) showDiscover();
    return true;
  }

  function onTargetClick(uid) {
    if (!app.game || app.game.status !== "playing") return;
    if (app.targetInfo && app.targetInfo.kind === "heroPower") {
      if (app.net && app.net.role === "guest") {
        app.targetInfo = null;
        guestSendAction({ kind: "heroPower", targetUid: uid });
        return;
      }
      const abilityPoint = capturePlayPoint(null, uid === "hero" ? null : uid);
      const powerPlayer = app.game.current;
      const powerBefore = app.game.players[powerPlayer].mana;
      const r = E.useHeroPower(app.game, powerPlayer, uid);
      app.targetInfo = null;
      if (!r.ok) toast(r.reason || "无法使用领袖技能。");
      else showAbilityFeedback(app.game.players[powerPlayer].hero.power.name, abilityPoint);
      renderGame();
      if (r.ok) showManaSpend(powerPlayer, powerBefore - app.game.players[powerPlayer].mana);
      if (showPendingDiscoverIfNeeded()) return;
      if (checkGameOverAfterAction()) return;
      if (app.game.current === app.aiPlayer) beginAiTurn();
      return;
    }
    if (app.targetInfo && app.targetInfo.kind === "minionTarget") {
      const r = E.resolvePendingMinionTarget(app.game, uid);
      app.targetInfo = null;
      if (!r.ok) {
        toast(r.reason || "目标不合法。");
        renderGame();
        return;
      }
      renderGame();
      if (r.pending) showDiscover();
      if (checkGameOverAfterAction()) return;
      if (app.game.current === app.aiPlayer) beginAiTurn();
      return;
    }
    if (app.targetInfo && app.targetInfo.kind === "card") {
      const cardUid = app.targetInfo.cardUid;
      app.targetInfo = null;
      app.selectedCard = cardUid;
      const card = app.game.players[app.game.current].hand.find((c) => c.uid === cardUid);
      if (!card) return;
      const def = D.CARDS[card.cardId];
      if (def.type === "minion") {
        if (app.pendingDragZone) {
          const z = app.pendingDragZone;
          app.pendingDragZone = null;
          commitPlay(cardUid, uid, z);
        } else {
          app.zoneSelect = { cardUid: cardUid, targetUid: uid };
          renderGame();
        }
      } else {
        commitPlay(cardUid, uid, null);
      }
      return;
    }
    if (app.attacker) {
      const attacker = app.attacker;
      app.attacker = null;
      if (app.net && app.net.role === "guest") {
        guestAnimateAttack(attacker, uid);
        return;
      }
      animateAttack(attacker, uid, app.game.current, () => {
        checkGameOverAfterAction();
      });
    }
  }

  function onZoneClick(zone) {
    if (!app.zoneSelect) return;
    const cardUid = app.zoneSelect.cardUid;
    const targetUid = app.zoneSelect.targetUid || null;
    app.zoneSelect = null;
    commitPlay(cardUid, targetUid, zone);
  }

  /* ===== card play ===== */
  function beginCard(cardUid) {
    if (!app.game || app.game.status !== "playing") return;
    if (app.busy || app.modalOpen) return;
    const s = app.game;
    if (s.current !== app.viewer) { toast("还没轮到你。"); return; }
    const player = s.players[s.current];
    const card = player.hand.find((c) => c.uid === cardUid);
    if (!card) return;
    const def = D.CARDS[card.cardId];
    const opt = E.getPlayOptions(s, s.current, cardUid);
    if (!opt.ok) { toast(opt.reason || "现在不能打出这张牌。"); return; }
    app.targetInfo = null;
    app.zoneSelect = null;
    app.attacker = null;
    app.selectedCard = cardUid;
    if ((def.type === "minion" || def.type === "formation") && app.pendingDragZone && !opt.targetType) {
      const z = app.pendingDragZone;
      app.pendingDragZone = null;
      commitPlay(cardUid, null, z);
      return;
    }
    if (opt.targetType) {
      if (!opt.targets.length) {
        if (def.type === "minion" || def.type === "formation") {
          app.zoneSelect = { cardUid: cardUid, targetUid: null };
          renderGame();
          return;
        }
        if (def.optionalTarget) {
          if (def.type === "minion" || def.type === "formation") {
            app.zoneSelect = { cardUid: cardUid, targetUid: null };
            renderGame();
          } else {
            app.pendingDragZone = null;
            commitPlay(cardUid, null, null);
          }
          return;
        }
        if (opt.targetType === "friendly") {
          if (def.type === "minion" || def.type === "formation") {
            app.zoneSelect = { cardUid: cardUid, targetUid: null };
            renderGame();
          } else {
            app.selectedCard = null;
            toast("没有可选的友方目标，无法施放这张战术牌。");
            renderGame();
          }
          return;
        }
        app.selectedCard = null;
        toast("没有合法目标。");
        renderGame();
        return;
      }
      app.targetInfo = { kind: "card", cardUid: cardUid, targetType: opt.targetType, targets: opt.targets };
      renderGame();
      return;
    }
    app.pendingDragZone = null;
    if (def.type === "minion" || def.type === "formation") {
      if (!opt.zones || !opt.zones.length) { toast(def.type === "formation" ? "阵型槽已满。" : "随从已满。"); return; }
      app.zoneSelect = { cardUid: cardUid, targetUid: null };
      renderGame();
      return;
    }
    commitPlay(cardUid, null, null);
  }

  function releaseMobileArmed(ev) {
    if (!isPhoneLayout() || !app.mobileClickArmed || app.modalOpen) return;
    const target = ev.target;
    if (!target || !target.closest) return;
    if (target.closest("#hand,.hand-zone,#mobile-simple-preview,.mobile-card-sheet,.modal,.log-panel,#log-backdrop,.game-top,button,a,input,select,textarea")) return;
    const s = app.game;
    if (!s || s.current !== app.viewer || app.busy) return;
    const uid = app.mobileClickArmed;
    const p = s.players[s.current];
    const hc = p.hand.find((c) => c.uid === uid);
    if (!hc) { app.mobileClickArmed = null; hideSimpleCardPreview(); return; }
    const def = D.CARDS[hc.cardId];
    if (!def) return;
    const opt = E.getPlayOptions(s, s.current, uid);
    if (!opt.ok) { toast(opt.reason || "现在不能打出这张牌。"); return; }

    ev.stopPropagation();
    app.mobileClickArmed = null;
    app.mobileGoldCard = null;
    hideSimpleCardPreview();
    clearCardDropHints();

    if (def.type === "minion" || def.type === "formation") {
      const zoneEl = target.closest(".zone");
      if (zoneEl && zoneEl.closest(".hs-player")) {
        const zone = zoneEl.dataset.zoneKey;
        // 先落地随从，再由 commitPlay 延迟打开登场目标选择。
        commitPlay(uid, null, zone);
      } else {
        beginCard(uid);
      }
      return;
    }

    let targetUid = null;
    const minionEl = target.closest(".board-card");
    if (minionEl) targetUid = minionEl.dataset.uid;
    else if (target.closest("#opponent-hero")) targetUid = "hero";
    else if (target.closest("#player-hero")) targetUid = "hero";
    if (targetUid && Array.isArray(opt.targets) && opt.targets.indexOf(targetUid) >= 0) {
      commitPlay(uid, targetUid, null);
    } else {
      beginCard(uid);
    }
  }

  function commitPlay(cardUid, targetUid, zone, targetUid2, extraOpts) {
    extraOpts = extraOpts || {};
    hidePreviewNow();
    hideSimpleCardPreview();
    app.mobileGoldCard = null;
    app.mobileClickArmed = null;
    clearCardDropHints();
    hideDeckHover();
    const s = app.game;
    if (!s) return;
    const player = s.players[s.current];
    const handCard = player && player.hand.find((c) => c.uid === cardUid);
    if (!handCard) { app.pendingDragZone = null; toast("这张牌已经不在手牌中。"); renderGame(); return; }
    const def = D.CARDS[handCard.cardId];
    const opt = E.getPlayOptions(s, s.current, cardUid);
    if (!opt.ok) { app.pendingDragZone = null; toast(opt.reason || "现在不能打出这张牌。"); renderGame(); return; }
    const deferMinionTarget = def.type === "minion" && !!opt.targetType && !targetUid && (opt.targets || []).length > 0 && !(app.net && app.net.role === "guest");
    if (def.type === "minion" && (!zone || opt.zones.indexOf(zone) < 0)) {
      app.pendingDragZone = null;
      toast("这个阵位已满，请换一个阵位。");
      renderGame();
      return;
    }
    if (opt.targetType) {
      if (def.type === "spell" && !targetUid && opt.targets.length === 0) {
        app.pendingDragZone = null;
        toast("没有可选的合法目标，无法施放这张战术牌。");
        renderGame();
        return;
      }
      if (targetUid && opt.targets.indexOf(targetUid) < 0) {
        app.pendingDragZone = null;
        toast("目标已失效，请重新选择。");
        renderGame();
        return;
      }
      if (!targetUid && opt.targets.length > 0 && !deferMinionTarget) {
        app.pendingDragZone = null;
        toast("请先选择目标。");
        renderGame();
        return;
      }
      if (!targetUid && opt.targets.length === 0 && opt.targetType !== "friendly" && !def.optionalTarget && def.type !== "minion") {
        app.pendingDragZone = null;
        toast("没有合法目标。");
        renderGame();
        return;
      }
    }
    if (def.target2 && (opt.target2Targets || []).length && !targetUid2) {
      const secondTargets = opt.target2Targets.map(uid => E.findMinion(s, uid)).filter(Boolean);
      app.pendingDragZone = null;
      openModal((content) => {
        content.appendChild(el("div", "eyebrow", "第二目标"));
        content.appendChild(el("h3", null, "选择第二个目标"));
        content.appendChild(el("p", null, "这张牌还需要选择一个目标。"));
        const actions = el("div", "modal-actions");
        for (const m of secondTargets) {
          const b = el("button", "btn btn-small", m.name + "（" + E.ZONE_NAMES[m.zone] + "）");
          b.onclick = () => { closeModal(true); commitPlay(cardUid, targetUid, zone, m.uid); };
          actions.appendChild(b);
        }
        content.appendChild(actions);
      });
      return;
    }
    app.pendingDragZone = null;
    const playPoint = capturePlayPoint(zone, targetUid);
    if (targetUid) showTargetByUid(targetUid, targetUid === "hero" ? "领袖" : null);
    const sourceEl = document.querySelector(".hand-card.selected");
    const sourceRect = sourceEl ? sourceEl.getBoundingClientRect() : null;
    const actingPlayer = s.current;
    const manaBefore = s.players[actingPlayer].mana;
    if (app.net && app.net.role === "guest") {
      guestSendAction({
        kind: "play",
        cardUid: cardUid,
        targetUid: targetUid || null,
        targetUid2: targetUid2 || null,
        zone: zone || null,
        payBlood: true,
        debtSide: extraOpts.debtSide || null
      });
      app.payBloodChoice = null;
      app.pendingBloodCard = null;
      app.selectedCard = null;
      app.targetInfo = null;
      app.zoneSelect = null;
      app.attacker = null;
      showPlayFeedback(def, playPoint, sourceRect, "player");
      renderGame();
      showManaSpend(actingPlayer, def.cost || 0);
      if (def.type === "equipment") showRelicEquipped(def, actingPlayer);
      return;
    }
    const result = E.playCard(s, s.current, cardUid, {
      targetUid: targetUid || null,
      targetUid2: targetUid2 || null,
      zone: zone || null,
      payBlood: true,
      deferTarget: deferMinionTarget,
      debtSide: extraOpts.debtSide || null
    });
    app.payBloodChoice = null;
    app.pendingBloodCard = null;
    app.selectedCard = null;
    app.targetInfo = null;
    app.zoneSelect = null;
    app.attacker = null;
    if (!result.ok) {
      toast(result.reason || "无法打出。");
      AudioBox.play("error");
      renderGame();
      return;
    }
    showPlayFeedback(def, playPoint, sourceRect, "player");
    if (s.pendingMinionTarget) {
      app.targetInfo = {
        kind: "minionTarget",
        minionUid: s.pendingMinionTarget.minionUid,
        targetType: s.pendingMinionTarget.targetType,
        targets: E.getPendingMinionTargets(s),
        defName: def.name
      };
    }
    renderGame();
    showManaSpend(actingPlayer, manaBefore - s.players[actingPlayer].mana);
    if (def.type === "equipment") showRelicEquipped(def, actingPlayer);
    if (s.pendingMinionTarget) gameWarn("随从已登场，请选择要强化的目标。");
    if (s.pendingChoice) showDiscover();
    if (checkGameOverAfterAction()) return;
  }

  function endTurn() {
    if (!app.game || app.game.status !== "playing" || app.busy) return;
    if (app.game.current !== app.viewer) return;
    document.body.classList.add("ending-turn");
    setTimeout(() => document.body.classList.remove("ending-turn"), 1400);
    playPageTurn();
    if (app.net && app.net.role === "guest") {
      app.selectedCard = null;
      app.targetInfo = null;
      app.zoneSelect = null;
      app.attacker = null;
      app.payBloodChoice = null;
      guestSendAction({ kind: "end" });
      return;
    }
    app.selectedCard = null;
    app.targetInfo = null;
    app.zoneSelect = null;
    app.attacker = null;
    app.payBloodChoice = null;
    const r = E.endTurn(app.game, app.game.current);
    if (app.game.pendingChoice) {
      renderGame();
      showDiscover();
      return;
    }
    showTurnBanner("回合结束");
    renderGame();
    if (checkGameOverAfterAction()) return;
    if (app.local) {
      showHandoff(app.game.current, false);
    } else if (app.game.current === app.aiPlayer) {
      beginAiTurn();
    } else if (app.game.current === app.viewer) {
     
    }
  }

  function checkGameOverAfterAction() {
    if (!app.game) return false;
    if (app.game.status === "gameover") {
      app.busy = true;
      app.aiRunning = false;
      document.body.classList.add("game-over-cinematic");
      document.body.classList.remove("low-hp-warning");
      renderGame();
      setTimeout(() => { if (app.game && app.game.status === "gameover") showEnd(); }, 280);
      return true;
    }
    return false;
  }

  /* ===== AI ===== */
  function aiDelay(base) {
    const factor = app.aiSpeed === "slow" ? 3.2 : app.aiSpeed === "fast" ? 1.2 : 2.4;
    return Math.round(base * factor);
  }

  function enemyHeroPoint() {
    const node = document.getElementById("opponent-hero");
    if (!node) return { x: innerWidth / 2, y: innerHeight * 0.22 };
    const r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function applyNightmareCheats() {
    if (!app.game || app.aiDifficulty !== "nightmare") return;
    const s = app.game;
    const ai = s.players[app.aiPlayer];
    if (!ai || ai.cheatRound === s.round) return;
    ai.cheatRound = s.round;
    ai.nextCostReduction = Math.max(ai.nextCostReduction || 0, 2);
  }

  function beginAiTurn() {
    if (!app.game || !app.aiPlayer || app.game.status !== "playing") return;
    if (app.game.current !== app.aiPlayer) return;
    if (app.aiRunning) return;
    app.aiRunning = true;
    app.busy = true;
    applyNightmareCheats();
    app.currentHint = "对手正在推演…";
    renderGame();
    setTimeout(aiStep, aiDelay(1000));
  }

  function aiStep() {
    if (app.modalOpen || app.screen !== "game") { setTimeout(aiStep, 300); return; }
    if (!app.game || app.game.status !== "playing") { app.aiRunning = false; app.busy = false; return; }
    if (app.game.current !== app.aiPlayer) {
      app.aiRunning = false;
      app.busy = false;
      renderGame();
      return;
    }
    if (app.aiDifficulty === "nightmare" && app.game.current === app.aiPlayer) {
      const ai = app.game.players[app.aiPlayer];
      if (ai) ai.nextCostReduction = Math.max(ai.nextCostReduction || 0, 1);
    }
    const action = AI.chooseAction(app.game, app.aiPlayer);
    if (action && action.type === "attack") {
      animateAttack(action.attackerUid, action.targetUid, app.aiPlayer, () => afterAiAction());
      return;
    }
    if (action && action.type === "play") {
      const actor = app.game.players[app.aiPlayer];
      const handCard = actor.hand.find(c => c.uid === action.cardUid);
      const played = handCard && D.CARDS[handCard.cardId];
      if (played) {
        const point = enemyHeroPoint();
        showPlayFeedback(played, point, null, "enemy");
        setTimeout(() => {
          if (!app.game || app.game.status !== "playing") { app.aiRunning = false; return; }
          AI.takeAction(app.game, app.aiPlayer);
          afterAiAction();
        }, animMs(720));
        return;
      }
    }
    if (action && action.type === "heroPower") {
      const hero = app.game.players[app.aiPlayer].hero;
      showAbilityFeedback((hero.power && hero.power.name) || "领袖技能", enemyHeroPoint());
      setTimeout(() => {
        if (!app.game || app.game.status !== "playing") { app.aiRunning = false; return; }
        AI.takeAction(app.game, app.aiPlayer);
        afterAiAction();
      }, animMs(520));
      return;
    }
    AI.takeAction(app.game, app.aiPlayer);
    afterAiAction();
  }

  function playActionSound(action) {
    if (!action || action.seq == null || action.seq === app.lastSfxSeq) return;
    app.lastSfxSeq = action.seq;
    if (action.type === "heroPower") AudioBox.play("hero_power");
  }

  function afterAiAction() {
    if (!app.game) return;
    const last = app.game.lastAction;
    playActionSound(last);
    if (checkGameOverAfterAction()) { app.aiRunning = false; return; }
    if (app.game.status === "playing" && app.game.current === app.aiPlayer) {
      renderGame();
      if (last && last.type === "play" && last.player === app.aiPlayer) {
        const def = D.CARDS[last.cardId];
        if (def) {
          showManaSpend(app.aiPlayer, def.cost || 0);
          if (def.type === "equipment") showRelicEquipped(def, app.aiPlayer);
        }
      } else if (last && last.type === "heroPower" && last.player === app.aiPlayer) {
        const hpCost = (app.game.players[app.aiPlayer].hero.power && app.game.players[app.aiPlayer].hero.power.cost) || 0;
        showManaSpend(app.aiPlayer, hpCost);
      }
      setTimeout(aiStep, aiDelay(1300) + (last && last.type === "play" ? 650 : 0));
    } else if (app.game.status === "playing") {
      app.aiRunning = false;
      app.busy = false;
      app.currentHint = "";
      renderGame();
      playPageTurn();
      AudioBox.play("select");
      showTurnBanner("你的回合");
     
    } else {
      app.aiRunning = false;
      app.busy = false;
      renderGame();
    }
  }

  /* ===== local handoff ===== */
  function showHandoff(playerIndex, initial) {
    const s = app.game;
    if (!s) return;
    const p = s.players[playerIndex];
    app.busy = true;
    openModal((content) => {
      content.classList.add("handoff-modal");
      const portrait = el("div", "handoff-portrait");
      portrait.style.backgroundImage = "url('" + heroImage(p.heroId) + "')";
      content.appendChild(el("div", "eyebrow", initial ? "档案交接 / 开始" : "档案交接 / 下一回合"));
      content.appendChild(portrait);
      content.appendChild(el("h3", null, p.name));
      content.appendChild(el("p", null, initial ? "请将设备交给 " + p.name + "，确认后开始推演。" : "请将设备交给 " + p.name + "，确认后继续。"));
      const btn = el("button", "btn btn-primary", "我准备好了");
      btn.onclick = () => {
        closeModal(true);
        app.busy = false;
        app.currentHint = "";
        renderGame();
        AudioBox.play("ui_open");
        if (!app.local && s.current === app.aiPlayer) beginAiTurn();
      };
      content.appendChild(btn);
    });
  }

  /* ===== modal ===== */
  function openModal(builder) {
    hidePreviewNow();
    hideDeckHover();
    closeModal(true);
    app.modalOpen = true;
    const root = $("modal-root");
    const backdrop = el("div", "modal-backdrop");
    const modal = el("div", "modal");
    backdrop.appendChild(modal);
    root.appendChild(backdrop);
    builder(modal);
    return { backdrop: backdrop, modal: modal };
  }
  function closeModal(force) {
    if (!app.modalOpen && !force) return;
    const root = $("modal-root");
    if (root) clear(root);
    app.modalOpen = false;
    if (app.screen === "home" && isPhoneLayout() && !app.mobileWelcomeShown) {
      setTimeout(() => { if (app.screen === "home" && !app.modalOpen) showMobileWelcome(); }, 280);
    }
  }

  function showDiscover() {
    const s = app.game;
    if (!s || !s.pendingChoice || s.pendingChoice.type !== "discover") return;
    if (s.pendingChoice.player !== app.viewer) return;
    app.busy = true;
    AudioBox.play("discover");
    const options = s.pendingChoice.options.slice();
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "发现 / 档案"));
      content.appendChild(el("h3", null, "从档案中选择一张牌"));
      content.appendChild(el("p", null, "选择一张置入手牌。"));
      const grid = el("div", "discover-grid");
      for (const id of options) {
        const def = D.CARDS[id];
        const card = el("div", "choice-card discover-card");
        const art = el("div", "preview-art");
        if (def.art) art.style.backgroundImage = "url('" + portraitImage(def.art) + "')";
        else {
          art.classList.add("placeholder", "generic-art");
          art.style.backgroundImage = genericArtStyle(def);
          art.dataset.icon = def.type === "spell" ? "术" : factionIcon(def.faction);
          addGenericGlyph(art, def);
          addGeneratedArt(art, def);
        }
        card.appendChild(art);
        card.appendChild(el("strong", null, def.name));
        card.appendChild(el("small", null, (def.type === "spell" ? "战术 · " : "随从 · ") + def.cost + " 行动力" + (def.type === "minion" ? " · " + def.attack + "/" + def.health : "")));
        const txt = el("p", null, def.text || "—");
        card.appendChild(txt);
        card.onclick = () => {
          if (app.net && app.net.role === "guest") {
            closeModal(true);
            guestSendAction({ kind: "discover", cardId: id });
            return;
          }
          const beforeCurrent = s.current;
          const r = E.resolveDiscover(s, s.pendingChoice.player, id);
          closeModal(true);
          app.busy = false;
          if (!r.ok) toast(r.reason || "选择失败。");
          else AudioBox.play("select");
          renderGame();
          if (s.pendingChoice) showDiscover();
          else if (checkGameOverAfterAction()) return;
          else if (s.current !== beforeCurrent) {
            if (s.current === app.aiPlayer) beginAiTurn();
            else if (s.current === app.viewer) {
              showTurnBanner("你的回合");
             
            }
          }
        };
        grid.appendChild(card);
      }
      content.appendChild(grid);
    });
  }

  function openVeinThresholdHelp() {
    const current = app.game && typeof app.game.vein === "number" ? app.game.vein : 0;
    openModal((content) => {
      content.classList.add("vein-help-modal");
      content.appendChild(el("div", "eyebrow", "共享流脉 / 阈值预览"));
      content.appendChild(el("h3", null, "流脉 " + current + " / 12"));
      content.appendChild(el("p", "muted", "达到阈值时自动结算。悬停查看简略，点击左侧流脉图标查看完整规则。"));
      const list = el("div", "vein-help-list");
      [
        ["4", "震荡", "所有随从受到 1 点伤害"],
        ["7", "裂隙", "双方领袖受到 2 点伤害"],
        ["10", "魔物潮", "所有随从受到 3 点伤害，双方领袖受到 5 点伤害"],
        ["12", "回流", "流脉清空，重新开始累积"]
      ].forEach(([at, name, desc]) => {
        const row = el("div", "vein-help-row" + (Number(at) <= current ? " reached" : ""));
        row.appendChild(el("b", null, at));
        row.appendChild(el("strong", null, name));
        row.appendChild(el("span", null, desc));
        list.appendChild(row);
      });
      content.appendChild(list);
      const actions = el("div", "modal-actions");
      const close = el("button", "btn btn-primary", "知道了");
      close.onclick = () => closeModal(true);
      actions.appendChild(close);
      content.appendChild(actions);
    });
  }

  function showTargetMarker(targetEl, label) {
    if (!targetEl) return;
    const old = document.getElementById("target-focus-label");
    if (old) old.remove();
    const chip = el("div", "target-focus-label", "目标 · " + (label || "目标"));
    document.body.appendChild(chip);
    const r = targetEl.getBoundingClientRect();
    const w = chip.offsetWidth || 100;
    chip.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + "px";
    chip.style.top = Math.max(46, r.top - 32) + "px";
    targetEl.classList.add("action-target-now");
    setTimeout(() => {
      targetEl.classList.remove("action-target-now");
      if (chip.parentNode) chip.remove();
    }, animMs(1150));
  }

  function showTargetByUid(targetUid, label) {
    if (!targetUid) return;
    const node = targetUid === "hero"
      ? document.getElementById(app.game && app.game.current === app.viewer ? "opponent-hero" : "player-hero")
      : document.querySelector('[data-minion="' + targetUid + '"]');
    const def = targetUid === "hero" ? null : (app.game && E.findMinion(app.game, targetUid));
    showTargetMarker(node, label || (def && def.name) || "领袖");
  }

  function toggleGameLog(force) {
    app.logOpen = force == null ? !app.logOpen : !!force;
    const panel = $("log-panel");
    const backdrop = $("log-backdrop");
    if (panel) panel.classList.toggle("open", app.logOpen);
    if (backdrop) {
      backdrop.hidden = !app.logOpen;
      backdrop.classList.toggle("show", app.logOpen);
    }
  }

  function openGameSettings() {
    openModal((content) => {
      content.classList.add("game-settings-modal");
      content.appendChild(el("div", "eyebrow", "暂停 / 设置"));
      content.appendChild(el("h3", null, "对局设置"));
      content.appendChild(el("p", "muted", "声音、背景音效与认输入口。关闭后继续当前对局。"));
      const rows = el("div", "game-settings-rows");
      const sound = el("button", "btn btn-small btn-ghost", "声音：" + (app.audioOn ? "开" : "关"));
      sound.onclick = () => { AudioBox.toggle(); sound.textContent = "声音：" + (app.audioOn ? "开" : "关"); };
      rows.appendChild(sound);
      const bgm = el("button", "btn btn-small btn-ghost", "背景音乐：" + (app.bgmOn ? "开" : "关"));
      bgm.onclick = () => { AudioBox.toggleBgm(); bgm.textContent = "背景音乐：" + (app.bgmOn ? "开" : "关"); };
      rows.appendChild(bgm);
      const sfx = el("button", "btn btn-small btn-ghost", "战斗音效：" + (app.sfxOn ? "开" : "关"));
      sfx.onclick = () => { AudioBox.toggleSfx(); sfx.textContent = "战斗音效：" + (app.sfxOn ? "开" : "关"); };
      rows.appendChild(sfx);
      const speedLabel = () => app.aiSpeed === "slow" ? "慢速（3秒）" : app.aiSpeed === "fast" ? "快速（1秒）" : "标准（2秒）";
      const speed = el("button", "btn btn-small btn-ghost", "AI 速度：" + speedLabel());
      speed.onclick = () => {
        app.aiSpeed = app.aiSpeed === "normal" ? "slow" : app.aiSpeed === "slow" ? "fast" : "normal";
        localStorage.setItem("gok_ai_speed", app.aiSpeed);
        speed.textContent = "AI 速度：" + speedLabel();
        updateSettingsUI();
      };
      rows.appendChild(speed);
      const shake = el("button", "btn btn-small btn-ghost", "震动：" + (app.screenShake ? "开" : "关"));
      shake.onclick = () => {
        app.screenShake = !app.screenShake;
        localStorage.setItem("gok_screen_shake", app.screenShake ? "1" : "0");
        shake.textContent = "震动：" + (app.screenShake ? "开" : "关");
        updateSettingsUI();
      };
      rows.appendChild(shake);
      const full = el("button", "btn btn-small btn-ghost", "完整设置（音量 / 画面 / 操作）");
      full.onclick = () => { closeModal(true); openSettings("game"); };
      rows.appendChild(full);
      const logBtn = el("button", "btn btn-small btn-ghost", "打开推演日志");
      logBtn.onclick = () => { closeModal(true); toggleGameLog(true); };
      rows.appendChild(logBtn);
      content.appendChild(rows);
      const actions = el("div", "modal-actions");
      const concede = el("button", "btn btn-small btn-ghost game-concede-btn", "认输");
      concede.onclick = () => { closeModal(true); confirmConcede(); };
      actions.appendChild(concede);
      const close = el("button", "btn btn-primary", "返回对局");
      close.onclick = () => closeModal(true);
      actions.appendChild(close);
      content.appendChild(actions);
    });
  }

  function confirmConcede() {
    if (!app.game || app.game.status !== "playing") return;
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "档案 / 认输"));
      content.appendChild(el("h3", null, "确认认输？"));
      content.appendChild(el("p", null, "当前对局会立即结束，并记录为败北。"));
      const actions = el("div", "modal-actions");
      const yes = el("button", "btn btn-primary", "确认认输");
      yes.onclick = () => { closeModal(true); doConcede(); };
      const no = el("button", "btn btn-ghost", "继续对局");
      no.onclick = () => closeModal(true);
      actions.appendChild(no);
      actions.appendChild(yes);
      content.appendChild(actions);
    });
  }

  function doConcede() {
    const s = app.game;
    if (!s || s.status !== "playing") return;
    if (app.net && app.net.role === "guest") {
      guestSendAction({ kind: "surrender" });
      toast("已发送认输。");
      return;
    }
    if (app.net && app.net.role === "host") {
      s.status = "gameover";
      s.winner = 1;
      sendNet({ type: "state", state: redactStateForGuest(s) });
      renderGame();
      showEnd();
      return;
    }
    s.status = "gameover";
    s.winner = 1 - (app.local ? s.current : app.human);
    s.stats.result = s.winner === app.human ? "win" : "loss";
    renderGame();
    showEnd();
  }

  function showEnd() {
    const s = app.game;
    if (!s) return;
    if (app.modalOpen || app.endCGPending) return;
    const classicOrStory = !app.contentRun || (app.contentRun && app.contentRun.mode === "story");
    if (!app.endCGPlayed && s.winner != null && !app.tutorial && classicOrStory && global.GokCinema) {
      app.endCGPlayed = true;
      app.endCGPending = true;
      app.busy = true;
      app.aiRunning = false;
      const win = s.winner === app.human;
      global.GokCinema.play(win ? "victory.mp4" : "defeat.mp4", {
        eyebrow: "对局结算 · " + (win ? "胜利" : "失败"),
        title: win ? "推演胜利" : "推演败北",
        text: win ? "档案记下这一局：流脉站在你这边。" : "档案合上了这一页，但地脉仍在流动。"
      }).then(() => {
        app.endCGPending = false;
        if (app.game === s) openEndModal();
      });
      return;
    }
    openEndModal();
  }

  function openEndModal() {
    const s = app.game;
    if (!s) return;
    app.busy = true;
    app.aiRunning = false;
    recordGameProfile();
    recordGameAchievements();
    const unlocked = (app.settlementAchievements || []).map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);
    const win = s.winner === app.human;
    const draw = s.winner == null;
    const series = app.series;
    if (series && !series.recorded) {
      if (!draw) series.wins[s.winner === app.human ? 0 : 1]++;
      series.recorded = true;
    }
    const seriesDone = !!(series && (series.wins[0] >= 2 || series.wins[1] >= 2));
    if (win && !app.contentRun && !app.tutorial && global.GokContent && global.GokContent.grantDaily) global.GokContent.grantDaily("classic", 1);
    AudioBox.play(win ? "victory" : "select");
    AudioBox.play(win ? "victory_jingle" : draw ? "turn_start" : "defeat_jingle");
    AudioBox.bgm(MAIN_BGM);
    openModal((content) => {
      content.classList.add("end-modal", win ? "end-win" : draw ? "end-draw" : "end-lose");
      content.appendChild(el("div", "eyebrow", "档案 / 结算"));
      const art = el("div", "end-art");
      const focusPlayer = s.winner != null ? s.players[s.winner] : s.players[app.human];
      art.style.backgroundImage = "linear-gradient(90deg, rgba(4,9,14,0.08), rgba(4,9,14,0.78)), url('" + portraitImage(focusPlayer.heroId) + "')";
      const artCrest = el("img", "end-crest");
      artCrest.src = D.FACTIONS[focusPlayer.faction].emblem;
      artCrest.alt = "";
      art.appendChild(artCrest);
      content.appendChild(art);
      content.appendChild(el("div", "end-result " + (win ? "win" : draw ? "draw" : "lose"), win ? "推演胜利" : draw ? "推演平局" : "推演败北"));
      let title = "未分胜负";
      if (s.winner != null) title = s.players[s.winner].name + " 获胜";
      content.appendChild(el("div", "end-winner", title));
      content.appendChild(el("div", "end-sub", "本次推演未写入正史。"));
      if (series) {
        const score = el("div", "end-series", "系列赛 · " + series.wins[0] + " : " + series.wins[1] + (seriesDone ? " · 系列赛结束" : " · 第 " + ((series.game || 1) + 1) + " 局待开始"));
        content.appendChild(score);
      }
      const stats = el("div", "end-stats");
      const items = [
        ["轮数", s.round],
        ["流脉峰值", s.stats.veinPeak],
        ["4 / 7 / 10", (s.stats.thresholds[4] || 0) + " / " + (s.stats.thresholds[7] || 0) + " / " + (s.stats.thresholds[10] || 0)],
        ["召唤随从", s.stats.minionsSummoned],
        ["阵亡随从", s.stats.minionsDied],
        ["剩余手牌", s.players[app.human].hand.length]
      ];
      for (const pair of items) {
        const box = el("div", "end-stat");
        box.appendChild(el("span", null, pair[0]));
        box.appendChild(el("strong", null, String(pair[1])));
        stats.appendChild(box);
      }
      content.appendChild(stats);
      if (s.ranked && app.rankChange) {
        const rc = app.rankChange;
        const rankBox = el("div", "end-rank");
        rankBox.appendChild(el("span", "panel-label", "排位结算"));
        rankBox.appendChild(el("strong", null, rankText(rc.after)));
        const delta = el("span", "end-rank-delta " + (rc.delta > 0 ? "up" : rc.delta < 0 ? "down" : "flat"), (rc.delta > 0 ? "+" : "") + rc.delta + " 分");
        rankBox.appendChild(delta);
        if (rc.beforeTier !== rc.afterTier) rankBox.appendChild(el("small", null, rc.beforeTier + " → " + rc.afterTier));
        content.appendChild(rankBox);
      }
      const achBox = el("div", "end-achievements");
      achBox.appendChild(el("div", "panel-label", "本局档案记录"));
      if (unlocked.length) {
        for (const a of unlocked) {
          const line = el("div", "end-achievement");
          line.appendChild(el("span", null, a.icon));
          line.appendChild(el("strong", null, a.name));
          line.appendChild(el("small", null, a.desc));
          achBox.appendChild(line);
        }
      } else {
        achBox.appendChild(el("p", "muted", "本局没有新的成就记录。"));
      }
      content.appendChild(achBox);
      const actions = el("div", "modal-actions");
      if (app.contentRun && global.GokContent && typeof global.GokContent.afterGame === "function") {
        const contentBtn = el("button", "btn btn-primary", "返回" + (app.contentRun.label || "模式"));
        contentBtn.onclick = () => { closeModal(true); const s2 = app.game; global.GokContent.afterGame(s2); };
        actions.appendChild(contentBtn);
      }
      const isContent = !!app.contentRun;
      const again = isContent || series ? null : el("button", "btn btn-primary", app.net ? "返回局域网" : "再演一局");
      if (again) again.onclick = () => {
        closeModal(true);
        if (app.net) {
          stopNet(true);
          app.game = null;
          showScreen("lan");
          initLanScreen();
        } else if (app.lastConfig) {
          startGame(app.lastConfig);
        }
      };
      let nextSeries = null;
      if (series && !seriesDone) {
        nextSeries = el("button", "btn btn-primary", "下一局 · " + series.wins[0] + " : " + series.wins[1]);
        nextSeries.onclick = () => {
          const nextState = Object.assign({}, series, { game: (series.game || 1) + 1, recorded: false });
          closeModal(true);
          startGame(Object.assign({}, app.lastConfig, { series: "bo3", seriesState: nextState, skipIntro: true }));
        };
      }
      if (series && seriesDone) {
        const result = el("button", "btn btn-primary", series.wins[0] >= 2 ? "系列赛胜利 · 返回" : "系列赛结束 · 返回");
        result.onclick = () => { closeModal(true); app.series = null; leaveGame(); };
        actions.appendChild(result);
      }
      const record = isContent ? null : el("button", "btn btn-ghost", "查看成就");
      if (record) record.onclick = () => { closeModal(true); app.game = null; app.tutorial = false; openAchievements(); };
      const home = el("button", "btn btn-ghost", "返回档案处");
      home.onclick = () => { closeModal(true); leaveGame(); };
      if (again) actions.appendChild(again);
      if (nextSeries) actions.appendChild(nextSeries);
      if (record) actions.appendChild(record);
      actions.appendChild(home);
      content.appendChild(actions);
    });
  }

  function showCredits() {
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "制作名单 / 档案"));
      content.appendChild(el("h3", null, "制作与素材说明"));
      const p1 = el("p", null, "《戈克世界：流脉牌局》经典模式 2.0。当前开放普卫岛、学院、西昭、洛斯汰聚落、共和国、帝国、灰港同盟与雪都八个阵营，支持起手调度、单人 AI 与局域网双人对战。");
      const p2 = el("p", null, "随从立绘与场景图来自《戈克世界》项目现有素材；音效与背景音乐来自《戈克纪元：流脉》项目。卡牌框架、规则引擎与界面由本作制作。");
      const p3 = el("p", null, "本作为非正史档案推演，卡牌效果不写入小说正史；未使用 NSFW 私设、参考图或带文字介绍卡。");
      content.appendChild(p1); content.appendChild(p2); content.appendChild(p3);
      const actions = el("div", "modal-actions");
      const close = el("button", "btn btn-primary", "知道了");
      close.onclick = () => closeModal(true);
      actions.appendChild(close);
      content.appendChild(actions);
    });
  }

  function leaveGame() {
    document.body.classList.remove("game-over-cinematic", "low-hp-warning");
    stopNet(true);
    const fromContent = !!app.contentRun;
    app.tutorial = false;
    app.series = null;
    app.game = null;
    app.busy = false;
    app.aiRunning = false;
    app.selectedCard = null;
    app.targetInfo = null;
    app.zoneSelect = null;
    app.attacker = null;
    app.payBloodChoice = null;
    app.pendingBloodCard = null;
    app.contentRun = null;
    hidePreview();
    if (fromContent && global.GokContent && typeof global.GokContent.renderHub === "function") {
      showScreen("content");
      global.GokContent.renderHub();
      return;
    }
    showScreen("home");
  }

  function checkGameOverAfterAction() {
    if (!app.game) return false;
    if (app.game.status === "gameover") {
      app.busy = true;
      app.aiRunning = false;
      document.body.classList.add("game-over-cinematic");
      document.body.classList.remove("low-hp-warning");
      renderGame();
      setTimeout(() => { if (app.game && app.game.status === "gameover") showEnd(); }, 280);
      return true;
    }
    return false;
  }

  /* ===== preview ===== */
  function cardKeywordHelpNode(def) {
    const labels = (typeof codexKeywordLabels === "function" ? codexKeywordLabels(def) : [])
      .filter((label) => KEYWORD_HELP[label])
      .sort((a, b) => {
        const ia = (def.text || "").indexOf(a);
        const ib = (def.text || "").indexOf(b);
        if (ia < 0 && ib < 0) return a.localeCompare(b);
        if (ia < 0) return 1;
        if (ib < 0) return -1;
        return ia - ib;
      });
    if (!labels.length) return null;
    const box = el("div", "preview-keyword-help");
    box.appendChild(el("div", "preview-keyword-title", "关键词速查"));
    for (const label of labels) {
      const row = el("div", "preview-keyword-row");
      const strong = el("strong", null, label + "：");
      applyKeywordColor(strong, label);
      row.appendChild(strong);
      row.appendChild(el("span", null, KEYWORD_HELP[label]));
      box.appendChild(row);
    }
    return box;
  }

  function showMobileCard(def, minion, hint) {
    const old = document.getElementById("mobile-card-sheet");
    if (old) old.remove();
    const bg = el("div", "mobile-card-backdrop");
    bg.id = "mobile-card-sheet";
    const sheet = el("div", "mobile-card-sheet");
    bg.appendChild(sheet);
    const close = el("button", "mobile-card-close", "×");
    close.onclick = () => bg.remove();
    sheet.appendChild(close);
    bg.onclick = (ev) => { if (ev.target === bg) bg.remove(); };
    sheet.appendChild(el("div", "eyebrow", "卡牌详情"));
    sheet.appendChild(el("h3", null, def.name));
    sheet.appendChild(el("div", "preview-meta", typeLine(def) + " · " + def.cost + " 行动力" + (def.type === "minion" ? " · 攻 " + (minion ? minion.attack : def.attack) + " / 血 " + (minion ? minion.health : def.health) : "")));
    const art = el("div", "mobile-preview-art");
    if (def.art) art.style.backgroundImage = "url('" + portraitImage(def.art) + "')";
    else {
      art.classList.add("placeholder", "generic-art");
      art.style.backgroundImage = genericArtStyle(def);
      art.dataset.icon = def.type === "spell" ? "术" : factionIcon(def.faction);
      addGenericGlyph(art, def);
      addGeneratedArt(art, def);
    }
    sheet.appendChild(art);
    addKeywordChips(sheet, def, minion);
    const text = el("p", "mobile-preview-text");
    appendKeywordText(text, def.text || "—");
    sheet.appendChild(text);
    const keywordHelp = cardKeywordHelpNode(def);
    if (keywordHelp) sheet.appendChild(keywordHelp);
    if (hint) sheet.appendChild(el("p", "mobile-preview-close-hint", hint));
    document.body.appendChild(bg);
  }

  function hideMobileCardSheet() {
    const old = document.getElementById("mobile-card-sheet");
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  function simplePreviewNode() {
    let box = document.getElementById("mobile-simple-preview");
    if (box) return box;
    box = el("div", "mobile-simple-preview");
    box.id = "mobile-simple-preview";
    box.hidden = true;
    box.appendChild(el("strong", null, ""));
    box.appendChild(el("small", null, ""));
    box.appendChild(el("p", null, ""));
    box.appendChild(el("em", null, ""));
    const help = el("div", "preview-keyword-help");
    box.appendChild(help);
    const close = el("button", "mobile-simple-close", "关闭");
    close.type = "button";
    close.onclick = (ev) => { ev.stopPropagation(); hideSimpleCardPreview(); };
    box.appendChild(close);
    document.body.appendChild(box);
    return box;
  }

  function hideSimpleCardPreview() {
    app.mobilePreviewUid = null;
    const old = document.getElementById("mobile-simple-preview");
    if (old) old.hidden = true;
    document.querySelectorAll(".hand-card.mobile-previewing").forEach((card) => {
      card.classList.remove("mobile-previewing");
    });
  }

  function markMobilePreview(card) {
    document.querySelectorAll(".hand-card.mobile-previewing").forEach((x) => x.classList.remove("mobile-previewing"));
    if (card) card.classList.add("mobile-previewing");
  }

  function showSimpleCardPreview(def, hint) {
    const box = simplePreviewNode();
    box.querySelector("strong").textContent = def.name;
    box.querySelector("small").textContent = typeLine(def) + " · " + def.cost + " 行动力" + (def.type === "minion" ? " · " + def.attack + "/" + def.health : "") + " · " + factionName(def.faction);
    box.querySelector("p").textContent = def.text || "没有额外效果。";
    const em = box.querySelector("em");
    em.textContent = hint || "";
    em.hidden = !hint;
    const help = box.querySelector(".preview-keyword-help");
    if (help) {
      clear(help);
      const keywordHelp = cardKeywordHelpNode(def);
      if (keywordHelp) help.appendChild(keywordHelp);
    }
    box.hidden = false;
  }

  function showSkillPreview(power, hint) {
    const box = simplePreviewNode();
    box.querySelector("strong").textContent = power.name || "领袖技能";
    box.querySelector("small").textContent = "领袖主动技能 · " + (power.cost || 2) + " 行动力";
    box.querySelector("p").textContent = power.text || "没有额外效果。";
    const em = box.querySelector("em");
    em.textContent = hint || "";
    em.hidden = !hint;
    const help = box.querySelector(".preview-keyword-help");
    if (help) clear(help);
    box.hidden = false;
  }

  function showCardDropHints(cardUid, def, text) {
    document.querySelectorAll(".hs-player .zone").forEach((zone) => {
      zone.classList.add("drop-ready");
      zone.dataset.dropHint = text || "点击摆放到此处";
    });
    if (def && def.type === "spell") highlightSpellTargets(cardUid);
  }

  function clearCardDropHints() {
    document.querySelectorAll(".zone.drop-ready, .zone.drop-hover").forEach((zone) => {
      zone.classList.remove("drop-ready", "drop-hover");
      delete zone.dataset.dropHint;
    });
    document.querySelectorAll(".board-card.drop-hover").forEach((node) => node.classList.remove("drop-hover"));
  }

  function attachMobileDrag(card, def, instance) {
    card.addEventListener("contextmenu", (ev) => ev.preventDefault());
    let timer = null;
    let start = null;
    let dragging = false;
    const clearTimer = () => { if (timer) { clearTimeout(timer); timer = null; } };
    const move = (ev) => {
      if (!dragging) return;
      ev.preventDefault();
      document.querySelectorAll(".zone.drop-hover").forEach((z) => z.classList.remove("drop-hover"));
      const node = document.elementFromPoint(ev.clientX, ev.clientY);
      const zone = node && node.closest && node.closest(".hs-player .zone");
      if (zone) zone.classList.add("drop-hover");
    };
    const finish = (ev) => {
      clearTimer();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", finish, true);
      document.removeEventListener("pointercancel", finish, true);
      if (!dragging) { start = null; return; }
      dragging = false;
      const x = ev && ev.clientX, y = ev && ev.clientY;
      const node = (x != null && y != null) ? document.elementFromPoint(x, y) : null;
      const zone = node && node.closest && node.closest(".hs-player .zone");
      const targetEl = node && node.closest && (node.closest(".board-card[data-minion]") || node.closest("#opponent-hero") || node.closest("#player-hero"));
      card.classList.remove("mobile-dragging", "selected", "mobile-gold");
      clearCardDropHints();
      app.suppressClick = Date.now() + 700;
      try {
        if (def.type === "minion" || def.type === "formation") {
          if (zone) onDropCardToZone(zone.dataset.zoneKey);
          else renderGame();
        } else if (targetEl) {
          const targetUid = targetEl.dataset && targetEl.dataset.minion ? targetEl.dataset.minion : "hero";
          commitPlay(instance.uid, targetUid, null);
        } else {
          const opt = E.getPlayOptions(app.game, app.game.current, instance.uid);
          if (opt.ok && !opt.targetType) commitPlay(instance.uid, null, null);
          else renderGame();
        }
      } catch (e) {
        renderGame();
      } finally {
        app.draggingUid = null;
        clearCardDropHints();
      }
      start = null;
    };
    card.addEventListener("pointerdown", (ev) => {
      if (ev.pointerType === "mouse" || ev.button !== 0 || card.classList.contains("disabled")) return;
      start = { x: ev.clientX, y: ev.clientY };
      document.addEventListener("pointermove", move, { passive: false });
      document.addEventListener("pointerup", finish, true);
      document.addEventListener("pointercancel", finish, true);
      timer = setTimeout(() => {
        if (!start) return;
        dragging = true;
        app.suppressClick = Date.now() + 1400;
        hideSimpleCardPreview();
        app.draggingUid = instance.uid;
        app.selectedCard = instance.uid;
        app.targetInfo = null;
        app.zoneSelect = null;
        app.attacker = null;
        card.classList.add("mobile-dragging", "selected");
        showCardDropHints(instance.uid, def, def.type === "minion" || def.type === "formation" ? "拖拽到此处释放" : "拖到目标上释放");
        if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
      }, 420);
    });
    card.addEventListener("pointermove", (ev) => {
      if (!start || dragging) return;
      if (Math.abs(ev.clientX - start.x) > 12 || Math.abs(ev.clientY - start.y) > 12) { clearTimer(); start = null; }
    });
  }

  function attachMobilePreview(card, def, minion, instance) {
    if (instance && isPhoneLayout() && app.handPlayMode === "drag" && !card.classList.contains("disabled")) {
      attachMobileDrag(card, def, instance);
      return;
    }
    card.addEventListener("contextmenu", (ev) => { if (isPhoneLayout()) ev.preventDefault(); });
    let timer = null;
    let start = null;
    let fired = false;
    const clearTimer = () => { if (timer) { clearTimeout(timer); timer = null; } };
    const hideHeldPreview = () => {
      if (fired) {
        hideMobileCardSheet();
        app.suppressClick = Math.max(app.suppressClick || 0, Date.now() + 450);
      }
      fired = false;
    };
    const onDocumentMove = (ev) => {
      if (!start) return;
      if (Math.abs(ev.clientX - start.x) > 14 || Math.abs(ev.clientY - start.y) > 14) {
        clearTimer();
        hideHeldPreview();
        start = null;
      }
    };
    const onDocumentUp = () => {
      clearTimer();
      start = null;
      document.removeEventListener("pointermove", onDocumentMove);
    };
    card.addEventListener("pointerdown", (ev) => {
      if (ev.pointerType === "mouse" || ev.button !== 0) return;
      fired = false;
      start = { x: ev.clientX, y: ev.clientY };
      document.addEventListener("pointermove", onDocumentMove, { passive: true });
      document.addEventListener("pointerup", onDocumentUp, { once: true });
      document.addEventListener("pointercancel", onDocumentUp, { once: true });
      timer = setTimeout(() => {
        if (!start) return;
        fired = true;
        app.suppressClick = Date.now() + 1100;
        hideSimpleCardPreview();
        showMobileCard(def, minion);
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
      }, 420);
    });
    card.addEventListener("pointercancel", () => { start = null; clearTimer(); hideHeldPreview(); });
  }

  function showDeckHover(def, anchor) {
    const tip = $("deck-hover-tip");
    if (!tip || !anchor) return;
    clear(tip);
    tip.appendChild(el("strong", null, def.name));
    tip.appendChild(el("small", null, typeLine(def) + " · " + def.cost + " 行动力" + (def.type === "minion" ? " · " + def.attack + "/" + def.health : "") + " · " + factionName(def.faction)));
    tip.appendChild(el("p", null, def.text || "没有额外效果。"));
    if (def.flavor) tip.appendChild(el("em", null, "“" + def.flavor + "”"));
    tip.hidden = false;
    const r = anchor.getBoundingClientRect();
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    let top = r.top - h - 10;
    if (top < 8) top = Math.min(window.innerHeight - h - 8, r.bottom + 10);
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }
  function hideDeckHover() {
    const tip = $("deck-hover-tip");
    if (tip) tip.hidden = true;
  }

  let previewHideTimer = null;
  function keepPreviewOpen() {
    clearTimeout(previewHideTimer);
    const box = $("card-preview");
    if (box) box.hidden = false;
  }

  function showPreview(def, minion) {
    const box = $("card-preview");
    if (!box) return;
    clearTimeout(previewHideTimer);
    box.hidden = false;
    clear(box);
    const title = el("h4", null, def.name);
    const meta = el("div", "preview-meta", typeLine(def) + " · " + (RARITY_NAMES[def.rarity] || "普通") + " · " + def.cost + " 行动力" + (def.type === "minion" ? " · " + (minion ? minion.attack + "/" + minion.health : def.attack + "/" + def.health) : "") + " · " + factionName(def.faction));
    box.appendChild(title);
    box.appendChild(meta);
    addKeywordChips(box, def, minion);
    const art = el("div", "preview-art");
    const previewCustomArt = customCardArtFor(def.id);
    if (previewCustomArt) { art.style.backgroundImage = "url('" + previewCustomArt + "')"; art.classList.add("has-custom-art"); }
    else if (def.art) art.style.backgroundImage = "url('" + portraitImage(def.art) + "')";
    else {
      art.classList.add("placeholder");
      art.style.display = "grid";
      art.style.placeItems = "center";
      art.textContent = factionIcon(def.faction);
      art.style.fontSize = "44px";
      art.style.color = "rgba(233,225,210,0.25)";
      art.style.backgroundImage = genericArtStyle(def);
      addGenericGlyph(art, def);
      addGeneratedArt(art, def);
    }
    box.appendChild(art);
    box.appendChild(el("div", "preview-text", def.text || "—"));
    const keywordHelp = cardKeywordHelpNode(def);
    if (keywordHelp) box.appendChild(keywordHelp);
  }
  function hidePreview() {
    clearTimeout(previewHideTimer);
    const box = $("card-preview");
    if (box) box.hidden = true;
  }

  function hidePreviewNow() {
    clearTimeout(previewHideTimer);
    const box = $("card-preview");
    if (box) box.hidden = true;
  }

  /* ===== toast ===== */
  /* ===== toast / in-game inline warnings ===== */
  let toastTimer = null;
  let hintWarnTimer = null;
  function clearToast() {
    const t = $("toast");
    if (!t) return;
    clearTimeout(toastTimer);
    t.classList.remove("show");
    t.textContent = "";
  }
  function gameWarn(text) {
    const hint = $("game-hint");
    if (hint) {
      hint.textContent = text;
      hint.classList.add("hint-warn");
      clearTimeout(hintWarnTimer);
      hintWarnTimer = setTimeout(() => {
        hint.classList.remove("hint-warn");
        if (hint.textContent === text) hint.textContent = "点击或拖动卡牌；点击我方随从攻击。";
      }, 1600);
    }
    const anchor = document.querySelector(".hand-card.selected, .board-card.selected, #player-hero");
    if (anchor) {
      anchor.classList.remove("invalid-shake");
      void anchor.offsetWidth;
      anchor.classList.add("invalid-shake");
      setTimeout(() => anchor.classList.remove("invalid-shake"), 360);
    }
    const mini = $("log-mini");
    if (mini) {
      mini.classList.add("log-warn");
      setTimeout(() => mini.classList.remove("log-warn"), 900);
    }
    flashScreen("invalid");
  }
  function toast(text) {
    // 对局中不再弹底部 toast：常规错误走局部抖动 + 顶部日志条，避免打断操作。
    if (app.screen === "game" && app.game && app.game.status === "playing") {
      gameWarn(text);
      return;
    }
    const t = $("toast");
    if (!t) return;
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1900);
  }
  function showMobileWelcome() {
    const box = $("mobile-welcome");
    if (!box || app.mobileWelcomeShown) return;
    app.mobileWelcomeShown = true;
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("show"));
  }
  function hideMobileWelcome() {
    const box = $("mobile-welcome");
    if (!box) return;
    box.classList.remove("show");
    setTimeout(() => { box.hidden = true; }, 220);
  }

  /* ===== simulation ===== */
  function runSimulation(total) {
    if (app.simRunning) return;
    app.simRunning = true;
    const buttons = document.querySelectorAll(".sim-run");
    buttons.forEach((b) => b.disabled = true);
    $("sim-progress").style.width = "0%";
    $("sim-progress-text").textContent = "推演中… 0 / " + total;
    $("sim-verdict").textContent = "正在让 AI 互相对打…";
    const stats = { games: 0, pus: 0, xz: 0, draw: 0, stall: 0, rounds: 0, peak: 0, t4: 0, t7: 0, t10: 0, t10games: 0, firstWins: 0, firstGames: 0 };
    let i = 0;
    const chunk = 20;
    function step() {
      const end = Math.min(i + chunk, total);
      for (; i < end; i++) {
        const result = AI.autoPlayGame({
          faction1: "pus",
          faction2: "xizhao",
          seed: 100000 + i * 7919,
          mode: "sim",
          p1AI: true,
          p2AI: true
        });
        const s = result.state;
        stats.games++;
        stats.rounds += s.round;
        stats.peak += s.stats.veinPeak || 0;
        stats.t4 += s.stats.thresholds[4] || 0;
        stats.t7 += s.stats.thresholds[7] || 0;
        stats.t10 += s.stats.thresholds[10] || 0;
        if ((s.stats.thresholds[10] || 0) > 0) stats.t10games++;
        if (s.status !== "gameover") stats.stall++;
        else if (s.winner === 0) stats.pus++;
        else if (s.winner === 1) stats.xz++;
        else stats.draw++;
        if (s.status === "gameover" && s.winner != null) {
          stats.firstGames++;
          if (s.winner === s.stats.firstPlayer) stats.firstWins++;
        }
      }
      const pct = i / total;
      $("sim-progress").style.width = Math.round(pct * 100) + "%";
      $("sim-progress-text").textContent = "推演中… " + i + " / " + total;
      updateSimDisplay(stats, total, false);
      if (i < total) {
        setTimeout(step, 0);
      } else {
        app.simRunning = false;
        buttons.forEach((b) => b.disabled = false);
        $("sim-progress-text").textContent = "完成 · " + total + " 局（种子可复现）";
        updateSimDisplay(stats, total, true);
      }
    }
    step();
  }

  function updateSimDisplay(stats, total, final) {
    const n = stats.games || 1;
    const pusPct = stats.pus / n * 100;
    const xzPct = stats.xz / n * 100;
    const firstPct = stats.firstGames ? stats.firstWins / stats.firstGames * 100 : 0;
    const avgRounds = stats.rounds / n;
    const avgPeak = stats.peak / n;
    const avg4 = stats.t4 / n;
    const avg7 = stats.t7 / n;
    const avg10 = stats.t10 / n;
    const t10Rate = stats.t10games / n * 100;
    $("stat-games").textContent = String(stats.games);
    $("stat-pus").textContent = pusPct.toFixed(1) + "%";
    $("stat-xz").textContent = xzPct.toFixed(1) + "%";
    $("stat-first").textContent = firstPct ? firstPct.toFixed(1) + "%" : "—";
    $("stat-rounds").textContent = avgRounds.toFixed(1);
    $("stat-peak").textContent = avgPeak.toFixed(1);
    $("stat-thresholds").textContent = avg4.toFixed(1) + " / " + avg7.toFixed(1) + " / " + avg10.toFixed(1);
    $("stat-draw").textContent = stats.draw + " / " + stats.stall;
    const tbody = $("sim-table-body");
    clear(tbody);
    const rows = [
      ["先手胜率", firstPct ? firstPct.toFixed(1) + "%" : "—", "48%～52%", firstPct >= 48 && firstPct <= 52],
      ["阵营胜率", "普 " + pusPct.toFixed(1) + "% / 西 " + xzPct.toFixed(1) + "%", "各 45%～55%", pusPct >= 45 && pusPct <= 55 && xzPct >= 45 && xzPct <= 55],
      ["平均轮数", avgRounds.toFixed(1), "8～12 轮", avgRounds >= 8 && avgRounds <= 12],
      ["流脉 10 触发率", t10Rate.toFixed(1) + "%", "30%～60%", t10Rate >= 30 && t10Rate <= 60],
      ["卡死 / 平局", stats.stall + " / " + stats.draw, "0 / 0", stats.stall === 0 && stats.draw === 0]
    ];
    for (const row of rows) {
      const tr = document.createElement("tr");
      tr.appendChild(el("td", null, row[0]));
      const val = el("td", null, row[1]);
      if (row[3]) val.style.color = "#8dd6a4";
      tr.appendChild(val);
      tr.appendChild(el("td", "muted", row[2]));
      tbody.appendChild(tr);
    }
    if (final) {
      const issues = [];
      if (!(firstPct >= 48 && firstPct <= 52)) issues.push("先手" + (firstPct > 52 ? "偏强" : "偏弱"));
      if (!(pusPct >= 45 && pusPct <= 55)) issues.push("阵营胜率超出区间");
      if (!(avgRounds >= 8 && avgRounds <= 12)) issues.push("节奏偏" + (avgRounds > 12 ? "慢" : "快"));
      if (!(t10Rate >= 30 && t10Rate <= 60)) issues.push("魔物潮触发率" + (t10Rate > 60 ? "过高" : "过低"));
      if (stats.stall) issues.push("出现卡死");
      $("sim-verdict").textContent = issues.length ? "读数：" + issues.join("；") + "。先记录，再调整。" : "读数：先手、阵营、节奏和流脉触发都在测试目标内。可以进入真人试玩。";
    }
  }

  const PROFILE_AVATARS = [
    { id: "gk", name: "档案徽记", glyph: "GK" },
    ...D.FACTION_IDS.map(id => ({ id: id, name: D.FACTIONS[id].name, emblem: D.FACTIONS[id].emblem })),
    { id: "neutral", name: "无主旅人", glyph: "旅" },
    { id: "dawn", name: "晨曦记录者", glyph: "晨" },
    { id: "dusk", name: "暮色抄写员", glyph: "暮" },
    { id: "mask", name: "无名面具", glyph: "隐" },
    { id: "ember", name: "余烬旅人", glyph: "烬" }
  ];
  const PROFILE_TITLES = [
    { id: "archivist", name: "档案员", desc: "默认称号", test: () => true },
    { id: "first_ink", name: "第一次落笔", desc: "解锁成就「第一次落笔」", test: () => !!(app.achievements && app.achievements.first_win && app.achievements.first_win.unlocked) },
    { id: "tide_walker", name: "踏潮者", desc: "在一局中触发流脉 10", test: () => !!(app.achievements && app.achievements.tide_10 && app.achievements.tide_10.unlocked) },
    { id: "archive_regular", name: "档案常客", desc: "完成 10 局推演", test: () => !!(app.achievements && app.achievements.play_10 && app.achievements.play_10.unlocked) },
    { id: "gold_vein", name: "黄金执脉者", desc: "排位达到黄金", test: () => ((app.profile && app.profile.rankPoints) || 0) >= 600 },
    { id: "grey_traveler", name: "灰港旅人", desc: "使用灰港赢得 3 局", test: () => ((((app.profile || {}).byFaction || {}).greyharbor || {}).wins || 0) >= 3 },
    { id: "academy_listener", name: "学院旁听生", desc: "使用学院赢得 3 局", test: () => ((((app.profile || {}).byFaction || {}).academy || {}).wins || 0) >= 3 },
    { id: "ten_rounds", name: "十局档案员", desc: "完成 10 局推演", test: () => ((app.profile && app.profile.games) || 0) >= 10 },
    { id: "eightfold", name: "八阵收集者", desc: "八阵营各赢 1 局", test: () => D.FACTION_IDS.every(id => ((((app.profile || {}).byFaction || {})[id] || {}).wins || 0) >= 1) },
    { id: "snowbound", name: "霜页旅人", desc: "使用雪都赢得 3 局", test: () => ((((app.profile || {}).byFaction || {}).snow || {}).wins || 0) >= 3 },
    { id: "iron_oath", name: "铁誓见证者", desc: "使用帝国赢得 3 局", test: () => ((((app.profile || {}).byFaction || {}).empire || {}).wins || 0) >= 3 }
  ];
  const PROFILE_CARD_BACKS = [
    { id: "classic", name: "档案原版", color: "#173b3a", glyph: "GK" },
    { id: "pus", name: "普卫岛 · 潮雾", color: "#306f72", glyph: "潮" },
    { id: "academy", name: "学院 · 霜纹", color: "#2f4d78", glyph: "书" },
    { id: "xizhao", name: "西昭 · 血契", color: "#5c2024", glyph: "血" },
    { id: "republic", name: "共和国 · 铁誓", color: "#4a506f", glyph: "誓" },
    { id: "empire", name: "帝国 · 铁序", color: "#4e3a2a", glyph: "序" },
    { id: "greyharbor", name: "灰港 · 账本", color: "#2f4b3d", glyph: "账" },
    { id: "snow", name: "雪都 · 极光", color: "#2f5f78", glyph: "霜" },
    { id: "losutai", name: "洛斯汰 · 潮纹", color: "#245c54", glyph: "潮" },
    { id: "neutral", name: "无主 · 旅印", color: "#4b4438", glyph: "旅" },
    { id: "gold", name: "黄金档案", color: "#6d5125", glyph: "金" }
  ];
  const PROFILE_AVATAR_FRAMES = [
    { id: "none", name: "无框", color: "rgba(159,207,196,.25)" },
    { id: "gold", name: "档案金", color: "#d9a441" },
    { id: "vein", name: "流脉青", color: "#5fd3c4" },
    { id: "frost", name: "霜纹蓝", color: "#78b9dc" },
    { id: "blood", name: "血契红", color: "#c0504d" },
    { id: "iron", name: "铁序灰", color: "#8f9aa4" },
    { id: "pulse", name: "流脉脉冲", color: "#5fd3c4" }
  ];
  const PROFILE_NAME_COLORS = [
    { id: "ink", name: "档案白", color: "#e9e1d2" },
    { id: "gold", name: "黄金", color: "#f2c66d" },
    { id: "vein", name: "流脉", color: "#79e0d2" },
    { id: "frost", name: "霜蓝", color: "#9bd2ee" },
    { id: "blood", name: "血契", color: "#e58b87" },
    { id: "grey", name: "灰烬", color: "#aab3b8" }
  ];
  const PROFILE_TITLE_PLATES = [
    { id: "none", name: "无底板" },
    { id: "gold", name: "金线" },
    { id: "vein", name: "流脉纹" },
    { id: "frost", name: "霜纹" },
    { id: "blood", name: "血契" }
  ];
  const PROFILE_TABLE_THEMES = [
    { id: "archive", name: "档案原版", tint: "rgba(95,211,196,.10)" },
    { id: "pus", name: "普卫潮雾", tint: "rgba(74,183,177,.20)" },
    { id: "academy", name: "学院霜纹", tint: "rgba(92,154,206,.20)" },
    { id: "snow", name: "雪都极光", tint: "rgba(132,210,224,.20)" },
    { id: "greyharbor", name: "灰港账本", tint: "rgba(111,157,122,.18)" }
  ];
  const PROFILE_CARD_FRAMES = [
    { id: "none", name: "原版", color: "rgba(159,207,196,.18)" },
    { id: "gold", name: "金线", color: "#d9a441" },
    { id: "vein", name: "流脉", color: "#5fd3c4" },
    { id: "frost", name: "霜纹", color: "#78b9dc" },
    { id: "blood", name: "血契", color: "#c0504d" },
    { id: "iron", name: "铁序", color: "#8f9aa4" }
  ];

  function profileTitleName(id) {
    const t = PROFILE_TITLES.find(x => x.id === id) || PROFILE_TITLES[0];
    return t.name;
  }
  function cardBackDefinition(id) {
    return PROFILE_CARD_BACKS.find(x => x.id === id) || PROFILE_CARD_BACKS[0];
  }
  function cardBackUrlFor(id) {
    if (id === "classic") return "assets/ui/card_back.svg";
    const b = cardBackDefinition(id);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><defs><pattern id="p" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0h22v22H0z" fill="' + b.color + '"/><path d="M0 0h1v22H0zM11 0h1v22h-1z" fill="rgba(255,255,255,.14)"/></pattern></defs><rect width="200" height="300" fill="#07120f"/><rect x="5" y="5" width="190" height="290" rx="8" fill="url(#p)" stroke="' + b.color + '" stroke-width="2"/><rect x="16" y="16" width="168" height="268" rx="4" fill="none" stroke="rgba(242,198,109,.55)"/><circle cx="100" cy="150" r="38" fill="rgba(3,12,12,.62)" stroke="rgba(242,198,109,.7)"/><text x="100" y="162" font-family="serif" font-size="38" text-anchor="middle" fill="#f0d29a">' + b.glyph + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function cardBackUrl() {
    const id = (app.account && app.account.cardBack) || "classic";
    if (id === "classic") return "assets/ui/card_back.svg";
    const b = cardBackDefinition(id);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><defs><pattern id="p" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0h22v22H0z" fill="' + b.color + '"/><path d="M0 0h1v22H0zM11 0h1v22h-1z" fill="rgba(255,255,255,.14)"/></pattern></defs><rect width="200" height="300" fill="#07120f"/><rect x="5" y="5" width="190" height="290" rx="8" fill="url(#p)" stroke="' + b.color + '" stroke-width="2"/><rect x="16" y="16" width="168" height="268" rx="4" fill="none" stroke="rgba(242,198,109,.55)"/><circle cx="100" cy="150" r="38" fill="rgba(3,12,12,.62)" stroke="rgba(242,198,109,.7)"/><text x="100" y="162" font-family="serif" font-size="38" text-anchor="middle" fill="#f0d29a">' + b.glyph + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function saveAccountCosmetics() {
    try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(app.account)); } catch (e) {}
    snapshotSave("cosmetics");
  }
  function applyProfileCosmetics() {
    document.documentElement.style.setProperty("--card-back-image", "url('" + cardBackUrl() + "')");
    const account = ensureAccount();
    document.body.dataset.tableTheme = account.tableTheme || "archive";
    document.body.dataset.cardFrame = account.cardFrame || "none";
    updateHomeAccount();
  }
  function accountDisplayName() {
    try { return (app.account && app.account.name) ? String(app.account.name).slice(0, 24) : "档案员"; } catch (e) { return "档案员"; }
  }

  function confirmExit() {
    if (!app.game || app.game.status === "gameover") { leaveGame(); return; }
    const wasBusy = app.busy;
    app.busy = true;
    openModal((content) => {
      const online = !!(app.net && app.net.active);
      content.appendChild(el("div", "eyebrow", online ? "离开在线对局" : "离开推演"));
      content.appendChild(el("h3", null, online ? "离开在线对局？" : "退出当前推演？"));
      content.appendChild(el("p", null, online ? "直接退出会让对手空等，对对手不负责。建议先认输，再离开。" : "当前对局不会写入档案。"));
      const actions = el("div", "modal-actions");
      const cancel = el("button", "btn btn-ghost", "继续对局");
      cancel.onclick = () => {
        closeModal(true);
        app.busy = wasBusy;
        renderGame();
      };
      if (online) {
        const concede = el("button", "btn btn-primary", "认输并退出");
        concede.onclick = () => {
          closeModal(true);
          doConcede();
          setTimeout(() => leaveGame(), 550);
        };
        actions.appendChild(cancel);
        actions.appendChild(concede);
      } else {
        const leave = el("button", "btn btn-primary", "退出推演");
        leave.onclick = () => { closeModal(true); leaveGame(); };
        actions.appendChild(cancel);
        actions.appendChild(leave);
      }
      content.appendChild(actions);
    });
  }

  /* ===== 档案编成 ===== */
  const DECK_STORAGE_KEY = "gok_custom_decks_v1";
  const DECK_LIBRARY_KEY = "gok_deck_library_v1";
  const RELIC_STORAGE_KEY = "gok_active_relics_v1";
  const LEGACY_DECK_KEY = "gok_legacy_decks_v1";
  const ACCOUNT_KEY = "gok_account_v1";
  const GUEST_KEY = "gok_guest_choice_v1";
  const ACCOUNT_NAMED_KEY = "gok_account_named_v1";
  const SAVE_BACKUP_KEY = "gok_save_backup_v1";
  let saveBackupTimer = null;

  function ensureAccount() {
    if (app.account && app.account.id) return app.account;
    let account = null;
    try { account = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null"); } catch (e) {}
    const isNewAccount = !account || !account.id;
    if (!account || !account.id) {
      account = { id: "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36), name: "档案员", avatar: "gk", title: "archivist", cardBack: "classic", createdAt: Date.now() };
      try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account)); } catch (e) {}
    }
    normalizeAccountProgression(account, isNewAccount);
    account.avatar = account.avatar || "gk";
    account.title = account.title || "archivist";
    account.cardBack = account.cardBack || "classic";
    account.avatarFrame = account.avatarFrame || "none";
    account.customAvatar = typeof account.customAvatar === "string" ? account.customAvatar : "";
    account.nameColor = account.nameColor || "ink";
    account.titlePlate = account.titlePlate || "none";
    account.signature = typeof account.signature === "string" ? account.signature.slice(0, 24) : "";
    account.badges = Array.isArray(account.badges) ? account.badges.slice(0, 3) : [];
    account.tableTheme = account.tableTheme || "archive";
    account.cardFrame = account.cardFrame || "none";
    app.account = account;
    if (account.name && account.name !== "档案员") { try { localStorage.setItem(ACCOUNT_NAMED_KEY, "1"); } catch (e) {} }
    try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account)); } catch (e) {}
    return account;
  }

  /* ===== account progression: tasks, levels, legendary collection ===== */
  const LEVEL_MAX = 30;
  const FEATURE_LEVELS = { hard: 2, lab: 3, other: 4, nightmare: 5, deckedit: 5, multideck: 7, customize: 8 };
  const FEATURE_LABELS = { hard: "困难 AI", lab: "疯狂实验", other: "其他模式", nightmare: "噩梦 AI", deckedit: "组卡与命名", multideck: "多套牌组", customize: "档案个性化" };
  function featureLabel(key) { return FEATURE_LABELS[key] || key; }
  const DAILY_TASKS = [
    { id: "play", name: "完成 1 场对局", key: "play", target: 1, xp: 50 },
    { id: "win", name: "赢得 1 场对局", key: "win", target: 1, xp: 60 },
    { id: "cards", name: "打出 8 张牌", key: "cards", target: 8, xp: 40 }
  ];
  const WEEKLY_TASKS = [
    { id: "wins", name: "赢得 3 场对局", key: "wins", target: 3, xp: 160 },
    { id: "factions", name: "使用 3 个不同阵营", key: "factions", target: 3, xp: 120 },
    { id: "games", name: "完成 5 场对局", key: "games", target: 5, xp: 150 }
  ];
  const MAIN_TASKS = [
    { id: "tutorial", chapter: 1, name: "完成新手教程", xp: 100 },
    { id: "codex_open", chapter: 1, name: "打开一次卡牌图鉴", xp: 50 },
    { id: "first_game", chapter: 1, name: "完成第一场推演", xp: 100 },
    { id: "first_win", chapter: 1, name: "赢得第一场胜利", xp: 120 },
    { id: "mulligan", chapter: 2, name: "完成一次起手调度", xp: 80 },
    { id: "vein4", chapter: 2, name: "触发一次流脉 4", xp: 100 },
    { id: "deck_saved", chapter: 3, name: "保存并命名第一套自定义牌组", xp: 150 },
    { id: "custom_deck_play", chapter: 3, name: "用自定义牌组完成一局", xp: 150 }
  ];
  const MAIN_CHAPTERS = {
    1: { name: "初入档案", desc: "学会走完一场完整推演" },
    2: { name: "流脉与阵位", desc: "理解站位、守备与流脉" },
    3: { name: "自己组一套", desc: "30 张、品级、曲线与命名" },
    4: { name: "在线档案", desc: "账号、休闲与排位" }
  };
  const CHAPTER_REWARDS = { 1: { xp: 200, marks: 3 }, 2: { xp: 250, marks: 3 }, 3: { xp: 400, marks: 5 } };
  function chapterClaimed(ch) { return !!(ensureAccount().progress.chapterClaims && ensureAccount().progress.chapterClaims[ch]); }
  function claimChapterReward(ch, tasks) {
    const account = ensureAccount();
    if (!tasks.every(t => taskComplete("main", t))) { toast("先完成本章全部任务。"); return; }
    if (chapterClaimed(ch)) return;
    account.progress.chapterClaims = account.progress.chapterClaims || {};
    account.progress.chapterClaims[ch] = true;
    persistAccount();
    const reward = CHAPTER_REWARDS[ch] || { xp: 0, marks: 0 };
    if (reward.marks) grantAchievementMarks(reward.marks);
    addExperience(reward.xp);
    toast("第" + ["一","二","三"][ch-1] + "章奖励 · +" + reward.xp + " XP" + (reward.marks ? " · 印记 +" + reward.marks : ""));
    renderTasksPage();
  }

  function mainTaskUnlocked(task) {
    return !task.level || ensureAccount().progress.level >= task.level;
  }

  function levelNeed(level) {
    if (level >= LEVEL_MAX) return Infinity;
    return 100 + (level - 1) * 40;
  }

  function localDateKey() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function localWeekKey() {
    const d = new Date();
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((t - yearStart) / 86400000) + 1) / 7);
    return t.getUTCFullYear() + "-W" + String(week).padStart(2, "0");
  }

  function allLegendaryIds() {
    return Object.keys(D.CARDS).filter(id => {
      const c = D.CARDS[id];
      return c && c.type !== "token" && !c.token && !c.disabled && !c.experimental && !c.easterEgg && c.rarity === "legendary";
    });
  }

  function ownedLegendarySet() {
    const account = app.account || ensureAccount();
    return new Set(Array.isArray(account.legendaryOwned) ? account.legendaryOwned : []);
  }

  function isUnownedLegendaryCard(id) {
    const c = D.CARDS[id];
    if (!c || c.rarity !== "legendary" || c.easterEgg) return false;
    if (c.type === "equipment" || c.type === "relic" || c.type === "formation") return false;
    return !ownedLegendarySet().has(id);
  }

  function normalizeAccountProgression(account, isNewAccount) {
    let p = account.progress;
    if (!p || !Number.isFinite(Number(p.level))) {
      account.progress = {
        level: isNewAccount ? 1 : LEVEL_MAX,
        xp: 0,
        legacy: !isNewAccount,
        tasks: {}
      };
      if (!isNewAccount) account.legendaryOwned = allLegendaryIds();
      else if (!Array.isArray(account.legendaryOwned)) account.legendaryOwned = [];
      p = account.progress;
    }
    p.level = Math.max(1, Math.min(LEVEL_MAX, Number(p.level) || 1));
    p.xp = Math.max(0, Number(p.xp) || 0);
    if (p.level >= LEVEL_MAX) p.xp = 0;
    if (!Array.isArray(account.legendaryOwned)) {
      account.legendaryOwned = p.legacy ? allLegendaryIds() : [];
    }
    if (!Array.isArray(p.pendingRewards)) p.pendingRewards = [];
    if (!p.tutorials || typeof p.tutorials !== "object") p.tutorials = {};
    if (!p.chapterClaims || typeof p.chapterClaims !== "object") p.chapterClaims = {};
    if (!p.tasks || typeof p.tasks !== "object") p.tasks = {};
    const dk = localDateKey(), wk = localWeekKey();
    if (!p.tasks.daily || p.tasks.daily.key !== dk) p.tasks.daily = { key: dk, play: 0, win: 0, cards: 0, claimed: [], bonus: false };
    if (!p.tasks.weekly || p.tasks.weekly.key !== wk) p.tasks.weekly = { key: wk, wins: 0, factions: [], games: 0, claimed: [] };
    if (!p.tasks.daily.claimed) p.tasks.daily.claimed = [];
    if (!p.tasks.weekly.claimed) p.tasks.weekly.claimed = [];
    if (!p.tasks.weekly.factions) p.tasks.weekly.factions = [];
    if (!p.tasks.main || typeof p.tasks.main !== "object") p.tasks.main = { done: {}, claimed: [] };
    if (!p.tasks.main.done) p.tasks.main.done = {};
    if (!p.tasks.main.claimed) p.tasks.main.claimed = [];
  }

  function persistAccount() {
    try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(app.account || ensureAccount())); } catch (e) {}
    scheduleSaveBackup();
  }

  function syncTaskPeriods() {
    const account = ensureAccount();
    normalizeAccountProgression(account, false);
  }

  function markMainTask(id) {
    const account = ensureAccount();
    syncTaskPeriods();
    const main = account.progress.tasks.main;
    if (!main.done[id]) {
      main.done[id] = true;
      persistAccount();
    }
  }

  function taskProgress(period, task) {
    const t = ensureAccount().progress.tasks[period];
    if (period === "daily") return Number(t[task.key] || 0);
    if (period === "weekly") {
      if (task.key === "factions") return (t.factions || []).length;
      return Number(t[task.key] || 0);
    }
    if (period === "main") return ensureAccount().progress.tasks.main.done[task.id] ? 1 : 0;
    return 0;
  }

  function taskComplete(period, task) {
    return taskProgress(period, task) >= (task.target || 1);
  }

  function taskClaimed(period, task) {
    const t = ensureAccount().progress.tasks[period];
    return period === "main" ? t.claimed.indexOf(task.id) >= 0 : (t.claimed || []).indexOf(task.id) >= 0;
  }

  function grantLegendaryReward(level) {
    const account = ensureAccount();
    const owned = ownedLegendarySet();
    const pool = allLegendaryIds().filter(id => !owned.has(id));
    if (!pool.length) return null;
    const id = pool[Math.floor(Math.random() * pool.length)];
    account.legendaryOwned = Array.from(new Set([...(account.legendaryOwned || []), id]));
    persistAccount();
    return D.CARDS[id] || null;
  }

  function showLevelUp(level, cards) {
    const list = (cards || []).filter(Boolean);
    AudioBox.play("victory");
    toast("档案等级提升 · Lv." + level + "。到任务页选择阵营，领取 2 张传说。");
    if (typeof renderTasksIfOpen === "function") renderTasksIfOpen();
  }

  function updateHomeTaskWidget() {
    const node = $("home-task-next");
    if (!node) return;
    try {
      syncTaskPeriods();
      const pending = (ensureAccount().progress && ensureAccount().progress.pendingRewards) || [];
      const next = MAIN_TASKS.find(t => !taskClaimed("main", t));
      node.textContent = pending.length ? "升级奖励：选择阵营领取 " + pending.length * 2 + " 张传说" : (next ? "下一步：" + next.name : "主线任务已完成，继续推演吧");
    } catch (e) {}
  }

  const ONBOARDING_STEPS = [
    { target: "#btn-home-tasks", title: "先看任务", text: "按这里查看任务。主线任务会告诉你下一步做什么。" },
    { target: "#btn-deck-home", title: "查看卡组", text: "按这里查看构筑的卡组。1–4 级先用预组，5 级开始教你手动组卡。" },
    { target: "#btn-settings", title: "调整设置", text: "按这里调整设置。音量、画面和手牌操作都在这里。" },
    { target: "#home-classic", title: "开始推演", text: "从这里进入开始推演。规则与教程已经收进这里，进去后可以展开查看。" }
  ];

  function onboardingState() {
    const account = ensureAccount();
    if (!account.progress) account.progress = {};
    if (!account.progress.onboarding) account.progress.onboarding = { version: 1, step: 0, completed: false, skipped: false };
    return account.progress.onboarding;
  }

  function startOnboardingIfNeeded() {
    try { if (navigator.webdriver && localStorage.getItem("gok_force_onboarding") !== "1") return; } catch (e) {}
    const account = ensureAccount();
    const p = account.progress || {};
    const state = onboardingState();
    if (p.level !== 1 || state.completed || state.skipped) { removeOnboardingCoach(); return; }
    if (app.screen !== "home") return;
    renderOnboardingCoach();
  }

  function removeOnboardingCoach() {
    document.querySelectorAll(".onboarding-coach,.onboarding-highlight").forEach(x => x.classList.remove("onboarding-coach", "onboarding-highlight"));
    const coach = $("onboarding-coach"); if (coach) coach.remove();
    document.querySelectorAll(".onboarding-target").forEach(x => { if (x._onboardingAdvance) { x.removeEventListener("click", x._onboardingAdvance); delete x._onboardingAdvance; } x.classList.remove("onboarding-target"); });
  }

  function renderOnboardingCoach() {
    removeOnboardingCoach();
    const state = onboardingState();
    const step = ONBOARDING_STEPS[Math.min(state.step, ONBOARDING_STEPS.length - 1)];
    const target = document.querySelector(step.target);
    if (target) { target.classList.add("onboarding-target"); target.scrollIntoView({ block: "center", behavior: "smooth" }); }
    const coach = el("div", "onboarding-coach"); coach.id = "onboarding-coach";
    const head = el("div", "onboarding-coach-head");
    head.appendChild(el("span", "onboarding-kicker", "新手引导 " + (state.step + 1) + " / " + ONBOARDING_STEPS.length));
    const skip = el("button", "onboarding-skip", "暂时跳过"); skip.type = "button";
    skip.onclick = () => { state.skipped = true; persistAccount(); removeOnboardingCoach(); toast("可以随时在规则与教程里重看新手引导。"); };
    head.appendChild(skip); coach.appendChild(head);
    coach.appendChild(el("strong", null, step.title));
    coach.appendChild(el("p", null, step.text));
    const actions = el("div", "onboarding-actions");
    const advance = () => {
      if (state.completed || state.skipped) return;
      state.step += 1;
      if (state.step >= ONBOARDING_STEPS.length) {
        state.completed = true; persistAccount(); removeOnboardingCoach();
        toast("恭喜你完成新手引导。现在开始你的第一把推演吧。");
      } else {
        persistAccount();
        if (app.screen === "home") renderOnboardingCoach(); else removeOnboardingCoach();
      }
    };
    const next = el("button", "btn btn-small btn-primary", state.step >= ONBOARDING_STEPS.length - 1 ? "完成引导" : "下一步");
    next.onclick = advance;
    if (target) {
      if (target._onboardingAdvance) target.removeEventListener("click", target._onboardingAdvance);
      target._onboardingAdvance = () => setTimeout(advance, 220);
      target.addEventListener("click", target._onboardingAdvance, { once: true });
    }
    actions.appendChild(next);
    coach.appendChild(actions);
    document.body.appendChild(coach);
  }

  const TUTORIAL_LESSONS = [
    { id: "navigation", level: 1, title: "主页导航", desc: "认识任务、卡组、设置和教程。", xp: 60, body: ["先看任务：主线任务会告诉你下一步做什么。", "构筑卡组在 5 级前先使用官方预组；5 级后再手动编辑。", "推演设置里可以调整音量、画面与手牌操作。"] },
    { id: "zones", level: 2, title: "阵位与守备", desc: "每个阵位最多 3 个随从，全场最多 6 个。", xp: 70, body: ["守备随从会挡住同阵位的其他友方随从。", "先处理守备，才能直接攻击后面的随从或领袖。", "连携需要同阵位有另一个友方随从。"] },
    { id: "vein", level: 3, title: "流脉阈值", desc: "流脉是双方共享的风险条。", xp: 80, body: ["4 震荡、7 裂隙、10 魔物潮、12 回流。", "引脉只在流脉达到标注数字时触发。", "采掘会抽牌并同时加速流脉。"] },
    { id: "gear", level: 4, title: "装备与阵型", desc: "30 张牌里的特殊卡。", xp: 80, body: ["装备最多 2 件，装备后持续生效。", "阵型最多 3 张，挂在阵位上持续提供效果。", "先看牌组曲线，再决定装备和阵型的数量。"] },
    { id: "deck", level: 5, title: "组卡入门", desc: "30 张、曲线、品级与命名。", xp: 120, body: ["固定 30 张：主牌 + 2 件装备 + 最多 3 张阵型。", "2–3 费 8–12 张，4–5 费 8–10 张，6+ 费别太多。", "先自动构筑，再手动替换 3–5 张。", "用「已拥有」筛选，未拥有的传说不能加入。", "保存前给牌组起名字，准备阶段按名字选择。"] },
    { id: "curve", level: 6, title: "曲线与节奏", desc: "费用曲线决定你能不能每回合做点事。", xp: 90, body: ["低费太多会缺后期，高费太多会卡手。", "先保证 2–3 费有牌可出，再补高质量高费。", "不要只看单卡强度，先看整套牌能不能顺起来。"] },
    { id: "archetypes", level: 7, title: "流派与多牌组", desc: "每个阵营可以保存不同流派。", xp: 100, body: ["快攻、中速、控制、组合是四种基本方向。", "同一阵营可以保存多套牌组，按流派命名。", "准备阶段按牌组名选择，不要只留一个「自定义牌组」。"] },
    { id: "online", level: 10, title: "在线匹配与排位", desc: "登录账号后才能参加排位。", xp: 100, body: ["游客可以打休闲；排位需要登录账号。", "在线匹配页右侧显示当前段位和最近战绩。", "匹配成功后进入准备与对局，超时会进入 AI 替补。"] }
  ];

  function lessonCompleted(id) {
    const p = ensureAccount().progress;
    return !!(p.tutorials && p.tutorials[id]);
  }

  function openLessonPage(id, back) {
    app.currentLesson = id;
    app.lessonReturn = back || "tasks";
    AudioBox.play("ui_open");
    showScreen("lesson");
  }

  function renderLessonPage() {
    const root = $("lesson-page-root");
    if (!root) return;
    clear(root);
    const lesson = TUTORIAL_LESSONS.find(x => x.id === app.currentLesson) || TUTORIAL_LESSONS[0];
    const level = ensureAccount().progress.level;
    const title = $("lesson-title"); if (title) title.textContent = lesson.title;
    const card = el("div", "lesson-card");
    card.appendChild(el("div", "lesson-kicker", "LEVEL " + lesson.level + " · " + lesson.desc));
    card.appendChild(el("h3", null, lesson.title));
    if (level < lesson.level) {
      card.appendChild(el("p", "lesson-copy", "本课将在 Lv." + lesson.level + " 开放。当前 Lv." + level + "。"));
      const actions = el("div", "lesson-actions");
      const back = el("button", "btn btn-primary", "返回教程库"); back.onclick = () => showScreen("tasks");
      actions.appendChild(back); card.appendChild(actions); root.appendChild(card); return;
    }
    const objectives = el("div", "lesson-objectives");
    for (const line of lesson.body) objectives.appendChild(el("div", null, line));
    card.appendChild(objectives);
    const done = lessonCompleted(lesson.id);
    const actions = el("div", "lesson-actions");
    actions.appendChild(el("span", "lesson-progress", done ? "已完成 · +" + lesson.xp + " XP" : "完成奖励 +" + lesson.xp + " XP"));
    if (lesson.id === "deck") {
      const go = el("button", "btn btn-small btn-ghost", "去组卡"); go.onclick = () => openDeckBuilder(app.faction, "mode"); actions.appendChild(go);
    }
    const finish = el("button", "btn btn-primary " + (done ? "btn-ghost" : ""), done ? "已完成" : "完成本课");
    finish.disabled = done;
    finish.onclick = () => {
      const p = ensureAccount().progress;
      if (p.tutorials[lesson.id]) return;
      p.tutorials[lesson.id] = true;
      persistAccount();
      addExperience(lesson.xp);
      AudioBox.play("coin");
      toast("教程完成 · " + lesson.title + " · +" + lesson.xp + " XP");
      renderLessonPage();
    };
    actions.appendChild(finish);
    card.appendChild(actions);
    root.appendChild(card);
  }

  function openLevelRewardPage() {
    app.levelRewardChoice = null;
    AudioBox.play("ui_open");
    showScreen("levelup");
  }

  function levelRewardFactionCards(faction) {
    const owned = ownedLegendarySet();
    return allLegendaryIds().filter(id => D.CARDS[id] && D.CARDS[id].faction === faction && !owned.has(id)).slice(0, 2);
  }

  function renderLevelRewardPage() {
    const root = $("levelup-page-root");
    if (!root) return;
    clear(root);
    const account = ensureAccount();
    const pending = account.progress.pendingRewards || [];
    if (!pending.length) {
      const box = el("div", "levelup-section");
      box.appendChild(el("div", "eyebrow", "COLLECTION / ARCHIVE"));
      box.appendChild(el("h3", null, "暂时没有待领取的等级奖励"));
      box.appendChild(el("p", "muted", "完成对局、任务或教程升级后，这里会出现传说收藏奖励。"));
      const b = el("button", "btn btn-primary", "返回推演记录"); b.onclick = () => showScreen("tasks");
      box.appendChild(b); root.appendChild(box); return;
    }
    const reward = pending[0];
    const owned = ownedLegendarySet();
    const total = allLegendaryIds().length;
    const hero = el("div", "levelup-hero");
    const copy = el("div");
    copy.appendChild(el("div", "eyebrow", "LEVEL REWARD / Lv." + reward.level));
    copy.appendChild(el("h3", null, "选择你要收藏的阵营"));
    copy.appendChild(el("p", null, "从该阵营已解锁传说中抽取 2 张。选择后卡牌会收入档案，不会重复。"));
    hero.appendChild(copy);
    hero.appendChild(el("span", "levelup-collection", "收藏进度 " + owned.size + " / " + total));
    root.appendChild(hero);
    if (!app.levelRewardChoice) {
      const section = el("div", "levelup-section");
      section.appendChild(el("div", "panel-label", "选择阵营"));
      const grid = el("div", "levelup-factions");
      for (const faction of D.FACTION_IDS) {
        const fact = D.FACTIONS[faction];
        const cards = levelRewardFactionCards(faction);
        const b = el("button", "levelup-faction"); b.type = "button";
        b.style.setProperty("--faction-color", fact.color || "#f2c66d");
        const img = el("img"); img.src = fact.emblem; img.alt = ""; b.appendChild(img);
        const txt = el("span"); txt.appendChild(el("strong", null, fact.name)); txt.appendChild(el("small", null, cards.length ? "可抽取 " + cards.length + " 张未拥有" : "已收集完")); b.appendChild(txt);
        b.disabled = !cards.length;
        b.onclick = () => { app.levelRewardChoice = { faction, cards }; renderLevelRewardPage(); };
        grid.appendChild(b);
      }
      section.appendChild(grid); root.appendChild(section);
      return;
    }
    const choice = app.levelRewardChoice;
    const section = el("div", "levelup-section");
    section.appendChild(el("div", "panel-label", D.FACTIONS[choice.faction].name + " · 抽取结果"));
    const reveal = el("div", "levelup-reveal");
    for (const id of choice.cards) {
      const card = D.CARDS[id];
      const wrap = el("div", "reward-card");
      const inner = el("div", "reward-card-inner");
      const back = el("div", "reward-back", "GK");
      const face = el("div", "reward-face");
      const img = el("img"); img.src = cardArtUrl(card); img.alt = card.name; face.appendChild(img);
      face.appendChild(el("strong", null, card.name));
      face.appendChild(el("small", null, "传说 · " + D.FACTIONS[card.faction].name));
      face.appendChild(el("span", "reward-rarity", "收藏候选 · 点击收入档案"));
      inner.appendChild(back); inner.appendChild(face); wrap.appendChild(inner); reveal.appendChild(wrap);
      setTimeout(() => wrap.classList.add("revealed"), 150);
    }
    section.appendChild(reveal);
    root.appendChild(section);
    const actions = el("div", "levelup-reveal-actions");
    const reselect = el("button", "btn btn-small btn-ghost", "换一个阵营"); reselect.onclick = () => { app.levelRewardChoice = null; renderLevelRewardPage(); };
    const claim = el("button", "btn btn-primary", "收入档案");
    claim.onclick = () => {
      const nextOwned = new Set(account.legendaryOwned || []);
      for (const id of choice.cards) nextOwned.add(id);
      account.legendaryOwned = [...nextOwned];
      account.progress.pendingRewards.shift();
      app.levelRewardChoice = null;
      persistAccount(); updateHomeAccount(); updateHomeTaskWidget();
      AudioBox.play("coin");
      toast("传说卡已收入档案 · " + choice.cards.length + " 张");
      if (account.progress.pendingRewards.length) renderLevelRewardPage(); else showScreen("tasks");
    };
    actions.appendChild(reselect); actions.appendChild(claim); root.appendChild(actions);
  }

  function addExperience(amount) {
    const account = ensureAccount();
    normalizeAccountProgression(account, false);
    const p = account.progress;
    if (p.level >= LEVEL_MAX) { persistAccount(); return; }
    p.xp += Math.max(0, Number(amount) || 0);
    const gained = [];
    let lastLevel = p.level;
    while (p.level < LEVEL_MAX && p.xp >= levelNeed(p.level)) {
      p.xp -= levelNeed(p.level);
      p.level += 1;
      lastLevel = p.level;
      p.pendingRewards.push({ level: p.level, rolls: 2, createdAt: Date.now() });
    }
    if (p.level >= LEVEL_MAX) p.xp = 0;
    persistAccount();
    if (typeof updateHomeAccount === "function") updateHomeAccount();
    if (typeof updateHomeTaskWidget === "function") updateHomeTaskWidget();
    if (lastLevel < 5 && p.level >= 5) setTimeout(() => toast("新教程：组卡入门。到任务页看看如何组出第一套牌。"), 700);
    if (lastLevel < 7 && p.level >= 7) setTimeout(() => toast("多套牌组已解锁。每个阵营可以保存不同流派。"), 900);
    if (p.level > lastLevel) showLevelUp(p.level, []);
  }

  function recordGameProgress(state, win) {
    const account = ensureAccount();
    syncTaskPeriods();
    const p = account.progress;
    const d = p.tasks.daily, w = p.tasks.weekly, main = p.tasks.main;
    const me = state && state.players && state.players[app.human];
    const faction = me && me.faction;
    d.play += 1;
    if (win) d.win += 1;
    d.cards += Number(me && me.cardsPlayed || 0);
    w.games += 1;
    if (win) w.wins += 1;
    if (faction && w.factions.indexOf(faction) < 0) w.factions.push(faction);
    main.done.first_game = true;
    if (win) main.done.first_win = true;
    if (state && state.stats && state.stats.thresholds && (state.stats.thresholds[4] || 0) > 0) main.done.vein4 = true;
    if (main.done.deck_saved) main.done.custom_deck_play = true;
    if (app.lastUsedDeckId) {
      for (const faction of D.FACTION_IDS) {
        const deck = deckLibraryFor(faction).find(d => d.id === app.lastUsedDeckId);
        if (!deck) continue;
        deck.games = (deck.games || 0) + 1;
        if (win) deck.wins = (deck.wins || 0) + 1; else deck.losses = (deck.losses || 0) + 1;
        deck.updatedAt = Date.now(); persistDeckLibrary(); break;
      }
    }
    app.lastUsedDeckId = null;
    const firstWin = win && !main.done._firstWinXp;
    if (firstWin) main.done._firstWinXp = true;
    persistAccount();
    addExperience(win ? 30 : 15);
    if (firstWin) addExperience(120);
    if (typeof updateHomeAccount === "function") updateHomeAccount();
    if (typeof updateHomeTaskWidget === "function") updateHomeTaskWidget();
  }

  function claimTask(period, id) {
    const account = ensureAccount();
    syncTaskPeriods();
    const defs = period === "daily" ? DAILY_TASKS : period === "weekly" ? WEEKLY_TASKS : MAIN_TASKS;
    const task = defs.find(x => x.id === id);
    if (!task || taskClaimed(period, task) || !taskComplete(period, task)) return;
    const t = account.progress.tasks[period];
    t.claimed.push(task.id);
    let xp = task.xp || 0;
    if (period === "daily" && !t.bonus && DAILY_TASKS.every(x => t.claimed.indexOf(x.id) >= 0)) {
      t.bonus = true;
      xp += 30;
    }
    persistAccount();
    addExperience(xp);
    if (typeof renderTasksIfOpen === "function") renderTasksIfOpen();
    if (typeof updateHomeTaskWidget === "function") updateHomeTaskWidget();
    if (period === "daily" && t.bonus) toast("每日任务全清 · 额外 +30 XP");
  }

  function tasksModalNode(content) {
    const account = ensureAccount();
    syncTaskPeriods();
    const p = account.progress;
    const need = levelNeed(p.level);
    content.appendChild(el("div", "eyebrow", "档案任务 / 成长"));
    content.appendChild(el("h3", null, "Lv." + p.level + (p.level >= LEVEL_MAX ? " · 满级" : " · 档案经验")));
    const bar = el("div", "task-xp-bar");
    const fill = el("div", "task-xp-fill");
    fill.style.width = (p.level >= LEVEL_MAX ? 100 : Math.min(100, p.xp / need * 100)) + "%";
    bar.appendChild(fill);
    content.appendChild(bar);
    content.appendChild(el("p", "muted", p.level >= LEVEL_MAX ? "档案满级，全部功能已开放。" : "经验 " + p.xp + " / " + need + " · 升级赠送 2 张传说卡"));
    const nextUnlocks = Object.entries(FEATURE_LEVELS).filter(([, lv]) => lv === Math.min(LEVEL_MAX, p.level + 1)).map(([key]) => featureLabel(key));
    if (p.level < LEVEL_MAX && nextUnlocks.length) content.appendChild(el("p", "fine-print", "下一等级解锁：" + nextUnlocks.join("、")));
    const owned = ownedLegendarySet().size;
    content.appendChild(el("p", "fine-print", "传说收集 " + owned + " / " + allLegendaryIds().length + " · 普通/稀有/史诗与彩蛋卡已全部解锁"));

    const section = (title, period, defs) => {
      content.appendChild(el("h4", "task-section-title", title));
      for (const task of defs) {
        const done = taskComplete(period, task);
        const claimed = taskClaimed(period, task);
        const row = el("div", "task-row" + (done ? " done" : "") + (claimed ? " claimed" : ""));
        const copy = el("div", "task-copy");
        copy.appendChild(el("strong", null, task.name));
        const prog = taskProgress(period, task);
        copy.appendChild(el("span", null, done ? "已完成" : "进度 " + prog + " / " + (task.target || 1)));
        row.appendChild(copy);
        row.appendChild(el("span", "task-xp", "+" + (task.xp || 0) + " XP"));
        const btn = el("button", "btn btn-small " + (done && !claimed ? "btn-primary" : "btn-ghost"), claimed ? "已领取" : done ? "领取" : "进行中");
        btn.disabled = claimed || !done;
        btn.onclick = () => claimTask(period, task.id);
        row.appendChild(btn);
        content.appendChild(row);
      }
    };
    section("每日任务 · " + account.progress.tasks.daily.key, "daily", DAILY_TASKS);
    section("每周任务 · " + account.progress.tasks.weekly.key, "weekly", WEEKLY_TASKS);
    section("主线任务", "main", MAIN_TASKS);
    return null;
  }

  function renderTasksIfOpen() {
    if (app.screen === "tasks") renderTasksPage();
  }

  function openTasks(keep) {
    if (!keep) AudioBox.play("ui_open");
    showScreen("tasks");
  }

  function renderTasksPage() {
    const root = $("tasks-page-root");
    if (!root) return;
    clear(root);
    const account = ensureAccount();
    syncTaskPeriods();
    const p = account.progress;
    const need = levelNeed(p.level);
    const chip = $("tasks-level-chip"); if (chip) chip.textContent = p.level >= LEVEL_MAX ? "Lv.30 MAX" : "Lv." + p.level;
    const pendingRewards = (p.pendingRewards || []);
    if (pendingRewards.length) {
      const reward = el("div", "levelup-hero");
      const rc = el("div"); rc.appendChild(el("div", "eyebrow", "LEVEL REWARD")); rc.appendChild(el("h3", null, "有 " + pendingRewards.length + " 次传说收藏待领取")); rc.appendChild(el("p", null, "选择阵营后抽取 2 张该阵营未拥有的传说卡。")); reward.appendChild(rc);
      const go = el("button", "btn btn-primary", "选择阵营"); go.onclick = () => openLevelRewardPage(); reward.appendChild(go); root.appendChild(reward);
    }
    const top = el("div", "tasks-top");
    const head = el("div", "tasks-top-head");
    head.appendChild(el("strong", null, p.level >= LEVEL_MAX ? "档案满级" : "Lv." + p.level + " · 档案经验"));
    head.appendChild(el("small", null, p.level >= LEVEL_MAX ? "全部档案权限已开放" : "距离下一级还差 " + Math.max(0, need - p.xp) + " XP"));
    top.appendChild(head);
    const bar = el("div", "tasks-xp-bar"); const fill = el("i"); fill.style.width = (p.level >= LEVEL_MAX ? 100 : Math.min(100, p.xp / need * 100)) + "%"; bar.appendChild(fill); top.appendChild(bar);
    top.appendChild(el("p", "fine-print", p.level >= LEVEL_MAX ? "当前经验 " + p.xp + " · 满级" : "经验 " + p.xp + " / " + need + " · 主线任务经验更多"));
    root.appendChild(top);
    const tabs = el("div", "tasks-tabs");
    const tabDefs = [["main", "主线"], ["daily", "每日"], ["weekly", "每周"], ["tutorial", "教程"]];
    app.taskTab = app.taskTab || "main";
    for (const [key, label] of tabDefs) { const b = el("button", "tasks-tab" + (app.taskTab === key ? " active" : ""), label); b.onclick = () => { app.taskTab = key; renderTasksPage(); }; tabs.appendChild(b); }
    root.appendChild(tabs);
    if (app.taskTab === "tutorial") { renderTaskTutorialTab(root); return; }
    const defs = app.taskTab === "daily" ? DAILY_TASKS : app.taskTab === "weekly" ? WEEKLY_TASKS : MAIN_TASKS;
    if (app.taskTab === "main") {
      const chapters = [1,2,3];
      for (const ch of chapters) {
        const list = MAIN_TASKS.filter(t => (t.chapter || 1) === ch).map(t => Object.assign({ level: ch === 3 ? 5 : 1 }, t));
        if (!list.length) continue;
        const box = el("div", "task-chapter");
        const chHead = el("div", "task-chapter-head");
        chHead.appendChild(el("strong", null, "第" + ["一","二","三"][ch-1] + "章 · " + MAIN_CHAPTERS[ch].name));
        chHead.appendChild(el("small", null, MAIN_CHAPTERS[ch].desc));
        box.appendChild(chHead);
        for (const task of list) {
          const locked = ch === 3 && p.level < 5;
          const done = taskComplete("main", task) && !locked; const claimed = taskClaimed("main", task); const prog = taskProgress("main", task);
          const row = el("div", "task-row" + (done ? " done" : "") + (done && !claimed ? " claim" : ""));
          row.appendChild(el("span", "task-mark", claimed ? "✓" : done ? "!" : locked ? "锁" : "·"));
          const copy = el("div"); copy.appendChild(el("strong", null, task.name)); copy.appendChild(el("small", null, locked ? "Lv.5 开放" : done ? "已完成，可领取" : "进度 " + prog + " / " + (task.target || 1))); row.appendChild(copy);
          row.appendChild(el("span", "task-xp", "+" + (task.xp || 0) + " XP"));
          const btn = el("button", "btn btn-small " + (done && !claimed ? "btn-primary" : "btn-ghost"), claimed ? "已领取" : locked ? "未开放" : done ? "领取" : "进行中"); btn.disabled = claimed || !done || locked; btn.onclick = () => claimTask("main", task.id); row.appendChild(btn);
          box.appendChild(row);
        }
        const foot = el("div", "task-chapter-foot");
        const reward = CHAPTER_REWARDS[ch] || { xp: 0, marks: 0 };
        const allDone = list.every(t => taskClaimed("main", t));
        foot.appendChild(el("span", null, chapterClaimed(ch) ? "章节奖励已领取" : "章节奖励 +" + reward.xp + " XP" + (reward.marks ? " +" + reward.marks + " 印记" : "")));
        const chapterBtn = el("button", "btn btn-small " + (allDone && !chapterClaimed(ch) ? "btn-primary" : "btn-ghost"), chapterClaimed(ch) ? "已领取" : allDone ? "领取章节奖励" : "完成本章任务");
        chapterBtn.disabled = !allDone || chapterClaimed(ch);
        chapterBtn.onclick = () => claimChapterReward(ch, list);
        foot.appendChild(chapterBtn); box.appendChild(foot);
        root.appendChild(box);
      }
    } else {
      const box = el("div", "task-chapter");
      const label = app.taskTab === "daily" ? "每日任务 · " + p.tasks.daily.key : "每周任务 · " + p.tasks.weekly.key;
      box.appendChild(el("div", "task-chapter-head")).appendChild(el("strong", null, label));
      for (const task of defs) {
        const done = taskComplete(app.taskTab, task); const claimed = taskClaimed(app.taskTab, task); const prog = taskProgress(app.taskTab, task);
        const row = el("div", "task-row" + (done ? " done" : "") + (done && !claimed ? " claim" : ""));
        row.appendChild(el("span", "task-mark", claimed ? "✓" : done ? "!" : "·"));
        const copy = el("div"); copy.appendChild(el("strong", null, task.name)); copy.appendChild(el("small", null, done ? "已完成，可领取" : "进度 " + prog + " / " + (task.target || 1))); row.appendChild(copy);
        row.appendChild(el("span", "task-xp", "+" + (task.xp || 0) + " XP"));
        const btn = el("button", "btn btn-small " + (done && !claimed ? "btn-primary" : "btn-ghost"), claimed ? "已领取" : done ? "领取" : "进行中"); btn.disabled = claimed || !done; btn.onclick = () => claimTask(app.taskTab, task.id); row.appendChild(btn);
        box.appendChild(row);
      }
      root.appendChild(box);
    }
  }

  function renderTaskTutorialTab(root) {
    const level = ensureAccount().progress.level;
    const box = el("div", "task-chapter");
    const head = el("div", "task-chapter-head");
    head.appendChild(el("strong", null, "教程库"));
    head.appendChild(el("small", null, "按等级逐步开放 · 完成给经验"));
    box.appendChild(head);
    for (const lesson of TUTORIAL_LESSONS) {
      const unlocked = level >= lesson.level;
      const done = lessonCompleted(lesson.id);
      const row = el("div", "task-row" + (done ? " done" : ""));
      row.appendChild(el("span", "task-mark", done ? "✓" : unlocked ? "·" : "锁"));
      const copy = el("div");
      copy.appendChild(el("strong", null, lesson.title));
      copy.appendChild(el("small", null, unlocked ? lesson.desc + (done ? " · 已完成" : " · +" + lesson.xp + " XP") : "Lv." + lesson.level + " 开放"));
      row.appendChild(copy);
      row.appendChild(el("span", "task-xp", done ? "已完成" : "+" + lesson.xp + " XP"));
      const b = el("button", "btn btn-small btn-ghost", done ? "重看" : unlocked ? "开始" : "未开放");
      b.onclick = () => { if (!unlocked) { toast("Lv." + lesson.level + " 开放。"); return; } openLessonPage(lesson.id, "tasks"); };
      row.appendChild(b);
      box.appendChild(row);
    }
    const drill = el("div", "task-chapter-foot");
    drill.appendChild(el("span", null, "六步训练：实战演练一局"));
    const start = el("button", "btn btn-small btn-primary", "进入六步训练");
    start.onclick = () => { app.tutorialReturn = "tasks"; showScreen("tutorial"); };
    drill.appendChild(start); box.appendChild(drill);
    root.appendChild(box);
  }

  function levelUnlocked(key) {
    return ensureAccount().progress.level >= (FEATURE_LEVELS[key] || 1);
  }

  function showLockedFeature(key, label) {
    const need = FEATURE_LEVELS[key] || 1;
    toast(label + " 将在 Lv." + need + " 开放。当前 Lv." + ensureAccount().progress.level + "。");
  }

  function collectSaveBundle() {
    return {
      schema: 2,
      savedAt: Date.now(),
      account: app.account || null,
      customDecks: app.customDecks || {},
      deckLibrary: app.deckLibrary || {},
      activeDeckId: app.activeDeckId || {},
      customCardArt: loadCustomCardArt(),
      rawCustomDecks: app.rawCustomDecks || null,
      legacyDecks: app.legacyDecks || {},
      activeRelics: app.activeRelics || {},
      achievements: app.achievements || {},
      profile: app.profile || {},
      content: (() => { try { return JSON.parse(localStorage.getItem("gok_content_v1") || "null"); } catch (e) { return null; } })(),
      settings: { aiSpeed: app.aiSpeed, aiDifficulty: app.aiDifficulty, bgm: app.bgmOn, sfx: app.sfxOn }
    };
  }

  function snapshotSave(reason) {
    try {
      const bundle = collectSaveBundle();
      localStorage.setItem(SAVE_BACKUP_KEY, JSON.stringify({ savedAt: Date.now(), reason: reason || "auto", bundle }));
    } catch (e) {}
  }

  function scheduleSaveBackup() {
    if (saveBackupTimer) return;
    saveBackupTimer = setTimeout(() => { saveBackupTimer = null; snapshotSave("auto"); syncCloudSave(); }, 900);
  }

  async function syncCloudSave(force) {
    if (!(app.auth && app.auth.user)) return;
    app.cloudSyncState = "syncing"; app.cloudSyncError = "";
    try {
      const baseVersion = (force && app.cloudConflict && app.cloudConflict.save && app.cloudConflict.save.version) || app.cloudSaveVersion || 0;
      const res = await fetch("/api/account/save", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ save: collectSaveBundle(), baseVersion })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        app.cloudConflict = data.current || true;
        app.cloudSyncState = "conflict";
        app.cloudSyncError = "云端与本地不一致";
        updateHomeAccount();
        toast("云端存档有冲突，请到个人资料 → 存档同步处理。");
        return;
      }
      if (!res.ok) throw new Error(data.error || "云端同步失败");
      app.cloudSaveVersion = Number(data.version) || app.cloudSaveVersion;
      app.cloudSaveAt = Number(data.updatedAt) || Date.now();
      app.cloudConflict = null;
      app.cloudSyncState = "synced"; app.cloudSyncError = "";
      updateHomeAccount();
    } catch (e) {
      app.cloudSyncState = "error"; app.cloudSyncError = e.message || String(e);
      updateHomeAccount();
      if (force) toast("云端同步失败：" + (e.message || e));
    }
  }

  function maybeShowAuthGate() {
    if (app.authGate || (app.auth && app.auth.user)) return;
    if (app.screen !== "home") return;
    try { if (localStorage.getItem(GUEST_KEY) === "1") return; } catch (e) {}
    const account = ensureAccount();
    const hasProgress = !!(localStorage.getItem(ACCOUNT_NAMED_KEY) || Object.keys(app.customDecks || {}).length || (account.progress && account.progress.level > 1));
    if (hasProgress) return;
    app.authGate = true;
    app.loginMode = "login";
    showScreen("login");
  }

  async function restoreAuthSession() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "same-origin" });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.user) return;
      app.auth = { user: data.user };
      if (data.save) {
        app.cloudSaveVersion = Number(data.save.version) || 0;
        app.cloudSaveAt = Number(data.save.updatedAt) || 0;
        const localHas = !!(localStorage.getItem(ACCOUNT_NAMED_KEY) || Object.keys(app.customDecks || {}).length);
        if (!localHas && data.save.save) { applySaveBundle(data.save.save); app.cloudSyncState = "synced"; toast("已恢复云端档案。"); }
        else { app.cloudConflict = data.save; app.cloudSyncState = "conflict"; }
      }
      updateHomeAccount();
    } catch (e) {}
  }

  function encodeSaveCode(bundle) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(bundle))));
  }

  function decodeSaveCode(code) {
    const text = decodeURIComponent(escape(atob(String(code || "").replace(/\s+/g, ""))));
    return JSON.parse(text);
  }

  function applySaveBundle(bundle) {
    if (!bundle || typeof bundle !== "object") throw new Error("存档格式不正确");
    if (!bundle.customDecks && !bundle.profile && !bundle.achievements) throw new Error("存档里没有可识别的数据");
    snapshotSave("before-import");
    const account = bundle.account && bundle.account.id ? bundle.account : ensureAccount();
    normalizeAccountProgression(account, false);
    app.account = account;
    try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account)); if (account.name && account.name !== "档案员") localStorage.setItem(ACCOUNT_NAMED_KEY, "1"); } catch (e) {}
    app.customDecks = bundle.customDecks && typeof bundle.customDecks === "object" ? bundle.customDecks : {};
    app.deckLibrary = bundle.deckLibrary && typeof bundle.deckLibrary === "object" ? bundle.deckLibrary : {};
    app.activeDeckId = bundle.activeDeckId && typeof bundle.activeDeckId === "object" ? bundle.activeDeckId : {};
    try { localStorage.setItem(DECK_LIBRARY_KEY, JSON.stringify(app.deckLibrary)); localStorage.setItem("gok_active_deck_v1", JSON.stringify(app.activeDeckId)); } catch (e) {}
    app.customCardArt = bundle.customCardArt && typeof bundle.customCardArt === "object" ? bundle.customCardArt : {};
    persistCustomCardArt();
    app.rawCustomDecks = bundle.rawCustomDecks || null;
    app.legacyDecks = bundle.legacyDecks || {};
    app.activeRelics = bundle.activeRelics && typeof bundle.activeRelics === "object" ? bundle.activeRelics : {};
    app.achievements = bundle.achievements || {};
    app.profile = bundle.profile || {};
    try { localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(app.customDecks)); } catch (e) {}
    try { localStorage.setItem(LEGACY_DECK_KEY, JSON.stringify(app.legacyDecks || {})); } catch (e) {}
    try { localStorage.setItem(RELIC_STORAGE_KEY, JSON.stringify(app.activeRelics)); } catch (e) {}
    try { localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(app.achievements)); } catch (e) {}
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(app.profile)); } catch (e) {}
    try { if (bundle.content) localStorage.setItem("gok_content_v1", JSON.stringify(bundle.content)); } catch (e) {}
    try { migrateDeckLibrary(); } catch (e) {}
    snapshotSave("after-import");
  }


  const DECK_REPAIR_POOL = ["neutral_wayfarer", "wandering_guard", "traveling_healer", "old_compass", "mercenary", "sim_assistant", "snow_medic", "mist_scout", "caravan_guard"];
  function migrateUnavailableCards(faction, list) {
    const usable = (id) => { const d = D.CARDS[id]; return !!d && !d.disabled; };
    if (list.every(usable)) return list.slice();
    const counts = {};
    for (const id of list) if (usable(id)) counts[id] = (counts[id] || 0) + 1;
    const isFiller = (id) => {
      const d = D.CARDS[id];
      return d && !d.disabled && !d.token && d.type !== "equipment" && d.faction === "neutral";
    };
    const preferred = DECK_REPAIR_POOL.filter(isFiller);
    const pool = preferred.concat(Object.keys(D.CARDS).filter((id) => isFiller(id) && preferred.indexOf(id) < 0));
    const out = [];
    for (const id of list) {
      if (usable(id)) { out.push(id); continue; }
      const repl = pool.find((nid) => (counts[nid] || 0) < D.maxCopies(D.CARDS[nid]));
      if (repl) { counts[repl] = (counts[repl] || 0) + 1; out.push(repl); }
    }
    return out;
  }

  function normalizeSavedDeck(faction, list) {
    if (!Array.isArray(list)) return null;
    list = migrateUnavailableCards(faction, list);
    const moved = list.some((id) => {
      const d = D.CARDS[id];
      return d && !d.token && d.disabled !== true && d.faction !== faction && d.faction !== "neutral";
    });
    if (moved) {
      const built = D.autoBuildDeck(faction, "midrange", Array.from(ownedLegendarySet()));
      if (D.validateDeck(faction, built).ok) return built.slice();
    }
    if (D.validateDeck(faction, list).ok && list.length === 30) return list.slice(0, 30);
    const special = D.DECK_SPECIALS[faction] || {};
    const extra = [special.relic, special.relic2].filter((id) => id && list.indexOf(id) < 0);
    const main = list.filter((id) => D.CARDS[id] && D.CARDS[id].type !== "equipment" && D.CARDS[id].type !== "formation");
    const forms = list.filter((id) => D.CARDS[id] && D.CARDS[id].type === "formation");
    const eqs = list.filter((id) => D.CARDS[id] && D.CARDS[id].type === "equipment");
    const full = main.slice(0, 26).concat(forms.slice(0, 2), eqs.slice(0, 2), extra).slice(0, 30);
    if (D.validateDeck(faction, full).ok) return full;
    return null;
  }

  function loadCustomDecks() {
    app.customDecks = {};
    app.rawCustomDecks = null;
    app.legacyDecks = {};
    try {
      const legacyRaw = localStorage.getItem(LEGACY_DECK_KEY);
      if (legacyRaw) app.legacyDecks = JSON.parse(legacyRaw) || {};
    } catch (e) { app.legacyDecks = {}; }
    try {
      const raw = localStorage.getItem(DECK_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      app.rawCustomDecks = parsed;
      for (const f of D.FACTION_IDS) {
        const list = parsed && parsed[f];
        const migrated = normalizeSavedDeck(f, list);
        if (migrated) app.customDecks[f] = migrated.slice();
        else if (Array.isArray(list) && list.length) app.legacyDecks[f] = list.slice();
      }
      try { localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(app.customDecks)); } catch (e) {}
    } catch (e) {
      app.customDecks = {};
    }
    try {
      const libRaw = localStorage.getItem(DECK_LIBRARY_KEY);
      if (libRaw) app.deckLibrary = JSON.parse(libRaw) || {};
      const activeRaw = localStorage.getItem("gok_active_deck_v1");
      if (activeRaw) app.activeDeckId = JSON.parse(activeRaw) || {};
    } catch (e) { app.deckLibrary = {}; app.activeDeckId = {}; }
    migrateDeckLibrary();
  }

  function deckLibraryFor(faction) {
    app.deckLibrary = app.deckLibrary || {};
    if (!Array.isArray(app.deckLibrary[faction])) app.deckLibrary[faction] = [];
    return app.deckLibrary[faction];
  }

  function newDeckId() {
    return "deck_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
  }

  function activeDeckFor(faction) {
    const lib = deckLibraryFor(faction);
    const id = app.activeDeckId && app.activeDeckId[faction];
    return lib.find(d => d.id === id) || lib[0] || null;
  }

  function persistDeckLibrary() {
    try { localStorage.setItem(DECK_LIBRARY_KEY, JSON.stringify(app.deckLibrary || {})); } catch (e) {}
    try { localStorage.setItem("gok_active_deck_v1", JSON.stringify(app.activeDeckId || {})); } catch (e) {}
    persistCustomDecks();
  }

  function syncActiveDeckCards(faction) {
    const active = activeDeckFor(faction);
    if (active && active.cards) app.customDecks[faction] = active.cards.slice();
  }

  function migrateDeckLibrary() {
    app.deckLibrary = app.deckLibrary || {};
    app.activeDeckId = app.activeDeckId || {};
    for (const f of D.FACTION_IDS) {
      const lib = deckLibraryFor(f);
      if (!lib.length && Array.isArray(app.customDecks[f]) && D.validateDeck(f, app.customDecks[f]).ok) {
        const deck = { id: newDeckId(), name: "自定义牌组 1", tags: [], cards: app.customDecks[f].slice(), updatedAt: Date.now() };
        lib.push(deck); app.activeDeckId[f] = deck.id;
      }
      if (lib.length && !lib.some(d => d.id === app.activeDeckId[f])) app.activeDeckId[f] = lib[0].id;
      if (lib.length) syncActiveDeckCards(f);
    }
  }

  function persistCustomDecks() {
    try { localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(app.customDecks)); } catch (e) {}
    try { localStorage.setItem(LEGACY_DECK_KEY, JSON.stringify(app.legacyDecks || {})); } catch (e) {}
    scheduleSaveBackup();
  }

  function loadActiveRelics() {
    try {
      const raw = localStorage.getItem(RELIC_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      for (const f of D.FACTION_IDS) if (parsed && parsed[f]) app.activeRelics[f] = parsed[f];
    } catch (e) { app.activeRelics = {}; }
  }
  function persistActiveRelics() {
    try { localStorage.setItem(RELIC_STORAGE_KEY, JSON.stringify(app.activeRelics)); } catch (e) {}
    scheduleSaveBackup();
  }
  function deckRelicIds(faction) {
    const list = (app.customDecks[faction] && D.validateDeck(faction, app.customDecks[faction]).ok ? app.customDecks[faction] : D.DECKS[faction]) || [];
    return list.filter(id => D.CARDS[id] && (D.CARDS[id].type === "equipment" || D.CARDS[id].type === "relic"));
  }
  function activeRelicFor(faction) {
    const relics = deckRelicIds(faction);
    if (app.activeRelics[faction] && relics.indexOf(app.activeRelics[faction]) >= 0) return app.activeRelics[faction];
    return relics[0] || null;
  }
  function getPlayDeck(faction) {
    const custom = app.customDecks[faction];
    return (custom && D.validateDeck(faction, custom).ok ? custom : D.DECKS[faction]).slice();
  }

  function getPresetPlayDeck(faction) {
    return (D.DECKS[faction] || []).slice();
  }

  function getSelectedPlayDeck(faction, deckMode) {
    if (deckMode === "preset") return getPresetPlayDeck(faction);
    return getPlayDeck(faction);
  }

  function deckContainsEaster(list) {
    return (list || []).some(id => D.CARDS[id] && D.CARDS[id].easterEgg);
  }

  function allowMultiplayerDeck(faction, deckMode) {
    if (deckMode !== "custom") return true;
    const list = getSelectedPlayDeck(faction, "custom");
    if (deckContainsEaster(list)) {
      toast("彩蛋卡只能用于单人 AI 推演，不能进入匹配或联机房间。");
      return false;
    }
    return true;
  }

  function updateSetupDeck() {
    const custom = app.customDecks[app.faction];
    const active = activeDeckFor(app.faction);
    const valid = !!(custom && D.validateDeck(app.faction, custom).ok);
    const sel = $("setup-deck-select");
    if (sel) {
      const lib = deckLibraryFor(app.faction);
      clear(sel);
      const preset = document.createElement("option"); preset.value = "preset"; preset.textContent = "官方预组 · 30 张"; sel.appendChild(preset);
      for (const d of lib) { const o = document.createElement("option"); o.value = d.id; o.textContent = d.name + " · " + d.cards.length + " 张"; sel.appendChild(o); }
      sel.value = valid && active ? active.id : "preset";
      sel.onchange = () => {
        if (sel.value === "preset") { delete app.customDecks[app.faction]; persistDeckLibrary(); updateSetupDeck(); toast("已切换为预设牌组。"); return; }
        const d = lib.find(x => x.id === sel.value);
        if (!d) return;
        app.activeDeckId[app.faction] = d.id; app.customDecks[app.faction] = d.cards.slice(); persistDeckLibrary(); updateSetupDeck(); toast("已选择「" + d.name + "」。");
      };
    }
    if (!$("setup-deck-name")) return;
    $("setup-deck-name").textContent = valid ? ((active && active.name) || "自定义牌组") + " · 30 张" : "预设牌组 · 30 张";
    const equipNames = deckRelicIds(app.faction).map(id => D.CARDS[id] && D.CARDS[id].name).filter(Boolean);
    $("setup-deck-detail").textContent = (valid ? "已保存在本机" : "官方预组") + " · 装备：" + (equipNames.length ? equipNames.join(" / ") : "未选择") + " · 需抽到后打出";
    $("btn-deck-preset").disabled = !valid;
  }

  function usePresetDeck(faction) {
    delete app.customDecks[faction];
    persistCustomDecks();
    updateSetupDeck();
    if (app.screen === "deck") renderDeckBuilder();
    toast("已切换为预设牌组。");
  }

  function openDeckBuilder(faction, origin) {
    app.deckBuildFaction = faction;
    app.deckReturn = origin || "setup";
    app.deckDrafts = {};
    const active = activeDeckFor(faction);
    const saved = active ? active.cards : app.customDecks[faction];
    app.deckBuildList = (saved && D.validateDeck(faction, saved).ok ? saved : D.DECKS[faction]).slice();
    app.deckEditingId = active ? active.id : null;
    app.deckDraftName = active ? active.name : "";
    app.deckReadOnly = !active;
    app.deckSource = saved && D.validateDeck(faction, saved).ok ? "custom" : "preset";
    app.lastAutoStrategy = null;
    app.deckBuildFilter = "all";
    app.deckBuildRarity = "all";
    app.deckBuildOwned = "all";
    app.deckBackArmed = false;
    showScreen("deck");
    renderDeckBuilder();
  }

  function cardDrawValue(def) {
    let n = 0;
    const s = def.spell || {};
    if (s.type === "draw") n += s.amount || 1;
    if (s.type === "healDraw") n += s.draw || 1;
    if (["freezeDraw", "bloodDraw"].indexOf(s.type) >= 0) n += s.draw || 1;
    if (s.type === "drawVein") n += (s.amount || 1) + (s.bonus || 1);
    const b = def.battlecry || {};
    if (b.type === "draw") n += b.amount || 1;
    if (b.type === "drawVein") n += (b.amount || 1) + (b.bonus || 1);
    if (b.type === "drawHandCondition") n += 2;
    if (b.type === "drawSpell" || b.type === "spellDraw") n += 1;
    return n;
  }

  function deckDrawCount(list) {
    return (list || []).reduce((sum, id) => sum + cardDrawValue(D.CARDS[id] || {}), 0);
  }

  function deckCounts(list) {
    const out = {};
    for (const id of list) out[id] = (out[id] || 0) + 1;
    return out;
  }

  function renderDeckLibraryBar() {
    const f = app.deckBuildFaction;
    const lib = deckLibraryFor(f);
    const select = $("deck-library-select");
    const input = $("deck-name-input");
    if (!select || !input) return;
    clear(select);
    const preset = document.createElement("option"); preset.value = ""; preset.textContent = "预设牌组 / 草稿"; select.appendChild(preset);
    for (const d of lib) {
      const o = document.createElement("option"); o.value = d.id; o.textContent = d.name + " · " + d.cards.length + " 张" + (d.tags && d.tags[0] ? " · " + d.tags[0] : "") + (d.games ? " · " + Math.round((d.wins || 0) / d.games * 100) + "%" : ""); select.appendChild(o);
    }
    select.value = app.deckEditingId || "";
    const readonly = !!app.deckReadOnly;
    const bar = $("deck-library-bar");
    if (bar) bar.classList.toggle("readonly", readonly);
    const readonlyNote = $("deck-readonly-note"); if (readonlyNote) readonlyNote.hidden = !readonly;
    select.onchange = () => {
      const id = select.value;
      if (!id) { app.deckEditingId = null; app.deckBuildList = D.DECKS[f].slice(); app.deckSource = "preset"; app.deckDraftName = ""; app.deckReadOnly = true; renderDeckBuilder(); return; }
      const d = lib.find(x => x.id === id);
      if (!d) return;
      app.deckEditingId = d.id; app.deckBuildList = d.cards.slice(); app.deckDraftName = d.name; app.deckSource = "custom"; app.deckReadOnly = false; app.activeDeckId[f] = d.id; app.customDecks[f] = d.cards.slice(); persistDeckLibrary(); renderDeckBuilder();
    };
    input.value = app.deckDraftName || "";
    input.disabled = readonly; input.oninput = () => { app.deckDraftName = input.value; };
    const tagSel = $("deck-tag-select");
    const activeDeck = lib.find(x => x.id === app.deckEditingId);
    if (tagSel) { tagSel.value = activeDeck && activeDeck.tags && activeDeck.tags[0] || ""; tagSel.disabled = readonly || !activeDeck; tagSel.onchange = () => { if (!activeDeck) return; activeDeck.tags = tagSel.value ? [tagSel.value] : []; activeDeck.updatedAt = Date.now(); persistDeckLibrary(); renderDeckLibraryBar(); }; }
    const copyPreset = $("btn-deck-copy-preset");
    if (copyPreset) {
      copyPreset.disabled = !levelUnlocked("deckedit");
      copyPreset.onclick = () => {
        if (!levelUnlocked("deckedit")) { toast("Lv.5 后可复制预设为自定义牌组。"); return; }
        const built = D.autoBuildDeck(f, "midrange", Array.from(ownedLegendarySet()));
        if (!D.validateDeck(f, built).ok) { toast("复制失败，请稍后再试。"); return; }
        const deck = { id: newDeckId(), name: (D.FACTIONS[f] ? D.FACTIONS[f].name : "自定义") + " · 自定义", tags: ["中速"], cards: built.slice(), updatedAt: Date.now(), games: 0, wins: 0, losses: 0 };
        lib.push(deck); app.activeDeckId[f] = deck.id; app.deckEditingId = deck.id; app.customDecks[f] = built.slice(); app.deckBuildList = built.slice(); app.deckDraftName = deck.name; app.deckReadOnly = false; persistDeckLibrary(); renderDeckBuilder(); toast("已复制为可编辑的自定义牌组。");
      };
    }
    const multiple = levelUnlocked("multideck");
    const add = $("btn-deck-new"), dup = $("btn-deck-duplicate"), del = $("btn-deck-delete");
    if (add) { add.disabled = readonly || (!multiple && lib.length > 0); add.title = multiple ? "" : "Lv.7 开放多套牌组"; add.onclick = () => { if (!multiple && lib.length) { toast("Lv.7 开放多套牌组。"); return; } app.deckEditingId = null; app.deckDraftName = "新牌组"; app.deckBuildList = D.DECKS[f].slice(); app.deckSource = "draft"; renderDeckBuilder(); }; }
    if (dup) { dup.disabled = readonly || !multiple || !app.deckEditingId; dup.onclick = () => { if (!multiple) { toast("Lv.7 开放多套牌组。"); return; } const d = lib.find(x => x.id === app.deckEditingId); if (!d) return; const copy = { id: newDeckId(), name: d.name + " 副本", tags: (d.tags || []).slice(), cards: d.cards.slice(), updatedAt: Date.now() }; lib.push(copy); app.activeDeckId[f] = copy.id; app.deckEditingId = copy.id; app.customDecks[f] = copy.cards.slice(); persistDeckLibrary(); app.deckBuildList = copy.cards.slice(); app.deckDraftName = copy.name; renderDeckBuilder(); toast("已复制牌组。"); }; }
    if (del) { del.disabled = readonly || !app.deckEditingId; del.onclick = () => { if (!app.deckEditingId) return; const i = lib.findIndex(x => x.id === app.deckEditingId); if (i < 0) return; lib.splice(i, 1); delete app.customDecks[f]; app.deckEditingId = lib[0] ? lib[0].id : null; app.deckDraftName = lib[0] ? lib[0].name : ""; app.deckBuildList = lib[0] ? lib[0].cards.slice() : D.DECKS[f].slice(); app.activeDeckId[f] = lib[0] ? lib[0].id : null; persistDeckLibrary(); renderDeckBuilder(); toast("牌组已删除。"); }; }
    const note = el("span", "deck-library-locked", readonly ? "官方预设只读" : (multiple ? "可保存多套牌组" : "Lv.7 开放多套牌组"));
    const old = bar && bar.querySelector(".deck-library-locked"); if (old) old.remove();
    if (bar) bar.appendChild(note);
  }

  function renderDeckBuilder() {
    renderDeckLibraryBar();
    hidePreviewNow();
    const f = app.deckBuildFaction;
    const list = app.deckBuildList;
    const counts = deckCounts(list);
    const validation = D.validateDeck(f, list);
    const mainCount = list.filter(id => D.CARDS[id].type !== "formation" && D.CARDS[id].type !== "equipment" && D.CARDS[id].type !== "relic").length;
    const formationCount = list.filter(id => D.CARDS[id].type === "formation").length;
    const relicCount = list.filter(id => D.CARDS[id].type === "equipment" || D.CARDS[id].type === "relic").length;
    const headerCount = $("deck-head-count");
    const fieldCount = mainCount + formationCount;
    if (headerCount) headerCount.textContent = list.length + " / 30";
    const totalEl = $("deck-count");
    if (totalEl) totalEl.textContent = list.length + " / 30 张";
    const noteEl = $("deck-count-note");
    if (noteEl) noteEl.textContent = "30 张 · 品级上限：传说 " + D.DECK_RARITY_LIMITS.legendary + " / 史诗 " + D.DECK_RARITY_LIMITS.epic + " / 稀有 " + D.DECK_RARITY_LIMITS.rare;

    const heroDef = D.HEROES[D.FACTIONS[f].hero];
    const leaderName = $("deck-leader-name");
    if (leaderName) leaderName.textContent = heroDef.name;
    const relicSelect = $("deck-relic-select");
    if (relicSelect) {
      const relicIds = list.filter(id => D.CARDS[id] && (D.CARDS[id].type === "equipment" || D.CARDS[id].type === "relic"));
      clear(relicSelect);
      if (!relicIds.length) relicSelect.appendChild(el("option", null, "未装备"));
      for (const rid of relicIds) relicSelect.appendChild(el("option", null, D.CARDS[rid].name));
      relicSelect.value = relicIds[0] ? D.CARDS[relicIds[0]].name : "未装备";
      relicSelect.disabled = true;
      relicSelect.onchange = null;
    }
    const leaderSkill = $("deck-leader-skill");
    if (leaderSkill) {
      clear(leaderSkill);
      const main = el("div", "deck-skill-main");
      main.appendChild(el("span", "deck-hero-stats", "领袖 " + heroDef.name + " · 生命 " + heroDef.hp + "（上限可成长）"));
      main.appendChild(el("strong", null, "领袖技能 · " + heroDef.power.name + " · " + heroDef.power.cost + " 行动力"));
      // keep the deck header compact: skill details are available in-game / via tooltip
      leaderSkill.appendChild(main);
    }
    const validEl = $("deck-valid");
    validEl.textContent = validation.ok ? "合法牌组" : "未完成";
    validEl.className = "deck-valid " + (validation.ok ? "ok" : "bad");

        document.querySelectorAll('[data-deck-filter="debt"]').forEach((b) => { b.hidden = false; });
const tabs = $("deck-faction-tabs");
    clear(tabs);
    for (const id of D.FACTION_IDS) {
      const b = el("button", "deck-faction-tab" + (id === f ? " active" : ""), D.FACTIONS[id].name);
      b.onclick = () => {
        app.deckDrafts[f] = list.slice();
        app.deckBuildFaction = id;
        const active = activeDeckFor(id);
        const saved = active ? active.cards : app.customDecks[id];
        app.deckEditingId = active ? active.id : null;
        app.deckDraftName = active ? active.name : "";
        app.deckBuildList = (app.deckDrafts[id] || (saved && D.validateDeck(id, saved).ok ? saved : D.DECKS[id])).slice();
        renderDeckBuilder();
      };
      tabs.appendChild(b);
    }

    const msg = $("deck-message");
    clear(msg);
    if (!validation.ok) {
      if (validation.errors.length) msg.textContent = validation.errors.slice(0, 2).join("；");
      else msg.textContent = "需要 30 张：装备/阵型/随从自由混编。";
    } else if (validation.warnings && validation.warnings.length) {
      msg.textContent = validation.warnings.join("；");
      msg.classList.add("warn");
    } else {
      msg.textContent = "30 张自由编成：装备/阵型/随从自由混编。";
    }

    const curve = $("deck-curve");
    clear(curve);
    const costCounts = {};
    for (const id of list) costCounts[D.CARDS[id].cost] = (costCounts[D.CARDS[id].cost] || 0) + 1;
    const maxCost = Math.max(1, ...Object.values(costCounts));
    for (let c = 1; c <= 7; c++) {
      const box = el("div", "deck-curve-bar");
      const fill = el("div", "deck-curve-fill");
      fill.style.height = Math.max(2, (costCounts[c] || 0) / maxCost * 100) + "%";
      box.appendChild(fill);
      box.appendChild(el("span", "deck-curve-label", String(c)));
      curve.appendChild(box);
    }
    const minions = list.filter(id => D.CARDS[id].type === "minion").length;
    const tactics = list.filter(id => D.CARDS[id].type === "spell").length;
    const debts = list.filter(id => D.CARDS[id].type === "debt").length;
    const formations = list.filter(id => D.CARDS[id].type === "formation").length;
    const drawTotal = deckDrawCount(list);
    $("deck-type-stats").textContent = "随从 " + minions + " · 战术 " + tactics + " · 阵型 " + formations + " · 债务卡 " + debts + " · 传说 " + validation.rarity.legendary + "/" + D.DECK_RARITY_LIMITS.legendary + " · 史诗 " + validation.rarity.epic + "/" + D.DECK_RARITY_LIMITS.epic + " · 稀有 " + validation.rarity.rare + "/" + D.DECK_RARITY_LIMITS.rare + " · 过牌 " + drawTotal;
    const rarityWarning = validation.ok && validation.presetExempt && validation.warnings.some(x => x.includes("品级"));
    msg.classList.toggle("warn", validation.ok && (drawTotal > 10 || rarityWarning));
    msg.hidden = validation.ok && !(drawTotal > 10) && !rarityWarning;
    if (validation.ok && drawTotal > 10) {
      msg.textContent = "30 张自由编成 · 过牌偏多：" + drawTotal + " 张，建议控制在 6–10 张。";
    }

    const selected = $("deck-selected");
    clear(selected);
    const groups = Object.keys(counts).map(id => ({ id, def: D.CARDS[id], count: counts[id] })).sort((a, b) => a.def.cost - b.def.cost || a.def.name.localeCompare(b.def.name));
    if (!groups.length) selected.appendChild(el("div", "deck-message", "还没有选牌。"));
    for (const g of groups) {
      const row = el("div", "deck-line");
      row.appendChild(el("span", "deck-line-cost", String(g.def.cost)));
      const borrowed = g.def.rarity === "legendary" && !g.def.easterEgg && !ownedLegendarySet().has(g.id);
      row.classList.toggle("borrowed", borrowed);
      row.appendChild(el("span", "deck-line-name", g.def.name + (g.count > 1 ? " ×" + g.count : "") + (borrowed ? " · 借用" : "") + (g.def.easterEgg ? " · 仅 AI" : "")));
      if (g.def.type === "minion") row.appendChild(el("span", "deck-line-stats", "攻" + g.def.attack + " / 血" + g.def.health));
      const minus = el("button", "deck-line-remove", "移除");
      minus.title = "从牌组移除一张";
      minus.onclick = () => removeDeckCard(g.id);
      row.appendChild(minus);
      row.onmouseenter = () => showDeckHover(g.def, row);
      row.onmouseleave = hideDeckHover;
      selected.appendChild(row);
    }

    hideDeckHover();
    const poolBox = $("deck-pool");
    clear(poolBox);
    const filter = app.deckBuildFilter;
    let scope = app.deckPoolScope || "faction";
    if (scope === "all") scope = "faction";
    const ownedLegend = ownedLegendarySet();
    const unownedLegend = (id) => isUnownedLegendaryCard(id);
    const canPickCard = (id) => {
      const c = D.CARDS[id];
      return !!(c && !c.token && !c.disabled);
    };
    let poolSource;
    if (scope === "neutral") poolSource = Object.keys(D.CARDS).filter(id => D.CARDS[id].faction === "neutral" && canPickCard(id));
    else poolSource = Object.keys(D.CARDS).filter(id => D.CARDS[id].faction === f && canPickCard(id) && !D.CARDS[id].experimental);
    const rarityFilter = app.deckBuildRarity || "all";
    const ownedFilter = app.deckBuildOwned || "all";
    document.querySelectorAll("[data-deck-owned]").forEach((b) => b.classList.toggle("active", b.dataset.deckOwned === ownedFilter));
    document.querySelectorAll("[data-deck-rarity]").forEach((b) => b.classList.toggle("active", b.dataset.deckRarity === rarityFilter));
    const pool = poolSource.filter(id => (filter === "all" || D.CARDS[id].type === filter) && (rarityFilter === "all" || D.CARDS[id].rarity === rarityFilter) && (ownedFilter === "all" || (ownedFilter === "unowned" ? isUnownedLegendaryCard(id) : !isUnownedLegendaryCard(id))))
      .sort((a, b) => D.CARDS[a].cost - D.CARDS[b].cost || D.CARDS[a].name.localeCompare(D.CARDS[b].name));
    $("deck-pool-count").textContent = "卡池 " + pool.length + " 张";
    for (const id of pool) {
      const def = D.CARDS[id];
      const count = counts[id] || 0;
      const max = D.maxCopies(def);
      const typeFull = false;
      const card = buildLibraryCard(def, { variant: "mini", faction: false, count: count + "/" + max });
      card.classList.add("deck-mini", "rarity-" + (def.rarity || "common"));
      if (count >= max || typeFull) card.classList.add("full");
      if (unownedLegend(id)) card.classList.add("locked-unowned");
      addCardTags(card, def, null, "lib-tags");
      card.title = unownedLegend(id) ? "尚未获得 · 通过档案升级获取" : (def.text || def.name);
      card.onclick = () => { if (unownedLegend(id)) { toast("你还没有这张卡。通过档案升级获得。"); return; } toggleDeckCard(id); };
      card.onmouseenter = () => showDeckHover(def, card);
      card.onmouseleave = hideDeckHover;
      poolBox.appendChild(card);
    }

    $("btn-deck-save").disabled = app.deckReadOnly || !validation.ok;
    if ($("btn-deck-reset")) $("btn-deck-reset").disabled = !!app.deckReadOnly;
    document.querySelectorAll(".auto-deck-btn").forEach((b) => { b.disabled = !!app.deckReadOnly; });
    document.querySelectorAll("#deck-selected .deck-line-remove").forEach((b) => { b.disabled = !!app.deckReadOnly; });
    $("btn-deck-use").disabled = app.deckReadOnly || !validation.ok;
    const topUse = $("btn-deck-top-use");
    if (topUse) { topUse.disabled = app.deckReadOnly || !validation.ok; topUse.textContent = app.deckReadOnly ? "只读预览" : "保存并使用"; }
    if ($("btn-deck-clear")) $("btn-deck-clear").disabled = !!app.deckReadOnly;
    const source = $("deck-source-label");
    if (source) {
      source.textContent = app.deckReadOnly ? "官方预设 · 只读" : (app.deckSource === "custom" ? "已载入自定义牌组 · 可继续编辑" : app.deckSource === "draft" ? "自动构筑草稿 · 尚未保存" : "预设牌组 · 可编辑");
      source.classList.toggle("custom", app.deckSource === "custom" || app.deckSource === "draft");
    }
    document.querySelectorAll(".auto-deck-btn").forEach((b) => b.classList.toggle("active", b.dataset.deckStrategy === app.lastAutoStrategy));
    const autoStatus = $("deck-auto-status");
    if (autoStatus) autoStatus.textContent = app.deckReadOnly ? "官方预设只读；复制为自定义牌组后才能自动构筑。" : (app.lastAutoStrategy ? "当前策略：" + D.DECK_STRATEGIES[app.lastAutoStrategy].name + " · 可继续手动调整" : "选择一套策略，一键生成 30 张牌组。");
  }

  function toggleDeckCard(id) {
    if (app.deckReadOnly) { toast("官方预设只读。请先在 Lv.5 后复制为自定义牌组。"); return; }
    const def = D.CARDS[id];
    if (!def) return;
    const count = app.deckBuildList.filter(x => x === id).length;
    const max = D.maxCopies(def);
    if (count > 0 && count >= max) { removeDeckCard(id); return; }
    addDeckCard(id);
  }

  function addDeckCard(id) {
    if (app.deckReadOnly) { toast("官方预设只读。请先复制为自定义牌组。"); return; }
    const def = D.CARDS[id];
    const count = app.deckBuildList.filter(x => x === id).length;
    const mainCount = app.deckBuildList.filter(x => D.CARDS[x].type !== "formation" && D.CARDS[x].type !== "equipment").length;
    const formationCount = app.deckBuildList.filter(x => D.CARDS[x].type === "formation").length;
    const relicCount = app.deckBuildList.filter(x => D.CARDS[x].type === "equipment").length;
    const fieldCount = mainCount + formationCount;
    if (def.type === "formation" && formationCount >= 8) { toast("阵位牌最多带 2 张。"); return; }
    
    if (app.deckBuildList.length >= 30) { toast("牌组已满（30 张）。"); return; }
    if (app.deckBuildList.length >= 30) { toast("牌组已满（30 张）。"); return; }
    if (count >= D.maxCopies(def)) { toast(def.name + " 已达同名张数上限。"); return; }
    if (isUnownedLegendaryCard(id)) { toast("你还没有这张卡。通过档案升级获得。"); return; }
    const rarity = D.deckRarityCounts(app.deckBuildList);
    const cap = D.DECK_RARITY_LIMITS[def.rarity];
    if (cap != null && rarity[def.rarity] >= cap) {
      toast("品级上限：" + ({ legendary: "传说", epic: "史诗", rare: "稀有" })[def.rarity] + "最多 " + cap + " 张。");
      return;
    }
    app.deckBuildList.push(id);
    AudioBox.play("click");
    renderDeckBuilder();
  }

  function removeDeckCard(id) {
    if (app.deckReadOnly) return;
    const i = app.deckBuildList.lastIndexOf(id);
    if (i >= 0) app.deckBuildList.splice(i, 1);
    AudioBox.play("click");
    renderDeckBuilder();
  }

  function confirmDeckWarnings(faction, list, actionLabel) {
    const v = D.validateDeck(faction, list);
    if (!v.ok) { toast(v.errors[0] || "牌组还不合法。"); return false; }
    if (v.warnings && v.warnings.length) {
      const text = "这份牌组有提醒：\n\n" + v.warnings.join("\n") + "\n\n" + (actionLabel || "继续");
      if (!window.confirm(text)) return false;
    }
    return true;
  }

  function saveCurrentDeck(showToast) {
    const f = app.deckBuildFaction;
    if (app.deckReadOnly) { if (showToast) toast("官方预设只读，不能保存。请先复制为自定义牌组。"); return false; }
    if (!levelUnlocked("deckedit")) { toast("Lv.5 解锁自定义组卡与牌组命名。先完成主线任务升级。"); return false; }
    const name = String(app.deckDraftName || "").trim().slice(0, 18) || (app.deckEditingId ? "未命名牌组" : "自定义牌组 " + (deckLibraryFor(f).length + 1));
    const v = D.validateDeck(f, app.deckBuildList);
    if (!v.ok) { toast(v.errors[0] || "牌组还不合法。"); return false; }
    if (v.warnings && v.warnings.length && !confirmDeckWarnings(f, app.deckBuildList, "仍然保存？")) return false;
    const missing = app.deckBuildList.filter((id) => isUnownedLegendaryCard(id));
    if (missing.length) {
      toast("尚未拥有传说：" + Array.from(new Set(missing.map(id => D.CARDS[id].name))).slice(0, 3).join("、") + "。官方预组可作为模板试玩。");
      return false;
    }
    const lib = deckLibraryFor(f);
    let deck = app.deckEditingId ? lib.find(d => d.id === app.deckEditingId) : null;
    if (!deck) { deck = { id: newDeckId(), name, tags: [], cards: [], updatedAt: Date.now() }; lib.push(deck); }
    deck.name = name; deck.cards = app.deckBuildList.slice(); deck.updatedAt = Date.now();
    app.deckEditingId = deck.id; app.activeDeckId[f] = deck.id; app.customDecks[f] = deck.cards.slice();
    app.deckSource = "custom";
    persistDeckLibrary();
    unlockAchievement("deck_saved");
    markMainTask("deck_saved");
    if (showToast) toast("牌组已保存到本机。");
    return true;
  }

  function autoBuildCurrentDeck(strategy) {
    if (app.deckReadOnly) { toast("官方预设只读。请先复制为自定义牌组。"); return; }
    const f = app.deckBuildFaction;
    const built = D.autoBuildDeck(f, strategy, Array.from(ownedLegendarySet()));
    app.deckBuildList = built;
    app.deckSource = "draft";
    app.lastAutoStrategy = strategy;
    renderDeckBuilder();
    toast("已自动构筑「" + D.DECK_STRATEGIES[strategy].name + "」牌组，可继续手动调整。");
  }

  /* ===== 房主对局恢复 ===== */
  const HOST_SESSION_KEY = "gok_host_session_v1";
  let hostSaveTimer = null;

  function saveHostSessionNow() {
    if (!app.game || !app.net || app.net.role !== "host" || !app.net.active) return;
    try {
      localStorage.setItem(HOST_SESSION_KEY, JSON.stringify({ version: 1, savedAt: Date.now(), game: app.game }));
    } catch (e) {}
  }

  function scheduleHostSave() {
    if (!app.game || !app.net || app.net.role !== "host" || !app.net.active) return;
    if (hostSaveTimer) return;
    hostSaveTimer = setTimeout(() => { hostSaveTimer = null; saveHostSessionNow(); }, 220);
  }

  function loadHostSession() {
    try {
      const raw = localStorage.getItem(HOST_SESSION_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (!saved || !saved.game || !Array.isArray(saved.game.players) || saved.game.players.length !== 2) return null;
      return saved;
    } catch (e) { return null; }
  }

  function clearHostSession() {
    if (hostSaveTimer) { clearTimeout(hostSaveTimer); hostSaveTimer = null; }
    try { localStorage.removeItem(HOST_SESSION_KEY); } catch (e) {}
    try { sessionStorage.removeItem("gok_host_active"); } catch (e) {}
  }

  function refreshResumePanel() {
    const box = $("lan-resume");
    if (!box) return;
    if (!app.lanHostPage) { box.hidden = true; return; }
    const saved = loadHostSession();
    if (!saved) { box.hidden = true; return; }
    box.hidden = false;
    const s = saved.game;
    $("lan-resume-text").textContent = "第 " + (s.round || 1) + " 轮 · " + (s.players[0].factionName || "") + " vs " + (s.players[1].factionName || "") + "，可以恢复并继续。";
  }

  async function resumeHostGame() {
    const saved = loadHostSession();
    if (!saved) { toast("没有可恢复的房主对局。"); refreshResumePanel(); return; }
    const game = saved.game;
    app.game = game;
    app.net = { role: "host", player: 0, active: true, since: 0 };
    app.human = 0;
    app.viewer = 0;
    app.aiPlayer = null;
    app.local = false;
    app.mode = "lan";
    app.busy = false;
    app.animating = false;
    app.lanEndShown = false;
    app.settlementRecorded = false;
    app.settlementAchievements = null;
    app.rankChange = null;
    app.lastVein = game.vein;
    app.lastThresholds = Object.assign({}, game.stats.thresholds);
    try { sessionStorage.setItem("gok_host_active", "1"); } catch (e) {}
    closeModal(true);
    showScreen("game");
    hideReconnectOverlay();
    AudioBox.play("ui_open");
    renderGame();
    let seq = 0;
    try { const st = await lanApi("/api/status"); seq = st.seq || 0; } catch (e) {}
    startNetPoll(0, seq);
    sendNet({ type: "state", state: redactStateForGuest(game) });
    lanHeartbeat(0);
    if (game.status === "gameover") showEnd();
    toast("已恢复房主对局。");
  }

  /* ===== 档案元界面 ===== */
  const ACHIEVEMENT_KEY = "gok_achievements_v1";
  const ACHIEVEMENTS = [
    { id: "first_win", name: "第一次落笔", desc: "赢得第一局推演。", icon: "I" },
    { id: "academy_win", name: "学院的答案", desc: "使用学院赢得一局。", icon: "书" },
    { id: "tide_10", name: "魔物潮", desc: "在一局中触发流脉 10。", icon: "X" },
    { id: "summoner_10", name: "六阵位", desc: "单局召唤 10 个随从。", icon: "VI" },
    { id: "lan_win", name: "隔桌", desc: "赢得一局局域网对战。", icon: "LAN" },
    { id: "deck_saved", name: "编成者", desc: "保存一套自定义 30 张牌组：30 张卡（装备/阵型自由混编）。", icon: "30" },
    { id: "tutorial", name: "第一课", desc: "进入新手演练。", icon: "01" },
    { id: "play_10", name: "档案常客", desc: "累计完成 10 局推演。", icon: "10" },
    { id: "fast_win", name: "速记", desc: "在 6 回合内赢得一局。", icon: "6" },
    { id: "online_10", name: "线上常客", desc: "赢得 10 局在线或排位对局。", icon: "NET" },
    { id: "all_factions", name: "八色档案", desc: "使用全部八个阵营各赢一局。", icon: "8" },
  ];

  const ACH_CATEGORY_LABELS = { combat: "战斗", collection: "收集", mode: "模式", archive: "档案" };
  const ACH_META = {
    first_win: { category: "combat", reward: 1 },
    academy_win: { category: "combat", reward: 1 },
    tide_10: { category: "combat", reward: 1 },
    summoner_10: { category: "combat", reward: 1 },
    lan_win: { category: "mode", reward: 2 },
    deck_saved: { category: "collection", reward: 1 },
    tutorial: { category: "mode", reward: 1 },
    play_10: { category: "archive", reward: 2 },
    fast_win: { category: "combat", reward: 2 },
    online_10: { category: "mode", reward: 3 },
    all_factions: { category: "collection", reward: 4 }
  };
  for (const a of ACHIEVEMENTS) Object.assign(a, ACH_META[a.id] || { category: "archive", reward: 0 });

  function loadAchievements() {
    app.achievements = {};
    try {
      const raw = localStorage.getItem(ACHIEVEMENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") app.achievements = parsed;
      }
    } catch (e) { app.achievements = {}; }
  }

  function persistAchievements() {
    try { localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(app.achievements)); } catch (e) {}
    scheduleSaveBackup();
  }

  function grantAchievementMarks(amount) {
    if (!amount) return 0;
    try {
      const key = "gok_content_v1";
      const data = JSON.parse(localStorage.getItem(key) || "null") || {};
      data.marks = (data.marks || 0) + amount;
      localStorage.setItem(key, JSON.stringify(data));
      return amount;
    } catch (e) { return 0; }
  }

  function unlockAchievement(id) {
    const def = ACHIEVEMENTS.find(a => a.id === id);
    if (!def) return false;
    if (app.achievements[id] && app.achievements[id].unlocked) return false;
    app.achievements[id] = Object.assign({}, app.achievements[id] || {}, { unlocked: true, at: Date.now() });
    persistAchievements();
    const reward = grantAchievementMarks(def.reward || 0);
    toast("成就解锁 · " + def.name + (reward ? " · 印记 +" + reward : ""));
    AudioBox.play("victory");
    return true;
  }

  function recordGameAchievements() {
    if (!app.game || app.settlementRecorded) return;
    app.settlementRecorded = true;
    const s = app.game;
    const win = s.winner != null && s.winner === app.human;
    const unlocked = [];
    if (win && unlockAchievement("first_win")) unlocked.push("first_win");
    if (win && s.players[app.human].faction === "academy" && unlockAchievement("academy_win")) unlocked.push("academy_win");
    if (win && app.net && unlockAchievement("lan_win")) unlocked.push("lan_win");
    if ((s.stats.thresholds[10] || 0) > 0 && unlockAchievement("tide_10")) unlocked.push("tide_10");
    if (s.ranked) {
      const rp = app.profile || {};
    }
    if ((s.stats.minionsSummoned || 0) >= 10 && unlockAchievement("summoner_10")) unlocked.push("summoner_10");
    if (win && (s.round || 99) <= 6 && unlockAchievement("fast_win")) unlocked.push("fast_win");
    if (win && (s.ranked || app.net)) {
      const online = app.achievements.online_10 || { progress: 0 };
      online.progress = (online.progress || 0) + 1;
      if (online.progress >= 10 && !online.unlocked) { online.unlocked = true; unlocked.push("online_10"); toast("成就解锁 · 线上常客"); }
      app.achievements.online_10 = online;
    }
    if (win) {
      const profile = app.profile || loadProfile();
      const won = new Set(D.FACTION_IDS.filter(f => profile.byFaction && profile.byFaction[f] && profile.byFaction[f].wins > 0));
      won.add(s.players[app.human].faction);
      if (won.size >= D.FACTION_IDS.length && unlockAchievement("all_factions")) unlocked.push("all_factions");
    }
    const rec = app.achievements.play_10 || { progress: 0 };
    rec.progress = (rec.progress || 0) + 1;
    if (rec.progress >= 10 && !rec.unlocked) { rec.unlocked = true; if (unlocked.indexOf("play_10") < 0) unlocked.push("play_10"); const reward = grantAchievementMarks((ACHIEVEMENTS.find(a => a.id === "play_10") || {}).reward || 0); toast("成就解锁 · 档案常客" + (reward ? " · 印记 +" + reward : "")); }
    app.achievements.play_10 = rec;
    persistAchievements();
    recordGameProgress(s, win);
    app.settlementAchievements = unlocked;
  }

  const RANK_TIERS = [
    { min: 0, name: "青铜", color: "#b58b62" },
    { min: 300, name: "白银", color: "#b9c7d2" },
    { min: 600, name: "黄金", color: "#e1b861" },
    { min: 900, name: "铂金", color: "#8fd6d1" },
    { min: 1200, name: "钻石", color: "#9fc9ff" },
    { min: 1500, name: "大师", color: "#d7a7ff" },
    { min: 2000, name: "宗师", color: "#ff9f91" }
  ];

  function emptyProfile() {
    return {
      games: 0, wins: 0, losses: 0, draws: 0, byFaction: {}, history: [], maxRound: 0,
      rankPoints: 0, rankWins: 0, rankLosses: 0, rankMatches: 0,
      rankStreak: 0, rankBestStreak: 0, rankPeak: 0, rankSeason: 1
    };
  }

  function rankInfo(points) {
    const value = Math.max(0, Number(points) || 0);
    let tier = RANK_TIERS[0];
    let next = null;
    for (let i = 0; i < RANK_TIERS.length; i++) {
      const t = RANK_TIERS[i];
      if (value >= t.min) { tier = t; next = RANK_TIERS[i + 1] || null; }
    }
    const floor = tier.min;
    const ceiling = next ? next.min : Math.max(2000, value);
    const progress = next ? Math.max(0, Math.min(100, (value - floor) / (ceiling - floor) * 100)) : 100;
    return { points: value, tier: tier.name, color: tier.color, next: next ? next.min : null, progress };
  }

  function rankText(points) {
    const info = rankInfo(points);
    return info.tier + " · " + info.points;
  }

  const PROFILE_KEY = "gok_profile_v1";

  function loadProfile() {
    const empty = emptyProfile();
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return empty;
      const p = JSON.parse(raw);
      return Object.assign(empty, p || {}, { byFaction: (p && p.byFaction) || {}, history: (p && p.history) || [] });
    } catch (e) { return empty; }
  }

  function persistProfile() {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(app.profile || {})); } catch (e) {}
    scheduleSaveBackup();
  }

  function downloadSaveFile() {
    try {
      const json = JSON.stringify(collectSaveBundle(), null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "gok-world-save-" + new Date().toISOString().slice(0, 10) + ".json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast("存档文件已导出。");
    } catch (e) { toast("导出失败：" + (e.message || e)); }
  }

  function deleteLocalSave() {
    const keys = [
      ACCOUNT_KEY,
      ACCOUNT_NAMED_KEY,
      DECK_STORAGE_KEY,
      LEGACY_DECK_KEY,
      RELIC_STORAGE_KEY,
      ACHIEVEMENT_KEY,
      PROFILE_KEY,
      CUSTOM_CARD_ART_KEY,
      SAVE_BACKUP_KEY,
      "gok_content_v1",
      HOST_SESSION_KEY
    ];
    let failed = false;
    for (const key of keys) {
      try { localStorage.removeItem(key); } catch (e) { failed = true; }
    }
    try { sessionStorage.removeItem("gok_host_active"); } catch (e) {}
    if (failed) {
      toast("删除失败：浏览器本地存储不可用。");
      return;
    }
    app.account = null;
    app.customDecks = {};
    app.rawCustomDecks = null;
    app.legacyDecks = {};
    app.activeRelics = {};
    app.achievements = {};
    app.profile = null;
    app.contentRun = null;
    app.game = null;
    app.lastConfig = null;
    app.series = null;
    app.settlementAchievements = [];
    app.endCGPlayed = false;
    app.endCGPending = false;
    closeModal(true);
    toast("本地存档已删除，正在重新开始…");
    setTimeout(() => location.reload(), 450);
  }

  function confirmDeleteSave() {
    openModal((content) => {
      content.classList.add("delete-save-modal");
      content.appendChild(el("div", "eyebrow", "DANGER / LOCAL SAVE"));
      content.appendChild(el("h3", null, "删除本地存档？"));
      content.appendChild(el("p", "account-warn", "这会清除账号昵称与 ID、自定义牌组、装备选择、成就、档案统计、远征进度、未结束的对局记录和最近备份。"));
      content.appendChild(el("p", "account-warn", "音量、画面等设置和教程观看记录会保留。删除后无法恢复，建议先导出存档。"));
      const actions = el("div", "modal-actions");
      const cancel = el("button", "btn btn-small btn-ghost", "取消");
      cancel.onclick = () => { closeModal(true); openAccountModal(); };
      const confirm = el("button", "btn btn-small btn-danger", "确认删除");
      confirm.onclick = deleteLocalSave;
      actions.appendChild(cancel);
      actions.appendChild(confirm);
      content.appendChild(actions);
    });
  }

  function renderProfileCustomization(content, pageMode) {
    clear(content);
    if (!pageMode) {
      content.appendChild(el("div", "eyebrow", "ARCHIVE / IDENTITY"));
      content.appendChild(el("h3", null, "档案外观"));
      content.appendChild(el("p", null, "头像、头像框、昵称色、称号底板、徽章、签名、卡背、牌桌和牌套都会保存在本机，并显示在主页或对局中。"));
    }
    const account = ensureAccount();
    const avatarSection = el("div", "profile-custom-section");
    avatarSection.appendChild(el("h4", null, "头像"));
    const avatarGrid = el("div", "profile-custom-grid");
    for (const av of PROFILE_AVATARS) {
      const b = el("button", "profile-custom-option profile-avatar-option" + (account.avatar === av.id ? " active" : ""));
      if (av.emblem) { const img = el("img"); img.src = av.emblem; img.alt = av.name; b.appendChild(img); }
      else b.appendChild(el("b", null, av.glyph || "GK"));
      b.appendChild(el("span", null, av.name));
      b.dataset.optionId = av.id;
      b.onclick = () => {
        account.avatar = av.id; saveAccountCosmetics();
        avatarGrid.querySelectorAll(".profile-custom-option").forEach((x) => x.classList.toggle("active", x.dataset.optionId === av.id));
        updateHomeAccount(); AudioBox.play("select");
      };
      avatarGrid.appendChild(b);
    }
    const customAvatarBtn = el("button", "profile-custom-option profile-avatar-option" + (account.avatar === "custom" ? " active" : ""));
    customAvatarBtn.appendChild(el("b", null, "＋"));
    customAvatarBtn.appendChild(el("span", null, "自传头像"));
    const avatarFile = document.createElement("input");
    avatarFile.type = "file"; avatarFile.accept = "image/png,image/jpeg,image/webp"; avatarFile.style.display = "none";
    customAvatarBtn.onclick = () => avatarFile.click();
    avatarFile.onchange = () => {
      const file = avatarFile.files && avatarFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const size = 128; const canvas = document.createElement("canvas"); canvas.width = size; canvas.height = size;
          const ctx = canvas.getContext("2d"); const side = Math.min(img.width, img.height);
          ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
          account.customAvatar = canvas.toDataURL("image/webp", 0.82); account.avatar = "custom";
          saveAccountCosmetics(); updateHomeAccount(); avatarGrid.querySelectorAll(".profile-custom-option").forEach(x => x.classList.remove("active")); customAvatarBtn.classList.add("active"); AudioBox.play("select");
        };
        img.src = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    };
    avatarGrid.appendChild(customAvatarBtn); avatarGrid.appendChild(avatarFile);
    avatarSection.appendChild(avatarGrid); content.appendChild(avatarSection);
    const titleSection = el("div", "profile-custom-section");
    titleSection.appendChild(el("h4", null, "称号"));
    const titleGrid = el("div", "profile-custom-grid");
    for (const t of PROFILE_TITLES) {
      const unlocked = t.test();
      const b = el("button", "profile-custom-option" + (account.title === t.id ? " active" : "") + (unlocked ? "" : " locked"));
      b.disabled = !unlocked;
      b.dataset.optionId = t.id;
      b.appendChild(el("strong", null, t.name));
      b.appendChild(el("span", null, unlocked ? t.desc : "未解锁 · " + t.desc));
      b.onclick = () => {
        if (!unlocked) return;
        account.title = t.id; saveAccountCosmetics();
        titleGrid.querySelectorAll(".profile-custom-option").forEach((x) => x.classList.toggle("active", x.dataset.optionId === t.id));
        updateHomeAccount(); AudioBox.play("select");
      };
      titleGrid.appendChild(b);
    }
    titleSection.appendChild(titleGrid); content.appendChild(titleSection);

    const choiceSection = (title, hint, items, currentId, build, onPick) => {
      const section = el("div", "profile-custom-section");
      section.appendChild(el("h4", null, title));
      if (hint) section.appendChild(el("p", "profile-custom-hint", hint));
      const grid = el("div", "profile-custom-grid");
      for (const item of items) {
        const b = el("button", "profile-custom-option" + (currentId === item.id ? " active" : ""));
        b.dataset.optionId = item.id;
        build(b, item);
        b.onclick = () => {
          onPick(item, b, grid);
          grid.querySelectorAll(".profile-custom-option").forEach((x) => x.classList.toggle("active", x.dataset.optionId === item.id));
          saveAccountCosmetics(); updateHomeAccount(); AudioBox.play("select");
        };
        grid.appendChild(b);
      }
      section.appendChild(grid); content.appendChild(section);
      return grid;
    };

    choiceSection("头像框", "只改主页与排位档案里的头像外框，不影响对局数值。", PROFILE_AVATAR_FRAMES, account.avatarFrame || "none", (b, item) => {
      const mark = el("b", "profile-frame-mark", "GK"); mark.style.borderColor = item.color; mark.style.boxShadow = "0 0 12px " + item.color;
      b.appendChild(mark); b.appendChild(el("span", null, item.name));
    }, (item) => { account.avatarFrame = item.id; });

    choiceSection("昵称颜色", "应用到主页和排位档案里的账号昵称。", PROFILE_NAME_COLORS, account.nameColor || "ink", (b, item) => {
      b.appendChild(el("strong", null, "档案员")); b.querySelector("strong").style.color = item.color; b.appendChild(el("span", null, item.name));
    }, (item) => { account.nameColor = item.id; });

    choiceSection("称号底板", "改变称号背后的底板纹理。", PROFILE_TITLE_PLATES, account.titlePlate || "none", (b, item) => {
      const plate = el("b", "profile-plate-preview", profileTitleName(account.title)); plate.dataset.plate = item.id;
      b.appendChild(plate); b.appendChild(el("span", null, item.name));
    }, (item) => { account.titlePlate = item.id; });

    const sigSection = el("div", "profile-custom-section");
    sigSection.appendChild(el("h4", null, "个人签名"));
    sigSection.appendChild(el("p", "profile-custom-hint", "最多 24 字，只显示在本机档案与排位页。"));
    const sigInput = el("input", "account-name-input profile-signature-input");
    sigInput.maxLength = 24; sigInput.value = account.signature || ""; sigInput.placeholder = "例如：只在流脉涨潮时出牌。";
    const saveSig = el("button", "btn btn-small btn-ghost", "保存签名");
    saveSig.onclick = () => { account.signature = String(sigInput.value || "").trim().slice(0, 24); saveAccountCosmetics(); updateHomeAccount(); toast("个人签名已保存。"); };
    sigInput.addEventListener("keydown", (ev) => { if (ev.key === "Enter") saveSig.onclick(); });
    const sigRow = el("div", "account-name-row"); sigRow.appendChild(sigInput); sigRow.appendChild(saveSig); sigSection.appendChild(sigRow); content.appendChild(sigSection);

    const badgeSection = el("div", "profile-custom-section");
    badgeSection.appendChild(el("h4", null, "展示徽章"));
    badgeSection.appendChild(el("p", "profile-custom-hint", "从已解锁成就中最多选 3 个，显示在主页账号栏。"));
    const badgeGrid = el("div", "profile-custom-grid");
    const unlockedBadges = ACHIEVEMENTS.filter(a => !!(app.achievements && app.achievements[a.id] && app.achievements[a.id].unlocked));
    if (!unlockedBadges.length) badgeSection.appendChild(el("p", "muted", "还没有已解锁成就。完成一局或触发流脉后再来。 "));
    const currentBadges = new Set(account.badges || []);
    for (const a of ACHIEVEMENTS) {
      const unlocked = !!unlockedBadges.find(x => x.id === a.id);
      const b = el("button", "profile-custom-option profile-badge-option" + (currentBadges.has(a.id) ? " active" : "") + (unlocked ? "" : " locked"));
      b.disabled = !unlocked;
      b.appendChild(el("b", null, a.icon)); b.appendChild(el("strong", null, a.name)); b.appendChild(el("span", null, a.desc));
      b.onclick = () => {
        if (!unlocked) return;
        const now = new Set(account.badges || []);
        if (now.has(a.id)) now.delete(a.id); else if (now.size < 3) now.add(a.id); else { toast("最多展示 3 个徽章。"); return; }
        account.badges = [...now]; b.classList.toggle("active", now.has(a.id)); saveAccountCosmetics(); updateHomeAccount(); AudioBox.play("select");
      };
      badgeGrid.appendChild(b);
    }
    badgeSection.appendChild(badgeGrid); content.appendChild(badgeSection);

    choiceSection("牌桌主题", "改变对局桌面的边缘光色，不遮挡卡牌与阵位。", PROFILE_TABLE_THEMES, account.tableTheme || "archive", (b, item) => {
      const sw = el("div", "profile-table-swatch"); sw.style.background = "radial-gradient(circle at 50% 40%, " + item.tint + ", rgba(4,15,17,.92))";
      b.appendChild(sw); b.appendChild(el("strong", null, item.name));
    }, (item) => { account.tableTheme = item.id; document.body.dataset.tableTheme = item.id; });

    choiceSection("卡牌牌套", "给手牌和场上随从加一层外框，不改卡面文字。", PROFILE_CARD_FRAMES, account.cardFrame || "none", (b, item) => {
      const mini = el("div", "profile-cardframe-preview"); mini.style.borderColor = item.color; mini.style.boxShadow = "0 0 14px " + item.color;
      b.appendChild(mini); b.appendChild(el("strong", null, item.name));
    }, (item) => { account.cardFrame = item.id; document.body.dataset.cardFrame = item.id; });

    const backSection = el("div", "profile-custom-section");
    backSection.appendChild(el("h4", null, "卡背"));
    const backGrid = el("div", "profile-custom-grid");
    for (const cb of PROFILE_CARD_BACKS) {
      const b = el("button", "profile-custom-option" + (account.cardBack === cb.id ? " active" : ""));
      const preview = el("div", "profile-cardback-preview");
      preview.style.backgroundImage = "url('" + (cb.id === "classic" ? "assets/ui/card_back.svg" : cardBackUrlFor(cb.id)) + "')";
      b.appendChild(preview);
      b.appendChild(el("strong", null, cb.name));
      b.dataset.optionId = cb.id;
      b.onclick = () => {
        account.cardBack = cb.id; saveAccountCosmetics(); applyProfileCardBack();
        backGrid.querySelectorAll(".profile-custom-option").forEach((x) => x.classList.toggle("active", x.dataset.optionId === cb.id));
        updateHomeAccount(); AudioBox.play("select");
      };
      backGrid.appendChild(b);
    }
    backSection.appendChild(backGrid); content.appendChild(backSection);
    const artSection = el("div", "profile-custom-section");
    artSection.appendChild(el("h4", null, "自由替换卡面"));
    artSection.appendChild(el("p", "profile-custom-hint", "打开图鉴，任意卡牌详情里都有「替换卡面」。只保存在本机，可随时恢复原卡面。"));
    const artCodexBtn = el("button", "btn btn-small btn-ghost", "打开图鉴替换卡面");
    artCodexBtn.onclick = () => { closeModal(true); openCodex(); };
    artSection.appendChild(artCodexBtn); content.appendChild(artSection);
    const actions = el("div", "appearance-actions");
    if (pageMode) {
      const backProfile = el("button", "btn btn-small btn-ghost", "返回个人资料");
      backProfile.onclick = () => openProfilePage("personal");
      const done = el("button", "btn btn-primary", "完成");
      done.onclick = () => { updateHomeAccount(); showScreen("home"); };
      actions.appendChild(backProfile); actions.appendChild(done);
    } else {
      const accountBtn = el("button", "btn btn-small btn-ghost", "返回个人资料");
      accountBtn.onclick = () => { closeModal(true); openProfilePage("personal"); };
      const close = el("button", "btn btn-primary", "完成");
      close.onclick = () => closeModal(true);
      actions.appendChild(accountBtn); actions.appendChild(close);
    }
    content.appendChild(actions);
    const cat = app.appearanceCat || "all";
    const sections = [...content.querySelectorAll(".profile-custom-section")];
    const visible = { avatarFrame: [0,2], title: [1,3,4,5,6], cardBack: [7,9], cardFrame: [8] }[cat];
    if (visible) sections.forEach((sec, i) => { sec.hidden = visible.indexOf(i) < 0; });
  }

  function openProfilePage(tab) {
    app.profileTab = tab || app.profileTab || "personal";
    AudioBox.play("ui_open");
    showScreen("profile");
  }

  function profileTabButton(key, label) {
    const b = el("button", "profile-tab" + ((app.profileTab || "personal") === key ? " active" : ""), label);
    b.type = "button";
    b.onclick = () => { app.profileTab = key; renderProfilePage(); };
    return b;
  }

  function renderProfilePage() {
    const root = $("profile-page-root");
    if (!root) return;
    clear(root);
    const account = ensureAccount();
    const pr = account.progress || { level: 1, xp: 0 };
    const rank = rankSummary();
    const hero = el("div", "profile-hero");
    const avatar = el("div", "home-account-avatar");
    const av = PROFILE_AVATARS.find(x => x.id === account.avatar) || PROFILE_AVATARS[0];
    if (account.avatar === "custom" && account.customAvatar) { const img = el("img"); img.src = account.customAvatar; img.alt = "自传头像"; avatar.appendChild(img); }
    else if (av.emblem) { const img = el("img"); img.src = av.emblem; img.alt = av.name; avatar.appendChild(img); }
    else avatar.textContent = av.glyph || "GK";
    avatar.dataset.frame = account.avatarFrame || "none";
    avatar.style.cursor = "pointer";
    avatar.onclick = () => openAppearancePage();
    hero.appendChild(avatar);
    const copy = el("div", "profile-hero-copy");
    copy.appendChild(el("h3", null, account.name || "档案员"));
    copy.appendChild(el("p", null, profileTitleName(account.title) + " · Lv." + pr.level + " · " + (rank.tier || "青铜")));
    const meta = el("div", "profile-hero-meta");
    meta.appendChild(el("span", null, app.auth && app.auth.user ? "已登录 · " + app.auth.user.username : "本地访客"));
    meta.appendChild(el("span", null, "档案局数 " + ((app.profile && app.profile.games) || 0)));
    meta.appendChild(el("span", null, "牌组 " + Object.keys(app.customDecks || {}).length));
    copy.appendChild(meta);
    const heroActions = el("div", "profile-actions");
    const appearance = el("button", "btn btn-small btn-ghost", "档案外观");
    appearance.onclick = () => openAppearancePage();
    heroActions.appendChild(appearance);
    const loginBtn = el("button", "btn btn-small btn-primary", app.auth && app.auth.user ? "账号管理" : "登录 / 注册");
    loginBtn.onclick = () => { app.profileTab = "security"; renderProfilePage(); };
    heroActions.appendChild(loginBtn);
    copy.appendChild(heroActions);
    hero.appendChild(copy);
    root.appendChild(hero);
    const tabs = el("div", "profile-tabs");
    tabs.appendChild(profileTabButton("personal", "个人资料"));
    tabs.appendChild(profileTabButton("security", "账号与安全"));
    tabs.appendChild(profileTabButton("save", "存档同步"));
    tabs.appendChild(profileTabButton("stats", "对局统计"));
    root.appendChild(tabs);
    const panel = el("div", "profile-panel");
    root.appendChild(panel);
    if ((app.profileTab || "personal") === "personal") renderProfilePersonal(panel, account);
    else if (app.profileTab === "security") renderProfileSecurity(panel, account);
    else if (app.profileTab === "save") renderProfileSave(panel, account);
    else renderProfileStats(panel);
  }

  function renderProfilePersonal(panel, account) {
    const head = el("div", "profile-subhead");
    head.appendChild(el("strong", null, "档案信息"));
    head.appendChild(el("small", null, "这些内容会显示在主页和排位页"));
    panel.appendChild(head);
    const grid = el("div", "profile-field-grid");
    const nameField = el("div", "profile-field");
    nameField.appendChild(el("label", null, "昵称"));
    const nameInput = el("input"); nameInput.maxLength = 16; nameInput.value = account.name || ""; nameInput.placeholder = "档案员";
    nameField.appendChild(nameInput); grid.appendChild(nameField);
    const sigField = el("div", "profile-field");
    sigField.appendChild(el("label", null, "个性签名"));
    const sigInput = el("input"); sigInput.maxLength = 40; sigInput.value = account.signature || ""; sigInput.placeholder = "例如：只在流脉涨潮时出牌。";
    sigField.appendChild(sigInput); grid.appendChild(sigField);
    panel.appendChild(grid);
    const actions = el("div", "profile-actions");
    const save = el("button", "btn btn-primary", "保存个人资料");
    save.onclick = () => {
      const name = String(nameInput.value || "").trim().slice(0, 16) || "档案员";
      account.name = name; account.signature = String(sigInput.value || "").trim().slice(0, 40);
      try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account)); localStorage.setItem(ACCOUNT_NAMED_KEY, "1"); } catch (e) {}
      snapshotSave("profile-edit"); updateHomeAccount(); renderProfilePage(); toast("个人资料已保存。");
    };
    actions.appendChild(save);
    panel.appendChild(actions);
    const note = el("p", "profile-custom-hint", "头像、头像框、称号、卡背和牌桌主题在「档案外观」里修改。");
    panel.appendChild(note);
  }

  function renderProfileSecurity(panel, account) {
    const head = el("div", "profile-subhead");
    head.appendChild(el("strong", null, "账号与安全"));
    head.appendChild(el("small", null, app.auth && app.auth.user ? "已登录账号" : "本地访客"));
    panel.appendChild(head);
    const status = el("div", "profile-status");
    const one = el("div"); one.appendChild(el("strong", null, app.auth && app.auth.user ? app.auth.user.username : "未登录")); one.appendChild(el("small", null, app.auth && app.auth.user ? "云端存档与排位已开启" : "登录后可跨设备同步并参加排位")); status.appendChild(one);
    const two = el("div"); two.appendChild(el("strong", null, "本地档案")); two.appendChild(el("small", null, "始终可用，不会因为登录失败丢失")); status.appendChild(two);
    panel.appendChild(status);
    if (!(app.auth && app.auth.user)) {
      panel.appendChild(el("p", "profile-custom-hint", "游客可以继续单人、房间和休闲；排位需要登录。"));
      const actions = el("div", "profile-actions");
      const login = el("button", "btn btn-primary", "登录账号"); login.onclick = () => openLoginPage("login"); actions.appendChild(login);
      const reg = el("button", "btn btn-ghost", "注册新账号"); reg.onclick = () => openLoginPage("register"); actions.appendChild(reg);
      panel.appendChild(actions);
      return;
    }
    const actions = el("div", "profile-actions");
    const logout = el("button", "btn btn-small btn-ghost", "退出登录");
    logout.onclick = async () => { try { await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }); } catch (e) {} app.auth = { user: null }; app.cloudSyncState = "idle"; app.cloudConflict = null; renderProfilePage(); updateHomeAccount(); toast("已退出账号，本地档案仍保留。"); };
    actions.appendChild(logout);
    const pwd = el("button", "btn btn-small btn-ghost", "修改密码"); pwd.onclick = () => openLoginPage("password"); actions.appendChild(pwd);
    const rec = el("button", "btn btn-small btn-ghost", "生成恢复码");
    rec.onclick = async () => {
      try {
        const data = await authJson("/api/account/recovery-code", {});
        openRecoveryPage(data.recoveryCode, "profile");
      } catch (e) { toast("生成恢复码失败：" + (e.message || e)); }
    };
    actions.appendChild(rec);
    panel.appendChild(actions);

    const danger = el("div", "profile-danger-zone");
    danger.appendChild(el("strong", null, "删除云端账号"));
    danger.appendChild(el("p", null, "只删除账号、云存档和登录会话；本机档案仍会保留。此操作不可撤销。"));
    const delPass = document.createElement("input"); delPass.type = "password"; delPass.placeholder = "输入当前密码确认"; delPass.autocomplete = "current-password";
    const delBtn = el("button", "btn btn-small btn-danger", "删除账号");
    delBtn.onclick = async () => {
      if (!delPass.value) { toast("请输入当前密码。"); return; }
      if (!confirm("确认删除云端账号？此操作不可撤销。")) return;
      delBtn.disabled = true;
      try {
        const res = await fetch("/api/account", { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ password: delPass.value }) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "删除失败");
        app.auth = { user: null }; app.cloudSaveVersion = 0; app.cloudSaveAt = 0; app.cloudConflict = null; app.cloudSyncState = "idle";
        updateHomeAccount(); toast("云端账号已删除，本机档案仍保留。"); openProfilePage("security");
      } catch (e) { toast("删除失败：" + (e.message || e)); } finally { delBtn.disabled = false; }
    };
    danger.appendChild(delPass); danger.appendChild(delBtn); panel.appendChild(danger);
  }

  function renderProfileSave(panel, account) {
    const head = el("div", "profile-subhead");
    head.appendChild(el("strong", null, "存档同步"));
    head.appendChild(el("small", null, "本地优先 · 登录后同步"));
    panel.appendChild(head);
    const status = el("div", "profile-status");
    const local = el("div"); local.appendChild(el("strong", null, "本地档案")); local.appendChild(el("small", null, "最近保存于本机")); status.appendChild(local);
    const cloudState = app.cloudSyncState === "conflict" ? "云端存档冲突" : app.cloudSyncState === "syncing" ? "同步中…" : app.cloudSyncState === "error" ? "同步失败" : app.cloudSaveAt ? "已同步" : "尚未同步";
    const cloud = el("div"); cloud.appendChild(el("strong", null, app.auth && app.auth.user ? cloudState : "云端未连接")); cloud.appendChild(el("small", null, app.auth && app.auth.user ? (app.cloudSaveAt ? "最近同步 " + new Date(app.cloudSaveAt).toLocaleString() : "保存时自动同步") : "登录后开启云端同步")); status.appendChild(cloud);
    panel.appendChild(status);
    const actions = el("div", "profile-actions");
    const exp = el("button", "btn btn-small btn-ghost", "导出存档文件"); exp.onclick = downloadSaveFile; actions.appendChild(exp);
    if (!(app.auth && app.auth.user)) { const login = el("button", "btn btn-small btn-primary", "登录并同步"); login.onclick = () => openLoginPage("login"); actions.appendChild(login); }
    if (app.auth && app.auth.user) {
      if (app.cloudConflict) {
        const conflictBox = el("div", "sync-conflict-box");
        conflictBox.appendChild(el("strong", null, "需要选择保留哪一份"));
        const cloudAt = app.cloudConflict && app.cloudConflict.save && app.cloudConflict.save.updatedAt ? new Date(app.cloudConflict.save.updatedAt).toLocaleString() : "未知时间";
        conflictBox.appendChild(el("p", null, "云端存档：版本 " + (app.cloudConflict && app.cloudConflict.save ? app.cloudConflict.save.version : "?") + " · " + cloudAt + "。本地与云端不会静默互相覆盖。"));
        panel.appendChild(conflictBox);
      }
      const upload = el("button", "btn btn-small btn-primary", app.cloudConflict ? "保留本地 · 覆盖云端" : "立即上传本地档案");
      upload.onclick = async () => { await syncCloudSave(true); updateHomeAccount(); renderProfilePage(); };
      actions.appendChild(upload);
      const pull = el("button", "btn btn-small btn-ghost", app.cloudConflict ? "使用云端 · 覆盖本地" : "从云端恢复");
      pull.onclick = async () => {
        try {
          const res = await fetch("/api/account/save", { credentials: "same-origin" });
          const data = await res.json();
          if (!data.save || !data.save.save) { toast("云端还没有可恢复的档案。"); return; }
          applySaveBundle(data.save.save); app.cloudSaveVersion = data.save.version || 0; app.cloudSaveAt = data.save.updatedAt || Date.now(); app.cloudConflict = null; app.cloudSyncState = "synced"; updateHomeAccount(); toast("已使用云端档案覆盖本地。"); renderProfilePage();
        } catch (e) { app.cloudSyncState = "error"; toast("恢复失败：" + (e.message || e)); }
      };
      actions.appendChild(pull);
    }
    panel.appendChild(actions);
    panel.appendChild(el("p", "profile-custom-hint", "云存档冲突时会先让你选择保留哪一份，不会静默覆盖本地。 "));
  }

  function renderProfileStats(panel) {
    const p = app.profile || {};
    const head = el("div", "profile-subhead"); head.appendChild(el("strong", null, "对局统计")); head.appendChild(el("small", null, "全部模式")); panel.appendChild(head);
    const grid = el("div", "profile-field-grid");
    const stats = [["总对局", p.games || 0], ["胜场", p.wins || 0], ["负场", p.losses || 0], ["胜率", (p.games ? Math.round((p.wins || 0) / p.games * 100) : 0) + "%"]];
    for (const [k, v] of stats) { const d = el("div", "profile-status"); const x = el("div"); x.appendChild(el("strong", null, String(v))); x.appendChild(el("small", null, k)); d.appendChild(x); grid.appendChild(d); }
    panel.appendChild(grid);
  }

  function openLoginPage(mode) {
    app.loginMode = mode || "login";
    AudioBox.play("ui_open");
    showScreen("login");
  }

  async function authJson(path, body) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body || {})
    });
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (!res.ok || data.ok === false) throw new Error(data.error || ("请求失败 " + res.status));
    return data;
  }

  function renderRecoveryPage() {
    const root = $("recovery-page-root");
    if (!root) return;
    clear(root);
    const card = el("div", "recovery-card");
    card.appendChild(el("div", "eyebrow", "ACCOUNT RECOVERY"));
    card.appendChild(el("h3", null, "保存这组恢复码"));
    card.appendChild(el("p", null, "忘记密码时，用它和新密码就能找回账号。恢复码只显示这一次。"));
    const code = el("div", "recovery-code", app.pendingRecoveryCode || "—");
    card.appendChild(code);
    card.appendChild(el("p", "recovery-warning", "不要发给别人。建议截图、抄写或存进密码管理器。使用过一次后会自动失效，可随时在账号与安全页重新生成。"));
    const actions = el("div", "recovery-actions");
    const copy = el("button", "btn btn-small btn-ghost", "复制恢复码");
    copy.onclick = async () => {
      try { await navigator.clipboard.writeText(app.pendingRecoveryCode || ""); toast("恢复码已复制。"); }
      catch (e) { toast("复制失败，请手动抄写。"); }
    };
    const done = el("button", "btn btn-primary", "我已保存");
    done.onclick = () => {
      app.pendingRecoveryCode = "";
      const back = app.recoveryReturn || "profile";
      showScreen(back);
      if (back === "home") setTimeout(startOnboardingIfNeeded, 300);
    };
    actions.appendChild(copy); actions.appendChild(done); card.appendChild(actions); root.appendChild(card);
  }

  function openRecoveryPage(code, returnScreen) {
    app.pendingRecoveryCode = code || "";
    app.recoveryReturn = returnScreen || "profile";
    AudioBox.play("ui_open");
    showScreen("recovery");
  }

  function renderLoginPage() {
    const root = $("login-page-root");
    const backBtn = $("btn-login-back"); if (backBtn) backBtn.hidden = !!app.authGate;
    if (!root) return;
    clear(root);
    const mode = app.loginMode || "login";
    const wrap = el("div", "login-wrap");
    wrap.appendChild(el("div", "eyebrow", "ARCHIVE / ACCOUNT"));
    wrap.appendChild(el("h3", null, mode === "register" ? "注册档案账号" : mode === "password" ? "修改密码" : mode === "recover" ? "找回密码" : "登录档案"));
    wrap.appendChild(el("p", null, mode === "register" ? "注册后会显示一组恢复码，请务必保存。用户名和密码不会显示给其他玩家。" : mode === "password" ? "修改密码需要先登录。修改后其他设备需要重新登录。" : mode === "recover" ? "输入用户名和之前保存的恢复码，设置新密码。" : "登录后可以跨设备同步档案，并解锁在线排位。"));
    if (mode !== "password") {
      const tabs = el("div", "login-tabs");
      for (const [key, label] of [["login", "登录"], ["register", "注册"], ["recover", "找回"]]) {
        const b = el("button", "login-tab" + (mode === key ? " active" : ""), label);
        b.type = "button"; b.onclick = () => { app.loginMode = key; renderLoginPage(); };
        tabs.appendChild(b);
      }
      wrap.appendChild(tabs);
    }
    const fields = el("div", "login-fields");
    const input = (label, type, name, ph) => {
      const l = el("label", null, label);
      const i = document.createElement("input"); i.type = type || "text"; i.name = name; i.placeholder = ph || ""; i.autocomplete = name === "password" ? "current-password" : "username";
      l.appendChild(i); fields.appendChild(l); return i;
    };
    const user = mode === "password" ? null : input("用户名", "text", "username", "3–20 位字母 / 数字 / 下划线");
    const nick = mode === "register" ? input("昵称", "text", "displayName", "游戏内显示名，可中文") : null;
    const recovery = mode === "recover" ? input("恢复码", "text", "recoveryCode", "XXXX-XXXX-XXXX-XXXX") : null;
    const pass = input(mode === "recover" ? "新密码" : "密码", "password", "password", "至少 8 位");
    const pass2 = mode === "register" || mode === "recover" ? input("确认密码", "password", "password2", "再输入一次") : null;
    wrap.appendChild(fields);
    const err = el("div", "login-error"); wrap.appendChild(err);
    const actions = el("div", "profile-actions");
    const submit = el("button", "btn btn-primary", mode === "register" ? "创建账号" : mode === "password" ? "修改密码" : mode === "recover" ? "重置密码" : "登录");
    submit.onclick = async () => {
      err.textContent = "";
      submit.disabled = true;
      try {
        if (mode === "register") {
          if (pass.value !== pass2.value) throw new Error("两次输入的密码不一致。");
          const data = await authJson("/api/auth/register", { username: user.value.trim(), password: pass.value, displayName: nick.value.trim() });
          app.auth = { user: data.user };
          app.authGate = false;
          if (data.save) applySaveBundle(data.save);
          await syncCloudSave(true);
          updateHomeAccount();
          if (data.recoveryCode) { openRecoveryPage(data.recoveryCode, "home"); return; }
          toast("账号已创建，本地档案已合并。");
        } else if (mode === "recover") {
          if (pass.value !== pass2.value) throw new Error("两次输入的密码不一致。");
          const data = await authJson("/api/auth/recover", { username: user.value.trim(), recoveryCode: recovery.value.trim(), password: pass.value });
          app.auth = { user: data.user };
          app.authGate = false;
          if (data.save) applySaveBundle(data.save);
          app.cloudSyncState = "synced";
          updateHomeAccount();
          toast("密码已重置并登录。");
          showScreen("home"); setTimeout(startOnboardingIfNeeded, 300);
          return;
        } else if (mode === "password") {
          const data = await authJson("/api/account/change-password", { password: pass.value });
          app.auth = { user: data.user || app.auth.user };
          toast("密码已修改。");
        } else {
          const data = await authJson("/api/auth/login", { username: user.value.trim(), password: pass.value });
          app.auth = { user: data.user };
          if (data.save) applySaveBundle(data.save);
          toast("登录成功。");
        }
        updateHomeAccount();
        app.authGate = false;
        showScreen("home");
        setTimeout(startOnboardingIfNeeded, 300);
      } catch (e) {
        err.textContent = e.message || String(e);
      } finally { submit.disabled = false; }
    };
    actions.appendChild(submit);
    const guest = el("button", "btn btn-small btn-ghost", app.authGate ? "游客登录（不保存云端）" : "以访客身份继续");
    guest.onclick = () => { app.authGate = false; try { localStorage.setItem(GUEST_KEY, "1"); } catch (e) {} showScreen("home"); };
    actions.appendChild(guest);
    wrap.appendChild(actions);
    wrap.appendChild(el("div", "login-note", "服务器位于新加坡。若登录缓慢，请检查网络或使用网络加速器。"));
    root.appendChild(wrap);
  }

  function openProfileCustomization() {
    openAppearancePage();
  }

  function openAppearancePage() {
    snapshotSave("open-cosmetics");
    showScreen("appearance");
  }

  function renderAppearancePage() {
    const root = $("appearance-page-root");
    if (!root) return;
    clear(root);
    const account = ensureAccount();
    const layout = el("div", "appearance-layout");
    const side = el("div", "appearance-side");
    const cats = [["all", "全部外观"], ["avatarFrame", "头像 / 头像框"], ["title", "称号 / 名字色"], ["cardBack", "卡背 / 牌桌"], ["cardFrame", "卡牌牌套"]];
    for (const [key, label] of cats) {
      const b = el("button", "appearance-cat" + ((app.appearanceCat || "all") === key ? " active" : ""), label);
      b.type = "button";
      b.onclick = () => { app.appearanceCat = key; openAppearancePage(); };
      side.appendChild(b);
    }
    layout.appendChild(side);
    const right = el("div", "appearance-main");
    const preview = el("div", "appearance-preview");
    const avatar = el("div", "home-account-avatar");
    const av = PROFILE_AVATARS.find(x => x.id === account.avatar) || PROFILE_AVATARS[0];
    if (account.avatar === "custom" && account.customAvatar) { const img = el("img"); img.src = account.customAvatar; img.alt = "自传头像"; avatar.appendChild(img); }
    else if (av.emblem) { const img = el("img"); img.src = av.emblem; img.alt = av.name; avatar.appendChild(img); }
    else avatar.textContent = av.glyph || "GK";
    avatar.dataset.frame = account.avatarFrame || "none";
    preview.appendChild(avatar);
    const pv = el("div"); pv.appendChild(el("h3", null, account.name || "档案员")); pv.appendChild(el("p", null, profileTitleName(account.title) + " · " + (account.signature || "还没有签名"))); preview.appendChild(pv);
    right.appendChild(preview);
    const content = el("div", "appearance-content");
    right.appendChild(content);
    layout.appendChild(right);
    root.appendChild(layout);
    renderProfileCustomization(content, true);
  }

  function openAccountModal() {
    ensureAccount();
    snapshotSave("open-account");
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "ARCHIVE / LOCAL SAVE"));
      content.appendChild(el("h3", null, "本地账号与存档"));
      content.appendChild(el("p", null, "账号与存档保存在本机。换设备时用存档文件或存档码迁移。后续更新不会覆盖已有牌组，旧格式牌组也会保留在备份中。"));
      const account = app.account;
      const accountLine = el("div", "account-line");
      accountLine.appendChild(el("strong", null, account.name || "档案员"));
      accountLine.appendChild(el("small", null, "称号：" + profileTitleName(account.title) + " · 账号 ID：" + account.id));
      content.appendChild(accountLine);
      const nameRow = el("div", "account-name-row");
      const nameInput = el("input", "account-name-input");
      nameInput.type = "text";
      nameInput.maxLength = 24;
      nameInput.value = account.name || "档案员";
      nameInput.placeholder = "账号昵称";
      const saveName = el("button", "btn btn-small btn-ghost", "保存昵称");
      saveName.onclick = () => {
        const name = String(nameInput.value || "").trim().slice(0, 24) || "档案员";
        app.account.name = name;
        try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(app.account)); localStorage.setItem(ACCOUNT_NAMED_KEY, "1"); } catch (e) {}
        snapshotSave("rename-account");
        toast("账号昵称已保存。");
        accountLine.querySelector("strong").textContent = name;
        updateHomeAccount();
      };
      nameRow.appendChild(nameInput);
      nameRow.appendChild(saveName);
      content.appendChild(nameRow);
      const appearance = el("button", "btn btn-small btn-primary", "档案外观 · 头像 / 称号 / 卡背");
      appearance.onclick = () => { closeModal(true); openProfileCustomization(); };
      content.appendChild(appearance);
      const summary = el("div", "account-summary");
      const validDecks = Object.keys(app.customDecks || {}).length;
      const legacyDecks = Object.keys(app.legacyDecks || {}).length;
      summary.appendChild(el("span", null, "有效牌组 " + validDecks + " 套"));
      summary.appendChild(el("span", null, "旧格式备份 " + legacyDecks + " 套"));
      summary.appendChild(el("span", null, "档案局数 " + ((app.profile && app.profile.games) || 0)));
      content.appendChild(summary);
      if (legacyDecks > 0) content.appendChild(el("p", "account-warn", "发现旧格式牌组：" + Object.keys(app.legacyDecks).map(f => D.FACTIONS[f] ? D.FACTIONS[f].name : f).join("、") + "。原始数据已保留在存档中，不会丢弃。"));
      const codeLabel = el("label", "account-label", "存档码");
      content.appendChild(codeLabel);
      const codeArea = el("textarea", "account-code");
      codeArea.readOnly = false;
      codeArea.placeholder = "点击「生成存档码」，或粘贴别人的存档码后恢复";
      content.appendChild(codeArea);
      const actions = el("div", "modal-actions account-actions");
      const exportBtn = el("button", "btn btn-small btn-primary", "导出存档文件");
      exportBtn.onclick = downloadSaveFile;
      actions.appendChild(exportBtn);
      const codeBtn = el("button", "btn btn-small btn-ghost", "生成存档码");
      codeBtn.onclick = () => {
        try { codeArea.value = encodeSaveCode(collectSaveBundle()); codeArea.select(); toast("存档码已生成，可复制。"); }
        catch (e) { toast("生成失败：" + (e.message || e)); }
      };
      actions.appendChild(codeBtn);
      const copyBtn = el("button", "btn btn-small btn-ghost", "复制存档码");
      copyBtn.onclick = async () => {
        try {
          if (!codeArea.value) codeArea.value = encodeSaveCode(collectSaveBundle());
          codeArea.select();
          if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(codeArea.value);
          else document.execCommand("copy");
          toast("存档码已复制。");
        } catch (e) { toast("复制失败，请手动全选复制。"); }
      };
      actions.appendChild(copyBtn);
      const importFileBtn = el("button", "btn btn-small btn-ghost", "导入存档文件");
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json,application/json";
      fileInput.style.display = "none";
      fileInput.onchange = async () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        try {
          const bundle = JSON.parse(await file.text());
          applySaveBundle(bundle);
          toast("存档已导入，正在重载…");
          closeModal(true);
          setTimeout(() => location.reload(), 450);
        } catch (e) { toast("导入失败：" + (e.message || e)); }
      };
      importFileBtn.onclick = () => fileInput.click();
      actions.appendChild(importFileBtn);
      actions.appendChild(fileInput);
      const codeImportBtn = el("button", "btn btn-small btn-ghost", "从存档码恢复");
      codeImportBtn.onclick = () => {
        try {
          const bundle = decodeSaveCode(codeArea.value);
          applySaveBundle(bundle);
          toast("存档已恢复，正在重载…");
          closeModal(true);
          setTimeout(() => location.reload(), 450);
        } catch (e) { toast("存档码无效或已损坏。"); }
      };
      actions.appendChild(codeImportBtn);
      const backupBtn = el("button", "btn btn-small btn-ghost", "恢复最近备份");
      backupBtn.onclick = () => {
        try {
          const raw = localStorage.getItem(SAVE_BACKUP_KEY);
          if (!raw) { toast("还没有自动备份。"); return; }
          const parsed = JSON.parse(raw);
          applySaveBundle(parsed.bundle);
          toast("最近备份已恢复，正在重载…");
          closeModal(true);
          setTimeout(() => location.reload(), 450);
        } catch (e) { toast("备份恢复失败：" + (e.message || e)); }
      };
      actions.appendChild(backupBtn);
      const closeBtn = el("button", "btn btn-small btn-ghost", "关闭");
      closeBtn.onclick = () => closeModal(true);
      actions.appendChild(closeBtn);
      content.appendChild(actions);
      const danger = el("div", "account-danger");
      const dangerCopy = el("div", "account-danger-copy");
      dangerCopy.appendChild(el("strong", null, "删除本地存档"));
      dangerCopy.appendChild(el("small", null, "清除账号、牌组、成就和进度；设置与教程记录保留。"));
      danger.appendChild(dangerCopy);
      const deleteBtn = el("button", "btn btn-small btn-danger account-delete-btn", "删除存档");
      deleteBtn.onclick = confirmDeleteSave;
      danger.appendChild(deleteBtn);
      content.appendChild(danger);
      content.appendChild(el("p", "fine-print", "存档包含：自定义牌组、旧牌组备份、装备选择、成就、档案统计与设置。存档只保存在本机，不会自动上传服务器。"));
    });
  }

  function maybePromptArchiveName() {
    return; // 首次建档改为主页新手引导，不再弹窗。
    // 无头自动化测试不弹首次建档框；需要验证首次流程时设置 gok_force_first_run=1。
    try { if (navigator.webdriver && localStorage.getItem("gok_force_first_run") !== "1") return; } catch (e) {}
    let named = false;
    try { named = localStorage.getItem(ACCOUNT_NAMED_KEY) === "1"; } catch (e) {}
    if (named) return;
    const account = ensureAccount();
    if (account.name && account.name !== "档案员") return;
    if (app.screen !== "home" || app.modalOpen) return;
    openModal((content) => {
      content.classList.add("first-run-account");
      content.appendChild(el("div", "eyebrow", "FIRST OPENING / ARCHIVE"));
      content.appendChild(el("h3", null, "先给你的档案起个名字"));
      content.appendChild(el("p", null, "这个名字会显示在主页存档牌上，也会跟着你的牌组、远征进度、成就一起保存在本机。之后可以在「账号与存档」里修改。"));
      const input = el("input", "account-name-input first-run-name");
      input.type = "text";
      input.maxLength = 24;
      input.placeholder = "例如：灰港旅人";
      input.value = account.name && account.name !== "档案员" ? account.name : "";
      content.appendChild(input);
      const actions = el("div", "modal-actions");
      const save = el("button", "btn btn-primary", "确认档案名");
      save.onclick = () => {
        const name = String(input.value || "").trim().slice(0, 24);
        if (!name) { toast("请输入一个档案名。"); input.focus(); return; }
        app.account.name = name;
        try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(app.account)); localStorage.setItem(ACCOUNT_NAMED_KEY, "1"); } catch (e) {}
        snapshotSave("first-run-name");
        updateHomeAccount();
        closeModal(true);
        toast("档案已建立：" + name);
      };
      const skip = el("button", "btn btn-ghost", "稍后再说");
      skip.onclick = () => { try { localStorage.setItem(ACCOUNT_NAMED_KEY, "1"); } catch (e) {} closeModal(true); };
      actions.appendChild(skip);
      actions.appendChild(save);
      content.appendChild(actions);
      setTimeout(() => input.focus(), 50);
    });
  }

  function applyProfileCardBack() {
    const url = cardBackUrl();
    const absolute = /^data:/.test(url) ? url : new URL(url, location.href).href;
    document.documentElement.style.setProperty("--card-back-image", "url('" + absolute + "')");
  }

  function renderRankIdentity() {
    const account = ensureAccount();
    const avatar = $("rank-identity-avatar");
    if (avatar) {
      clear(avatar);
      const av = PROFILE_AVATARS.find(x => x.id === account.avatar) || PROFILE_AVATARS[0];
      if (account.avatar === "custom" && account.customAvatar) { const img = el("img"); img.src = account.customAvatar; img.alt = "自传头像"; avatar.appendChild(img); }
      else if (av.emblem) { const img = el("img"); img.src = av.emblem; img.alt = av.name; avatar.appendChild(img); }
      else avatar.textContent = av.glyph || "GK";
      avatar.dataset.frame = account.avatarFrame || "none";
    }
    const name = $("rank-identity-name");
    if (name) {
      name.textContent = account.name || "档案员";
      name.style.color = (PROFILE_NAME_COLORS.find(x => x.id === account.nameColor) || PROFILE_NAME_COLORS[0]).color;
    }
    const title = $("rank-identity-title");
    if (title) { title.textContent = profileTitleName(account.title); title.dataset.plate = account.titlePlate || "none"; }
    const sig = $("rank-identity-signature"); if (sig) { sig.textContent = account.signature || ""; sig.hidden = !account.signature; }
    const badges = $("rank-identity-badges");
    if (badges) {
      clear(badges);
      (account.badges || []).map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean).forEach(a => {
        const chip = el("span", "home-account-badge", a.icon + " " + a.name); chip.title = a.desc; badges.appendChild(chip);
      });
    }
  }

  function updateHomeAccount() {
    const account = ensureAccount();
    const nameEl = $("home-account-name");
    const metaEl = $("home-account-meta");
    const levelEl = $("home-account-level");
    const statusEl = $("home-account-status");
    if (nameEl) nameEl.textContent = account.name || "档案员";
    if (levelEl) levelEl.textContent = "Lv." + ((account.progress && account.progress.level) || 1);
    if (statusEl) {
      const sync = app.cloudSyncState === "conflict" ? "存档冲突" : app.cloudSyncState === "syncing" ? "同步中" : app.cloudSyncState === "error" ? "同步失败" : "已同步";
      statusEl.textContent = app.auth && app.auth.user ? sync + " · " + app.auth.user.username : "本地访客";
      statusEl.dataset.sync = app.auth && app.auth.user ? app.cloudSyncState : "local";
    }
    const titleEl = $("home-account-title");
    if (titleEl) titleEl.textContent = profileTitleName(account.title);
    const avatarEl = $("home-account-avatar");
    if (avatarEl) {
      clear(avatarEl);
      const av = PROFILE_AVATARS.find(x => x.id === account.avatar) || PROFILE_AVATARS[0];
      if (account.avatar === "custom" && account.customAvatar) { const img = el("img"); img.src = account.customAvatar; img.alt = "自传头像"; avatarEl.appendChild(img); }
      else if (av.emblem) { const img = el("img"); img.src = av.emblem; img.alt = av.name; avatarEl.appendChild(img); }
      else avatarEl.textContent = av.glyph || "GK";
      avatarEl.dataset.frame = account.avatarFrame || "none";
    }
    if (nameEl) {
      const nc = PROFILE_NAME_COLORS.find(x => x.id === account.nameColor) || PROFILE_NAME_COLORS[0];
      nameEl.style.color = nc.color;
    }
    if (titleEl) {
      titleEl.dataset.plate = account.titlePlate || "none";
    }
    const sigEl = $("home-account-signature");
    if (sigEl) { sigEl.textContent = account.signature || ""; sigEl.hidden = !account.signature; }
    const badgesEl = $("home-account-badges");
    if (badgesEl) {
      clear(badgesEl);
      const badges = (account.badges || []).map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);
      badges.forEach(a => {
        const chip = el("span", "home-account-badge", a.icon + " " + a.name);
        chip.title = a.desc;
        badgesEl.appendChild(chip);
      });
      badgesEl.hidden = !badges.length;
    }
    document.body.dataset.tableTheme = account.tableTheme || "archive";
    document.body.dataset.cardFrame = account.cardFrame || "none";
    applyProfileCardBack();
    const cardBackEl = $("home-account-cardback");
    if (cardBackEl) {
      const cb = cardBackDefinition(account.cardBack || "classic");
      cardBackEl.style.backgroundImage = "url('" + cardBackUrl() + "')";
      cardBackEl.textContent = cb.glyph || "GK";
      cardBackEl.title = "当前卡背：" + cb.name;
    }
    if (!metaEl) return;
    let content = {};
    try { content = JSON.parse(localStorage.getItem("gok_content_v1") || "{}"); } catch (e) {}
    let backup = null;
    try { backup = JSON.parse(localStorage.getItem(SAVE_BACKUP_KEY) || "null"); } catch (e) {}
    const time = backup && backup.savedAt ? new Date(backup.savedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) : null;
    const deckCount = Object.keys(app.customDecks || {}).length;
    const pr = account.progress || { level: 1, xp: 0 };
    const need = levelNeed(pr.level);
    const levelText = pr.level >= LEVEL_MAX ? "Lv.30 MAX" : "Lv." + pr.level + " · XP " + pr.xp + "/" + need;
    metaEl.textContent = levelText + " · " + (time ? "自动备份 " + time : "自动备份已就绪") + " · 牌组 " + deckCount + " · 街机印记 " + (content.marks || 0);
    const dock = document.querySelector(".home-account-dock");
    if (dock) dock.classList.toggle("unset", !account.name || account.name === "档案员");
  }

  function renderHomeDash() {
    const statusEl = $("home-arcade-status");
    const ctaEl = $("home-arcade-cta");
    if (!statusEl && !ctaEl) return;
    let content = {};
    try { content = JSON.parse(localStorage.getItem("gok_content_v1") || "{}") || {}; } catch (e) {}
    const date = new Date().toISOString().slice(0, 10);
    const daily = content.daily && content.daily.date === date ? content.daily.result : null;
    const expedition = content.expedition;
    const arena = content.arena;
    let active = null;
    if (expedition && !expedition.finished && expedition.nodes && expedition.node < expedition.nodes.length) {
      active = "继续远征 · 节点 " + (expedition.node + 1) + "/" + expedition.nodes.length;
    } else if (arena && arena.active) {
      active = "继续轮抽 · " + arena.picks + "/10 选";
    }
    if (statusEl) {
      if (active) statusEl.textContent = active + " · 印记 " + (content.marks || 0);
      else if (daily) statusEl.textContent = (daily === "win" ? "今日已通关" : "今日已结算") + " · 印记 " + (content.marks || 0);
      else statusEl.textContent = "今日挑战待推演 · 印记 " + (content.marks || 0);
    }
    if (ctaEl) ctaEl.innerHTML = (active ? "继续档案" : "进入街机") + " <i>→</i>";
  }

  function afterAccountUI() { updateHomeAccount(); }

  function updateHomeProfile() {
    const p = app.profile || { games: 0, wins: 0 };
    const level = 1 + Math.floor((p.games || 0) / 5);
    const el = $("home-profile");
    if (el) el.textContent = "档案等级 " + level + " · " + (p.games || 0) + " 局 · " + (p.wins || 0) + " 胜";
    if (app.screen === "rank") renderRankScreen();
  }

  function recordGameProfile() {
    if (!app.game || app.profileRecorded) return;
    app.profileRecorded = true;
    if (app.tutorial) return;
    const s = app.game;
    const p = app.profile || loadProfile();
    p.games = (p.games || 0) + 1;
    p.wins = p.wins || 0;
    p.losses = p.losses || 0;
    p.draws = p.draws || 0;
    p.byFaction = p.byFaction || {};
    p.history = p.history || [];
    const me = s.players[app.human];
    const opp = s.players[1 - app.human];
    const result = s.winner == null ? "draw" : s.winner === app.human ? "win" : "loss";
    if (result === "win") p.wins++;
    else if (result === "loss") p.losses++;
    else p.draws++;
    let rankChange = null;
    if (s.ranked) {
      const before = p.rankPoints || 0;
      const delta = result === "win" ? 25 : result === "loss" ? -15 : 0;
      p.rankPoints = Math.max(0, before + delta);
      p.rankMatches = (p.rankMatches || 0) + 1;
      if (result === "win") {
        p.rankWins = (p.rankWins || 0) + 1;
        p.rankStreak = (p.rankStreak || 0) + 1;
        p.rankBestStreak = Math.max(p.rankBestStreak || 0, p.rankStreak);
      } else if (result === "loss") {
        p.rankLosses = (p.rankLosses || 0) + 1;
        p.rankStreak = 0;
      }
      p.rankPeak = Math.max(p.rankPeak || 0, p.rankPoints);
      const b = rankInfo(before), a = rankInfo(p.rankPoints);
      rankChange = { before: before, after: p.rankPoints, delta: p.rankPoints - before, beforeTier: b.tier, afterTier: a.tier, result: result };
      app.rankChange = rankChange;
    }
    const f = p.byFaction[me.faction] || { games: 0, wins: 0 };
    f.games++;
    if (result === "win") f.wins++;
    p.byFaction[me.faction] = f;
    p.maxRound = Math.max(p.maxRound || 0, s.round || 0);
    p.history.unshift({ at: Date.now(), faction: me.faction, opponent: opp.faction, result: result, round: s.round || 0, ranked: !!s.ranked, rankDelta: rankChange ? rankChange.delta : 0 });
    p.history = p.history.slice(0, 8);
    app.profile = p;
    persistProfile();
    updateHomeProfile();
    if (s.ranked && rankChange && rankChange.delta !== 0) toast("排位 " + (rankChange.delta > 0 ? "+" : "") + rankChange.delta + " · " + rankText(rankChange.after));
  }

  function renderProfileGrid() {
    const grid = $("profile-grid");
    if (!grid) return;
    clear(grid);
    const p = app.profile || loadProfile();
    const winRate = p.games ? (p.wins / p.games * 100) : 0;
    const items = [
      ["档案等级", 1 + Math.floor((p.games || 0) / 5)],
      ["段位", rankText(p.rankPoints || 0)],
      ["排位分", p.rankPoints || 0],
      ["排位胜场", p.rankWins || 0],
      ["总对局", p.games || 0],
      ["胜场", p.wins || 0],
      ["胜率", winRate.toFixed(0) + "%"],
      ["最长轮数", p.maxRound || 0],
      ["成就", Object.keys(app.achievements || {}).filter(k => app.achievements[k] && app.achievements[k].unlocked).length + " / " + ACHIEVEMENTS.length]
    ];
    for (const pair of items) {
      const box = el("div", "profile-stat");
      box.appendChild(el("span", null, pair[0]));
      box.appendChild(el("strong", null, String(pair[1])));
      grid.appendChild(box);
    }
    const factions = el("div", "profile-factions");
    factions.appendChild(el("div", "panel-label", "阵营记录"));
    for (const id of D.FACTION_IDS) {
      const rec = (p.byFaction && p.byFaction[id]) || { games: 0, wins: 0 };
      const rate = rec.games ? rec.wins / rec.games * 100 : 0;
      const row = el("div", "profile-faction-row");
      row.appendChild(el("span", null, D.FACTIONS[id].name));
      const bar = el("div", "profile-bar");
      const fill = el("i");
      fill.style.width = rate + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      row.appendChild(el("span", null, rec.games ? (rate.toFixed(0) + "% / " + rec.games) : "—"));
      factions.appendChild(row);
    }
    grid.appendChild(factions);
    const hist = el("div", "profile-history");
    hist.appendChild(el("div", "panel-label", "最近对局"));
    if (!p.history || !p.history.length) hist.appendChild(el("p", "muted", "还没有对局记录。"));
    else for (const h of p.history.slice(0, 5)) {
      const line = el("div", "profile-history-line");
      const d = new Date(h.at);
      line.appendChild(el("span", null, (d.getMonth() + 1) + "/" + d.getDate() + " · " + factionName(h.faction) + " vs " + factionName(h.opponent)));
      line.appendChild(el("strong", null, h.result === "win" ? "胜 · R" + h.round : h.result === "loss" ? "负 · R" + h.round : "平 · R" + h.round));
      hist.appendChild(line);
    }
    grid.appendChild(hist);
  }

  const CODEX_FAV_KEY = "gok_codex_favorites";
  const CODEX_SEEN_KEY = "gok_codex_seen";
  function loadCodexState() {
    try {
      const fav = JSON.parse(localStorage.getItem(CODEX_FAV_KEY) || "[]");
      app.codexFavorites = new Set(Array.isArray(fav) ? fav : []);
    } catch (e) { app.codexFavorites = new Set(); }
    try {
      const seen = JSON.parse(localStorage.getItem(CODEX_SEEN_KEY) || "{}");
      app.codexSeen = seen && typeof seen === "object" ? seen : {};
    } catch (e) { app.codexSeen = {}; }
  }
  function persistCodexState() {
    try { localStorage.setItem(CODEX_FAV_KEY, JSON.stringify(Array.from(app.codexFavorites || []))); } catch (e) {}
    try { localStorage.setItem(CODEX_SEEN_KEY, JSON.stringify(app.codexSeen || {})); } catch (e) {}
  }
  function toggleCodexFavorite(id) {
    if (!app.codexFavorites) app.codexFavorites = new Set();
    if (app.codexFavorites.has(id)) app.codexFavorites.delete(id); else app.codexFavorites.add(id);
    persistCodexState();
    renderCodex();
  }
  function markCodexSeen(id) {
    if (!app.codexSeen) app.codexSeen = {};
    if (!app.codexSeen[id]) { app.codexSeen[id] = Date.now(); persistCodexState(); }
  }

  function openCodex() {
    markMainTask("codex_open");
    showScreen("codex");
    renderCodex();
  }

  function buildLibraryCard(def, opts) {
    opts = opts || {};
    const variantClass = opts.variant ? " library-" + opts.variant : " library-codex";
    const card = el("article", "gok-library-card" + (opts.variant === "mini" ? " library-mini" : "") + variantClass);
    card.dataset.cardId = def.id;
    card.dataset.faction = def.faction;
    card.dataset.rarity = def.rarity || "common";
    card.dataset.type = def.type || "";
    const factionColor = (D.FACTIONS[def.faction] && D.FACTIONS[def.faction].color) || "#d6b25f";
    const rarityColor = RARITY_COLORS[def.rarity] || RARITY_COLORS.common;
    card.style.setProperty("--faction-color", factionColor);
    card.style.setProperty("--rarity-color", rarityColor);
    const art = el("div", "gok-lib-art");
    const customArt = customCardArtFor(def.id);
    if (customArt) {
      art.style.backgroundImage = "url('" + customArt + "')";
      art.classList.add("has-custom-art");
    } else if (def.art) art.style.backgroundImage = "url('" + portraitImage(def.art) + "')";
    else {
      art.classList.add("placeholder");
      art.style.backgroundImage = genericArtStyle(def);
      addGeneratedArt(art, def);
    }
    card.appendChild(art);
    card.appendChild(el("div", "gok-lib-scrim"));
    const costEl = el("div", "gok-lib-cost", String(opts.cost != null ? opts.cost : def.cost));
    costEl.style.setProperty("--faction-color", factionColor);
    card.appendChild(costEl);
    if (opts.count != null) card.appendChild(el("div", "gok-lib-count", opts.count));
    if (opts.faction !== false) {
      const factionEl = el("div", "gok-lib-faction", factionName(def.faction));
      factionEl.style.setProperty("--faction-color", factionColor);
      card.appendChild(factionEl);
    }
    card.appendChild(el("div", "gok-lib-name", def.name));
    const kindEl = el("div", "gok-lib-kind");
    kindEl.dataset.rarity = def.rarity || "common";
    kindEl.style.setProperty("--rarity-color", rarityColor);
    if (opts.typeText) {
      kindEl.textContent = opts.typeText;
    } else {
      kindEl.appendChild(el("span", "gok-lib-type", typeLine(def)));
      kindEl.appendChild(el("span", "gok-lib-kind-sep", " · "));
      const rarityEl = el("b", "gok-lib-rarity", RARITY_NAMES[def.rarity] || "普通");
      rarityEl.style.setProperty("--rarity-color", rarityColor);
      kindEl.appendChild(rarityEl);
    }
    card.appendChild(kindEl);
    const text = el("div", "gok-lib-text");
    appendKeywordText(text, opts.text != null ? opts.text : (def.text || "—"));
    card.appendChild(text);
    if (def.type === "minion") {
      const atk = opts.attack != null ? opts.attack : def.attack;
      const hp = opts.health != null ? opts.health : def.health;
      card.appendChild(el("div", "gok-lib-stat gok-lib-atk", String(atk)));
      card.appendChild(el("div", "gok-lib-stat gok-lib-hp", String(hp)));
    }
    addCardFrame(card);
    return card;
  }

  function codexKeywordLabels(d) {
    const labels = new Set();
    for (const key of d.keywords || []) {
      if (D.KEYWORDS[key] && D.KEYWORDS[key].name) labels.add(D.KEYWORDS[key].name);
    }
    for (const label of Object.keys(KEYWORD_HELP)) {
      if ((d.text || "").includes(label)) labels.add(label);
    }
    return Array.from(labels);
  }

  function codexKeywordOptions() {
    const used = new Set();
    for (const d of Object.values(D.CARDS)) {
      if (d.token || d.disabled) continue;
      for (const label of codexKeywordLabels(d)) used.add(label);
    }
    const ordered = TUTORIAL_KEYWORD_ORDER.filter(label => used.has(label));
    for (const label of Object.keys(KEYWORD_HELP)) if (used.has(label) && !ordered.includes(label)) ordered.push(label);
    return ordered;
  }

  function codexCostMatch(d, filter) {
    if (filter === "all") return true;
    if (filter === "low") return d.cost <= 1;
    if (filter === "mid") return d.cost >= 2 && d.cost <= 3;
    if (filter === "high") return d.cost >= 4 && d.cost <= 5;
    if (filter === "top") return d.cost >= 6;
    return true;
  }

  function resetCodexFilters() {
    app.codexFaction = "all";
    app.codexFilter = "all";
    app.codexSearch = "";
    app.codexCost = "all";
    app.codexKeyword = "all";
    app.codexSort = "faction";
    app.codexRarity = "all";
    app.codexFavoritesOnly = false;
    app.codexLimit = 60;
    renderCodex();
  }

  function renderCodexHeroPanel() {
    const panel = $("codex-hero-panel");
    if (!panel) return;
    clear(panel);
    if (app.codexFaction === "all") {
      panel.hidden = true;
      return;
    }
    const fact = D.FACTIONS[app.codexFaction];
    const hero = fact && D.HEROES[fact.hero];
    if (!hero) { panel.hidden = true; return; }
    panel.hidden = false;
    panel.classList.add("compact");
    const art = el("div", "codex-hero-compact-art");
    art.style.backgroundImage = "url('" + heroImage(hero.id) + "')";
    panel.appendChild(art);
    const copy = el("div", "codex-hero-compact-copy");
    copy.appendChild(el("strong", null, hero.name));
    copy.appendChild(el("small", null, fact.name + " · 生命 " + hero.hp));
    if (hero.power) copy.appendChild(el("span", null, (hero.power.passive ? "被动" : "主动 " + (hero.power.cost || 0) + " 费") + " · " + hero.power.name + "：" + hero.power.text));
    if (hero.passive) copy.appendChild(el("span", null, "被动 · " + hero.passive.name + "：" + hero.passive.text));
    panel.appendChild(copy);
  }

  function renderCodex() {
    renderCodexHeroPanel();
    const tabs = $("codex-faction-tabs");
    clear(tabs);
    const allCards = Object.values(D.CARDS).filter(d => !d.disabled);
    const factions = [{ id: "all", name: "全部" }, ...D.FACTION_IDS.map(id => ({ id, name: D.FACTIONS[id].name })), { id: "neutral", name: "中立" }];
    for (const f of factions) {
      const count = f.id === "all" ? allCards.length : allCards.filter(d => d.faction === f.id).length;
      const b = el("button", "deck-faction-tab" + (app.codexFaction === f.id ? " active" : ""), f.name + " " + count);
      const factionColor = f.id === "all" ? "#f2c66d" : f.id === "neutral" ? "#b7c5cc" : (D.FACTIONS[f.id] && D.FACTIONS[f.id].color) || "#f2c66d";
      b.style.setProperty("--faction-color", factionColor);
      b.onclick = () => { app.codexFaction = f.id; app.codexLimit = 60; renderCodex(); };
      tabs.appendChild(b);
    }
    document.querySelectorAll("[data-codex-filter]").forEach((b) => {
      b.classList.toggle("active", b.dataset.codexFilter === (app.codexFilter || "all"));
      b.onclick = () => { app.codexFilter = b.dataset.codexFilter; app.codexLimit = 60; renderCodex(); };
    });
    document.querySelectorAll("[data-codex-rarity]").forEach((b) => {
      const isSpecial = app.codexFilter === "token" || app.codexFilter === "easter";
      b.disabled = isSpecial;
      b.title = isSpecial ? "衍生卡 / 彩蛋卡是独立分类，不按品级筛选" : "";
      b.classList.toggle("active", !isSpecial && b.dataset.codexRarity === (app.codexRarity || "all"));
      b.onclick = () => { if (isSpecial) return; app.codexRarity = b.dataset.codexRarity; app.codexLimit = 60; renderCodex(); };
    });
    const keywordSelect = $("codex-keyword");
    if (keywordSelect) {
      const options = codexKeywordOptions();
      if (keywordSelect.dataset.ready !== "1" || keywordSelect.options.length <= 1) {
        clear(keywordSelect);
        keywordSelect.appendChild(new Option("全部关键词", "all"));
        for (const label of options) keywordSelect.appendChild(new Option(label, label));
        keywordSelect.dataset.ready = "1";
      }
      keywordSelect.value = app.codexKeyword || "all";
    }
    const costSelect = $("codex-cost");
    if (costSelect) costSelect.value = app.codexCost || "all";
    const sortSelect = $("codex-sort");
    if (sortSelect) sortSelect.value = app.codexSort || "faction";
    const raritySelect = $("codex-rarity");
    if (raritySelect) raritySelect.value = app.codexRarity || "all";
    const tokenQuick = $("codex-token-quick");
    if (tokenQuick) {
      tokenQuick.textContent = "衍生卡 " + allCards.filter(d => d.token).length;
      tokenQuick.classList.toggle("active", app.codexFilter === "token");
      tokenQuick.onclick = () => {
        app.codexFilter = "token";
        app.codexRarity = "all";
        app.codexLimit = 60;
        renderCodex();
      };
    }
    const easterQuick = $("codex-easter-quick");
    if (easterQuick) {
      easterQuick.textContent = "彩蛋卡 " + allCards.filter(d => d.easterEgg).length;
      easterQuick.classList.toggle("active", app.codexFilter === "easter");
      easterQuick.onclick = () => {
        app.codexFilter = "easter";
        app.codexRarity = "all";
        app.codexLimit = 60;
        renderCodex();
      };
    }
    const favButton = $("codex-favorites");
    if (favButton) {
      const n = app.codexFavorites ? app.codexFavorites.size : 0;
      favButton.textContent = "收藏 " + n + (app.codexFavoritesOnly ? " · 筛选中" : "");
      favButton.classList.toggle("active", !!app.codexFavoritesOnly);
    }
    const query = (app.codexSearch || "").trim().toLowerCase();
    const list = allCards.filter((d) => {
      if (app.codexFaction !== "all" && d.faction !== app.codexFaction) return false;
      const category = app.codexFilter || "all";
      const specialCategory = category === "token" || category === "easter";
      if (category === "token" && !d.token) return false;
      if (category === "easter" && !d.easterEgg) return false;
      if (category === "all" && (d.token || d.easterEgg)) return false;
      if (!specialCategory && category !== "all") {
        if (d.type !== category) return false;
        if (d.token || d.easterEgg) return false;
      }
      if (!codexCostMatch(d, app.codexCost)) return false;
      if (app.codexKeyword !== "all" && !codexKeywordLabels(d).includes(app.codexKeyword)) return false;
      if (!specialCategory && app.codexRarity && app.codexRarity !== "all" && d.rarity !== app.codexRarity) return false;
      if (app.codexFavoritesOnly && !(app.codexFavorites && app.codexFavorites.has(d.id))) return false;
      if (!query) return true;
      const keywordText = codexKeywordLabels(d).join(" ");
      return (d.name + " " + (d.text || "") + " " + keywordText).toLowerCase().includes(query);
    }).sort((a, b) => {
      if (app.codexSort === "cost") return a.cost - b.cost || a.name.localeCompare(b.name);
      if (app.codexSort === "name") return a.name.localeCompare(b.name, "zh-Hans-CN");
      if (app.codexSort === "type") {
        const order = { minion: 0, spell: 1, formation: 2, relic: 3, equipment: 3, debt: 4 };
        return (order[a.type] == null ? 9 : order[a.type]) - (order[b.type] == null ? 9 : order[b.type]) || a.cost - b.cost || a.name.localeCompare(b.name);
      }
      const fa = D.FACTION_IDS.indexOf(a.faction), fb = D.FACTION_IDS.indexOf(b.faction);
      return (fa < 0 ? 9 : fa) - (fb < 0 ? 9 : fb) || a.cost - b.cost || a.name.localeCompare(b.name);
    });
    const shown = list.slice(0, app.codexLimit || 60);
    const seenCount = allCards.filter(d => app.codexSeen && app.codexSeen[d.id]).length;
    $("codex-count").innerHTML = '<span class="codex-count-total">收录 <b>' + allCards.length + '</b> 张</span><span class="codex-count-sep"> · </span><span class="codex-count-seen">已阅 ' + seenCount + '</span><span class="codex-count-sep"> · </span><span class="codex-count-fav">收藏 ' + (app.codexFavorites ? app.codexFavorites.size : 0) + '</span><span class="codex-count-sep"> · </span><span class="codex-count-hit">当前 <b>' + list.length + '</b> 张</span>' + (list.length > shown.length ? '<span class="codex-count-sep"> · </span><span class="codex-count-shown">已显示 ' + shown.length + '</span>' : "");
    const more = $("codex-more");
    if (more) { more.hidden = list.length <= shown.length; more.onclick = () => { app.codexLimit = (app.codexLimit || 60) + 60; renderCodex(); }; }
    const empty = $("codex-empty");
    if (empty) empty.hidden = list.length > 0;
    const search = $("codex-search");
    if (search && search.value !== (app.codexSearch || "")) search.value = app.codexSearch || "";
    const grid = $("codex-grid");
    clear(grid);
    shown.forEach((d, index) => {
      const card = buildLibraryCard(d, { variant: "codex", faction: true });
      card.classList.add("codex-card");
      addCardTags(card, d, null, "lib-tags");
      card.onclick = () => openCodexCard(d, "返回图鉴", shown, index);
      grid.appendChild(card);
    });
  }

  function openCodexCard(d, backLabel, list, index) {
    markCodexSeen(d.id);
    openModal((content) => {
      content.classList.add("card-large-modal");
      content.appendChild(el("div", "eyebrow", "ARCHIVE / 卡牌档案"));
      content.appendChild(el("h3", null, d.name));
      content.appendChild(el("div", "preview-meta", factionName(d.faction) + " · " + typeLine(d) + " · " + (RARITY_NAMES[d.rarity] || "普通") + " · " + d.cost + " 行动力" + (d.type === "minion" ? " · 攻 " + d.attack + " / 血 " + d.health : "")));
      addKeywordChips(content, d, null);
      const art = el("div", "preview-art");
      const codexCustomArt = customCardArtFor(d.id);
      if (codexCustomArt) { art.style.backgroundImage = "url('" + codexCustomArt + "')"; art.classList.add("has-custom-art"); }
      else if (d.art) art.style.backgroundImage = "url('" + portraitImage(d.art) + "')";
      else {
        art.classList.add("placeholder");
        art.textContent = d.type === "spell" ? "术" : factionIcon(d.faction);
        art.style.backgroundImage = genericArtStyle(d);
        addGenericGlyph(art, d);
        addGeneratedArt(art, d);
      }
      content.appendChild(art);
      content.appendChild(el("p", null, d.text || "—"));
      if (d.flavor) content.appendChild(el("div", "preview-flavor", "“" + d.flavor + "”"));
      const artTools = el("div", "card-art-tools");
      artTools.appendChild(el("small", null, "卡面替换只保存在本机，不会上传，也不会改变对手看到的卡面。"));
      const artFile = document.createElement("input"); artFile.type = "file"; artFile.accept = "image/png,image/jpeg,image/webp"; artFile.style.display = "none";
      const replaceArt = el("button", "btn btn-small btn-ghost", "替换卡面");
      replaceArt.onclick = () => artFile.click();
      artFile.onchange = () => { const file = artFile.files && artFile.files[0]; if (!file) return; replaceCardArtFromFile(d.id, file, () => { toast("卡面已替换。 "); openCodexCard(d, backLabel, list, index); }); };
      artTools.appendChild(replaceArt); artTools.appendChild(artFile);
      if (codexCustomArt) {
        const resetArt = el("button", "btn btn-small btn-ghost", "恢复原卡面");
        resetArt.onclick = () => { clearCustomCardArt(d.id); toast("已恢复原卡面。 "); openCodexCard(d, backLabel, list, index); };
        artTools.appendChild(resetArt);
      }
      content.appendChild(artTools);
      const actions = el("div", "modal-actions");
      if (list && list.length > 1) {
        const prev = el("button", "btn btn-small btn-ghost", "‹ 上一张");
        prev.onclick = () => openCodexCard(list[(index - 1 + list.length) % list.length], backLabel, list, (index - 1 + list.length) % list.length);
        const next = el("button", "btn btn-small btn-ghost", "下一张 ›");
        next.onclick = () => openCodexCard(list[(index + 1) % list.length], backLabel, list, (index + 1) % list.length);
        actions.appendChild(prev); actions.appendChild(next);
      }
      const fav = el("button", "btn btn-small btn-ghost", app.codexFavorites && app.codexFavorites.has(d.id) ? "★ 已收藏" : "☆ 收藏");
      fav.onclick = () => { toggleCodexFavorite(d.id); openCodexCard(d, backLabel, list, index); };
      actions.appendChild(fav);
      const close = el("button", "btn btn-primary", backLabel || "返回图鉴");
      close.onclick = () => closeModal(true);
      actions.appendChild(close);
      content.appendChild(actions);
    });
  }

  function openGameGuide() {
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "ARCHIVE / GAME GUIDE"));
      content.appendChild(el("h3", null, "游戏教程"));
      content.appendChild(el("p", null, "先看这份速查；完整规则、卡牌类型与关键词解析在「完整教程」里。"));
      const intro = el("div", "guide-sections");
      const sections = [
        ["胜利条件", "先把对方领袖生命降到 0。随从可以攻击敌方随从或领袖；有守备的随从必须先处理。"],
        ["行动力与先后手", "第 1 回合 1 点，每回合 +1，上限 10 点，回合开始回满。先手抽 3 张；后手抽 4 张，并额外获得「采掘许可」（本回合 +2 点行动力）。"],
        ["阵位", "左翼 / 中枢 / 右翼三个阵位，每个阵位最多 3 个随从，全场最多 6 个。阵位会影响部分卡牌的范围与固定效果。"],
        ["流脉", "双方共享 0→12，每次完整轮次（双方各行动一次）自然 +1。4 震荡、7 裂隙、10 魔物潮触发世界事件，12 回流清空。"],
        ["牌组结构", "30 张主牌（随从 + 战术 + 阵型）+ 2 件装备牌。领袖在开局单独选择，不占牌组，也不进入牌库。装备需要抽到并打出，最多可同时装备两件。"]
      ];
      for (const [title, desc] of sections) {
        const sec = el("div", "guide-section");
        sec.appendChild(el("strong", null, title));
        sec.appendChild(el("span", null, desc));
        intro.appendChild(sec);
      }
      content.appendChild(intro);
      const tutorialBox = el("div", "guide-tutorial");
      tutorialBox.appendChild(el("div", "panel-label", "新手速查 / 7 步"));
      const tutorialList = el("div", "guide-tutorial-steps");
      for (const step of [
        "1. 先看手牌、行动力和共享流脉。",
        "2. 点击「开始推演」，选择阵营与预设牌组。",
        "3. 起手换牌：保留 1–3 行动力的牌，换掉 4 行动力以上的高消耗牌。",
        "4. 低费随从先铺场，再用战术解场或增益。",
        "5. 点击攻击力大于 0 的随从发起攻击；有守备先打守备。",
        "6. 流脉到 4 / 7 / 10 会触发世界事件，12 回流清空。",
        "7. 结束回合，交替行动，直到一方领袖生命归零。"
      ]) tutorialList.appendChild(el("span", null, step));
      tutorialBox.appendChild(tutorialList);
      content.appendChild(tutorialBox);
      const actions = el("div", "modal-actions");
      const full = el("button", "btn btn-ghost", "完整教程");
      full.onclick = () => { closeModal(true); showScreen("tutorial"); };
      const tutorial = el("button", "btn btn-ghost", "开始实战教学");
      tutorial.onclick = () => { closeModal(true); startTutorial(); };
      const close = el("button", "btn btn-primary", "关闭");
      close.onclick = () => closeModal(true);
      actions.appendChild(full);
      actions.appendChild(tutorial);
      actions.appendChild(close);
      content.appendChild(actions);
    });
  }

  function openRulesGuide() {
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "ARCHIVE / RULES"));
      content.appendChild(el("h3", null, "规则速查"));
      const box = el("div", "guide-sections");
      const sections = [
        ["目标", "把对方领袖生命降到 0。随从可攻击敌方随从或领袖；有守备的随从必须先处理。"],
        ["行动力", "第 1 回合 1 点，每回合 +1，上限 10 点，回合开始回满。先手抽 3 张；后手抽 4 张并获得「采掘许可」。"],
        ["阵位", "左翼 / 中枢 / 右翼三个阵位，每个阵位最多 3 个随从，全场最多 6 个。同阵位可能触发协同，双方同列互为对位。"],
        ["流脉", "共享流脉 0→12。到达 4 震荡、7 裂隙、10 魔物潮时触发世界事件；12 回流清空。"],
        ["关键词", "登场、余响、守备、先遣、冻结、沉默、引脉、预兆等关键词会在卡牌和标签上标明。"],
        ["装备", "装备是一张牌，抽到并打出后持续生效；同类装备最多生效 2 件。"]
      ];
      for (const [title, desc] of sections) {
        const sec = el("div", "guide-section");
        sec.appendChild(el("strong", null, title));
        sec.appendChild(el("span", null, desc));
        box.appendChild(sec);
      }
      content.appendChild(box);
      const actions = el("div", "modal-actions");
      const keys = el("button", "btn btn-ghost", "打开关键词解释");
      keys.onclick = () => { closeModal(true); openKeywordGlossary(); };
      const close = el("button", "btn btn-primary", "关闭");
      close.onclick = () => closeModal(true);
      actions.appendChild(keys);
      actions.appendChild(close);
      content.appendChild(actions);
    });
  }

  function openRank(returnScreen) {
    app.rankReturn = returnScreen || app.screen || "home";
    AudioBox.play("ui_open");
    showScreen("rank");
    renderRankScreen();
  }

  function closeRank() {
    AudioBox.play("cancel");
    const target = app.rankReturn || "home";
    if (target === "match") { showScreen("match"); renderMatchPage(); return; }
    if (target === "mode") { showScreen("mode"); showModeMulti(true); return; }
    showScreen(target);
    if (target === "game" && app.game) renderGame();
  }

  const RANK_REWARDS = [3, 5, 8, 12, 16, 22, 30];
  function rankTierIndex(points) {
    const v = Math.max(0, Number(points) || 0);
    let idx = 0;
    for (let i = 0; i < RANK_TIERS.length; i++) if (v >= RANK_TIERS[i].min) idx = i;
    return idx;
  }
  function rankRewardFor(points) { return RANK_REWARDS[rankTierIndex(points)] || 3; }
  function renderRankScreen() {
    const p = app.profile || loadProfile();
    const info = rankInfo(p.rankPoints || 0);
    const tierIndex = rankTierIndex(p.rankPoints || 0);
    $("rank-season").textContent = String(p.rankSeason || 1);
    $("rank-tier").textContent = info.tier;
    $("rank-tier").style.color = info.color;
    $("rank-emblem").textContent = info.tier.charAt(0);
    $("rank-emblem").style.color = info.color;
    $("rank-points").textContent = String(p.rankPoints || 0) + " 分";
    $("rank-progress-fill").style.width = info.progress + "%";
    $("rank-next").textContent = info.next == null ? "已达最高段位" : "距离下一段位还差 " + Math.max(0, info.next - (p.rankPoints || 0)) + " 分";
    $("rank-level").textContent = String(1 + Math.floor((p.games || 0) / 5));
    $("rank-wins").textContent = String(p.rankWins || 0);
    $("rank-losses").textContent = String(p.rankLosses || 0);
    $("rank-streak").textContent = String(p.rankStreak || 0);
    $("rank-games").textContent = String(p.games || 0);
    $("rank-total-wins").textContent = String(p.wins || 0);
    $("rank-peak").textContent = String(p.rankPeak || 0);
    $("rank-best-streak").textContent = String(p.rankBestStreak || 0);
    renderRankIdentity();
    const grid = document.querySelector(".rank-detail-grid");
    const oldLadder = $("rank-ladder-panel"); if (oldLadder) oldLadder.remove();
    const oldReward = $("rank-reward-panel"); if (oldReward) oldReward.remove();
    const ladder = el("div", "panel rank-panel"); ladder.id = "rank-ladder-panel";
    ladder.appendChild(el("div", "panel-label", "段位阶梯 / LADDER"));
    const ladderBox = el("div", "rank-ladder");
    for (let i = 0; i < RANK_TIERS.length; i++) {
      const t = RANK_TIERS[i];
      const row = el("div", "rank-ladder-row" + (i === tierIndex ? " current" : "") + (i < tierIndex ? " passed" : ""));
      row.appendChild(el("span", "rank-ladder-dot", t.name.charAt(0)));
      row.appendChild(el("strong", null, t.name));
      row.appendChild(el("small", null, i === tierIndex ? (info.next == null ? "最高段位" : "当前") : i < tierIndex ? "已通过" : "还差 " + Math.max(1, t.min - (p.rankPoints || 0)) + " 分"));
      ladderBox.appendChild(row);
    }
    ladder.appendChild(ladderBox);
    if (grid) grid.insertBefore(ladder, grid.firstChild);
    const reward = el("div", "panel rank-panel rank-reward-panel"); reward.id = "rank-reward-panel";
    reward.appendChild(el("div", "panel-label", "赛季奖励 / SEASON"));
    const claimKey = String(p.rankSeason || 1);
    const claimTierKey = claimKey + ":" + tierIndex;
    const rankClaims = p.rankRewardClaims || {};
    const claimed = !!rankClaims[claimTierKey];
    reward.appendChild(el("p", "muted", "当前段位可领取 " + rankRewardFor(p.rankPoints || 0) + " 枚档案印记。每个赛季每个段位结算一次。"));
    const claim = el("button", "btn btn-small btn-primary", claimed ? "本赛季已领取" : "领取 " + rankRewardFor(p.rankPoints || 0) + " 印记");
    claim.disabled = claimed;
    claim.onclick = () => {
      if (claimed) return;
      rankClaims[claimTierKey] = true; p.rankRewardClaims = rankClaims; p.rankRewardSeason = claimKey;
      app.profile = p; persistProfile();
      const amount = grantAchievementMarks(rankRewardFor(p.rankPoints || 0));
      toast("赛季奖励领取 · 印记 +" + amount);
      AudioBox.play("coin");
      renderRankScreen();
    };
    reward.appendChild(claim);
    if (grid) grid.insertBefore(reward, grid.children[1] || null);
    const box = $("rank-history");
    clear(box);
    const filters = el("div", "rank-history-filters");
    app.rankHistoryFilter = app.rankHistoryFilter || "all";
    for (const [key, label] of [["all", "全部"], ["win", "胜场"], ["loss", "败场"]]) {
      const b = el("button", "rank-history-filter" + (app.rankHistoryFilter === key ? " active" : ""), label);
      b.onclick = () => { app.rankHistoryFilter = key; renderRankScreen(); };
      filters.appendChild(b);
    }
    box.appendChild(filters);
    const rows = (p.history || []).filter(h => h.ranked).filter(h => app.rankHistoryFilter === "all" || (h.result === "win") === (app.rankHistoryFilter === "win")).slice(0, 10);
    if (!rows.length) { box.appendChild(el("p", "muted", "还没有排位记录。")); return; }
    for (const h of rows) {
      const row = el("div", "rank-history-row");
      const d = new Date(h.at);
      row.appendChild(el("span", null, (d.getMonth() + 1) + "/" + d.getDate()));
      row.appendChild(el("strong", null, factionName(h.faction) + " vs " + factionName(h.opponent)));
      row.appendChild(el("span", "rank-delta " + (h.result === "win" ? "up" : h.result === "loss" ? "down" : "flat"), h.result === "win" ? "胜" : h.result === "loss" ? "负" : "平"));
      box.appendChild(row);
    }
  }

  function openAchievements() {
    showScreen("achievements");
    renderAchievements();
  }

  function renderAchievementRecords() {
    const box = $("achievement-records");
    if (!box) return;
    clear(box);
    const p = app.profile || {};
    const hist = (p.history || []).slice(0, 6);
    const total = p.games || 0;
    const wins = p.wins || 0;
    const winRate = total ? Math.round(wins / total * 100) : 0;
    const head = el("div", "achievement-records-head");
    head.appendChild(el("div", "panel-label", "推演记录 / MATCH RECORDS"));
    head.appendChild(el("span", "achievement-records-summary", total + " 场 · 胜率 " + winRate + "% · 胜 " + wins + " / 负 " + (p.losses || 0)));
    box.appendChild(head);
    const row = el("div", "achievement-record-row");
    const by = p.byFaction || {};
    for (const f of D.FACTION_IDS) {
      const r = by[f] || { games: 0, wins: 0 };
      const chip = el("span", "achievement-faction-record");
      chip.appendChild(el("b", null, factionName(f)));
      chip.appendChild(el("small", null, r.games ? r.wins + "/" + r.games + " · " + Math.round(r.wins / r.games * 100) + "%" : "未记录"));
      row.appendChild(chip);
    }
    box.appendChild(row);
    const list = el("div", "achievement-record-list");
    if (!hist.length) list.appendChild(el("p", "muted", "还没有完成的对局记录。"));
    for (const h of hist) {
      const line = el("div", "achievement-record-line");
      line.appendChild(el("strong", null, (factionName(h.faction) || h.faction) + " vs " + (factionName(h.opponent) || h.opponent)));
      line.appendChild(el("span", null, (h.result === "win" ? "胜利" : h.result === "loss" ? "失败" : "平局") + " · " + (h.round || 0) + " 回合" + (h.ranked ? " · 排位" : "")));
      line.appendChild(el("small", null, new Date(h.at).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })));
      list.appendChild(line);
    }
    box.appendChild(list);
  }

  function renderAchievements() {
    renderAchievementRecords();
    renderProfileGrid();
    const total = ACHIEVEMENTS.length;
    const unlocked = ACHIEVEMENTS.filter(a => app.achievements[a.id] && app.achievements[a.id].unlocked).length;
    const summary = $("achievements-summary");
    clear(summary);
    const line = el("div", "achievement-summary-line");
    line.appendChild(el("strong", null, "已解锁 " + unlocked + " / " + total));
    line.appendChild(el("span", null, " 完成 " + Math.round(unlocked / Math.max(1, total) * 100) + "%"));
    summary.appendChild(line);
    const bar = el("div", "achievement-progress-bar");
    const fill = el("i"); fill.style.width = (unlocked / Math.max(1, total) * 100) + "%";
    bar.appendChild(fill); summary.appendChild(bar);
    const filters = el("div", "achievement-filters");
    const defs = [["all", "全部"], ["combat", "战斗"], ["collection", "收集"], ["mode", "模式"], ["archive", "档案"], ["unlocked", "已解锁"], ["locked", "未解锁"]];
    app.achievementFilter = app.achievementFilter || "all";
    for (const [key, label] of defs) {
      const b = el("button", "achievement-filter" + (app.achievementFilter === key ? " active" : ""), label);
      b.onclick = () => { app.achievementFilter = key; renderAchievements(); };
      filters.appendChild(b);
    }
    summary.appendChild(filters);
    const list = $("achievements-list");
    clear(list);
    const visible = ACHIEVEMENTS.filter(a => {
      const rec = app.achievements[a.id] || {};
      if (app.achievementFilter === "unlocked") return !!rec.unlocked;
      if (app.achievementFilter === "locked") return !rec.unlocked;
      if (["all", "combat", "collection", "mode", "archive"].includes(app.achievementFilter) && app.achievementFilter !== "all") return a.category === app.achievementFilter;
      return true;
    });
    const groups = {};
    for (const a of visible) (groups[a.category] = groups[a.category] || []).push(a);
    for (const key of Object.keys(ACH_CATEGORY_LABELS)) {
      if (!groups[key] || !groups[key].length) continue;
      const section = el("section", "achievement-section");
      section.appendChild(el("div", "panel-label", ACH_CATEGORY_LABELS[key]));
      for (const a of groups[key]) {
        const rec = app.achievements[a.id] || {};
        const card = el("div", "achievement" + (rec.unlocked ? " unlocked" : ""));
        card.appendChild(el("div", "achievement-icon", a.icon));
        const body = el("div", "achievement-body");
        body.appendChild(el("strong", null, a.name));
        body.appendChild(el("p", null, a.desc));
        const goal = a.id === "play_10" ? 10 : a.id === "online_10" ? 10 : a.id === "all_factions" ? 8 : 1;
        const progress = a.id === "play_10" || a.id === "online_10" ? Math.min(goal, rec.progress || 0) : (rec.unlocked ? 1 : 0);
        const pbar = el("div", "achievement-progress-bar small");
        const pfill = el("i"); pfill.style.width = (progress / goal * 100) + "%"; pbar.appendChild(pfill);
        body.appendChild(pbar);
        body.appendChild(el("span", "achievement-progress", progress + " / " + goal + " · 奖励 " + (a.reward || 0) + " 印记"));
        card.appendChild(body);
        card.appendChild(el("span", "achievement-state", rec.unlocked ? "已记录" : "未完成"));
        section.appendChild(card);
      }
      list.appendChild(section);
    }
    if (!visible.length) list.appendChild(el("p", "muted", "这个筛选下没有成就。"));
  }

  function openGameMenu() {
    if (!app.game || app.game.status !== "playing") return;
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "对局菜单 / 暂停"));
      content.appendChild(el("h3", null, "对局菜单"));
      content.appendChild(el("p", null, "可以继续对局、进入设置，或直接认输。"));
      const actions = el("div", "modal-actions game-menu-actions");
      const resume = el("button", "btn btn-primary", "继续对局");
      resume.onclick = () => closeModal(true);
      const settings = el("button", "btn btn-ghost", "游戏设置");
      settings.onclick = () => { closeModal(true); openSettings("game"); };
      const concede = el("button", "btn btn-ghost", "认输");
      concede.onclick = () => { closeModal(true); confirmConcede(); };
      const exit = el("button", "btn btn-small btn-ghost", "退出对局");
      exit.onclick = () => { closeModal(true); confirmExit(); };
      actions.appendChild(resume);
      actions.appendChild(settings);
      actions.appendChild(concede);
      actions.appendChild(exit);
      content.appendChild(actions);
    });
  }

  const LAB_MODS = [
    { id: "veinStorm", name: "流脉暴走", desc: "开局流脉直接 +6。世界会更早替你们结算。" },
    { id: "manaFlood", name: "行动力沸腾", desc: "双方开局最大行动力 +2，当前行动力也补满。" },
    { id: "ironRush", name: "全员先遣", desc: "双方之后召唤的所有随从获得先遣。" },
    { id: "crossFaction", name: "跨阵营乱斗", desc: "双方牌组从八阵营卡池随机混编，不再讲阵营纪律。" },
    { id: "experimentalCards", name: "实验卡牌", desc: "把当前 6 张实验牌混入乱斗牌组：混沌裂隙、变异之卵、命运赌徒、禁忌知识、时间借贷、流脉超载。" },
    { id: "chaosEvents", name: "随机事件", desc: "从第 3 回合开始，每隔 3 个回合触发一次随机实验事件。" }
  ];

  function applyExperimentalMods(state, mods) {
    if (!state || !Array.isArray(mods)) return;
    state.experimental = mods.slice();
    for (const mod of mods) {
      if (mod === "veinStorm") state.vein = Math.min(12, (state.vein || 0) + 6);
      if (mod === "manaFlood") {
        for (const p of state.players) {
          p.maxMana = Math.min(10, (p.maxMana || 1) + 2);
          p.mana = p.maxMana;
        }
      }
      if (mod === "ironRush") state.experimentalIronRush = true;
    }
  }

  function buildChaosDeck(faction, includeExperimental) {
    const pool = Object.keys(D.CARDS).filter(id => {
      const d = D.CARDS[id];
      return d && !d.token && !d.disabled && d.type !== "equipment" && (!d.experimental || includeExperimental);
    });
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const deck = [];
    const counts = {};
    if (includeExperimental) {
      for (const id of Object.keys(D.CARDS)) {
        if (D.CARDS[id] && D.CARDS[id].experimental) { deck.push(id); counts[id] = 1; }
      }
    }
    for (const id of pool) {
      if (deck.length >= 30) break;
      const max = D.maxCopies(D.CARDS[id]) || 2;
      const n = counts[id] || 0;
      if (n >= max) continue;
      deck.push(id);
      counts[id] = n + 1;
      if (deck.length < 30 && n + 1 < max && Math.random() > 0.45) {
        deck.push(id);
        counts[id] = n + 2;
      }
    }
    const source = D.DECKS[faction] || [];
    const relic = source.find(id => D.CARDS[id] && (D.CARDS[id].type === "equipment" || D.CARDS[id].type === "relic")) || "vein_heart";
    deck.push(relic);
    return deck.slice(0, 30).concat(relic);
  }

  function openLabPage(returnTo) {
    if (!window.GOK_IS_PREVIEW) { toast("疯狂实验只在抢先版开放。"); return; }
    app.labReturn = returnTo || "home";
    showScreen("lab");
    renderLabPage();
  }

  function renderLabPage() {
    const root = $("lab-page-root");
    if (!root) return;
    clear(root);
    let faction = D.FACTIONS[app.labFaction] ? app.labFaction : (D.FACTIONS[app.faction] ? app.faction : "pus");
    const selected = new Set(Array.isArray(app.labMods) ? app.labMods : []);
    const intro = el("div", "lab-intro");
    intro.appendChild(el("div", "eyebrow", "PREVIEW / CHAOS LAB"));
    intro.appendChild(el("h3", null, "疯狂实验"));
    intro.appendChild(el("p", null, "这里可以组合一些不稳定、未平衡的规则。它们只影响本局，不会写入稳定版。建议先单人试。"));
    root.appendChild(intro);
    root.appendChild(el("p", "muted", "实验牌池：混沌裂隙、变异之卵、命运赌徒、禁忌知识、时间借贷、流脉超载。只有勾选「实验卡牌」或跨阵营乱斗时才会进入牌组。"));
    root.appendChild(el("div", "eyebrow", "选择实验规则"));
    const modsBox = el("div", "lab-mods");
    for (const mod of LAB_MODS) {
      const b = el("button", "lab-mod" + (selected.has(mod.id) ? " active" : ""));
      b.type = "button";
      b.appendChild(el("strong", null, mod.name));
      b.appendChild(el("small", null, mod.desc));
      b.onclick = () => {
        if (selected.has(mod.id)) selected.delete(mod.id);
        else selected.add(mod.id);
        app.labMods = Array.from(selected);
        b.classList.toggle("active", selected.has(mod.id));
      };
      modsBox.appendChild(b);
    }
    root.appendChild(modsBox);
    root.appendChild(el("div", "eyebrow", "选择阵营"));
    const factionRow = el("div", "match-faction-grid");
    for (const id of D.FACTION_IDS) {
      const fact = D.FACTIONS[id];
      const b = el("button", "match-faction-card" + (id === faction ? " active" : ""));
      b.type = "button";
      const emblem = el("img", "match-faction-emblem"); emblem.src = fact.emblem; emblem.alt = "";
      const copy = el("span", "match-faction-copy");
      copy.appendChild(el("strong", null, fact.name));
      copy.appendChild(el("small", null, D.HEROES[fact.hero] ? "领袖 · " + D.HEROES[fact.hero].name : "领袖"));
      b.appendChild(emblem); b.appendChild(copy);
      b.onclick = () => { app.labFaction = id; renderLabPage(); };
      factionRow.appendChild(b);
    }
    root.appendChild(factionRow);
    const actions = el("div", "lab-actions");
    const start = el("button", "btn btn-primary", "开始实验");
    start.onclick = () => startLabGame(faction, Array.from(selected));
    const back = el("button", "btn btn-small btn-ghost", "返回档案处");
    back.onclick = () => showScreen("home");
    const daily = el("button", "btn btn-small btn-ghost", "今日混沌");
    daily.onclick = () => {
      const seed = new Date();
      const key = seed.getFullYear() * 10000 + (seed.getMonth() + 1) * 100 + seed.getDate();
      const picks = [LAB_MODS[key % LAB_MODS.length].id, LAB_MODS[(key + 3) % LAB_MODS.length].id];
      startLabGame(faction, Array.from(new Set(picks)));
    };
    actions.appendChild(daily); actions.appendChild(back); actions.appendChild(start);
    root.appendChild(actions);
  }

  function startLabGame(faction, mods) {
    app.labFaction = faction;
    const opponent = D.nextFaction(faction);
    const includeExperimental = mods.indexOf("experimentalCards") >= 0;
    const chaos = mods.indexOf("crossFaction") >= 0 || includeExperimental;
    const p1Deck = chaos ? buildChaosDeck(faction, includeExperimental) : getSelectedPlayDeck(faction, "preset");
    const p2Deck = chaos ? buildChaosDeck(opponent, includeExperimental) : getSelectedPlayDeck(opponent, "preset");
    startGame({
      faction: faction,
      opponent: opponent,
      p1Deck: p1Deck,
      p2Deck: p2Deck,
      mode: "ai",
      aiDifficulty: "hard",
      mulligan: false,
      skipIntro: true,
      experimental: mods
    });
  }

  function applySettingsSimplicity() {
    const screen = $("screen-settings");
    if (!screen) return;
    const grid = screen.querySelector(".settings-grid");
    if (!grid) return;
    let bar = screen.querySelector(".settings-simple-bar");
    if (!bar) {
      bar = el("div", "settings-simple-bar");
      const common = el("button", "btn btn-small btn-primary", "常用设置");
      const advanced = el("button", "btn btn-small btn-ghost", "高级设置");
      const hint = el("span", "settings-simple-hint", "只显示最常调整的选项；画面细节、重置与实验项收进高级。" );
      common.onclick = () => { app.settingsAdvanced = false; applySettingsSimplicity(); };
      advanced.onclick = () => { app.settingsAdvanced = true; applySettingsSimplicity(); };
      bar.appendChild(common); bar.appendChild(advanced); bar.appendChild(hint);
      bar._common = common; bar._advanced = advanced;
      grid.parentNode.insertBefore(bar, grid);
    }
    const advanced = !!app.settingsAdvanced;
    screen.classList.toggle("settings-advanced", advanced);
    document.body.classList.toggle("settings-advanced", advanced);
    if (bar._common) bar._common.className = "btn btn-small " + (advanced ? "btn-ghost" : "btn-primary");
    if (bar._advanced) bar._advanced.className = "btn btn-small " + (advanced ? "btn-primary" : "btn-ghost");
    const advancedIds = [
      "btn-settings-cinema", "btn-settings-replay-cg", "btn-settings-bg", "btn-settings-fx",
      "btn-settings-shake", "btn-settings-density", "btn-settings-hand-sort",
      "btn-settings-contrast", "btn-settings-zone-labels", "btn-settings-battler-fx",
      "btn-settings-clear-achievements", "btn-settings-clear-profile", "btn-settings-reset-prefs",
      "btn-settings-credits"
    ];
    for (const id of advancedIds) {
      const btn = $(id); const row = btn && btn.closest ? btn.closest(".settings-row") : null;
      if (row) row.classList.add("settings-advanced-row");
    }
    for (const id of ["settings-bgm-volume", "settings-sfx-volume", "settings-dim"]) {
      const input = $(id); const row = input && input.closest ? input.closest(".settings-row") : null;
      if (row) row.classList.add("settings-advanced-row");
    }
    const exp = screen.querySelector(".settings-experience-panel"); if (exp) exp.classList.add("settings-advanced-panel");
    const about = screen.querySelector(".settings-about-panel"); if (about) about.classList.add("settings-advanced-panel");
    const controls = screen.querySelector(".settings-controls-panel");
    if (controls) [...controls.querySelectorAll(".settings-row")].forEach((row, i) => { if (i > 0) row.classList.add("settings-advanced-row"); });
  }

  function openSettings(returnScreen) {
    app.settingsReturn = returnScreen === "game" ? "game" : (returnScreen || "home");
    const back = $("btn-settings-back");
    if (back) back.textContent = app.settingsReturn === "game" ? "← 返回对局" : "← 返回档案处";
    showScreen("settings");
    updateSettingsUI();
    applySettingsSimplicity();
  }

  function applyHomeVideo() {
    const video = $("home-bg-video");
    if (!video) return;
    const on = !!app.bgVideoOn && app.screen === "home";
    video.classList.toggle("on", on);
    video.muted = true;
    if (on) video.play().catch(() => {});
    else video.pause();
  }

  function applyMobileFixedSettings() {
    const mobile = isPhoneLayout();
    const controls = document.querySelector(".settings-controls-panel");
    if (controls) controls.hidden = false;
    const handBtn = $("btn-settings-hand-mode");
    const handFixed = $("settings-hand-fixed");
    if (handBtn) handBtn.hidden = mobile;
    if (handFixed) handFixed.hidden = !mobile;
    const hideOnMobile = ["btn-settings-bg", "btn-settings-bgvideo", "btn-settings-motion", "btn-settings-fx", "btn-settings-textsize", "btn-settings-fullscreen"];
    for (const id of hideOnMobile) {
      const btn = $(id);
      const row = btn && btn.closest && btn.closest(".settings-row");
      if (row) row.hidden = mobile;
    }
  }

  function applyVideoPrefs() {
    if (isPhoneLayout()) {
      app.bgAnimOn = false;
      app.bgVideoOn = false;
      app.motionOn = false;
      app.fxOn = false;
      app.textLarge = true;
      if (!localStorage.getItem("gok_screen_shake")) app.screenShake = false;
      if (!localStorage.getItem("gok_anim_speed")) app.animSpeed = 1.25;
      if (!localStorage.getItem("gok_ai_speed")) app.aiSpeed = "slow";
      if (!localStorage.getItem("gok_ui_density")) app.uiDensity = "compact";
      if (!localStorage.getItem("gok_damage_numbers")) app.damageNumbers = false;
    }
    document.documentElement.style.setProperty("--anim-scale", String(app.animSpeed || 0.7));
    document.body.classList.toggle("no-bg-animation", !app.bgAnimOn);
    document.body.classList.toggle("reduce-motion", !app.motionOn);
    document.body.classList.toggle("simple-fx", !app.fxOn);
    document.body.classList.toggle("large-text", !!app.textLarge);
    document.documentElement.style.setProperty("--bg-dim", String((app.bgDim || 0) / 100));
    applyExperiencePrefs();
    applyHomeVideo();
  }

  function applyExperiencePrefs() {
    document.body.classList.toggle("ui-compact", app.uiDensity === "compact");
    document.body.classList.toggle("high-contrast", !!app.highContrast);
    document.body.classList.toggle("hide-zone-labels", !app.zoneLabels);
  }

  function toggleBgVideo() {
    app.bgVideoOn = !app.bgVideoOn;
    setPref("gok_bg_video", app.bgVideoOn ? "1" : "0");
    applyHomeVideo();
    updateSettingsUI();
  }

  function toggleBgAnim() {
    app.bgAnimOn = !app.bgAnimOn;
    localStorage.setItem("gok_bg_anim", app.bgAnimOn ? "1" : "0");
    applyVideoPrefs();
    updateSettingsUI();
  }

  function toggleMotion() {
    app.motionOn = !app.motionOn;
    localStorage.setItem("gok_motion", app.motionOn ? "1" : "0");
    applyVideoPrefs();
    updateSettingsUI();
  }

  function cinemaEnabled() {
    try { return localStorage.getItem("gok_cg_off") !== "1"; } catch (e) { return true; }
  }

  function setPref(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (e) {}
  }

  function toggleCinema() {
    const next = !cinemaEnabled();
    setPref("gok_cg_off", next ? "0" : "1");
    toast(next ? "剧情演出已开启。" : "剧情演出已关闭，将直接进入对局。");
    updateSettingsUI();
  }

  function replayOpening() {
    if (!global.GokCinema || typeof global.GokCinema.play !== "function") {
      toast("当前版本没有可播放的剧情演出。");
      return;
    }
    global.GokCinema.play("opening.mp4", {
      eyebrow: "GOK WORLD · VEIN GAMBIT",
      title: "戈克降临",
      text: "地脉在群山之下翻身，巨影自风暴中醒来。档案室记录下这一切，等待下一位执脉者。"
    });
  }

  function toggleLowFx() {
    const low = !app.bgAnimOn && !app.motionOn && !app.fxOn && !app.damageNumbers && !app.screenShake;
    const next = !low;
    app.bgAnimOn = !next;
    app.bgVideoOn = false;
    app.motionOn = !next;
    app.fxOn = !next;
    app.damageNumbers = !next;
    app.screenShake = !next;
    setPref("gok_bg_anim", app.bgAnimOn ? "1" : "0");
    setPref("gok_bg_video", "0");
    setPref("gok_motion", app.motionOn ? "1" : "0");
    setPref("gok_fx", app.fxOn ? "1" : "0");
    setPref("gok_damage_numbers", app.damageNumbers ? "1" : "0");
    setPref("gok_screen_shake", app.screenShake ? "1" : "0");
    applyVideoPrefs();
    updateSettingsUI();
    toast(next ? "低配模式已开启：动效与伤害数字已关闭。" : "已恢复完整特效。");
  }

  function resetVisualAudioPrefs() {
    app.audioOn = true;
    app.audioVolume = 0.7;
    app.bgmVolume = 0.22;
    app.sfxVolume = 0.42;
    app.bgmOn = true;
    app.sfxOn = true;
    app.bgAnimOn = true;
    app.bgVideoOn = false;
    app.motionOn = true;
    app.fxOn = true;
    app.damageNumbers = true;
    app.screenShake = true;
    app.textLarge = false;
    app.bgDim = 0;
    app.aiSpeed = "normal";
    app.uiDensity = "comfortable";
    app.handSort = "none";
    app.highContrast = false;
    app.zoneLabels = true;
    app.battlerFx = "normal";
    setPref("gok_sound", "1");
    setPref("gok_volume", "0.7");
    setPref("gok_bgm_volume", "0.22");
    setPref("gok_sfx_volume", "0.42");
    setPref("gok_bgm", "1");
    setPref("gok_sfx", "1");
    setPref("gok_bg_anim", "1");
    setPref("gok_bg_video", "0");
    setPref("gok_motion", "1");
    setPref("gok_fx", "1");
    setPref("gok_damage_numbers", "1");
    setPref("gok_screen_shake", "1");
    setPref("gok_text_large", "0");
    setPref("gok_bg_dim", "0");
    setPref("gok_ai_speed", "normal");
    setPref("gok_ui_density", "comfortable");
    setPref("gok_hand_sort", "none");
    setPref("gok_high_contrast", "0");
    setPref("gok_zone_labels", "1");
    setPref("gok_battler_fx", "normal");
    try { localStorage.removeItem("gok_cg_off"); } catch (e) {}
    AudioBox.applyVolumes();
    AudioBox.updateButton();
    applyVideoPrefs();
    updateSettingsUI();
    toast("画面与声音设置已恢复默认。");
  }

  function persistExperiencePrefs() {
    localStorage.setItem("gok_ui_density", app.uiDensity);
    localStorage.setItem("gok_hand_sort", app.handSort);
    localStorage.setItem("gok_high_contrast", app.highContrast ? "1" : "0");
    localStorage.setItem("gok_zone_labels", app.zoneLabels ? "1" : "0");
    localStorage.setItem("gok_battler_fx", app.battlerFx);
  }
  function refreshBgmForScreen() {
    if (app.screen === "game") AudioBox.bgm(BATTLE_BGM);
    else if (app.screen === "setup" || app.screen === "lan" || app.screen === "match" || app.screen === "room") AudioBox.bgm(PREP_BGM);
    else if (app.screen === "codex" || app.screen === "deck" || app.screen === "achievements") AudioBox.bgm(ARCHIVE_BGM);
    else AudioBox.bgm(MAIN_BGM);
  }
  function applyExperiencePreset(kind) {
    const presets = {
      immersive: { uiDensity: "comfortable", bgAnimOn: true, bgVideoOn: true, motionOn: true, fxOn: true, damageNumbers: true, screenShake: true, highContrast: false, zoneLabels: true, battlerFx: "normal", aiSpeed: "normal", handSort: "none" },
      competitive: { uiDensity: "compact", bgAnimOn: false, bgVideoOn: false, motionOn: true, fxOn: true, damageNumbers: true, screenShake: false, highContrast: true, zoneLabels: true, battlerFx: "fast", aiSpeed: "fast", handSort: "cost" },
      performance: { uiDensity: "compact", bgAnimOn: false, bgVideoOn: false, motionOn: false, fxOn: false, damageNumbers: false, screenShake: false, highContrast: false, zoneLabels: false, battlerFx: "fast", aiSpeed: "fast", handSort: "none" }
    };
    const p = presets[kind]; if (!p) return;
    Object.assign(app, p);
    localStorage.setItem("gok_ui_density", app.uiDensity);
    localStorage.setItem("gok_hand_sort", app.handSort);
    localStorage.setItem("gok_high_contrast", app.highContrast ? "1" : "0");
    localStorage.setItem("gok_zone_labels", app.zoneLabels ? "1" : "0");
    localStorage.setItem("gok_battler_fx", app.battlerFx);
    localStorage.setItem("gok_bg_anim", app.bgAnimOn ? "1" : "0");
    localStorage.setItem("gok_bg_video", app.bgVideoOn ? "1" : "0");
    localStorage.setItem("gok_motion", app.motionOn ? "1" : "0");
    localStorage.setItem("gok_fx", app.fxOn ? "1" : "0");
    localStorage.setItem("gok_damage_numbers", app.damageNumbers ? "1" : "0");
    localStorage.setItem("gok_screen_shake", app.screenShake ? "1" : "0");
    localStorage.setItem("gok_ai_speed", app.aiSpeed);
    applyVideoPrefs();
    refreshBgmForScreen();
    updateSettingsUI();
    if (app.game && app.screen === "game") renderGame();
    toast("已应用「" + (kind === "immersive" ? "沉浸" : kind === "competitive" ? "竞技" : "性能") + "」预设。");
  }

  function updateSettingsUI() {
    const b = $("btn-settings-sound");
    if (b) b.textContent = "声音：" + (app.audioOn ? "开" : "关");
    const slider = $("settings-volume");
    if (slider) slider.value = String(Math.round((app.audioVolume == null ? 0.7 : app.audioVolume) * 100));
    const label = $("settings-volume-label");
    if (label) label.textContent = Math.round((app.audioVolume == null ? 0.7 : app.audioVolume) * 100) + "%";
    const bgmSlider = $("settings-bgm-volume");
    if (bgmSlider) bgmSlider.value = String(Math.round((app.bgmVolume == null ? 0.22 : app.bgmVolume) * 100));
    const bgmLabel = $("settings-bgm-label");
    if (bgmLabel) bgmLabel.textContent = Math.round((app.bgmVolume == null ? 0.22 : app.bgmVolume) * 100) + "%";
    const sfxSlider = $("settings-sfx-volume");
    if (sfxSlider) sfxSlider.value = String(Math.round((app.sfxVolume == null ? 0.42 : app.sfxVolume) * 100));
    const sfxLabel = $("settings-sfx-label");
    if (sfxLabel) sfxLabel.textContent = Math.round((app.sfxVolume == null ? 0.42 : app.sfxVolume) * 100) + "%";
    const cinema = $("btn-settings-cinema");
    if (cinema) cinema.textContent = "演出：" + (cinemaEnabled() ? "开" : "关");
        const fs = $("btn-settings-fullscreen");
    if (fs) fs.textContent = "全屏：" + (document.fullscreenElement ? "开" : "关");
    const bgm = $("btn-settings-bgm");
    if (bgm) bgm.textContent = "音乐：" + (app.bgmOn ? "开" : "关");
    const sfx = $("btn-settings-sfx");
    if (sfx) sfx.textContent = "音效：" + (app.sfxOn ? "开" : "关");
    const bg = $("btn-settings-bg");
    if (bg) bg.textContent = "背景动画：" + (app.bgAnimOn ? "开" : "关");
    const bgVideo = $("btn-settings-bgvideo");
    if (bgVideo) bgVideo.textContent = "背景视频：" + (app.bgVideoOn ? "开" : "关");
    const motion = $("btn-settings-motion");
    if (motion) motion.textContent = "动态效果：" + (app.motionOn ? "开" : "关");
    const dmgNum = $("btn-settings-damage");
    if (dmgNum) dmgNum.textContent = "伤害数字：" + (app.damageNumbers ? "开" : "关");
    const fx = $("btn-settings-fx");
    if (fx) fx.textContent = "战斗特效：" + (app.fxOn ? "完整" : "简洁");
    const ai = $("btn-settings-ai");
    if (ai) ai.textContent = "AI：" + (app.aiSpeed === "slow" ? "慢速" : app.aiSpeed === "fast" ? "快速（1.2秒）" : "标准（2秒）");
    const shake = $("btn-settings-shake");
    if (shake) shake.textContent = "震动：" + (app.screenShake ? "开" : "关");
    const anim = $("btn-settings-anim");
    if (anim) anim.textContent = "动画：" + (app.animSpeed <= 0.6 ? "很快" : app.animSpeed <= 0.78 ? "快" : app.animSpeed <= 1.02 ? "标准" : "慢");
    const handMode = $("btn-settings-hand-mode");
    if (handMode) handMode.textContent = "出牌：" + (isPhoneLayout() ? "点击" : app.handPlayMode === "double" ? "双击" : "拖拽");
    const textsize = $("btn-settings-textsize");
    if (textsize) textsize.textContent = "文字：" + (app.textLarge ? "大" : "标准");
    const dim = $("settings-dim");
    if (dim) dim.value = String(app.bgDim || 0);
    const dimLabel = $("settings-dim-label");
    if (dimLabel) dimLabel.textContent = (app.bgDim || 0) + "%";
    const density = $("btn-settings-density"); if (density) density.textContent = "界面：" + (app.uiDensity === "compact" ? "紧凑" : "舒适");
    const sort = $("btn-settings-hand-sort"); if (sort) sort.textContent = "排序：" + (app.handSort === "cost" ? "费用" : app.handSort === "type" ? "类型" : "默认");
    const contrast = $("btn-settings-contrast"); if (contrast) contrast.textContent = "高对比：" + (app.highContrast ? "开" : "关");
    const zones = $("btn-settings-zone-labels"); if (zones) zones.textContent = "标签：" + (app.zoneLabels ? "显示" : "隐藏");
    const battlerFx = $("btn-settings-battler-fx"); if (battlerFx) battlerFx.textContent = "演出：" + (app.battlerFx === "fast" ? "快速" : "标准");
    applyVideoPrefs();
    applyMobileFixedSettings();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => toast("当前环境不允许全屏。"));
    } else {
      toast("当前浏览器不支持全屏。");
    }
  }

  /* ===== 局域网 ===== */
  function lanServerAvailable() {
    return location.protocol === "http:" || location.protocol === "https:";
  }

  function isHostPage() {
    if (!lanServerAvailable()) return false;
    const hostParam = new URLSearchParams(location.search).get("host");
    if (hostParam === "1") return true;
    if (hostParam === "0") return false;
    if (app.roomCode) return false;
    // 本机启动器打开 localhost 时默认是房主；远程设备打开同一地址时默认是挑战者。
    const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    return local && !sessionStorage.getItem("gok_lan_guest");
  }

  async function lanApi(path, options) {
    if (app.roomCode) path += (path.indexOf("?") >= 0 ? "&" : "?") + "room=" + encodeURIComponent(app.roomCode);
    const res = await fetch(path, Object.assign({ cache: "no-store" }, options || {}));
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
    return data;
  }

  function lanHeartbeat(player) {
    clearInterval(app.lanHeartbeatTimer);
    const ping = () => lanApi("/api/hello?player=" + player, { method: "POST" }).catch(() => {});
    ping();
    app.lanHeartbeatTimer = setInterval(ping, 2500);
  }

  function syncRankModeUI() {
    if (app.roomCode) app.lanRanked = false;
    document.querySelectorAll(".rank-mode-tabs").forEach((b) => { b.hidden = !!app.roomCode; });
    const roomRulesBox = $("lan-room-rules");
    if (roomRulesBox) {
      roomRulesBox.hidden = !app.roomCode;
      const rules = app.roomRules || {};
      if ($("lan-rule-hp")) $("lan-rule-hp").value = String(rules.hp || 28);
      if ($("lan-rule-rounds")) $("lan-rule-rounds").value = String(rules.maxRounds || 0);
      if ($("lan-rule-first")) $("lan-rule-first").value = rules.first || "random";
    }
    document.querySelectorAll(".rank-mode-tab").forEach((b) => {
      b.classList.toggle("active", (b.dataset.lanMode === "ranked") === !!app.lanRanked);
    });
    const hostLabel = $("lan-rank-label");
    if (hostLabel) hostLabel.textContent = app.roomCode ? "固定休闲" : "S" + ((app.profile && app.profile.rankSeason) || 1) + " · " + rankText((app.profile && app.profile.rankPoints) || 0);
    const guestRank = $("lan-guest-rank");
    if (guestRank) guestRank.textContent = "我的排位：" + rankText((app.profile && app.profile.rankPoints) || 0);
    const guestMode = $("lan-guest-mode");
    if (guestMode) guestMode.textContent = app.lanRanked ? "排位赛" : "休闲对局";
    const start = $("btn-lan-start");
    if (start && app.lanRanked) start.textContent = start.disabled ? start.textContent : "开始排位";
  }

  async function setLanRanked(ranked) {
    if (app.roomCode) { app.lanRanked = false; syncRankModeUI(); toast("组队码房间固定为休闲对局。"); return; }
    app.lanRanked = !!ranked;
    syncRankModeUI();
    try {
      await lanApi("/api/room/mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ranked: app.lanRanked })
      });
      AudioBox.play("select");
      toast(app.lanRanked ? "已切换为排位赛。" : "已切换为休闲对局。");
    } catch (e) {
      toast("模式切换失败：" + (e.message || e));
    }
  }

  async function refreshLanStatus() {
    if (!lanServerAvailable()) {
      $("lan-hint").textContent = "局域网模式需要通过启动器打开（Edge 应用模式）。直接打开 HTML 文件只能进行单人推演。";
      $("lan-hint").classList.add("error");
      return;
    }
    try {
      const st = await lanApi("/api/status");
      const url = app.roomCode ? location.origin + "/?room=" + app.roomCode : "http://" + st.ip + ":" + st.port + "/";
      app.lanAddress = url;
      $("lan-address").textContent = url;
      if (!app.roomCode) renderLanAddresses(st);
      updateOnlineRoomBar();
      if ($("lan-guest-address")) $("lan-guest-address").textContent = location.origin + "/";
      app.lanGuestOnline = !!st.guestOnline;
      if (app.net && app.net.role === "host" && Number(st.seq || 0) < app.lanSince) {
        app.lanSince = 0;
        startNetPoll(0, 0);
      }
      app.lanGuestName = (st.names && st.names[1]) || app.lanGuestName || null;
      app.lanHostName = (st.names && st.names[0]) || app.lanHostName || null;
      if (app.net && app.game) setOpponentOnline(!!st.guestOnline);
      app.lanGuestFaction = st.guestFaction || null;
      app.lanGuestReady = !!st.guestReady;
      app.lanGuestDecks = st.guestDecks || null;
      app.lanGuestRelic = st.guestRelic || null;
      app.lanGuestDecksReady = !!st.guestDecksReady;
      app.lanRanked = app.roomCode ? false : !!st.ranked;
      syncRankModeUI();
      const gf = st.guestFaction && D.FACTIONS[st.guestFaction] ? D.FACTIONS[st.guestFaction].name : "选择阵营中";
      $("lan-status").textContent = st.guestOnline ? (st.guestReady ? "挑战者已准备 · " + gf + " · 牌组已同步" : "挑战者已连接 · " + gf + " · 等待准备") : "等待挑战者连接…";
      $("lan-status").classList.toggle("online", !!st.guestOnline && !!st.guestReady);
      const gfName = $("lan-guest-faction-name");
      if (gfName) gfName.textContent = st.guestOnline ? gf : "等待选择";
      const start = $("btn-lan-start");
      if (start) {
        start.disabled = !(st.guestOnline && st.guestReady && st.guestDecksReady && st.guestFaction);
        start.textContent = st.guestOnline ? (st.guestReady ? (st.guestDecksReady ? (st.guestFaction ? (app.lanRanked ? "开始排位" : "开始对局") : "等待选择阵营") : "等待同步牌组") : "等待挑战者准备") : "等待挑战者";
      }
      $("lan-hint").classList.remove("error");
      $("lan-hint").textContent = app.lanAutoMatch ? "快速匹配已连接，正在自动准备…" : "地址在同一个局域网内可访问；如果打不开，请检查 Windows 防火墙是否允许 Edge。";
      maybeAutoStartMatchedRoom();
    } catch (e) {
      $("lan-hint").textContent = "局域网服务器没有响应。请通过启动器打开游戏，或确认端口 4173 未被占用。";
      $("lan-hint").classList.add("error");
      const start = $("btn-lan-start");
      if (start) { start.disabled = true; start.textContent = "服务器未连接"; }
    }
  }

  function maybeAutoStartMatchedRoom() {
    if (!app.lanAutoMatch || !app.lanHostPage || app.lanAutoStarted || app.game) return;
    if (!(app.lanGuestOnline && app.lanGuestReady && app.lanGuestDecksReady && app.lanGuestFaction)) return;
    app.lanAutoStarted = true;
    setTimeout(() => {
      if (!app.game) hostStartLan();
    }, 180);
  }

  function lanHasCustom(faction) {
    const custom = app.customDecks[faction];
    return !!(custom && D.validateDeck(faction, custom).ok);
  }

  function updateGuestDeckLabel() {
    const valid = lanHasCustom(app.lanFaction);
    const label = $("lan-guest-deck-label");
    if (label) label.textContent = (valid && app.lanGuestUseCustom ? "自定义牌组" : "预设牌组") + " · 30 张";
    const select = $("lan-guest-deck-select");
    if (select) {
      select.value = app.lanGuestUseCustom && valid ? "custom" : "preset";
      const customOption = select.querySelector('option[value="custom"]');
      if (customOption) customOption.disabled = !valid;
    }
  }

  function updateHostDeckLabel() {
    const valid = lanHasCustom(app.lanFaction);
    const label = $("lan-host-deck-label");
    if (label) label.textContent = (valid && app.lanHostUseCustom ? "自定义牌组" : "预设牌组") + " · 30 张";
    const select = $("lan-host-deck-select");
    if (select) {
      select.value = app.lanHostUseCustom && valid ? "custom" : "preset";
      const customOption = select.querySelector('option[value="custom"]');
      if (customOption) customOption.disabled = !valid;
    }
  }

  function renderLanAddresses(st) {
    const box = $("lan-address-list");
    if (!box) return;
    clear(box);
    const seen = {};
    const port = st.port || 4173;
    const addresses = (st.addresses || []).filter((x) => x && x.address && x.address.indexOf("169.254.") !== 0);
    for (const item of addresses) {
      const url = "http://" + item.address + ":" + port + "/";
      if (seen[url]) continue;
      seen[url] = true;
      const row = el("button", "lan-address-item");
      const label = el("span", "lan-address-url", url);
      const adapter = el("small", null, (item.name || "本机网卡") + " · 端口 " + port);
      const copy = el("em", null, "复制");
      row.appendChild(label);
      row.appendChild(adapter);
      row.appendChild(copy);
      row.onclick = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast("已复制：" + url)).catch(() => toast(url));
        else toast(url);
      };
      box.appendChild(row);
    }
    if (!addresses.length) box.appendChild(el("div", "lan-address-empty", "未检测到可用网卡地址。"));
  }

  function initLanScreen() {
    if (app.roomCode) app.lanRanked = false;
    app.lanHostPage = isHostPage();
    app.lanGuestOnline = false;
    clearInterval(app.lanStatusTimer);
    clearInterval(app.lanHeartbeatTimer);
    if (!lanServerAvailable()) {
      $("lan-host-panel").hidden = true;
      $("lan-guest-panel").hidden = true;
      $("lan-title").textContent = "局域网未启动";
      $("lan-intro").textContent = "局域网对战需要房主通过启动器打开，挑战者用浏览器访问房主地址。";
      $("lan-hint").textContent = "直接打开 HTML 文件时，浏览器无法提供局域网中继服务。";
      $("lan-hint").classList.add("error");
      return;
    }
    $("lan-hint").classList.remove("error");
    if (app.lanHostPage) {
      clearInterval(app.lanHeartbeatTimer);
      lanHeartbeat(0);
      refreshResumePanel();
      $("lan-role-label").textContent = app.roomCode ? "ONLINE / HOST" : "HOST / ROOM";
      $("lan-title").textContent = app.roomCode ? "在线房间" : "建立房间";
      $("lan-intro").textContent = app.roomCode ? "把邀请链接发给朋友，对方打开后选择阵营并准备。" : "把下面的地址发给同一局域网内的挑战者。对手用浏览器打开后，即可坐到你的对面。";
      $("lan-host-panel").hidden = false;
      $("lan-guest-panel").hidden = true;
      const isPrivateHost = /^(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname) || location.protocol === "file:";
      if (!isPrivateHost) {
        app.lanPublicUrl = location.origin;
        const pinput = $("lan-public-input"); if (pinput) pinput.value = location.origin;
        const pst = $("lan-public-status"); if (pst) { pst.textContent = location.origin; pst.classList.add("ok"); }
      }
      $("lan-status").textContent = "等待挑战者连接…";
      $("lan-status").classList.remove("online");
      $("lan-hint").textContent = "正在检测局域网与服务器…";
      document.querySelectorAll("#lan-faction .faction-card").forEach((b) => { b.classList.toggle("active", b.dataset.lanFaction === app.lanFaction); b.style.setProperty("--emblem", "url('" + D.FACTIONS[b.dataset.lanFaction].emblem + "')"); });
      updateHostDeckLabel();
      app.lanStatusTimer = setInterval(refreshLanStatus, 1400);
      refreshLanStatus();
    } else {
      $("lan-role-label").textContent = app.roomCode ? "ONLINE / GUEST" : "GUEST / CHALLENGER";
      $("lan-title").textContent = app.roomCode ? "加入在线房间" : "加入房间";
      $("lan-intro").textContent = app.roomCode ? "选择你的阵营，编成自己的牌组，然后准备。" : "选择你的阵营，编成自己的牌组，然后加入房主的对局。";
      $("lan-host-panel").hidden = true;
      $("lan-guest-panel").hidden = false;
      $("lan-guest-address").textContent = app.roomCode ? location.origin + "/?room=" + app.roomCode : location.origin + "/";
      const joinBtn = $("btn-lan-join");
      if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = "准备"; }
      try { const sf = sessionStorage.getItem("gok_lan_faction"); if (sf && D.FACTIONS[sf]) app.lanFaction = sf; } catch (e) {}
      document.querySelectorAll("#lan-guest-faction .faction-card").forEach((b) => {
        b.disabled = false;
        b.classList.toggle("active", b.dataset.guestFaction === app.lanFaction);
        b.style.setProperty("--emblem", "url('" + D.FACTIONS[b.dataset.guestFaction].emblem + "')");
      });
      const gd = $("btn-lan-guest-deck"); if (gd) gd.disabled = false;
      const gsel = $("lan-guest-deck-select"); if (gsel) gsel.disabled = false;
      updateGuestDeckLabel();
      $("lan-guest-status").textContent = "尚未准备";
    }
    syncRankModeUI();
    updateOnlineRoomBar();
  }

  function initLanEvents() {
    document.querySelectorAll(".rank-mode-tab").forEach((b) => {
      b.onclick = () => setLanRanked(b.dataset.lanMode === "ranked");
    });
    const copy = $("btn-copy-lan");
    if (copy) copy.onclick = () => {
      const text = app.lanAddress || $("lan-address").textContent;
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => toast("地址已复制。")).catch(() => toast(text));
      } else {
        toast(text);
      }
    };
    document.querySelectorAll("#lan-faction .faction-card").forEach((b) => {
      b.onclick = () => {
        app.lanFaction = b.dataset.lanFaction;
        document.querySelectorAll("#lan-faction .faction-card").forEach((x) => x.classList.toggle("active", x === b));
        updateHostDeckLabel();
        AudioBox.play("click");
      };
    });
    document.querySelectorAll("#lan-guest-faction .faction-card").forEach((b) => {
      b.onclick = () => {
        if (b.disabled) return;
        app.lanFaction = b.dataset.guestFaction;
        try { sessionStorage.setItem("gok_lan_faction", app.lanFaction); } catch (e) {}
        document.querySelectorAll("#lan-guest-faction .faction-card").forEach((x) => x.classList.toggle("active", x === b));
        updateGuestDeckLabel();
        AudioBox.play("click");
      };
    });
    const guestDeck = $("btn-lan-guest-deck");
    if (guestDeck) guestDeck.onclick = () => { AudioBox.play("ui_open"); openDeckBuilder(app.lanFaction || "pus", "lan"); };
    const hostDeck = $("btn-lan-host-deck");
    if (hostDeck) hostDeck.onclick = () => { AudioBox.play("ui_open"); openDeckBuilder(app.lanFaction || "pus", "lan"); };
    const hostSelect = $("lan-host-deck-select");
    if (hostSelect) hostSelect.onchange = () => { app.lanHostUseCustom = hostSelect.value === "custom" && lanHasCustom(app.lanFaction); updateHostDeckLabel(); };
    const guestSelect = $("lan-guest-deck-select");
    if (guestSelect) guestSelect.onchange = () => { app.lanGuestUseCustom = guestSelect.value === "custom" && lanHasCustom(app.lanFaction); updateGuestDeckLabel(); };
    const publicBtn = $("btn-lan-public");
    if (publicBtn) publicBtn.onclick = () => {
      const input = $("lan-public-input");
      const raw = (input ? input.value : "").trim().replace(/\/+$/, "");
      if (!/^https?:\/\/[^\s]+$/i.test(raw)) { toast("请填写完整的 http(s) 公网地址。"); return; }
      app.lanPublicUrl = raw;
      const st = $("lan-public-status");
      if (st) { st.textContent = raw; st.classList.add("ok"); }
      if (st) st.title = "把这个地址发给远程对手";
      AudioBox.play("ui_open");
      toast("公网地址已设置，复制后发给远程对手。");
    };
    const publicCopy = $("btn-copy-public");
    if (publicCopy) publicCopy.onclick = () => {
      const input = $("lan-public-input");
      const text = app.lanPublicUrl || (input ? input.value.trim() : "");
      if (!text) { toast("还没有填写公网地址。"); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast("公网地址已复制。")).catch(() => toast(text));
      else toast(text);
    };
    const start = $("btn-lan-start");
    if (start) start.onclick = () => hostStartLan();
    const resume = $("btn-lan-resume");
    if (resume) resume.onclick = () => resumeHostGame();
    const join = $("btn-lan-join");
    if (join) join.onclick = () => joinLanRoom();
  }

  function stopNet(clearGame) {
    if (app.onlineClockTimer) { clearInterval(app.onlineClockTimer); app.onlineClockTimer = null; }
    app.onlineTurnKey = "";
    app.onlineTurnDeadline = 0;
    app.onlineTurnWarned = false;
    app.opponentOnline = true;
    const turnTimer = $("game-turn-timer"); if (turnTimer) turnTimer.hidden = true;
    const conn = $("game-connection-status"); if (conn) conn.hidden = true;
    if (app.lanStatusTimer) clearInterval(app.lanStatusTimer);
    if (app.lanHeartbeatTimer) clearInterval(app.lanHeartbeatTimer);
    if (app.lanPollTimer) clearTimeout(app.lanPollTimer);
    if (app.lanWaitTimer) clearTimeout(app.lanWaitTimer);
    app.lanStatusTimer = null;
    app.lanHeartbeatTimer = null;
    app.lanPollTimer = null;
    app.lanWaitTimer = null;
    app.lanPollBusy = false;
    app.net = null;
    app.lanEndShown = false;
    try { sessionStorage.removeItem("gok_lan_guest"); } catch (e) {}
    clearHostSession();
    if (clearGame && app.screen !== "game") app.game = null;
  }

  async function hostStartLan() {
    if (app.lanHostUseCustom && deckContainsEaster(getPlayDeck(app.lanFaction || "pus"))) { toast("彩蛋卡只能用于单人 AI 推演，不能进入联机房间。"); return; }
    if (app.lanGuestUseCustom && app.lanGuestDecks && Object.values(app.lanGuestDecks).some(deckContainsEaster)) { toast("挑战者牌组含彩蛋卡，不能开始联机对局。"); return; }
    if (!app.lanGuestOnline) { toast("挑战者还没有连接。"); return; }
    if (!app.lanGuestReady) { toast("挑战者还没有准备。"); return; }
    if (!app.lanGuestDecksReady) { toast("挑战者还没有同步牌组。"); return; }
    try { await lanApi("/api/reset", { method: "POST" }); } catch (e) {}
    clearHostSession();
    const faction = app.lanFaction || "pus";
    const other = app.lanGuestFaction || D.nextFaction(faction);
    const seed = (Date.now() >>> 0) ^ Math.floor(Math.random() * 0x7fffffff);
    const roomRules = app.roomRules || {};
    const firstRule = app.roomCode ? (roomRules.first === "host" ? 0 : roomRules.first === "guest" ? 1 : undefined) : undefined;
    const state = E.createGame({
      faction1: faction,
      faction2: other,
      p1AI: false,
      p2AI: false,
      mode: "lan",
      mulligan: true,
      p1Deck: getSelectedPlayDeck(faction, app.lanHostUseCustom ? "custom" : "preset"),
      p2Deck: (() => {
        const active = app.lanGuestRelic || activeRelicFor(other);
        const gd = app.lanGuestDecks && app.lanGuestDecks[other];
        const source = gd && D.validateDeck(other, gd).ok ? gd : D.DECKS[other];
        return source.filter(id => { const def = D.CARDS[id]; return !def || def.type !== "equipment" || id === active; });
      })(),
      seed: seed,
      first: firstRule
    });
    if (app.roomCode && roomRules.hp) {
      for (const p of state.players) { p.maxHp = Number(roomRules.hp) || p.maxHp; p.hp = p.maxHp; }
    }
    if (app.roomCode && Number(roomRules.maxRounds) > 0) state.maxRounds = Number(roomRules.maxRounds);
    state.ranked = !!app.lanRanked;
    state.players[0].name = accountDisplayName();
    state.players[1].name = app.lanGuestName || (app.matchmaking ? "对手" : "挑战者");
    app.game = state;
    app.net = { role: "host", player: 0, active: true, since: 0 };
    app.human = 0;
    app.aiPlayer = null;
    app.local = false;
    app.viewer = 0;
    app.mode = "lan";
    app.busy = false;
    app.mulliganOpen = false;
    app.mulliganSubmitted = false;
    app.mulliganSelected = new Set();
    app.lanEndShown = false;
    try { sessionStorage.setItem("gok_host_active", "1"); } catch (e) {}
    app.lastVein = state.vein;
    app.lastThresholds = Object.assign({}, state.stats.thresholds);
    app.lanSince = 0;
    closeModal(true);
    showScreen("game");
    AudioBox.play("ui_open");
    renderGame();
    sendNet({ type: "state", state: redactStateForGuest(state) });
    startNetPoll(0);
    lanHeartbeat(0);
    if (state.current === 0) showTurnBanner("你的回合");
    else toast("已开始，等待挑战者行动。");
  }

  async function joinLanRoom() {
    if (app.lanGuestUseCustom && deckContainsEaster(getPlayDeck(app.lanFaction || "pus"))) { toast("彩蛋卡只能用于单人 AI 推演，不能进入联机房间。"); return; }
    if (!lanServerAvailable()) { toast("当前不是局域网模式。"); return; }
    const join = $("btn-lan-join");
    if (join) { join.disabled = true; join.textContent = "连接中…"; }
    try {
      await lanApi("/api/join?player=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decks: (app.lanGuestUseCustom && lanHasCustom(app.lanFaction)) ? (() => { const d = {}; d[app.lanFaction || "pus"] = app.customDecks[app.lanFaction || "pus"].slice(); return d; })() : {}, faction: app.lanFaction || "pus", relic: activeRelicFor(app.lanFaction || "pus"), name: accountDisplayName(), ranked: !!app.lanRanked })
      });
      app.net = { role: "guest", player: 1, active: true, since: 0 };
      app.lanGuestFaction = app.lanFaction || "pus";
      try { sessionStorage.setItem("gok_lan_faction", app.lanFaction || "pus"); } catch (e) {}
      document.querySelectorAll("#lan-guest-faction .faction-card").forEach((b) => { b.disabled = true; });
      const gd = $("btn-lan-guest-deck"); if (gd) gd.disabled = true;
      const gsel = $("lan-guest-deck-select"); if (gsel) gsel.disabled = true;
      app.lanGuestReady = true;
      if (join) { join.disabled = true; join.textContent = "已准备"; }
      if ($("lan-guest-status")) $("lan-guest-status").textContent = "已准备 · " + factionName(app.lanFaction || "pus") + " · 等待房主开始";
      app.lanEndShown = false;
      try { sessionStorage.setItem("gok_lan_guest", "1"); } catch (e) {}
      lanHeartbeat(1);
      startNetPoll(1);
      setTimeout(() => sendNet({ type: "action", action: { kind: "sync" } }), 350);
      AudioBox.play("ui_open");
    } catch (e) {
      hideReconnectOverlay();
      if (join) { join.disabled = false; join.textContent = "准备"; }
      toast("无法加入房间：" + (e.message || e));
    }
  }

  function startNetPoll(player, initialSince) {
    if (app.lanPollTimer) clearTimeout(app.lanPollTimer);
    app.opponentOnline = true;
    app.lanSince = initialSince || 0;
    app.lanPollBusy = false;
    const poll = async () => {
      if (!app.net || !app.net.active) return;
      if (app.lanPollBusy) { app.lanPollTimer = setTimeout(poll, 260); return; }
      app.lanPollBusy = true;
      try {
        const data = await lanApi("/api/poll?player=" + player + "&since=" + app.lanSince);
        app.lanSince = Math.max(app.lanSince, data.seq || 0);
        if (typeof data.hostOnline === "boolean") setOpponentOnline(player === 1 ? data.hostOnline : data.guestOnline);
        for (const msg of data.messages || []) {
          if (msg.payload && msg.payload.type === "emote") { receiveEmote(msg.payload.emote, msg.from); continue; }
          if (player === 0) {
            if (msg.payload && msg.payload.type === "action") applyGuestAction(msg.payload.action);
          } else {
            if (msg.payload && msg.payload.type === "state") applyGuestState(msg.payload.state);
          }
        }
      } catch (e) {
        // 网络中断时保持页面，下一次重试
      } finally {
        app.lanPollBusy = false;
        if (app.net && app.net.active) app.lanPollTimer = setTimeout(poll, 280);
      }
    };
    app.lanPollTimer = setTimeout(poll, 200);
  }

  const EMOTE_LINES = [
    { id: "tide", icon: "潮", text: "流脉会记住这一刻。", voice: "流脉会记住这一刻。" },
    { id: "archive", icon: "档", text: "档案不会说谎。", voice: "档案不会说谎。" },
    { id: "oath", icon: "誓", text: "这一局，写进档案。", voice: "这一局，写进档案。" },
    { id: "frost", icon: "霜", text: "让潮声替我们作证。", voice: "让潮声替我们作证。" },
    { id: "iron", icon: "铁", text: "牌桌从不撒谎。", voice: "牌桌从不撒谎。" },
    { id: "vein", icon: "脉", text: "潮起潮落，牌局未定。", voice: "潮起潮落，牌局未定。" },
    { id: "good", icon: "好", text: "这手漂亮。", voice: "这手漂亮。" },
    { id: "gg", icon: "礼", text: "承让，下一局见。", voice: "承让，下一局见。" }
  ];

  function speakEmote(text) {
    if (!app.emoteVoice || !window.speechSynthesis || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).slice(0, 40));
      u.lang = "zh-CN"; u.rate = 1.02; u.pitch = 1.06; u.volume = .78;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  function showEmote(emote, from) {
    if (!emote) return;
    const known = EMOTE_LINES.find(x => x.id === emote.id) || null;
    const data = known || { icon: String(emote.icon || "档").slice(0, 2), text: String(emote.text || "").slice(0, 40) };
    let layer = document.getElementById("emote-layer");
    if (!layer) { layer = el("div", "emote-layer"); layer.id = "emote-layer"; document.body.appendChild(layer); }
    const bubble = el("div", "emote-bubble");
    bubble.appendChild(el("b", "emote-bubble-icon", data.icon));
    const copy = el("div", "emote-bubble-copy");
    copy.appendChild(el("small", null, (from === "you" || from === app.viewer) ? "你" : "对手"));
    copy.appendChild(el("strong", null, data.text));
    bubble.appendChild(copy);
    layer.appendChild(bubble);
    requestAnimationFrame(() => bubble.classList.add("show"));
    setTimeout(() => { bubble.classList.remove("show"); setTimeout(() => bubble.remove(), 350); }, 3200);
    speakEmote(data.voice || "");
  }

  function sendEmote(emote) {
    if (!emote) return;
    const payload = { id: emote.id, icon: emote.icon, text: emote.text, voice: emote.voice };
    if (app.net && app.net.active) sendNet({ type: "emote", emote: payload });
    showEmote(payload, "you");
    AudioBox.play("select");
  }

  function receiveEmote(emote, from) {
    showEmote(emote, from === app.net.player ? "you" : "opponent");
    AudioBox.play("select");
  }

  function openEmotePanel() {
    openModal((content) => {
      content.classList.add("emote-panel-modal");
      content.appendChild(el("div", "eyebrow", "CHANNEL / BATTLE LINES"));
      content.appendChild(el("h3", null, "联机台词"));
      content.appendChild(el("p", null, "选择一句发送给对手。语音台词用本机语音合成播放，不经过服务器。"));
      const grid = el("div", "emote-grid");
      for (const e of EMOTE_LINES) {
        const b = el("button", "emote-choice");
        b.appendChild(el("b", null, e.icon)); b.appendChild(el("strong", null, e.text));
        b.onclick = () => { closeModal(true); sendEmote(e); };
        grid.appendChild(b);
      }
      content.appendChild(grid);
      const actions = el("div", "modal-actions");
      const voice = el("button", "btn btn-small btn-ghost", "语音台词：" + (app.emoteVoice ? "开" : "关"));
      voice.onclick = () => { app.emoteVoice = !app.emoteVoice; try { localStorage.setItem("gok_emote_voice", app.emoteVoice ? "1" : "0"); } catch (e) {} voice.textContent = "语音台词：" + (app.emoteVoice ? "开" : "关"); };
      const close = el("button", "btn btn-small btn-primary", "关闭");
      close.onclick = () => closeModal(true);
      actions.appendChild(voice); actions.appendChild(close); content.appendChild(actions);
    });
  }

  function sendNet(payload) {
    if (!app.net || !lanServerAvailable()) return Promise.resolve(null);
    return lanApi("/api/send?player=" + app.net.player, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => null);
  }

  let netBroadcastTimer = null;
  function scheduleNetBroadcast() {
    if (!app.net || app.net.role !== "host" || !app.net.active || !app.game) return;
    if (netBroadcastTimer) return;
    netBroadcastTimer = setTimeout(() => {
      netBroadcastTimer = null;
      sendNet({ type: "state", state: redactStateForGuest(app.game) });
    }, 60);
  }

  function redactStateForGuest(state) {
    const copy = JSON.parse(JSON.stringify(state));
    const host = copy.players[0];
    host.hand = host.hand.map((c, i) => ({ uid: "hidden_h" + i, cardId: "hidden" }));
    host.deck = host.deck.map((c, i) => ({ uid: "hidden_d" + i, cardId: "hidden" }));
    copy.log = copy.log.map((entry) => {
      if (entry.player === 0 && (entry.type === "draw" || entry.type === "discover" || entry.type === "burn")) {
        return Object.assign({}, entry, { text: "对手进行了一次档案操作。" });
      }
      return entry;
    });
    if (copy.pendingChoice && copy.pendingChoice.player === 0) {
      copy.pendingChoice = Object.assign({}, copy.pendingChoice, { options: ["hidden", "hidden", "hidden"] });
    }
    if (app.net && app.net.role === "host" && app.onlineTurnDeadline) {
      copy.turnRemainingMs = Math.max(0, app.onlineTurnDeadline - Date.now());
    }
    return copy;
  }

  function applyGuestState(state) {
    if (!state || !app.net || app.net.role !== "guest") return;
    const firstState = app.screen !== "game";
    const prevCurrent = app.game ? app.game.current : null;
    const prevActionSeq = app.game && app.game.lastAction ? app.game.lastAction.seq : 0;
    app.game = state;
    app.human = 1;
    app.viewer = 1;
    if (app.matchmaking && (!state.players[0].name || !state.players[1].name)) {
      state.players[0].name = state.players[0].name || "对手";
      state.players[1].name = state.players[1].name || accountDisplayName();
    }
    app.aiPlayer = null;
    app.local = false;
    app.mode = "lan";
    app.busy = false;
    app.animating = false;
    if (app.lanWaitTimer) { clearTimeout(app.lanWaitTimer); app.lanWaitTimer = null; }
    if (firstState) {
      app.mulliganOpen = false;
      app.mulliganSubmitted = false;
      app.mulliganSelected = new Set();
      app.lastVein = state.vein;
      app.lastThresholds = Object.assign({}, state.stats.thresholds);
      closeModal(true);
      showScreen("game");
      hideReconnectOverlay();
      AudioBox.play("ui_open");
      showTurnBanner("对局开始");
    }
    renderGame();
    if (state.pendingChoice && state.pendingChoice.player === 1) {
      if (!app.modalOpen) showDiscover();
    } else if (state.status === "gameover") {
      if (!app.lanEndShown) { app.lanEndShown = true; showEnd(); }
    }
    if (!firstState && prevCurrent !== state.current && state.status === "playing") {
      showTurnBanner(state.current === 1 ? "你的回合" : "对手回合");
    }
    if (!firstState && state.lastAction && state.lastAction.seq !== prevActionSeq && state.lastAction.player === 0) {
      const act = state.lastAction;
      if (act.type === "attack") setTimeout(() => animateRemoteAttack(act.attackerUid, act.targetUid, 0), 0);
      else if (act.type === "play") setTimeout(() => animateRemotePlay(act), 0);
      else if (act.type === "heroPower") setTimeout(() => animateRemoteAbility(act), 0);
    }
  }

  function applyGuestAction(action) {
    if (!action || !app.net || app.net.role !== "host") return;
    if (action.kind === "sync") {
      if (app.game) sendNet({ type: "state", state: redactStateForGuest(app.game) });
      return;
    }
    if (!app.game) return;
    if (action.kind === "surrender") {
      app.game.status = "gameover";
      app.game.winner = 0;
      sendNet({ type: "state", state: redactStateForGuest(app.game) });
      renderGame();
      showEnd();
      return;
    }
    if (action.kind === "mulligan") {
      if (app.game.mulliganPhase) E.mulliganPlayer(app.game, 1, action.uids || []);
      renderGame();
      return;
    }
    if (app.game.current !== 1 || app.game.status !== "playing") return;
    const prevCurrent = app.game.current;
    const playedDef = action.kind === "play" ? (() => { const h = app.game.players[1].hand.find(c => c.uid === action.cardUid); return h ? D.CARDS[h.cardId] : null; })() : null;
    let result = { ok: false };
    if (action.kind === "play") result = E.playCard(app.game, 1, action.cardUid, { targetUid: action.targetUid || null, targetUid2: action.targetUid2 || null, zone: action.zone || null, payBlood: !!action.payBlood });
    else if (action.kind === "attack") result = E.attack(app.game, 1, action.attackerUid, action.targetUid);
    else if (action.kind === "heroPower") result = E.useHeroPower(app.game, 1, action.targetUid);
    else if (action.kind === "end") result = E.endTurn(app.game, 1);
    else if (action.kind === "discover") result = E.resolveDiscover(app.game, 1, action.cardId);
    else if (action.kind === "retreat") result = E.retreatMinion(app.game, 1, action.uid);
    if (!result || !result.ok) {
      // 回发当前状态，让挑战者解除等待
      sendNet({ type: "state", state: redactStateForGuest(app.game) });
      return;
    }
    const turnChanged = app.game.current !== prevCurrent;
    renderGame();
    if (checkGameOverAfterAction()) return;
    if (action.kind === "attack" && result.ok) {
      setTimeout(() => animateRemoteAttack(action.attackerUid, action.targetUid, 1), 0);
    }
    if (playedDef) {
      setTimeout(() => showPlayFeedback(playedDef, { x: innerWidth / 2, y: innerHeight * 0.45 }, null), 0);
    } else if (action.kind === "play" && result.ok) {
      const act = app.game.lastAction;
      if (act && act.type === "play") setTimeout(() => animateRemotePlay(act), 0);
    } else if (action.kind === "heroPower" && result.ok) {
      const act = app.game.lastAction;
      if (act && act.type === "heroPower") setTimeout(() => animateRemoteAbility(act), 0);
    }
    if (turnChanged) {
      if (app.game.current === 0) showTurnBanner("你的回合");
      else showTurnBanner("对手回合");
    }
  }

  function animateRemoteAttack(attackerUid, targetUid, attackerOwner) {
    if (!app.game) return;
    const attackerEl = document.querySelector('.board-card[data-minion="' + attackerUid + '"]');
    const targetHeroId = attackerOwner === app.viewer ? "opponent-hero" : "player-hero";
    const targetEl = targetUid === "hero" ? document.getElementById(targetHeroId) : document.querySelector('.board-card[data-minion="' + targetUid + '"]');
    if (!attackerEl || !targetEl) return;
    const ar = attackerEl.getBoundingClientRect();
    const tr = targetEl.getBoundingClientRect();
    attackerEl.classList.add(attackerOwner === app.viewer ? "attack-up" : "attack-down");
    setTimeout(() => targetEl.classList.add("hit"), 100);
    setTimeout(() => showAttackLine(ar.left + ar.width / 2, ar.top + ar.height / 2, tr.left + tr.width / 2, tr.top + tr.height / 2), 80);
    setTimeout(() => showImpact((ar.left + tr.left + tr.width) / 2, (ar.top + tr.top + tr.height) / 2), 160);
    setTimeout(() => showImpact(tr.left + tr.width / 2, tr.top + tr.height / 2), 210);
    AudioBox.play("battle");
    setTimeout(() => {
      attackerEl.classList.remove("attack-up", "attack-down");
      targetEl.classList.remove("hit");
    }, 560);
  }

  function animateRemotePlay(action) {
    const def = D.CARDS[action.cardId];
    if (!def) return;
    showPlayFeedback(def, enemyHeroPoint(), null, "enemy");
    showManaSpend(action.player == null ? 1 : action.player, def.cost || 0);
    if (def.type === "equipment") showRelicEquipped(def, action.player == null ? 1 : action.player);
  }

  function animateRemoteAbility(action) {
    const hero = D.HEROES[action.heroId];
    const name = (hero && hero.power && hero.power.name) || action.powerName || "领袖技能";
    showAbilityFeedback(name, enemyHeroPoint());
  }

  function guestAnimateAttack(attackerUid, targetUid) {
    if (!app.net || app.net.role !== "guest") return false;
    const attackerEl = document.querySelector('.board-card[data-minion="' + attackerUid + '"]');
    const targetEl = targetUid === "hero" ? $("opponent-hero") : document.querySelector('.board-card[data-minion="' + targetUid + '"]');
    if (!attackerEl || !targetEl) return false;
    const ar = attackerEl.getBoundingClientRect();
    const tr = targetEl.getBoundingClientRect();
    attackerEl.classList.add("attack-up");
    setTimeout(() => targetEl.classList.add("hit"), 100);
    setTimeout(() => showAttackLine(ar.left + ar.width / 2, ar.top + ar.height / 2, tr.left + tr.width / 2, tr.top + tr.height / 2), 80);
    setTimeout(() => showImpact((ar.left + tr.left + tr.width) / 2, (ar.top + tr.top + tr.height) / 2), 160);
    setTimeout(() => showImpact(tr.left + tr.width / 2, tr.top + tr.height / 2), 210);
    AudioBox.play("battle");
    app.selectedCard = null;
    app.attacker = null;
    app.targetInfo = null;
    app.targetInfo = null;
    setTimeout(() => {
      guestSendAction({ kind: "attack", attackerUid: attackerUid, targetUid: targetUid });
    }, 280);
    return true;
  }

  function guestSendAction(action) {
    if (!app.net || app.net.role !== "guest") return false;
    app.busy = true;
    app.currentHint = "等待房主结算…";
    renderGame();
    sendNet({ type: "action", action: action });
    if (app.lanWaitTimer) clearTimeout(app.lanWaitTimer);
    app.lanWaitTimer = setTimeout(() => {
      if (app.busy) {
        app.busy = false;
        renderGame();
        toast("房主暂时没有响应。");
      }
    }, 3500);
    return true;
  }

  function preloadArt() {
    // 手机端不要预载 242 张卡图：首屏刷新时大量解码会造成明显卡顿。
    // 卡图改为进入手牌/战场时按需加载，桌面端保留预载。
    const urls = new Set();
    if (!isPhoneLayout()) {
      for (const id of Object.keys(D.CARDS)) {
        const d = D.CARDS[id];
        if (d.art) urls.add(portraitImage(d.art));
      }
      for (const id of Object.keys(D.HEROES)) urls.add(heroImage(id));
    }
    urls.add("assets/backgrounds/menu.webp");
    urls.add("assets/backgrounds/battle.webp");
    urls.forEach((u) => { const img = new Image(); img.src = u; });
  }

  function startHostKeepAlive() {
    if (!isHostPage() || app.hostKeepAliveTimer) return;
    const ping = () => {
      fetch("/api/hello?player=0", { method: "POST" }).catch(() => {});
    };
    ping();
    app.hostKeepAliveTimer = setInterval(ping, 20000);
  }

  window.addEventListener("beforeunload", (ev) => {
    if (app.screen !== "deck") return;
    ev.preventDefault();
    ev.returnValue = "再按一次退出编成；直接关闭会丢失未保存的改动。";
    return ev.returnValue;
  });

  function showReconnectOverlay(text) {
    const overlay = $("reconnect-overlay");
    if (!overlay) return;
    const label = $("reconnect-text");
    if (label) label.textContent = text || "正在恢复房间与手牌，请稍候。";
    overlay.hidden = false;
    if (app.reconnectOverlayTimer) clearTimeout(app.reconnectOverlayTimer);
    app.reconnectOverlayTimer = setTimeout(() => { hideReconnectOverlay(); }, 12000);
  }

  function hideReconnectOverlay() {
    const overlay = $("reconnect-overlay");
    if (overlay) overlay.hidden = true;
    if (app.reconnectOverlayTimer) { clearTimeout(app.reconnectOverlayTimer); app.reconnectOverlayTimer = null; }
  }

  function autoReconnectOnLoad() {
    if (!lanServerAvailable()) return;
    if (isHostPage()) {
      const saved = loadHostSession();
      if (saved) {
        let active0 = false; try { active0 = sessionStorage.getItem("gok_host_active") === "1"; } catch (e) {}
        if (active0) showReconnectOverlay("正在恢复房主对局与牌桌…");
        showScreen("lan");
        initLanScreen();
        let active = false;
        try { active = sessionStorage.getItem("gok_host_active") === "1"; } catch (e) {}
        if (active) setTimeout(() => resumeHostGame(), 450);
      }
      return;
    }
    let guestSession = false;
    try { guestSession = sessionStorage.getItem("gok_lan_guest") === "1"; } catch (e) {}
    if (!guestSession) return;
    showReconnectOverlay("正在恢复你的手牌与在线对局…");
    setTimeout(() => {
      if (app.screen !== "home" && app.screen !== "lan") return;
      if (app.net) return;
      showScreen("lan");
      initLanScreen();
      joinLanRoom();
    }, 450);
  }

  function channelBuild() {
    return (window.GOK_BUILD || "dev").replace(/^v/, "");
  }

  function showChannelNotice(data) {
    if (app.modalOpen) return;
    const preview = window.GOK_CHANNEL === "preview";
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", preview ? "EXPERIMENTAL / 实验版" : "STABLE / 稳定版"));
      content.appendChild(el("h3", null, preview ? "实验构建" : "稳定版更新"));
      content.appendChild(el("p", null, preview ? "本地/局域网预览是实验构建：卡牌仍在重做，可能出现数值、脚本或交互问题，不是稳定版。" : "以下内容已经进入稳定版。"));
      const notes = (data && data.notes) || [];
      if (notes.length) {
        const list = el("ul", "channel-notice-list");
        for (const n of notes) list.appendChild(el("li", null, n));
        content.appendChild(list);
      }
      const issues = (data && data.knownIssues) || [];
      if (issues.length) {
        const known = el("div", "channel-notice-known");
        known.appendChild(el("strong", null, "已知问题"));
        for (const n of issues) known.appendChild(el("div", null, "· " + n));
        content.appendChild(known);
      }
      const actions = el("div", "modal-actions");
      const ok = el("button", "btn btn-primary", preview ? "进入实验版" : "继续");
      ok.onclick = () => closeModal(true);
      actions.appendChild(ok);
      content.appendChild(actions);
    });
  }

  function tryChannelNotice(data, attempt) {
    if (app.modalOpen) {
      if ((attempt || 0) < 8) setTimeout(() => tryChannelNotice(data, (attempt || 0) + 1), 900);
      return;
    }
    showChannelNotice(data);
  }

  function initChannelUI() {
    const preview = window.GOK_CHANNEL === "preview";
    const badge = $("channel-badge");
    if (badge) {
      badge.hidden = false;
      badge.textContent = preview ? "实验版 EXPERIMENTAL" : "稳定版 STABLE";
      badge.classList.toggle("preview", preview);
      badge.title = preview ? window.GOK_BUILD + " · 实验构建，不是稳定版" : window.GOK_BUILD + " · 稳定通道";
      badge.onclick = () => {
        if (app.modalOpen) return;
        fetch("announcements.json", { cache: "no-store" })
          .then((r) => r.json())
          .then((all) => showChannelNotice(all[window.GOK_CHANNEL] || {}))
          .catch(() => showChannelNotice({}));
      };
    }
    fetch("announcements.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((all) => {
        const data = all[window.GOK_CHANNEL] || {};
        const version = data.version || channelBuild();
        const key = "gok_channel_seen_" + window.GOK_CHANNEL + "_" + version;
        let seen = false;
        try { seen = localStorage.getItem(key) === "1"; } catch (e) {}
        if (!seen) {
          try { localStorage.setItem(key, "1"); } catch (e) {}
          if (preview) setTimeout(() => tryChannelNotice(data, 0), 900);
        }
      })
      .catch(() => {
        if (preview) setTimeout(() => tryChannelNotice({}, 0), 900);
      });
  }

  /* ===== init ===== */
  function updateOnlineRoomBar() {
    const bar = $("lan-online-bar");
    if (!bar) return;
    bar.hidden = !app.roomCode;
    const lanScreen = $("screen-lan");
    if (lanScreen) lanScreen.classList.toggle("online-room", !!app.roomCode);
    const heading = lanScreen && lanScreen.querySelector(".page-head h2");
    if (heading) heading.textContent = app.roomCode ? "组队码房间" : "局域网对战";
    const eyebrow = lanScreen && lanScreen.querySelector(".page-head .eyebrow");
    if (eyebrow) eyebrow.textContent = app.roomCode ? "ONLINE / GROUP CODE ROOM" : "LAN / DIRECT DUEL";
    if (!app.roomCode) return;
    const link = location.origin + "/?room=" + encodeURIComponent(app.roomCode);
    bar.dataset.link = link;
    const code = $("lan-online-code");
    if (code) code.textContent = app.roomCode;
    const copy = $("btn-copy-online-link");
    if (copy) copy.onclick = () => {
      const text = bar.dataset.link || link;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast("邀请链接已复制。")).catch(() => toast(text));
      else toast(text);
    };
  }

  function rankSummary() {
    const p = (app.profile && app.profile.profile) || app.profile || {};
    const pts = p.rankPoints || 0;
    const info = rankInfo(pts);
    return { points: pts, tier: info.tier || rankText(pts), next: info.next, wins: p.rankWins || 0, losses: p.rankLosses || 0 };
  }

  function openMatchPage() {
    showScreen("match");
    renderMatchPage();
  }

  function renderMatchPage() {
    const root = $("match-page-root");
    if (!root) return;
    clear(root);
    const loggedIn = !!(app.auth && app.auth.user);
    let ranked = loggedIn ? app.matchPageRanked !== false : false;
    let selectedFaction = (app.matchPageFaction && D.FACTIONS[app.matchPageFaction]) ? app.matchPageFaction : (app.faction && D.FACTIONS[app.faction] ? app.faction : "pus");
    let selectedDeck = app.matchPageDeck === "custom" && lanHasCustom(selectedFaction) ? "custom" : (lanHasCustom(selectedFaction) && app.matchDeckMode === "custom" ? "custom" : "preset");
    const rank = rankSummary();
    const grid = el("div", "match-page-grid");
    const setup = el("div", "panel mode-panel");
    setup.appendChild(el("div", "eyebrow", "在线匹配 / ONLINE MATCH"));
    setup.appendChild(el("h3", null, "选择匹配方式"));
    setup.appendChild(el("p", null, "休闲不计段位；排位会影响段位分。选择阵营和牌组后开始匹配。"));
    const modeTabs = el("div", "match-mode-tabs");
    const casual = el("button", "match-mode-tab", "休闲");
    const rankedTab = el("button", "match-mode-tab", "排位");
    casual.type = rankedTab.type = "button";
    casual.onclick = () => { app.matchPageRanked = false; ranked = false; renderMatchPage(); };
    rankedTab.onclick = () => { if (!loggedIn) { toast("排位需要先登录账号。"); openLoginPage("login"); return; } app.matchPageRanked = true; ranked = true; renderMatchPage(); };
    rankedTab.classList.toggle("locked", !loggedIn);
    rankedTab.title = loggedIn ? "" : "登录后解锁排位";
    modeTabs.appendChild(casual); modeTabs.appendChild(rankedTab);
    setup.appendChild(modeTabs);
    setup.appendChild(el("div", "match-setup-label", "选择阵营 / 领袖"));
    const factionGrid = el("div", "match-faction-grid");
    for (const id of D.FACTION_IDS) {
      const fact = D.FACTIONS[id];
      const hero = D.HEROES[fact.hero];
      const card = el("button", "match-faction-card" + (id === selectedFaction ? " active" : ""));
      card.type = "button";
      card.dataset.faction = id;
      const emblem = el("img", "match-faction-emblem"); emblem.src = fact.emblem; emblem.alt = "";
      const copy = el("span", "match-faction-copy");
      copy.appendChild(el("strong", null, fact.name));
      copy.appendChild(el("small", null, hero ? "领袖 · " + hero.name : "领袖"));
      card.appendChild(emblem); card.appendChild(copy);
      card.onclick = () => {
        selectedFaction = id;
        app.faction = id;
        app.matchPageFaction = id;
        if (selectedDeck === "custom" && !lanHasCustom(id)) selectedDeck = "preset";
        app.matchPageDeck = selectedDeck;
        renderMatchPage();
      };
      factionGrid.appendChild(card);
    }
    const selectedHero = D.HEROES[D.FACTIONS[selectedFaction].hero];
    const heroPreview = el("div", "match-hero-preview");
    const heroArt = el("div", "match-hero-preview-art");
    if (selectedHero) heroArt.style.backgroundImage = "url('" + heroImage(selectedHero.id) + "')";
    const heroCopy = el("div", "match-hero-preview-copy");
    heroCopy.appendChild(el("div", "eyebrow", "领袖 / LEADER"));
    heroCopy.appendChild(el("h4", null, selectedHero ? selectedHero.name : factionName(selectedFaction)));
    heroCopy.appendChild(el("p", "match-hero-hp", selectedHero ? "生命 " + selectedHero.hp + " · " + factionName(selectedFaction) : factionName(selectedFaction)));
    if (selectedHero && selectedHero.power) heroCopy.appendChild(el("p", "match-hero-skill", (selectedHero.power.passive ? "被动" : "主动 " + (selectedHero.power.cost || 0) + " 费") + " · " + selectedHero.power.name + "：" + selectedHero.power.text));
    if (selectedHero && selectedHero.passive) heroCopy.appendChild(el("p", "match-hero-skill", "被动 · " + selectedHero.passive.name + "：" + selectedHero.passive.text));
    heroPreview.appendChild(heroArt); heroPreview.appendChild(heroCopy);
    setup.appendChild(heroPreview);
    setup.appendChild(factionGrid);
    const deckRow = el("div", "match-deck-row");
    const deckCopy = el("div", "match-deck-copy");
    deckCopy.appendChild(el("strong", null, "牌组"));
    deckCopy.appendChild(el("small", null, "30 张卡（装备/阵型自由混编）"));
    const deckSelect = document.createElement("select");
    deckSelect.className = "match-deck-select";
    const lib = deckLibraryFor(selectedFaction);
    deckSelect.innerHTML = '<option value="preset">官方预组 · 30 张</option>';
    for (const d of lib) { const o = document.createElement("option"); o.value = d.id; o.textContent = d.name + " · " + d.cards.length + " 张"; deckSelect.appendChild(o); }
    const activeId = activeDeckFor(selectedFaction) ? activeDeckFor(selectedFaction).id : "preset";
    deckSelect.value = selectedDeck === "custom" ? activeId : "preset";
    deckSelect.onchange = () => {
      if (deckSelect.value === "preset") { selectedDeck = "preset"; app.matchPageDeck = "preset"; }
      else { const d = lib.find(x => x.id === deckSelect.value); if (d) { app.activeDeckId[selectedFaction] = d.id; app.customDecks[selectedFaction] = d.cards.slice(); selectedDeck = "custom"; app.matchPageDeck = "custom"; persistDeckLibrary(); } }
      renderMatchPage();
    };
    deckRow.appendChild(deckCopy); deckRow.appendChild(deckSelect); setup.appendChild(deckRow);
    const selectedDeckList = getSelectedPlayDeck(selectedFaction, selectedDeck);
    const deckPreview = el("div", "match-deck-preview");
    deckPreview.appendChild(el("span", "panel-label", selectedDeck === "custom" ? "自定义牌组" : "预设牌组"));
    deckPreview.appendChild(el("strong", null, (selectedDeckList || []).length + " 张 · 传说 " + (selectedDeckList || []).filter(id => D.CARDS[id] && D.CARDS[id].rarity === "legendary").length));
    const names = (selectedDeckList || []).slice(0, 8).map(id => D.CARDS[id] && D.CARDS[id].name).filter(Boolean).join(" / ");
    deckPreview.appendChild(el("small", null, names + ((selectedDeckList || []).length > 8 ? " …" : "")));
    setup.appendChild(deckPreview);

    const start = el("button", "btn btn-primary btn-wide", ranked ? "开始排位匹配" : "开始休闲匹配");
    start.onclick = () => { if (ranked && !loggedIn) { toast("排位需要先登录账号。"); openLoginPage("login"); return; } app.faction = selectedFaction; app.matchPageFaction = selectedFaction; app.matchDeckMode = selectedDeck; app.matchPageDeck = selectedDeck; beginMatchPage(selectedFaction, selectedDeck, ranked); };
    const actions = el("div", "match-page-actions"); actions.appendChild(start); setup.appendChild(actions);
    grid.appendChild(setup);
    const side = el("div", "match-rank-mini");
    side.style.display = (ranked || !loggedIn) ? "" : "none";
    side.appendChild(el("div", "panel-label", "RANK / 段位"));
    const emblem = el("div", "rank-emblem", (rank.tier || "青").slice(0, 1));
    side.appendChild(emblem);
    side.appendChild(el("h3", null, rank.tier || "青铜"));
    side.appendChild(el("p", "rank-points", String(rank.points) + " 分 · " + rank.wins + " 胜 " + rank.losses + " 负"));
    if (!loggedIn) {
      side.appendChild(el("p", "muted", "游客可以打休闲；登录后解锁排位。"));
      const login = el("button", "btn btn-small btn-primary", "登录解锁排位");
      login.onclick = () => openLoginPage("login");
      side.appendChild(login);
    } else {
      const progress = el("div", "rank-progress");
      const info = rankInfo(rank.points || 0); const fill = el("i"); fill.style.width = (info.progress || 0) + "%"; progress.appendChild(fill); side.appendChild(progress);
      side.appendChild(el("p", "muted", "最近排位"));
      const hist = ((app.profile && app.profile.history) || []).filter(h => h.ranked).slice(0, 3);
      if (!hist.length) side.appendChild(el("p", "muted", "还没有排位记录。"));
      for (const h of hist) {
        const row = el("div", "rank-history-row");
        row.appendChild(el("span", null, h.result === "win" ? "胜" : h.result === "loss" ? "负" : "平"));
        row.appendChild(el("span", null, factionName(h.faction) + " vs " + factionName(h.opponent)));
        row.appendChild(el("small", null, (h.round || 0) + " 回合"));
        side.appendChild(row);
      }
      const all = el("button", "btn btn-small btn-ghost", "全部战绩");
      all.onclick = () => { showScreen("achievements"); renderAchievements(); };
      side.appendChild(all);
    }
    grid.appendChild(side);
    root.appendChild(grid);
    if (ranked) rankedTab.classList.add("active"); else casual.classList.add("active");
  }

  function aiDifficultyForRank(points) {
    const p = Number(points) || 0;
    if (p >= 1200) return "nightmare";
    if (p >= 600) return "hard";
    return "normal";
  }

  function beginMatchPage(faction, deckMode, ranked) {
    if (!allowMultiplayerDeck(faction, deckMode)) return;
    app.lastUsedDeckId = deckMode === "custom" ? (activeDeckFor(faction) ? activeDeckFor(faction).id : null) : null;
    const root = $("match-page-root");
    if (!root) return;
    clear(root);
    const box = el("div", "match-ready-animation");
    box.innerHTML = '<div class="match-ring"></div><div class="match-ring"></div><strong>正在寻找合适的对手…</strong><p class="match-page-status">匹配中，请稍候</p>';
    const status = box.querySelector(".match-page-status");
    const cancel = el("button", "btn btn-small btn-ghost", "取消匹配");
    box.appendChild(cancel);
    root.appendChild(box);
    const startedAt = Date.now();
    const WAIT_MS = 20000;
    let ticket = "", finished = false, pollTimer = null, tickTimer = null;
    const rankPoints = (app.profile && app.profile.rankPoints) || 0;
    const hint = "阵营 " + factionName(faction) + " · " + (ranked ? "排位" : "休闲") + " · " + (deckMode === "custom" ? "自定义牌组" : "预设牌组") + " · 当前 " + rankText(rankPoints);
    status.textContent = hint;
    cancel.onclick = () => {
      finished = true; clearTimeout(pollTimer); clearInterval(tickTimer);
      if (ticket) fetch("/api/match/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticket }) }).catch(() => {});
      renderMatchPage();
    };
    function cancelTicket() { if (ticket) fetch("/api/match/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticket }) }).catch(() => {}); }
    function stop() { clearTimeout(pollTimer); clearInterval(tickTimer); }
    function found(data) {
      if (finished) return; finished = true; stop();
      box.querySelector("strong").textContent = "已找到对手，正在进入对局…";
      status.textContent = "房间 " + String(data.room || "").toUpperCase() + " · 正在跳转";
      AudioBox.play("ui_open");
      const params = new URLSearchParams();
      params.set("room", data.room);
      if (data.role === "host") params.set("host", "1");
      params.set("match", "1");
      params.set("ranked", ranked ? "1" : "0");
      params.set("faction", faction);
      params.set("deck", deckMode);
      setTimeout(() => { location.href = "/?" + params.toString(); }, 700);
    }
    function fallbackAi() {
      if (finished) return; finished = true; stop(); cancelTicket();
      const difficulty = aiDifficultyForRank(rankPoints);
      box.querySelector("strong").textContent = "已找到旗鼓相当的对手";
      status.textContent = "正在铺开牌桌…";
      setTimeout(() => {
        closeModal(true);
        startGame({
          faction: faction,
          opponent: D.nextFaction(faction),
          opponentName: "旗鼓相当的对手",
          p1Deck: getSelectedPlayDeck(faction, deckMode),
          aiDifficulty: difficulty,
          ranked: !!ranked,
          aiSubstitute: true,
          matchmaking: true,
          skipIntro: true
        });
      }, 600);
    }
    function abortIfLeft() {
      if (finished) return true;
      if (app.screen !== "match") { finished = true; stop(); cancelTicket(); return true; }
      return false;
    }
    function poll() {
      if (abortIfLeft()) return;
      if (Date.now() - startedAt >= WAIT_MS) { fallbackAi(); return; }
      fetch("/api/match/status?ticket=" + encodeURIComponent(ticket), { cache: "no-store" }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (finished) return;
        if (data.matched) { found(data); return; }
        if (data.waiting) pollTimer = setTimeout(poll, 600);
        else if (data.expired) fallbackAi();
        else pollTimer = setTimeout(poll, 800);
      }).catch(() => { if (!finished) pollTimer = setTimeout(poll, 900); });
    }
    fetch("/api/match/join", { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ranked: !!ranked, rank: rankPoints, name: accountDisplayName() }) }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "匹配服务不可用");
      if (data.matched) { found(data); return; }
      ticket = data.ticket || "";
      poll();
    }).catch((e) => {
      if (finished) return;
      box.querySelector("strong").textContent = "匹配服务连接失败";
      status.textContent = "正在协调匹配服务…";
      setTimeout(() => { if (!finished) fallbackAi(); }, 1500);
    }).finally(() => {
      tickTimer = setInterval(() => {
        if (abortIfLeft()) return;
        const sec = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
        if (Date.now() - startedAt >= WAIT_MS) fallbackAi();
        else status.textContent = hint + " · " + String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
      }, 350);
    });
  }

  function openMatchmaking() {
    let selectedFaction = app.faction && D.FACTIONS[app.faction] ? app.faction : "pus";
    let selectedDeck = lanHasCustom(selectedFaction) ? "custom" : "preset";
    openModal((content) => {
      content.classList.add("match-setup-modal");
      content.appendChild(el("div", "eyebrow", "ONLINE MATCH / RANKED"));
      content.appendChild(el("h3", null, "在线匹配"));
      content.appendChild(el("p", null, "先选择领袖与牌组，匹配成功后直接进入排位对局。"));
      content.appendChild(el("div", "match-setup-label", "选择领袖 / 阵营"));
      const factionGrid = el("div", "match-faction-grid");
      for (const id of D.FACTION_IDS) {
        const fact = D.FACTIONS[id];
        const hero = D.HEROES[fact.hero];
        const card = el("button", "match-faction-card");
        card.type = "button";
        card.dataset.faction = id;
        const emblem = el("img", "match-faction-emblem");
        emblem.src = fact.emblem;
        emblem.alt = "";
        const copy = el("span", "match-faction-copy");
        copy.appendChild(el("strong", null, fact.name));
        copy.appendChild(el("small", null, hero ? "领袖 · " + hero.name : "领袖"));
        card.appendChild(emblem);
        card.appendChild(copy);
        card.onclick = () => {
          selectedFaction = id;
          if (selectedDeck === "custom" && !lanHasCustom(id)) selectedDeck = "preset";
          renderSetup();
        };
        factionGrid.appendChild(card);
      }
      content.appendChild(factionGrid);
      const deckRow = el("div", "match-deck-row");
      const deckCopy = el("div", "match-deck-copy");
      deckCopy.appendChild(el("strong", null, "牌组"));
      deckCopy.appendChild(el("small", null, "30 张卡（装备/阵型自由混编）"));
      const deckSelect = document.createElement("select");
      deckSelect.className = "match-deck-select";
      const presetOpt = document.createElement("option");
      presetOpt.value = "preset";
      presetOpt.textContent = "预设牌组 · 30 张";
      const customOpt = document.createElement("option");
      customOpt.value = "custom";
      deckSelect.appendChild(presetOpt);
      deckSelect.appendChild(customOpt);
      deckRow.appendChild(deckCopy);
      deckRow.appendChild(deckSelect);
      content.appendChild(deckRow);
      const summary = el("div", "match-setup-summary");
      content.appendChild(summary);
      const actions = el("div", "modal-actions");
      const cancel = el("button", "btn btn-small btn-ghost", "取消");
      cancel.onclick = () => closeModal(true);
      const start = el("button", "btn btn-primary", "开始匹配");
      start.onclick = () => {
        if (selectedDeck === "custom" && !lanHasCustom(selectedFaction)) selectedDeck = "preset";
        app.faction = selectedFaction;
        app.matchDeckMode = selectedDeck;
        closeModal(true);
        beginMatchmaking(selectedFaction, selectedDeck);
      };
      actions.appendChild(cancel);
      actions.appendChild(start);
      content.appendChild(actions);
      deckSelect.onchange = () => { selectedDeck = deckSelect.value === "custom" && lanHasCustom(selectedFaction) ? "custom" : "preset"; renderSetup(); };
      function renderSetup() {
        const hasCustom = lanHasCustom(selectedFaction);
        const hero = D.HEROES[D.FACTIONS[selectedFaction].hero];
        document.querySelectorAll(".match-faction-card").forEach((b) => b.classList.toggle("active", b.dataset.faction === selectedFaction));
        customOpt.disabled = !hasCustom;
        customOpt.textContent = hasCustom ? "自定义牌组 · 30 张" : "自定义牌组（尚未构筑）";
        if (selectedDeck === "custom" && !hasCustom) selectedDeck = "preset";
        deckSelect.value = selectedDeck;
        summary.textContent = "领袖：" + (hero ? hero.name : factionName(selectedFaction)) + " · " + factionName(selectedFaction) + " · " + (selectedDeck === "custom" && hasCustom ? "自定义牌组" : "预设牌组");
      }
      renderSetup();
    });
  }
  function beginMatchmaking(faction, deckMode) {
    if (!allowMultiplayerDeck(faction, deckMode)) return;
    app.lastUsedDeckId = deckMode === "custom" ? (activeDeckFor(faction) ? activeDeckFor(faction).id : null) : null;
    const WAIT_MS = 20000;
    const rankPoints = (app.profile && app.profile.rankPoints) || 0;
    let ticket = "";
    let finished = false;
    let pollTimer = null;
    let tickTimer = null;
    const startedAt = Date.now();
    const status = el("div", "matchmaking-status", "正在寻找旗鼓相当的对手…");
    const timer = el("div", "matchmaking-timer", "匹配时间 00:00");
    window.addEventListener("beforeunload", () => {
      if (finished || !ticket) return;
      try {
        navigator.sendBeacon("/api/match/cancel", new Blob([JSON.stringify({ ticket })], { type: "application/json" }));
      } catch (e) {}
    }, { once: true });
    const hint = el("p", "matchmaking-hint", "阵营：" + factionName(faction) + " · " + (deckMode === "custom" ? "自定义牌组" : "预设牌组") + " · 当前 " + rankText(rankPoints) + " · 正在按段位寻找对手。");
    showScreen("matchmaking");
    const pageRoot = $("matchmaking-page-root");
    if (pageRoot) {
      clear(pageRoot);
      pageRoot.appendChild(el("div", "eyebrow", "ONLINE MATCH / RANKED"));
      pageRoot.appendChild(el("h3", null, "正在寻找对手"));
      pageRoot.appendChild(status);
      pageRoot.appendChild(timer);
      pageRoot.appendChild(hint);
      const actions = el("div", "profile-actions");
      const cancel = el("button", "btn btn-small btn-ghost", "取消匹配");
      cancel.onclick = () => {
        if (finished) return;
        finished = true;
        clearTimeout(pollTimer);
        clearInterval(tickTimer);
        if (ticket) fetch("/api/match/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticket }) }).catch(() => {});
        showScreen("match"); renderMatchPage();
      };
      actions.appendChild(cancel);
      pageRoot.appendChild(actions);
      setTimeout(() => {
        if (finished) return;
        if (!lanServerAvailable()) {
          status.textContent = "匹配服务暂不可用";
          hint.textContent = "正在协调对手…";
          setTimeout(() => { if (!finished) fallbackAi(); }, 1200);
          return;
        }
        fetch("/api/match/join", { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ranked: true, rank: rankPoints, name: accountDisplayName() }) }).then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.ok) throw new Error(data.error || "匹配服务不可用");
          if (finished) return;
          if (data.matched) { found(data); return; }
          ticket = data.ticket || "";
          poll();
        }).catch((e) => {
          if (finished) return;
          status.textContent = "匹配服务连接失败";
          hint.textContent = "正在协调对手…";
          setTimeout(() => { if (!finished) fallbackAi(); }, 1200);
        });
      }, 120);
    }
    tickTimer = setInterval(() => {
      if (finished) return;
      if (app.screen !== "matchmaking") {
        finished = true;
        clearTimeout(pollTimer);
        clearInterval(tickTimer);
        if (ticket) fetch("/api/match/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticket }) }).catch(() => {});
        return;
      }
      const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
      const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
      const ss = String(elapsed % 60).padStart(2, "0");
      timer.textContent = "匹配时间 " + mm + ":" + ss;
      if (Date.now() - startedAt >= WAIT_MS) fallbackAi();
    }, 220);
    function stopTimers() {
      clearTimeout(pollTimer);
      clearInterval(tickTimer);
    }
    function cancelTicket() {
      if (!ticket) return;
      fetch("/api/match/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticket }) }).catch(() => {});
    }
    function found(data) {
      if (finished) return;
      finished = true;
      stopTimers();
      status.textContent = "已找到旗鼓相当的对手";
      timer.textContent = "匹配成功";
      AudioBox.play("ui_open");
      const params = new URLSearchParams();
      params.set("room", data.room);
      if (data.role === "host") params.set("host", "1");
      params.set("match", "1");
      params.set("ranked", "1");
      params.set("faction", faction);
      params.set("deck", deckMode);
      setTimeout(() => { location.href = "/?" + params.toString(); }, 500);
    }
    function fallbackAi() {
      if (finished) return;
      finished = true;
      stopTimers();
      cancelTicket();
      status.textContent = "已找到旗鼓相当的对手";
      timer.textContent = "匹配成功";
      AudioBox.play("ui_open");
      setTimeout(() => {
        if (app.screen !== "matchmaking") return;
        const difficulty = aiDifficultyForRank(rankPoints);
        const opponent = D.nextFaction(faction);
        startGame({
          faction: faction,
          opponent: opponent,
          opponentName: "旗鼓相当的对手",
          p1Deck: getSelectedPlayDeck(faction, deckMode),
          aiDifficulty: difficulty,
          ranked: true,
          aiSubstitute: true,
          matchmaking: true,
          skipIntro: true
        });
      }, 500);
    }
    function poll() {
      if (finished) return;
      const left = WAIT_MS - (Date.now() - startedAt);
      if (left <= 0) { fallbackAi(); return; }
      fetch("/api/match/status?ticket=" + encodeURIComponent(ticket), { cache: "no-store" }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (finished) return;
        if (data.matched) { found(data); return; }
        if (data.waiting) pollTimer = setTimeout(poll, 480);
        else if (data.expired) fallbackAi();
        else pollTimer = setTimeout(poll, 650);
      }).catch(() => { if (!finished) pollTimer = setTimeout(poll, 800); });
    }
  }
  function openRoomPage() {
    showScreen("room");
    renderRoomPage();
  }

  function renderRoomPage() {
    const root = $("room-page-root");
    if (!root) return;
    clear(root);
    const card = el("div", "panel room-lobby-card");
    card.appendChild(el("div", "eyebrow", "组队码 / 在线房间"));
    card.appendChild(el("h3", null, "创建或加入组队码"));
    card.appendChild(el("p", null, "创建新房间会把 6 位组队码放进邀请链接；也可以输入房主发来的组队码加入。"));
    const entry = el("div", "room-code-entry");
    const input = document.createElement("input");
    input.id = "room-code-input";
    input.placeholder = "输入 6 位组队码";
    input.maxLength = 6;
    input.autocomplete = "off";
    input.inputMode = "text";
    entry.appendChild(input);
    card.appendChild(entry);
    const actions = el("div", "room-lobby-actions");
    const create = el("button", "btn btn-primary", "创建组队码");
    create.onclick = async () => {
      create.disabled = true; create.textContent = "创建中…";
      try {
        const res = await fetch("/api/room/create", { method: "POST", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.code) throw new Error(data.error || "创建失败");
        const url = new URL(location.href);
        url.searchParams.set("room", data.code);
        url.searchParams.set("host", "1");
        location.href = url.toString();
      } catch (e) {
        create.disabled = false; create.textContent = "创建组队码";
        toast("创建房间失败：" + (e.message || e));
      }
    };
    const join = el("button", "btn btn-ghost", "加入房间");
    join.onclick = async () => {
      const code = input.value.trim().toLowerCase();
      if (!/^[a-z0-9]{6}$/.test(code)) { toast("请输入 6 位组队码。"); return; }
      join.disabled = true; join.textContent = "加入中…";
      try {
        const res = await fetch("/api/status?room=" + encodeURIComponent(code), { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "房间不存在");
        const url = new URL(location.href);
        url.searchParams.set("room", code);
        url.searchParams.delete("host");
        location.href = url.toString();
      } catch (e) {
        join.disabled = false; join.textContent = "加入房间";
        toast("无法加入：" + (e.message || e));
      }
    };
    const back = el("button", "btn btn-small btn-ghost", "取消");
    back.onclick = () => { showScreen("mode"); showModeMulti(true); };
    actions.appendChild(create); actions.appendChild(join); actions.appendChild(back);
    card.appendChild(actions);
    card.appendChild(el("p", "room-page-hint", "进入对局后，顶栏会继续显示组队码；对方断线后可凭组队码重新进入。"));
    root.appendChild(card);
  }

  function openOnlineLobby() {
    openModal((content) => {
      content.appendChild(el("div", "eyebrow", "GROUP CODE / ONLINE ROOM"));
      content.appendChild(el("h3", null, "创建或加入组队码"));
      content.appendChild(el("p", null, "创建新房间会把 6 位组队码放进邀请链接；也可以输入房主发来的组队码加入。"));
      const close = el("button", "btn btn-small btn-ghost online-close", "关闭");
      close.onclick = () => closeModal(true);
      content.insertBefore(close, content.firstChild);
      const input = el("input", "online-code-input");
      input.placeholder = "输入 6 位组队码";
      input.maxLength = 6;
      input.autocomplete = "off";
      content.appendChild(input);
      const actions = el("div", "modal-actions online-actions");
      const create = el("button", "btn btn-primary", "创建组队码");
      create.onclick = async () => {
        create.disabled = true;
        try {
          const res = await fetch("/api/room/create", { method: "POST", cache: "no-store" });
          const data = await res.json();
          if (!res.ok || !data.code) throw new Error(data.error || "创建失败");
          const url = new URL(location.href);
          url.searchParams.set("room", data.code);
          url.searchParams.set("host", "1");
          location.href = url.toString();
        } catch (e) {
          create.disabled = false;
          toast("创建房间失败：" + (e.message || e));
        }
      };
      const join = el("button", "btn btn-ghost", "加入房间");
      join.onclick = async () => {
        const code = input.value.trim().toLowerCase();
        if (!/^[a-z0-9]{6}$/.test(code)) { toast("请输入 6 位组队码。"); return; }
        join.disabled = true;
        try {
          const res = await fetch("/api/status?room=" + encodeURIComponent(code), { cache: "no-store" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "房间不存在");
          const url = new URL(location.href);
          url.searchParams.set("room", code);
          url.searchParams.delete("host");
          location.href = url.toString();
        } catch (e) {
          join.disabled = false;
          toast("无法加入：" + (e.message || e));
        }
      };
      actions.appendChild(create);
      actions.appendChild(join);
      const cancel = el("button", "btn btn-small btn-ghost", "取消");
      cancel.onclick = () => closeModal(true);
      actions.appendChild(cancel);
      content.appendChild(actions);
    });
  }

  function initOnlineFromQuery() {
    try {
      const params = new URLSearchParams(location.search);
      const code = (params.get("room") || "").toLowerCase();
      if (/^[a-z0-9]{6}$/.test(code)) { app.roomCode = code; app.onlineMode = true; }
      if (params.get("match") === "1") {
        app.matchmaking = true;
        app.lanAutoMatch = true;
        app.lanRanked = params.get("ranked") === "1";
        const f = params.get("faction");
        if (f && D.FACTIONS[f]) {
          app.faction = f;
          app.lanFaction = f;
        }
        app.matchDeckMode = params.get("deck") === "preset" ? "preset" : "custom";
        const useCustom = app.matchDeckMode === "custom" && lanHasCustom(app.lanFaction);
        app.lanHostUseCustom = useCustom;
        app.lanGuestUseCustom = useCustom;
      }
    } catch (e) {}
    if (!app.roomCode) return;
    showScreen("lan");
    initLanScreen();
    updateOnlineRoomBar();
    if (app.lanAutoMatch) {
      if (app.lanHostPage) {
        setTimeout(() => { refreshLanStatus(); maybeAutoStartMatchedRoom(); }, 500);
      } else {
        setTimeout(() => { if (!app.net) joinLanRoom(); }, 650);
      }
    }
  }


  function initDepthVisuals() {
    const screen = document.getElementById("screen-game");
    const field = document.getElementById("battlefield");
    const sceneHost = field || screen;
    if (sceneHost && !sceneHost.querySelector(".scene-ambient")) {
      const layer = el("div", "scene-ambient");
      layer.setAttribute("aria-hidden", "true");
      for (const cls of ["mist", "mist m2", "mist m3"]) layer.appendChild(el("div", cls));
      for (const cls of ["ray", "ray ray2"]) layer.appendChild(el("div", cls));
      for (let i = 0; i < 22; i++) {
        const mote = el("i", "mote");
        const teal = i % 4 === 0;
        mote.style.setProperty("--x", (Math.random() * 100).toFixed(2) + "%");
        mote.style.setProperty("--dx", (Math.random() * 90 - 45).toFixed(1) + "px");
        mote.style.setProperty("--s", (Math.random() * 2.6 + 1.6).toFixed(1) + "px");
        mote.style.setProperty("--dur", (Math.random() * 9 + 12).toFixed(1) + "s");
        mote.style.setProperty("--delay", (-Math.random() * 18).toFixed(1) + "s");
        mote.style.setProperty("--c", teal ? "rgba(125,224,206,.6)" : "rgba(242,198,109,.6)");
        layer.appendChild(mote);
      }
      layer.appendChild(el("div", "scan"));
      sceneHost.insertBefore(layer, sceneHost.firstChild);
    }
    if (field && !field.querySelector(".board-playmat")) field.insertBefore(el("div", "board-playmat"), field.firstChild);
    if (field && !field.querySelector(".board-frame")) field.insertBefore(el("div", "board-frame"), field.firstChild);
    if (field && !field.querySelector(".board-inlay")) {
      const inlay = el("div", "board-inlay");
      inlay.appendChild(el("i", null, ""));
      inlay.appendChild(el("i", null, ""));
      inlay.appendChild(el("i", null, ""));
      field.insertBefore(inlay, field.firstChild);
    }
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let queued = false;
    let last = null;
    const clearTilt = (node) => {
      if (!node) return;
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
      node.style.setProperty("--glare", "0");
    };
    const clearHero = (node) => {
      if (!node) return;
      node.style.setProperty("--hero-rx", "0deg");
      node.style.setProperty("--hero-ry", "0deg");
      node.style.setProperty("--hero-glare", "0");
    };
    document.addEventListener("pointermove", (ev) => {
      last = ev;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (!last || !last.target || !last.target.closest) return;
        if (document.body.classList.contains("reduce-motion") || document.body.classList.contains("simple-fx")) return;
        if (app.draggingUid) return;
        const card = last.target.closest(".hand-card, .board-card, .codex-card");
        const hero = last.target.closest(".hero-panel");
        if (card || hero) {
          const node = card || hero;
          const rect = node.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const nx = Math.max(-1, Math.min(1, (last.clientX - rect.left) / rect.width * 2 - 1));
          const ny = Math.max(-1, Math.min(1, (last.clientY - rect.top) / rect.height * 2 - 1));
          if (card) {
            if (card.classList.contains("disabled")) return;
            card.style.setProperty("--ry", (nx * 7.5).toFixed(2) + "deg");
            card.style.setProperty("--rx", (-ny * 6.5).toFixed(2) + "deg");
            card.style.setProperty("--mx", ((nx + 1) * 50).toFixed(1) + "%");
            card.style.setProperty("--my", ((ny + 1) * 50).toFixed(1) + "%");
            card.style.setProperty("--glare", "0.52");
          } else {
            hero.style.setProperty("--hero-ry", (nx * 4.2).toFixed(2) + "deg");
            hero.style.setProperty("--hero-rx", (-ny * 3.2).toFixed(2) + "deg");
            hero.style.setProperty("--hero-mx", ((nx + 1) * 50).toFixed(1) + "%");
            hero.style.setProperty("--hero-my", ((ny + 1) * 50).toFixed(1) + "%");
            hero.style.setProperty("--hero-glare", "0.35");
          }
        }
        if (document.body.dataset.screen === "game") {
          const nx = last.clientX / window.innerWidth - 0.5;
          const ny = last.clientY / window.innerHeight - 0.5;
          document.body.style.setProperty("--bg-x", (nx * -12).toFixed(2) + "px");
          document.body.style.setProperty("--bg-y", (ny * -8).toFixed(2) + "px");
        }
      });
    }, { passive: true });
    document.addEventListener("pointerout", (ev) => {
      if (!ev.target || !ev.target.closest) return;
      const card = ev.target.closest(".hand-card, .board-card, .codex-card");
      const hero = ev.target.closest(".hero-panel");
      if (card && (!ev.relatedTarget || !card.contains(ev.relatedTarget))) clearTilt(card);
      if (hero && (!ev.relatedTarget || !hero.contains(ev.relatedTarget))) clearHero(hero);
    }, { passive: true });
  }

  function init() {
    AudioBox.init();
    applyVideoPrefs();
    preloadArt();
    loadCustomDecks();
    loadCodexState();
    loadActiveRelics();
    loadAchievements();
    app.profile = loadProfile();
    ensureAccount();
    snapshotSave("startup");
    applyFactionChipColors();
    updateHomeProfile();
    updateHomeAccount();
    updateHomeTaskWidget();
    restoreAuthSession().then(() => setTimeout(maybeShowAuthGate, 1500));
    setTimeout(maybePromptArchiveName, 1200);
    setTimeout(startOnboardingIfNeeded, 1400);
    updateHomeLegendary();
    const openArcadeFromHome = () => {
      if (!global.GokContent) return;
      let content = {};
      try { content = JSON.parse(localStorage.getItem("gok_content_v1") || "{}") || {}; } catch (e) {}
      const expedition = content.expedition;
      const arena = content.arena;
      const hasRun = (expedition && !expedition.finished && expedition.nodes && expedition.node < expedition.nodes.length) || (arena && arena.active);
      if (hasRun && global.GokContent.resume) global.GokContent.resume();
      else global.GokContent.open();
    };
    if ($("home-classic")) $("home-classic").onclick = () => { AudioBox.play("ui_open"); showModeSelect(); };
    if ($("home-other")) $("home-other").onclick = () => { if (!levelUnlocked("other")) { showLockedFeature("other", "其他模式"); return; } AudioBox.play("ui_open"); showScreen("other"); };

    if ($("btn-other-back")) $("btn-other-back").onclick = () => { AudioBox.play("cancel"); showScreen("home"); };
    if ($("btn-mode-home")) $("btn-mode-home").onclick = () => { AudioBox.play("cancel"); showScreen("home"); };
    if ($("mode-guide-toggle")) $("mode-guide-toggle").onclick = () => { const body = $("mode-guide-body"); const state = $("mode-guide-state"); if (!body) return; const open = body.hidden; body.hidden = !open; if (state) state.textContent = open ? "收起 ↑" : "展开 ↓"; AudioBox.play(open ? "ui_open" : "cancel"); };
    document.querySelectorAll("[data-mode-guide]").forEach((b) => { b.onclick = () => { const kind = b.dataset.modeGuide; AudioBox.play("ui_open"); if (kind === "rules") openRulesScreen("mode"); else if (kind === "deck") { openDeckBuilder(app.faction, "mode"); } else if (kind === "tutorial") { app.tutorialReturn = "mode"; showScreen("tutorial"); } else if (kind === "keywords") openKeywordGlossary(); }; });
    if ($("mode-solo")) $("mode-solo").onclick = () => { AudioBox.play("ui_open"); showScreen("setup"); setupState(); };
    if ($("mode-multi")) $("mode-multi").onclick = () => showModeMulti(true);
    if ($("mode-multi-back")) $("mode-multi-back").onclick = () => showModeMulti(false);
    if ($("mode-group")) $("mode-group").onclick = () => { AudioBox.play("ui_open"); openRoomPage(); };
    if ($("mode-lan")) $("mode-lan").onclick = () => showModeLan(true);
    if ($("mode-lan-back")) $("mode-lan-back").onclick = () => showModeLan(false);
    if ($("mode-lan-direct")) $("mode-lan-direct").onclick = () => { AudioBox.play("ui_open"); showScreen("lan"); initLanScreen(); };
    if ($("mode-online")) $("mode-online").onclick = () => { AudioBox.play("ui_open"); openRoomPage(); };
    if ($("btn-match-back")) $("btn-match-back").onclick = () => { showScreen("mode"); showModeMulti(true); };
    if ($("btn-room-back")) $("btn-room-back").onclick = () => { showScreen("mode"); showModeMulti(true); };
    if ($("btn-lab-back")) $("btn-lab-back").onclick = () => {
      if (app.labReturn === "content" && global.GokContent) { showScreen("content"); global.GokContent.renderHub(); }
      else showScreen("home");
    };
    if ($("mode-match")) $("mode-match").onclick = () => { AudioBox.play("ui_open"); openMatchPage(); };
    if ($("btn-mode-multi")) $("btn-mode-multi").onclick = () => setStartSubmenu(true);
    if ($("btn-mode-back")) $("btn-mode-back").onclick = () => setStartSubmenu(false);
    if ($("start-menu-close")) $("start-menu-close").onclick = () => closeStartMenu();
    const startBackdrop = document.querySelector(".start-menu-backdrop");
    if (startBackdrop) startBackdrop.onclick = () => closeStartMenu();
    $("btn-solo").onclick = () => { closeStartMenu(); AudioBox.play("ui_open"); showScreen("setup"); setupState(); };
    $("btn-deck-home").onclick = () => { AudioBox.play("ui_open"); openDeckBuilder(app.faction || "pus", "home"); };
    if ($("btn-content-home")) $("btn-content-home").onclick = () => { AudioBox.play("ui_open"); if (global.GokContent) global.GokContent.open(); };
    if ($("btn-home-profile")) $("btn-home-profile").onclick = () => openProfilePage("personal");
    if ($("btn-profile-back")) $("btn-profile-back").onclick = () => showScreen("home");
    if ($("btn-appearance-back")) $("btn-appearance-back").onclick = () => openProfilePage("personal");
    if ($("btn-login-back")) $("btn-login-back").onclick = () => { if (app.authGate) { toast("请选择登录、注册或游客登录。"); return; } openProfilePage("security"); };
    if ($("btn-tasks-back")) $("btn-tasks-back").onclick = () => showScreen("home");
    if ($("btn-levelup-back")) $("btn-levelup-back").onclick = () => showScreen("tasks");
    if ($("btn-lesson-back")) $("btn-lesson-back").onclick = () => showScreen(app.lessonReturn || "tasks");
    if ($("btn-recovery-back")) $("btn-recovery-back").onclick = () => { app.pendingRecoveryCode = ""; showScreen(app.recoveryReturn || "profile"); };
    if ($("btn-matchmaking-back")) $("btn-matchmaking-back").onclick = () => { showScreen("match"); renderMatchPage(); };
    window.addEventListener("gok-content-changed", () => scheduleSaveBackup());
    const updateOrientationLock = () => {
      const lock = $("orientation-lock");
      if (!lock) return;
      const touchDevice = !!(window.matchMedia && (window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0));
      document.documentElement.classList.toggle("touch-device", touchDevice);
      const landscape = !!(window.matchMedia && window.matchMedia("(orientation: landscape)").matches);
      const shortSide = Math.min(window.screen && window.screen.width || window.innerWidth, window.screen && window.screen.height || window.innerHeight);
      const phoneLandscape = touchDevice && landscape && shortSide <= 950;
      lock.hidden = !phoneLandscape;
      document.body.classList.toggle("orientation-blocked", phoneLandscape);
    };
    window.addEventListener("resize", updateOrientationLock);
    window.addEventListener("orientationchange", () => setTimeout(updateOrientationLock, 120));
    updateOrientationLock();
    document.addEventListener("click", (ev) => {
      const target = ev.target && ev.target.closest ? ev.target.closest("button, [role=button], .home-nav-item, .deck-filter, .deck-faction-tab, .start-choice, .deck-card, .codex-card") : null;
      if (!target || target.disabled) return;
      const before = AudioBox.lastPlayedAt;
      setTimeout(() => { if (AudioBox.lastPlayedAt === before) AudioBox.play("click", { gain: 0.42 }); }, 30);
    });
    window.addEventListener("resize", () => { if (app.screen === "game") requestAnimationFrame(fitHandToWidth); });
    if ($("btn-tutorial")) $("btn-tutorial").onclick = () => { closeStartMenu(); AudioBox.play("ui_open"); showScreen("tutorial"); };
    $("btn-codex").onclick = () => { AudioBox.play("ui_open"); openCodex(); };
    document.querySelectorAll("[data-ai-diff]").forEach((b) => { b.onclick = () => { const diff = b.dataset.aiDiff; if ((diff === "hard" && !levelUnlocked("hard")) || (diff === "nightmare" && !levelUnlocked("nightmare"))) { showLockedFeature(diff, diff === "hard" ? "机密档案" : "绝密档案"); return; } app.aiDifficulty = diff; document.querySelectorAll("[data-ai-diff]").forEach((x) => x.classList.toggle("active", x === b)); }; });
    document.querySelectorAll("[data-first]").forEach((b) => { b.onclick = () => { app.firstChoice = b.dataset.first; document.querySelectorAll("[data-first]").forEach((x) => x.classList.toggle("active", x === b)); AudioBox.play("select"); setupState(); }; });
    if ($("lan-rule-hp")) $("lan-rule-hp").onchange = (e) => { app.roomRules.hp = Number(e.target.value) || 28; };
    if ($("lan-rule-rounds")) $("lan-rule-rounds").onchange = (e) => { app.roomRules.maxRounds = Number(e.target.value) || 0; };
    if ($("lan-rule-first")) $("lan-rule-first").onchange = (e) => { app.roomRules.first = e.target.value; };
    const codexToolbar = document.querySelector(".codex-toolbar");
    if (codexToolbar) {
      const order = [".codex-filter-label:first-of-type", "#codex-faction-tabs", "#codex-hero-panel", ".codex-type-row", "#codex-rarity-row", ".codex-search-row", ".codex-color-legend"];
      const typeLabel = [...codexToolbar.querySelectorAll(".codex-filter-label")].find(x => x.textContent.includes("卡牌类型"));
      const rarityLabel = [...codexToolbar.querySelectorAll(".codex-filter-label")].find(x => x.textContent.includes("品级"));
      const factionLabel = [...codexToolbar.querySelectorAll(".codex-filter-label")].find(x => x.textContent.includes("阵营"));
      for (const node of [factionLabel, document.querySelector("#codex-faction-tabs"), document.querySelector("#codex-hero-panel"), typeLabel, document.querySelector(".codex-type-row"), rarityLabel, document.querySelector("#codex-rarity-row"), document.querySelector(".codex-search-row"), document.querySelector(".codex-color-legend")]) if (node) codexToolbar.appendChild(node);
    }
    if ($("codex-search")) $("codex-search").oninput = (e) => { app.codexSearch = e.target.value; app.codexLimit = 60; renderCodex(); };
    if ($("codex-cost")) $("codex-cost").onchange = (e) => { app.codexCost = e.target.value; app.codexLimit = 60; renderCodex(); };
    if ($("codex-keyword")) $("codex-keyword").onchange = (e) => { app.codexKeyword = e.target.value; app.codexLimit = 60; renderCodex(); };
    if ($("codex-sort")) $("codex-sort").onchange = (e) => { app.codexSort = e.target.value; renderCodex(); };
    if ($("codex-rarity")) $("codex-rarity").onchange = (e) => {
      app.codexRarity = e.target.value === "token" ? "all" : e.target.value;
      app.codexLimit = 60;
      renderCodex();
    };
    if ($("codex-favorites")) $("codex-favorites").onclick = () => { app.codexFavoritesOnly = !app.codexFavoritesOnly; app.codexLimit = 60; renderCodex(); };
    if ($("codex-reset")) $("codex-reset").onclick = resetCodexFilters;
    if ($("codex-random")) $("codex-random").onclick = () => {
      const visible = Array.from(document.querySelectorAll("#codex-grid .codex-card")).map(c => c.dataset.cardId).filter(Boolean);
      const pool = visible.length ? visible : Object.keys(D.CARDS).filter(id => !D.CARDS[id].token && !D.CARDS[id].disabled);
      if (!pool.length) return;
      openCodexCard(D.CARDS[pool[Math.floor(Math.random() * pool.length)]]);
    };
    const fieldDrop = $("battlefield");
    if (fieldDrop) {
      fieldDrop.addEventListener("dragover", (ev) => {
        if (!app.draggingUid) return;
        const def = handDef(app.draggingUid);
        if (!def || (def.type !== "spell" && def.type !== "equipment")) return;
        const opt = E.getPlayOptions(app.game, app.game.current, app.draggingUid);
        if (!opt.ok) return;
        if (ev.target.closest && ev.target.closest(".zone, .board-card")) return;
        ev.preventDefault();
        fieldDrop.classList.add("drop-ready");
      });
      fieldDrop.addEventListener("dragleave", (ev) => { if (!fieldDrop.contains(ev.relatedTarget)) fieldDrop.classList.remove("drop-ready"); });
      fieldDrop.addEventListener("drop", (ev) => {
        fieldDrop.classList.remove("drop-ready");
        if (!app.draggingUid) return;
        if (ev.target.closest && ev.target.closest(".zone, .board-card")) return;
        const uid = app.draggingUid;
        const def = handDef(uid);
        if (!def || (def.type !== "spell" && def.type !== "equipment")) return;
        const opt = E.getPlayOptions(app.game, app.game.current, uid);
        if (!opt.ok) return;
        ev.preventDefault();
        playCardFromDrop(uid);
      });
    }
    document.addEventListener("pointerdown", (e) => { if (!e.target.closest || !e.target.closest(".kw, .keyword-tag, .preview-keyword")) hideKeywordTip(); }, true);
    window.addEventListener("scroll", hideKeywordTip, true);
    document.addEventListener("mouseover", (e) => {
      const label = keywordLabelFromTarget(e.target);
      if (!label) return;
      showKeywordTip(e, label);
    });
    document.addEventListener("mousemove", (e) => {
      if (keywordLabelFromTarget(e.target)) positionKeywordTip(e);
    });
    document.addEventListener("mouseout", (e) => {
      const label = keywordLabelFromTarget(e.target);
      if (!label) return;
      const to = e.relatedTarget;
      if (to && to.closest && to.closest(".kw, .preview-keyword, .keyword-tag") === e.target.closest(".kw, .preview-keyword, .keyword-tag")) return;
      hideKeywordTip();
    });
    document.addEventListener("click", (e) => {
      const label = keywordLabelFromTarget(e.target);
      if (!label) return;
      e.preventDefault();
      e.stopPropagation();
      showKeywordTip(e, label, true);
    }, true);
    $("btn-achievements").onclick = () => { AudioBox.play("ui_open"); openAchievements(); };
    if ($("btn-tasks")) $("btn-tasks").onclick = () => { AudioBox.play("ui_open"); openTasks(); };
    if ($("btn-home-tasks")) $("btn-home-tasks").onclick = () => { AudioBox.play("ui_open"); openTasks(); };
    $("btn-settings").onclick = () => { AudioBox.play("ui_open"); openSettings("home"); };
    $("btn-codex-back").onclick = () => { AudioBox.play("cancel"); showScreen("home"); };
    $("btn-achievements-back").onclick = () => { AudioBox.play("cancel"); showScreen("home"); };
    $("btn-settings-back").onclick = () => {
      AudioBox.play("cancel");
      const back = app.settingsReturn === "game" && app.game ? "game" : "home";
      app.settingsReturn = null;
      showScreen(back);
      if (back === "game") renderGame();
    };
    $("btn-settings-sound").onclick = () => { AudioBox.toggle(); updateSettingsUI(); };
    if ($("btn-settings-bgm")) $("btn-settings-bgm").onclick = () => AudioBox.toggleBgm();
    if ($("btn-settings-sfx")) $("btn-settings-sfx").onclick = () => AudioBox.toggleSfx();
    if ($("btn-settings-bg")) $("btn-settings-bg").onclick = () => toggleBgAnim();
    if ($("btn-settings-bgvideo")) $("btn-settings-bgvideo").onclick = toggleBgVideo;
    if ($("btn-settings-cinema")) $("btn-settings-cinema").onclick = toggleCinema;
    if ($("btn-settings-replay-cg")) $("btn-settings-replay-cg").onclick = replayOpening;
    if ($("btn-settings-lowfx")) $("btn-settings-lowfx").onclick = toggleLowFx;
    if ($("btn-settings-motion")) $("btn-settings-motion").onclick = () => toggleMotion();
    if ($("btn-settings-damage")) $("btn-settings-damage").onclick = () => { app.damageNumbers = !app.damageNumbers; localStorage.setItem("gok_damage_numbers", app.damageNumbers ? "1" : "0"); updateSettingsUI(); };
    if ($("btn-settings-fx")) $("btn-settings-fx").onclick = () => { app.fxOn = !app.fxOn; localStorage.setItem("gok_fx", app.fxOn ? "1" : "0"); updateSettingsUI(); };
    if ($("btn-settings-ai")) $("btn-settings-ai").onclick = () => { app.aiSpeed = app.aiSpeed === "normal" ? "slow" : app.aiSpeed === "slow" ? "fast" : "normal"; localStorage.setItem("gok_ai_speed", app.aiSpeed); updateSettingsUI(); };
    if ($("btn-settings-shake")) $("btn-settings-shake").onclick = () => { app.screenShake = !app.screenShake; localStorage.setItem("gok_screen_shake", app.screenShake ? "1" : "0"); updateSettingsUI(); };
    if ($("btn-settings-textsize")) $("btn-settings-textsize").onclick = () => { app.textLarge = !app.textLarge; localStorage.setItem("gok_text_large", app.textLarge ? "1" : "0"); updateSettingsUI(); };
    if ($("btn-settings-density")) $("btn-settings-density").onclick = () => { app.uiDensity = app.uiDensity === "compact" ? "comfortable" : "compact"; localStorage.setItem("gok_ui_density", app.uiDensity); applyExperiencePrefs(); updateSettingsUI(); toast("界面密度：" + (app.uiDensity === "compact" ? "紧凑" : "舒适")); };
    if ($("btn-settings-hand-sort")) $("btn-settings-hand-sort").onclick = () => { app.handSort = app.handSort === "none" ? "cost" : app.handSort === "cost" ? "type" : "none"; localStorage.setItem("gok_hand_sort", app.handSort); if (app.game && app.screen === "game") renderGame(); updateSettingsUI(); };
    if ($("btn-settings-contrast")) $("btn-settings-contrast").onclick = () => { app.highContrast = !app.highContrast; localStorage.setItem("gok_high_contrast", app.highContrast ? "1" : "0"); applyExperiencePrefs(); updateSettingsUI(); };
    if ($("btn-settings-zone-labels")) $("btn-settings-zone-labels").onclick = () => { app.zoneLabels = !app.zoneLabels; localStorage.setItem("gok_zone_labels", app.zoneLabels ? "1" : "0"); applyExperiencePrefs(); updateSettingsUI(); };
    if ($("btn-settings-battler-fx")) $("btn-settings-battler-fx").onclick = () => { app.battlerFx = app.battlerFx === "fast" ? "normal" : "fast"; localStorage.setItem("gok_battler_fx", app.battlerFx); updateSettingsUI(); };
    if ($("btn-preset-immersive")) $("btn-preset-immersive").onclick = () => applyExperiencePreset("immersive");
    if ($("btn-preset-competitive")) $("btn-preset-competitive").onclick = () => applyExperiencePreset("competitive");
    if ($("btn-preset-performance")) $("btn-preset-performance").onclick = () => applyExperiencePreset("performance");
    if ($("btn-settings-hand-mode")) $("btn-settings-hand-mode").onclick = () => {
      if (isPhoneLayout()) { toast("手机版固定为点击操作。"); return; }
      app.handPlayMode = app.handPlayMode === "double" ? "drag" : "double";
      localStorage.setItem("gok_hand_play_mode", app.handPlayMode);
      updateSettingsUI();
      toast(app.handPlayMode === "double" ? "电脑操作：双击卡牌确认出牌。" : "电脑操作：拖到阵位或目标出牌。");
    };
    if ($("btn-settings-anim")) $("btn-settings-anim").onclick = () => {
      app.animSpeed = app.animSpeed <= 0.6 ? 0.7 : app.animSpeed <= 0.78 ? 0.9 : app.animSpeed <= 1.02 ? 1.2 : 0.55;
      localStorage.setItem("gok_anim_speed", String(app.animSpeed));
      applyVideoPrefs();
      updateSettingsUI();
      toast("动画速度已调整。");
    };
    if ($("settings-dim")) $("settings-dim").oninput = (e) => { app.bgDim = Math.max(0, Math.min(55, Number(e.target.value) || 0)); localStorage.setItem("gok_bg_dim", String(app.bgDim)); applyVideoPrefs(); updateSettingsUI(); };
    $("settings-volume").oninput = (e) => AudioBox.setVolume(Number(e.target.value) / 100);
    if ($("settings-bgm-volume")) $("settings-bgm-volume").oninput = (e) => AudioBox.setBgmVolume(Number(e.target.value) / 100);
    if ($("settings-sfx-volume")) $("settings-sfx-volume").oninput = (e) => AudioBox.setSfxVolume(Number(e.target.value) / 100);
    if ($("btn-settings-reset-prefs")) $("btn-settings-reset-prefs").onclick = resetVisualAudioPrefs;
    $("btn-settings-fullscreen").onclick = () => toggleFullscreen();
    document.addEventListener("fullscreenchange", updateSettingsUI);
    if ($("btn-settings-account")) $("btn-settings-account").onclick = () => { AudioBox.play("ui_open"); openProfilePage("security"); };
    $("btn-settings-clear-achievements").onclick = () => { app.achievements = {}; persistAchievements(); toast("成就记录已重置。"); };
    $("btn-settings-clear-profile").onclick = () => { app.profile = loadProfile(); app.profile = { games: 0, wins: 0, losses: 0, draws: 0, byFaction: {}, history: [], maxRound: 0 }; persistProfile(); updateHomeProfile(); toast("档案统计已重置。"); };
    $("btn-settings-credits").onclick = () => showCredits();
    $("btn-tutorial-back").onclick = () => returnFromTutorial();
    if ($("btn-tutorial-coach-collapse")) $("btn-tutorial-coach-collapse").onclick = () => {
      app.tutorialCoachCollapsed = true;
      const coach = $("tutorial-coach"); if (coach) coach.classList.add("collapsed");
      AudioBox.play("click");
    };
    if ($("btn-tutorial-coach-restore")) $("btn-tutorial-coach-restore").onclick = () => {
      app.tutorialCoachCollapsed = false;
      const coach = $("tutorial-coach"); if (coach) coach.classList.remove("collapsed");
      renderTutorialCoach();
      AudioBox.play("click");
    };
    if ($("btn-tutorial-skip")) $("btn-tutorial-skip").onclick = () => returnFromTutorial();
    if ($("btn-rules-back")) $("btn-rules-back").onclick = closeRulesScreen;
    if ($("btn-rules-back2")) $("btn-rules-back2").onclick = closeRulesScreen;
    if ($("btn-rules-keywords-top")) $("btn-rules-keywords-top").onclick = () => { AudioBox.play("ui_open"); openKeywordGlossary(); };
    if ($("btn-rules-tutorial")) $("btn-rules-tutorial").onclick = () => { if (app.rulesReturn === "game" && app.game) { toast("对局中不能跳转新手教程。"); return; } AudioBox.play("ui_open"); showScreen("tutorial"); };
    const startTutorialFlow = () => { markTutorialSeen("drill"); runBootLoading("正在准备新手演练", "载入教学牌桌…", BOOT_ASSETS, () => startTutorial()); };
    $("btn-tutorial-start").onclick = startTutorialFlow;
    document.querySelectorAll("[data-tutorial-drill]").forEach((b) => { b.onclick = startTutorialFlow; });
    document.querySelectorAll("[data-tutorial-jump]").forEach((b) => {
      b.onclick = () => {
        markTutorialSeen(b.dataset.tutorialJump);
        const target = document.getElementById(b.dataset.tutorialJump);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        AudioBox.play("select");
      };
    });
    if ($("btn-tutorial-restart")) $("btn-tutorial-restart").onclick = () => { AudioBox.play("ui_open"); startTutorial(); };
    $("btn-tutorial-exit").onclick = () => endTutorial();
    $("btn-lan").onclick = () => { closeStartMenu(); AudioBox.play("ui_open"); showScreen("lan"); initLanScreen(); };
    const matchBtn = $("btn-match");
    if (matchBtn) matchBtn.onclick = () => { closeStartMenu(); AudioBox.play("ui_open"); openMatchPage(); };
    const onlineBtn = $("btn-online");
    if (onlineBtn) onlineBtn.onclick = () => { closeStartMenu(); AudioBox.play("ui_open"); openRoomPage(); };
    $("btn-lan-back").onclick = () => { stopNet(true); showScreen("mode"); showModeMulti(true); };
    if ($("btn-credits")) $("btn-credits").onclick = () => showCredits();
    if ($("btn-rules")) $("btn-rules").onclick = () => { AudioBox.play("ui_open"); openKeywordGlossary(); };
    if ($("btn-rank")) $("btn-rank").onclick = () => openRank("home");
    if ($("btn-customize-home")) $("btn-customize-home").onclick = () => { if (!levelUnlocked("customize")) { showLockedFeature("customize", "档案个性化"); return; } AudioBox.play("ui_open"); openAppearancePage(); };
    if ($("home-account-cardback")) { $("home-account-cardback").style.cursor = "pointer"; $("home-account-cardback").title = "当前卡背 · 点击打开自定义"; $("home-account-cardback").onclick = () => { AudioBox.play("ui_open"); openProfileCustomization(); }; }
    if ($("btn-rank-multi")) $("btn-rank-multi").onclick = () => { closeStartMenu(); AudioBox.play("ui_open"); openRank("mode"); };
    if ($("btn-rank-mode")) $("btn-rank-mode").onclick = () => { AudioBox.play("ui_open"); openRank("mode"); };
    if ($("btn-rank-back")) $("btn-rank-back").onclick = () => closeRank();
    if ($("btn-rank-game")) $("btn-rank-game").onclick = () => openRank("game");
    if ($("btn-concede")) $("btn-concede").onclick = () => confirmConcede();
    if ($("btn-game-settings")) $("btn-game-settings").onclick = () => { AudioBox.play("ui_open"); openGameMenu(); };
    if (typeof app.emoteVoice !== "boolean") app.emoteVoice = localStorage.getItem("gok_emote_voice") !== "0";
    if ($("btn-emote")) $("btn-emote").onclick = () => { AudioBox.play("ui_open"); openEmotePanel(); };
    if ($("btn-game-guide")) $("btn-game-guide").onclick = () => { AudioBox.play("ui_open"); app.tutorialReturn = app.screen === "game" ? "game" : "home"; showScreen("tutorial"); };
    if ($("btn-lore-home")) $("btn-lore-home").onclick = () => { AudioBox.play("ui_open"); window.open("lore/index.html?v=20261023world1", "_blank", "noopener"); };
    window.addEventListener("resize", () => { document.querySelectorAll("#player-hero, #opponent-hero").forEach(centerHeroDeckBadge); });
    if ($("btn-sim-back")) $("btn-sim-back").onclick = () => showScreen("home");
    $("btn-setup-back").onclick = () => showModeSelect();
    $("btn-game-home").onclick = () => confirmExit();
    if ($("btn-toggle-log")) $("btn-toggle-log").onclick = () => toggleGameLog();
    if ($("btn-mobile-log")) $("btn-mobile-log").onclick = () => toggleGameLog();
    if ($("turn-badge")) { $("turn-badge").onclick = () => toggleGameLog(); $("turn-badge").title = "点击展开推演日志"; }
    if ($("btn-log-close")) $("btn-log-close").onclick = () => toggleGameLog(false);
    if ($("log-backdrop")) $("log-backdrop").onclick = () => toggleGameLog(false);
    if ($("btn-mobile-welcome-close")) $("btn-mobile-welcome-close").onclick = hideMobileWelcome;
    const veinRow = $("vein-row");
    if (veinRow) {
      let veinTimer = null;
      let veinStart = null;
      let veinTip = null;
      const hideVeinTip = () => { if (veinTip) veinTip.hidden = true; };
      const cancelVeinPress = () => { if (veinTimer) clearTimeout(veinTimer); veinTimer = null; veinStart = null; };
      const ensureVeinTip = () => {
        if (veinTip) return veinTip;
        veinTip = el("div", "vein-hover-tip");
        veinTip.id = "vein-hover-tip";
        veinTip.innerHTML = "<strong>流脉阈值</strong><span><b>4 震荡</b> 所有随从 1 伤害</span><span><b>7 裂隙</b> 双方领袖 2 伤害</span><span><b>10 魔物潮</b> 全场 3 伤害，领袖 5</span><span><b>12 回流</b> 流脉清空</span>";
        document.body.appendChild(veinTip);
        return veinTip;
      };
      veinRow.addEventListener("pointerdown", (ev) => {
        if (ev.pointerType === "mouse" || (ev.target.closest && ev.target.closest("button,.end-turn-stack,.end-turn-btn"))) return;
        veinStart = { x: ev.clientX, y: ev.clientY };
        veinTimer = setTimeout(() => { veinTimer = null; if (veinStart) openVeinThresholdHelp(); }, 340);
      });
      veinRow.addEventListener("pointermove", (ev) => {
        if (veinStart && (Math.abs(ev.clientX - veinStart.x) > 12 || Math.abs(ev.clientY - veinStart.y) > 12)) cancelVeinPress();
        if (ev.pointerType === "mouse") {
          if (ev.target.closest && ev.target.closest("button,.end-turn-stack,.end-turn-btn")) { hideVeinTip(); return; }
          const tip = ensureVeinTip();
          tip.hidden = false;
          const w = tip.offsetWidth || 220, h = tip.offsetHeight || 104;
          let x = ev.clientX + 14, y = ev.clientY - h - 12;
          if (x + w > innerWidth - 8) x = innerWidth - w - 8;
          if (y < 8) y = ev.clientY + 16;
          tip.style.left = Math.max(8, x) + "px";
          tip.style.top = Math.max(8, y) + "px";
        }
      });
      veinRow.addEventListener("mouseleave", hideVeinTip);
      veinRow.addEventListener("pointerup", cancelVeinPress);
      veinRow.addEventListener("pointercancel", cancelVeinPress);
      veinRow.addEventListener("pointerleave", cancelVeinPress);
      const sigil = veinRow.querySelector(".vein-sigil");
      if (sigil) {
        sigil.style.cursor = "pointer";
        sigil.title = "点击查看流脉阈值";
        sigil.addEventListener("click", (ev) => { ev.stopPropagation(); cancelVeinPress(); hideVeinTip(); openVeinThresholdHelp(); });
      }
    }
    const gameScreen = $("screen-game");
    if (gameScreen) {
      let pullStart = null;
      gameScreen.addEventListener("pointerdown", (ev) => {
        if (ev.pointerType === "mouse" || ev.clientY > 120 || (ev.target.closest && ev.target.closest("button"))) return;
        pullStart = { y: ev.clientY };
      });
      gameScreen.addEventListener("pointermove", (ev) => {
        if (!pullStart) return;
        if (ev.clientY - pullStart.y > 58) { pullStart = null; toggleGameLog(true); }
      });
      gameScreen.addEventListener("pointerup", () => { pullStart = null; });
      gameScreen.addEventListener("pointercancel", () => { pullStart = null; });
    }
    const keyBtn = $("btn-keywords");
    if (keyBtn) keyBtn.onclick = () => openKeywordGlossary();
    if ($("btn-game-tutorial")) $("btn-game-tutorial").onclick = () => { AudioBox.play("ui_open"); app.tutorialReturn = "game"; openGameGuide(); };
    const logMini = $("log-mini");
    if (logMini) logMini.onclick = () => toggleGameLog();
    $("btn-sound").onclick = () => AudioBox.toggle();
    if ($("btn-series-bo1")) $("btn-series-bo1").onclick = () => { app.seriesMode = "bo1"; document.querySelectorAll(".series-choice").forEach(b => b.classList.toggle("active", b.id === "btn-series-bo1")); AudioBox.play("click"); };
    if ($("btn-series-bo3")) $("btn-series-bo3").onclick = () => { app.seriesMode = "bo3"; document.querySelectorAll(".series-choice").forEach(b => b.classList.toggle("active", b.id === "btn-series-bo3")); AudioBox.play("click"); };
    $("btn-start-game").onclick = () => {
      const deckForStart = getPlayDeck(app.faction);
      if (!confirmDeckWarnings(app.faction, deckForStart, "仍然开始推演？")) return;
      app.lastUsedDeckId = app.customDecks[app.faction] ? (activeDeckFor(app.faction) ? activeDeckFor(app.faction).id : null) : null;
    const begin = () => runBootLoading("正在铺开牌桌", "载入牌组、阵位与流脉…", BOOT_ASSETS, () => startGame({ mode: "ai", faction: app.faction, aiDifficulty: app.aiDifficulty, first: app.firstChoice === "random" ? undefined : Number(app.firstChoice) }));
      const cg = CLASSIC_CG[app.faction];
      if (global.GokCinema && cg) {
        global.GokCinema.playOnce("classic_intro_" + app.faction, cg.clip, {
          eyebrow: "CLASSIC · " + factionName(app.faction),
          title: cg.title,
          text: cg.text
        }).then(begin);
      } else {
        begin();
      }
    };
    document.querySelectorAll("#setup-faction .faction-card").forEach((b) => {
      b.onclick = () => { app.faction = b.dataset.faction; AudioBox.play("click"); setupState(); };
    });
    $("btn-deck").onclick = () => { AudioBox.play("ui_open"); openDeckBuilder(app.faction); };
    if ($("btn-deck-random")) $("btn-deck-random").onclick = () => { const f = app.faction; const keys = Object.keys(D.DECK_STRATEGIES); const strategy = keys[Math.floor(Math.random() * keys.length)] || "midrange"; const built = D.autoBuildDeck(f, strategy, Array.from(ownedLegendarySet())); if (!D.validateDeck(f, built).ok) { toast("随机构筑失败，请重试。"); return; } app.customDecks[f] = built; persistCustomDecks(); updateSetupDeck(); toast("已按「" + D.DECK_STRATEGIES[strategy].name + "」从全卡池生成 30 张牌组。"); };
    $("btn-deck-preset").onclick = () => usePresetDeck(app.faction);
    $("btn-deck-back").onclick = () => {
      AudioBox.play("cancel");
      if (isPhoneLayout() && !app.deckBackArmed) {
        app.deckBackArmed = true;
        toast("再按一次「取消编成」退出，防止误触。");
        setTimeout(() => { app.deckBackArmed = false; }, 2400);
        return;
      }
      app.deckBackArmed = false;
      app.faction = app.deckBuildFaction; const to = app.deckReturn || "setup"; showScreen(to); if (to === "setup") setupState(); else if (to === "lan") initLanScreen(); toast("已取消编成，未保存改动。");
    };
    $("btn-deck-save").onclick = () => { if (saveCurrentDeck(true)) { app.deckSource = "custom"; renderDeckBuilder(); } };
    $("btn-deck-clear").onclick = () => { if (app.deckReadOnly) { toast("官方预设只读。"); return; } app.deckBuildList = []; app.deckSource = "draft"; app.lastAutoStrategy = null; renderDeckBuilder(); toast("已清空当前牌组，可重新选择。"); };
    $("btn-deck-reset").onclick = () => { app.deckBuildList = D.DECKS[app.deckBuildFaction].slice(); app.lastAutoStrategy = null; app.deckSource = "preset"; renderDeckBuilder(); toast("已恢复预设牌组。"); };
    $("btn-deck-use").onclick = () => { if (app.deckReadOnly) { toast("官方预设可直接在准备页使用，不能编辑。"); return; } if (!saveCurrentDeck(false)) return; app.faction = app.deckBuildFaction; const to = app.deckReturn || "setup"; showScreen(to); if (to === "setup") setupState(); else if (to === "lan") initLanScreen(); toast("已应用自定义牌组。"); };
    $("btn-deck-top-use").onclick = () => { if (app.deckReadOnly) { toast("官方预设可直接在准备页使用，不能编辑。"); return; } if (!saveCurrentDeck(false)) return; app.faction = app.deckBuildFaction; const to = app.deckReturn || "setup"; showScreen(to); if (to === "setup") setupState(); else if (to === "lan") initLanScreen(); toast("已应用自定义牌组。"); };
    document.querySelectorAll("[data-deck-filter]").forEach((b) => {
      b.classList.toggle("active", b.dataset.deckFilter === (app.deckBuildFilter || "all"));
      b.onclick = () => { app.deckBuildFilter = b.dataset.deckFilter; document.querySelectorAll("[data-deck-filter]").forEach((x) => x.classList.toggle("active", x === b)); renderDeckBuilder(); };
    });
    document.querySelectorAll("[data-deck-rarity]").forEach((b) => {
      b.classList.toggle("active", b.dataset.deckRarity === (app.deckBuildRarity || "all"));
      b.onclick = () => { app.deckBuildRarity = b.dataset.deckRarity; document.querySelectorAll("[data-deck-rarity]").forEach((x) => x.classList.toggle("active", x === b)); renderDeckBuilder(); };
    });
    document.querySelectorAll("[data-deck-owned]").forEach((b) => {
      b.onclick = () => { app.deckBuildOwned = b.dataset.deckOwned; document.querySelectorAll("[data-deck-owned]").forEach((x) => x.classList.toggle("active", x === b)); renderDeckBuilder(); };
    });
    document.querySelectorAll(".deck-scope").forEach((b) => {
      b.onclick = () => { app.deckPoolScope = b.dataset.deckScope; document.querySelectorAll(".deck-scope").forEach((x) => x.classList.toggle("active", x === b)); renderDeckBuilder(); };
    });
    document.querySelectorAll(".auto-deck-btn").forEach((b) => {
      b.disabled = !!app.deckReadOnly;
      b.onclick = () => autoBuildCurrentDeck(b.dataset.deckStrategy);
    });
    document.querySelectorAll(".sim-run").forEach((b) => {
      b.onclick = () => { AudioBox.play("ui_open"); runSimulation(Number(b.dataset.count)); };
    });
    initLanEvents();
    function dismissUnusableCardPreview(ev) {
      if (!isPhoneLayout() || !app.mobilePreviewUid || app.modalOpen) return;
      if (app.mobileClickArmed) return; // 可打出的牌交给 releaseMobileArmed
      const target = ev.target;
      if (!target || !target.closest) return;
      if (target.closest("#hand,.hand-card,#mobile-simple-preview,.mobile-card-sheet,.modal,.log-panel,#log-backdrop")) return;
      hideSimpleCardPreview();
      clearCardDropHints();
    }
    document.addEventListener("click", dismissUnusableCardPreview, true);
    document.addEventListener("click", releaseMobileArmed, true);
    document.addEventListener("contextmenu", (e) => {
      if (app.screen === "game" && !app.modalOpen && (app.targetInfo || app.zoneSelect || app.attacker || app.selectedCard)) {
        e.preventDefault();
        cancelSelection(true);
      }
    });
    // 鼠标离开卡牌/悬浮预览后立即收起，避免预览残留在别的界面
    document.addEventListener("pointermove", (e) => {
      const target = e.target && e.target.closest ? e.target.closest("#card-preview, .hand-card, .board-card, .codex-card, .deck-mini, .deck-line") : null;
      if (!target) { hidePreviewNow(); hideDeckHover(); }
    }, { passive: true });
    document.addEventListener("mouseleave", () => { hidePreviewNow(); hideDeckHover(); hideMobileCardSheet(); });
    document.addEventListener("scroll", () => { hideDeckHover(); }, true);
    window.addEventListener("resize", () => { hideDeckHover(); hidePreviewNow(); if (app.screen === "game") fitHandToWidth(); });
    // 所有界面按钮的统一清脆点击音；已有动作音的按钮会自动跳过，避免双响
    document.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest ? e.target.closest("button") : null;
      if (!btn || btn.disabled) return;
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      if (AudioBox.lastPlayedAt && now - AudioBox.lastPlayedAt < 90) return;
      AudioBox.play("click");
    }, { passive: true });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && app.screen === "codex" && !app.modalOpen && !(e.target.closest && e.target.closest("input, textarea, select"))) {
        const search = $("codex-search");
        if (search) { e.preventDefault(); search.focus(); search.select(); return; }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        goBack();
        return;
      }
      if (e.code === "Space" && app.screen === "game" && !app.modalOpen && !$("btn-end-turn").disabled) {
        e.preventDefault();
        endTurn();
      }
    });
    initDepthVisuals();
    setupState();
    renderTutorialKeywords();
    renderTutorialRoute();
    renderHomeDash();
    runBootLoading("正在展开流脉档案", "校准地脉、阵位与关键词…", BOOT_ASSETS, null);
    if (!localStorage.getItem("gok_welcome_v2")) localStorage.setItem("gok_welcome_v2", "1");
    AudioBox.updateButton();
    autoReconnectOnLoad();
    initChannelUI();
    if (isPhoneLayout()) {
      const welcome = $("mobile-welcome");
      if (welcome) document.body.appendChild(welcome);
      const tryWelcome = () => { if (app.screen === "home" && !app.modalOpen) showMobileWelcome(); };
      setTimeout(tryWelcome, 1200);
      setTimeout(tryWelcome, 3200);
    }
    startHostKeepAlive();
    initOnlineFromQuery();
    // 便于自动截图/调试
    app.startGame = startGame;
    app.showScreen = showScreen;
    app.runSimulation = runSimulation;
    app.endTurn = endTurn;
    app.render = renderGame;
    app.showEnd = showEnd;
    app.openLabPage = openLabPage;
    app.openCodex = openCodex;
    app.openAchievements = openAchievements;
    app.openSettings = openSettings;
  }

  function reinforceHandCardText() {
    if (isPhoneLayout()) return;
    document.querySelectorAll(".hand-card").forEach((card) => {
      const text = card.querySelector(".gok-lib-text");
      if (text) {
        text.style.setProperty("display", "-webkit-box", "important");
        text.style.setProperty("-webkit-box-orient", "vertical", "important");
        text.style.setProperty("-webkit-line-clamp", "3", "important");
        text.style.setProperty("overflow", "hidden", "important");
        text.style.setProperty("text-overflow", "ellipsis", "important");
      }
      const type = card.querySelector(".card-type");
      if (type) type.style.setProperty("display", "block", "important");
      const art = card.querySelector(".card-art");
      if (art) art.style.setProperty("inset", "0", "important");
    });
  }
  setInterval(reinforceHandCardText, 450);
  setTimeout(reinforceHandCardText, 80);


  global.GokUI = { init: init, app: app, startGame: startGame, showScreen: showScreen, runSimulation: runSimulation, renderGame: renderGame };

})(window);








