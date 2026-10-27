/* 《戈克世界：流脉牌局》开场动画
 * 40 秒六幕：灯灭 -> 南迁 -> 冰退火起 -> 流脉亮起 -> 八阵营落章 -> 标题
 * 技术：Canvas 2D 粒子底 + DOM 分镜 + CSS 关键帧；音频需要一次用户手势才允许播放
 * 对外：window.GokOpening = { play, finish, isOpen }
 */
(function () {
  var KEY_SEEN = "gok_cg_opening_v2";
  var TOTAL = 40000;
  var root = null;
  var canvas = null;
  var ctx = null;
  var raf = null;
  var clock = 0;
  var last = 0;
  var speed = 1;
  var running = false;
  var finished = false;
  var onDoneCb = null;
  var audioEl = null;
  var scene = 0;
  var parts = [];
  var dpr = 1;

  var SCENES = [
    { t: 0, name: "spark" },
    { t: 5000, name: "blackout" },
    { t: 12000, name: "march" },
    { t: 20000, name: "vein" },
    { t: 28000, name: "emblems" },
    { t: 34000, name: "title" }
  ];

  var SUBS = [
    { from: 600, to: 4600, text: "旧历 2034 年" },
    { from: 5400, to: 11200, text: "那一夜，全世界的灯都灭了" },
    { from: 12600, to: 19000, text: "活下来的人，不到一成" },
    { from: 20400, to: 27000, text: "他们在那里，重新点起了火" },
    { from: 28400, to: 33200, text: "六方鼎立，学院与雪都各执一端" }
  ];

  var NARRATION = [
    { from: 800, to: 4600, text: "记录从这一夜开始。" },
    { from: 12600, to: 19000, text: "活下来的人，不到一成。" },
    { from: 28400, to: 33200, text: "档案里没写他们为什么活着，只写了他们留下了什么。" }
  ];

  function $(sel) { return root ? root.querySelector(sel) : null; }

  function reducedMotion() {
    try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  }

  function forced() {
    if (window.__GOK_OPENING_FORCE) return true;
    if (location.search.indexOf("opening=1") >= 0) return true;
    try { if (localStorage.getItem("gok_cg_force") === "1") return true; } catch (e) {}
    return false;
  }

  function markSeenEarly() { try { localStorage.setItem(KEY_SEEN, "1"); } catch (e) {} }

  function shouldPlay() {
    if (forced()) return true;
    try { if (localStorage.getItem("gok_cg_off") === "1") return false; } catch (e) {}
    if (navigator.webdriver) return false;
    if (location.search.indexOf("capture=1") >= 0) return false; // 截图/自动化流程不需要开场挡着
    try { return !localStorage.getItem(KEY_SEEN); } catch (e) { return false; }
  }

  // ---------------------------------------------------------------- 画布
  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    var w = window.innerWidth, h = window.innerHeight;
    parts = [];
    // 城市灯点阵（第二幕逐排熄灭）
    var cols = Math.max(12, Math.floor(w / 74));
    var rows = 9;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        parts.push({
          kind: "light",
          x: (c + 0.5) * (w / cols) + (Math.random() - 0.5) * 18,
          y: h * 0.30 + r * (h * 0.055) + (Math.random() - 0.5) * 8,
          r: 1.4 + Math.random() * 1.8,
          row: r,
          outAt: 0,
          alpha: 1
        });
      }
    }
    // 风雪
    for (var i = 0; i < 90; i++) {
      parts.push({
        kind: "snow",
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        vx: 0.15 + Math.random() * 0.5,
        vy: 0.35 + Math.random() * 0.9,
        alpha: 0.15 + Math.random() * 0.45
      });
    }
    // 流脉脉络（第四幕从地底亮起）
    for (var b = 0; b < 14; b++) {
      var x0 = w * (0.06 + Math.random() * 0.88);
      var segs = [];
      var x = x0, y = h;
      var steps = 5 + Math.floor(Math.random() * 4);
      for (var s = 0; s < steps; s++) {
        x += (Math.random() - 0.5) * 90;
        y -= h * (0.07 + Math.random() * 0.05);
        segs.push({ x: x, y: y });
      }
      parts.push({ kind: "vein", segs: segs, born: 20000 + Math.random() * 3500, grow: 0 });
    }
    // 火星（第四幕的“第一堆火”）
    for (var f = 0; f < 40; f++) {
      parts.push({
        kind: "ember",
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 80,
        y: window.innerHeight * 0.80 + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.25 - Math.random() * 0.6,
        r: 0.8 + Math.random() * 1.6,
        alpha: 0
      });
    }
  }

  function draw(dt, ms) {
    var w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    // 背景底色渐变（越靠后越暖）
    var warm = Math.max(0, Math.min(1, (ms - 19000) / 9000));
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(5,8,11,0.96)");
    g.addColorStop(1, warm > 0 ? "rgba(" + Math.round(6 + 26 * warm) + "," + Math.round(11 + 12 * warm) + "," + Math.round(16 + 4 * warm) + ",0.98)" : "rgba(4,7,10,0.98)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // 第一幕：心跳光点
    if (ms < 5200) {
      var p = ms < 5200 ? Math.max(0, 1 - ms / 5200) : 0;
      var pulse = 0.55 + 0.45 * Math.sin(ms / 260);
      var rad = 26 + 18 * pulse;
      var rg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, rad * 6);
      rg.addColorStop(0, "rgba(242,198,109," + (0.85 * p * pulse) + ")");
      rg.addColorStop(0.4, "rgba(217,164,65," + (0.22 * p) + ")");
      rg.addColorStop(1, "rgba(217,164,65,0)");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, rad * 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 第二幕：天裂
    if (ms > 4600 && ms < 13000) {
      var k = Math.min(1, (ms - 4600) / 1400);
      ctx.save();
      ctx.strokeStyle = "rgba(240,246,255," + (0.75 * (1 - Math.min(1, (ms - 8000) / 4600))) + ")";
      ctx.lineWidth = 2 + 6 * (1 - k);
      ctx.beginPath();
      var cx = w * 0.52, cy = h * 0.42;
      ctx.moveTo(cx - 260 * k, cy - 120 * k);
      ctx.lineTo(cx - 40 * k, cy + 30 * k);
      ctx.lineTo(cx + 150 * k, cy - 60 * k);
      ctx.lineTo(cx + 300 * k, cy + 90 * k);
      ctx.stroke();
      ctx.restore();
    }

    for (var i = 0; i < parts.length; i++) {
      var pt = parts[i];
      if (pt.kind === "light") {
        if (ms < 5200) continue;
        // 逐排熄灭：越靠后越晚
        var outAt = 6200 + pt.row * 520 + Math.random() * 120;
        if (!pt.outAt) pt.outAt = outAt;
        var alive = ms < pt.outAt ? 1 : Math.max(0, 1 - (ms - pt.outAt) / 700);
        if (alive <= 0) continue;
        ctx.fillStyle = "rgba(242,198,109," + (0.75 * alive) + ")";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        if (alive > 0.4) {
          ctx.fillStyle = "rgba(242,198,109," + (0.10 * alive) + ")";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (pt.kind === "snow") {
        if (ms < 11500 || ms > 27000) continue;
        pt.x += pt.vx * dt * 0.06;
        pt.y += pt.vy * dt * 0.06;
        if (pt.x > w + 10) pt.x = -10;
        if (pt.y > h + 10) { pt.y = -10; pt.x = Math.random() * w; }
        ctx.fillStyle = "rgba(226,240,250," + pt.alpha + ")";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (pt.kind === "vein") {
        if (ms < pt.born) continue;
        var growTo = Math.min(pt.segs.length, (ms - pt.born) / 260);
        ctx.strokeStyle = "rgba(95,211,196," + (0.16 + 0.24 * Math.min(1, growTo / pt.segs.length)) + ")";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(pt.segs[0].x, h);
        for (var s = 0; s < Math.floor(growTo); s++) ctx.lineTo(pt.segs[s].x, pt.segs[s].y);
        if (Math.floor(growTo) < pt.segs.length) {
          var frac = growTo - Math.floor(growTo);
          var a = pt.segs[Math.max(0, Math.floor(growTo) - 1)];
          var bpt = pt.segs[Math.floor(growTo)];
          ctx.lineTo(a.x + (bpt.x - a.x) * frac, a.y + (bpt.y - a.y) * frac);
        }
        ctx.stroke();
      } else if (pt.kind === "ember") {
        if (ms < 21200) continue;
        pt.x += pt.vx * dt * 0.05;
        pt.y += pt.vy * dt * 0.05;
        pt.alpha = Math.min(0.9, (ms - 21200) / 2400);
        if (pt.y < h * 0.35) { pt.y = h * 0.8; pt.x = window.innerWidth * 0.5 + (Math.random() - 0.5) * 80; }
        ctx.fillStyle = "rgba(242,170,80," + pt.alpha + ")";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 第四幕：地平线上的火光
    if (ms > 20500) {
      var f = Math.min(1, (ms - 20500) / 2200);
      var fg = ctx.createRadialGradient(w / 2, h * 0.86, 0, w / 2, h * 0.86, h * 0.5);
      fg.addColorStop(0, "rgba(242,170,80," + (0.28 * f) + ")");
      fg.addColorStop(1, "rgba(242,170,80,0)");
      ctx.fillStyle = fg;
      ctx.fillRect(0, h * 0.45, w, h * 0.55);
    }
  }

  // ---------------------------------------------------------------- 时间线
  function applyScene(ms) {
    var idx = 0;
    for (var i = 0; i < SCENES.length; i++) if (ms >= SCENES[i].t) idx = i;
    if (idx !== scene) {
      scene = idx;
      root.setAttribute("data-scene", SCENES[idx].name);
    }
    // 字幕
    var sub = $(".gkopen-sub");
    var line = null;
    for (var j = 0; j < SUBS.length; j++) if (ms >= SUBS[j].from && ms <= SUBS[j].to) line = SUBS[j].text;
    if (sub) {
      if (line) {
        if (sub.textContent !== line) sub.textContent = line;
        sub.classList.add("on");
      } else {
        sub.classList.remove("on");
      }
    }
  }

  function tick(now) {
    if (!running) return;
    if (!last) last = now;
    var dt = Math.min(64, now - last);
    last = now;
    clock += dt * speed;
    applyScene(clock);
    draw(dt * speed, clock);
    if (clock >= TOTAL) { finish("auto"); return; }
    raf = requestAnimationFrame(tick);
  }

  function playAudio(ms) {
    if (!audioEl) return;
    var line = null;
    for (var i = 0; i < NARRATION.length; i++) if (ms >= NARRATION[i].from && ms <= NARRATION[i].to) line = i;
    if (line == null) return;
    if (audioEl.dataset.line === String(line)) return;
    audioEl.dataset.line = String(line);
    audioEl.src = "assets/voice/opening/narrator_narration" + (line + 1) + ".ogg";
    var p = audioEl.play();
    if (p && p.catch) p.catch(function () {});
  }

  function startRun(opts) {
    opts = opts || {};
    speed = opts.speed || 1;
    if (opts.short) speed = 3.2;
    running = true;
    finished = false;
    clock = 0;
    last = 0;
    scene = -1;
    resize();
    seed();
    root.hidden = false;
    root.classList.add("gkopen-on");
    root.classList.remove("gkopen-done");
    root.setAttribute("data-scene", "spark");
    applyScene(0);
    if (audioEl) audioEl.dataset.line = "";
    raf = requestAnimationFrame(tick);
  }

  function finish(reason) {
    if (finished) return;
    finished = true;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    if (audioEl) { try { audioEl.pause(); } catch (e) {} }
    try { localStorage.setItem(KEY_SEEN, "1"); } catch (e) {}
    if (root) {
      root.classList.add("gkopen-done");
      setTimeout(function () { if (root) { root.hidden = true; root.classList.remove("gkopen-on", "gkopen-done"); } }, 420);
    }
    var cb = onDoneCb;
    onDoneCb = null;
    if (cb) cb(reason || "skip");
  }

  // 需要一次点击才能出声（浏览器自动播放策略），所以第一幕是“点击开始”
  function waitGesture(opts) {
    var start = $(".gkopen-start");
    root.hidden = false;
    root.classList.add("gkopen-on");
    root.setAttribute("data-scene", "idle");
    resize();
    if (start) start.hidden = false;
    var go = function () {
      if (start) start.hidden = true;
      root.removeEventListener("click", go);
      root.removeEventListener("keydown", go);
      try {
        if (audioEl) {
          audioEl.src = "audio/bgm_gok_title.ogg";
          var p = audioEl.play();
          if (p && p.catch) p.catch(function () {});
        }
      } catch (e) {}
      // 跳过按钮自己处理，别让它触发开始
      // 开场有自己的配乐：先把首页 BGM 停掉，免得两首叠在一起
      try {
        var audio = window.GokUI && window.GokUI.audio;
        if (audio && audio.bgmEl) audio.bgmEl.pause();
      } catch (e) {}
      startRun(opts);
    };
    root.addEventListener("click", function (ev) {
      if (ev.target && ev.target.classList && ev.target.classList.contains("gkopen-skip")) return;
      go();
    }, { once: true });
    window.addEventListener("keydown", function onKey(ev) {
      if (!running) { window.removeEventListener("keydown", onKey); go(); }
    }, { once: true });
  }

  function build() {
    root = document.getElementById("gok-opening");
    if (!root) return false;
    canvas = root.querySelector(".gkopen-fx");
    audioEl = root.querySelector(".gkopen-audio");
    var skip = root.querySelector(".gkopen-skip");
    if (skip) skip.addEventListener("click", function (ev) { ev.stopPropagation(); finish("skip"); });
    window.addEventListener("keydown", function (ev) {
      if (!running && !root.classList.contains("gkopen-on")) return;
      if (ev.key === "Escape" || ev.key === " " || ev.key === "Enter") { ev.preventDefault(); finish("key"); }
    });
    window.addEventListener("resize", function () { if (running) { resize(); seed(); } });
    return true;
  }

  function play(opts) {
    opts = opts || {};
    if (!root && !build()) return;
    onDoneCb = opts.onDone || null;
    if (opts.noGesture) { startRun(opts); return; }
    if (reducedMotion() && !opts.force) { startRun({ speed: 6, short: true }); return; }
    waitGesture(opts);
  }

  function boot() {
    if (!build()) return;
    if (!shouldPlay()) return;
    markSeenEarly();   // 决定要播就先记账，中途刷新也不会重播
    // 等启动进度条走完再上开场，避免两层遮罩打架
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      var b = document.getElementById("boot-loading");
      var bootVisible = b && !b.hidden && getComputedStyle(b).display !== "none";
      // 健康游戏忠告要先播完，再上开场动画
      var hp = document.getElementById("health-notice");
      var hpVisible = hp && !hp.hidden;
      if ((!bootVisible && !hpVisible) || tries > 80) {
        clearInterval(timer);
        setTimeout(function () { play(); }, 260);
      }
    }, 150);
  }

  window.GokOpening = {
    play: play,
    finish: finish,
    isOpen: function () { return !!running; },
    reset: function () { try { localStorage.removeItem(KEY_SEEN); } catch (e) {} }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
