/* 配音播放器：单通道 + 优先级抢占 + 冷却 + BGM 自动压低 + 字幕
 * 台词表：tools/voice-lines.json（生成脚本读它）
 * 产物：assets/voice/<faction>/<role>_<scene>.ogg + assets/voice/manifest.json
 * 对外：window.GokVoice = { play, stop, setEnabled, setSubtitles, enabled, ready }
 */
(function () {
  var MANIFEST = "assets/voice/manifest.json";
  var KEY_ON = "gok_voice_on";
  var KEY_VOL = "gok_voice_volume";
  var KEY_SUB = "gok_voice_sub";
  var KEY_SEEN = "gok_voice_seen";

  var manifest = null;
  var lines = {};
  var current = null;
  var lastPlayed = {};          // id -> ts，做冷却
  var subtitlesOn = read(KEY_SUB, "1") === "1";
  var enabled = read(KEY_ON, "1") === "1";
  var volume = Number(read(KEY_VOL, "80")) / 100;
  var subEl = null;
  var preloaded = {};

  function read(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) {} }

  function ensureSub() {
    if (subEl && document.body.contains(subEl)) return subEl;
    subEl = document.createElement("div");
    subEl.className = "gok-voice-sub";
    subEl.hidden = true;
    document.body.appendChild(subEl);
    return subEl;
  }

  function showSub(line) {
    if (!subtitlesOn) return;
    var el = ensureSub();
    el.innerHTML = '<b>' + (line.name || "") + "</b><span>" + (line.text || "") + "</span>";
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add("on"); });
    clearTimeout(showSub._t);
    showSub._t = setTimeout(hideSub, Math.max(1600, (line.ms || 2000) + 400));
  }

  function hideSub() {
    if (!subEl) return;
    subEl.classList.remove("on");
    clearTimeout(showSub._t);
    showSub._t = setTimeout(function () { if (subEl) subEl.hidden = true; }, 260);
  }

  function duck(on) {
    var audio = window.GokUI && window.GokUI.audio;
    if (!audio || typeof audio.duckBgm !== "function") return;
    try { audio.duckBgm(on ? 0.34 : 1, on ? 6000 : 400); } catch (e) {}
  }

  function load() {
    if (manifest) return Promise.resolve(manifest);
    return fetch(MANIFEST, { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        manifest = data || { lines: [] };
        lines = {};
        (manifest.lines || []).forEach(function (l) { lines[l.id] = l; });
        return manifest;
      })
      .catch(function () { manifest = { lines: [] }; return manifest; });
  }

  function preload() {
    // 只预载八位领袖的开场句，其余懒加载
    (manifest.lines || []).forEach(function (l) {
      if (l.scene !== "opening" || l.priority !== "P0") return;
      var a = new Audio(l.file);
      a.preload = "auto";
      preloaded[l.id] = a;
    });
  }

  function pick(role, scene) {
    var id = role + "_" + scene;
    if (lines[id]) return lines[id];
    var found = null;
    (manifest.lines || []).forEach(function (l) { if (l.role === role && l.scene === scene) found = l; });
    return found;
  }

  function play(role, scene, opts) {
    if (!enabled || !role || !scene) return false;
    load().then(function () {
      if (!manifest) return;
      var line = pick(role, scene);
      if (!line) return;
      var now = Date.now();
      // 同一条 8 秒内不重复
      if (lastPlayed[line.id] && now - lastPlayed[line.id] < 8000) return;
      // 单通道：P0 可以打断 P1，其余一律让位
      if (current) {
        var cur = current.line;
        var incomingP0 = line.priority === "P0";
        var curP1 = cur && cur.priority !== "P0";
        if (!(incomingP0 && curP1)) return;
        stop();
      }
      var url = line.file + "?v=" + (manifest.generatedAt || "").replace(/[^0-9]/g, "").slice(0, 12);
      var a = preloaded[line.id] || new Audio(url);
      if (a.src.indexOf(line.file) < 0) a.src = url;
      a.volume = Math.max(0, Math.min(1, volume));
      current = { audio: a, line: line, startedAt: now };
      lastPlayed[line.id] = now;
      duck(true);
      showSub(line);
      var done = function () {
        if (current && current.audio === a) { current = null; hideSub(); duck(false); }
      };
      a.onended = done;
      a.onerror = function () { done(); };
      try {
        a.currentTime = 0;
        var p = a.play();
        if (p && p.catch) p.catch(function () { done(); });
      } catch (e) { done(); }
    });
    return true;
  }

  function stop() {
    if (!current) return;
    try { current.audio.pause(); current.audio.currentTime = 0; } catch (e) {}
    current = null;
    hideSub();
    duck(false);
  }

  function announce() {
    try { document.dispatchEvent(new CustomEvent("gok-voice-change")); } catch (e) {}
  }

  function setEnabled(on) {
    enabled = !!on;
    write(KEY_ON, enabled ? "1" : "0");
    if (!enabled) stop();
    announce();
    return enabled;
  }

  function setSubtitles(on) {
    subtitlesOn = !!on;
    write(KEY_SUB, subtitlesOn ? "1" : "0");
    if (!subtitlesOn) hideSub();
    announce();
    return subtitlesOn;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, Number(v) || 0));
    write(KEY_VOL, Math.round(volume * 100));
    if (current) current.audio.volume = volume;
    return volume;
  }

  // 首次进入游戏时给一条开场提示（只一次）
  function maybeFirstHint() {
    if (read(KEY_SEEN, "")) return;
    write(KEY_SEEN, "1");
  }

  function boot() {
    ensureSub();
    load().then(function () {
      preload();
      maybeFirstHint();
    });
    // 设置面板开关（元素可能还没渲染，轮询一次）
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      var toggle = document.getElementById("btn-voice-toggle");
      var sub = document.getElementById("btn-voice-sub");
      var slider = document.getElementById("settings-voice");
      var label = document.getElementById("settings-voice-label");
      if (toggle) {
        var paint = function () {
          toggle.textContent = enabled ? "开" : "关";
          toggle.classList.toggle("btn-primary", enabled);
          toggle.classList.toggle("btn-ghost", !enabled);
        };
        paint();
        toggle.onclick = function () { setEnabled(!enabled); paint(); };
      }
      if (sub) {
        var paintSub = function () {
          sub.textContent = subtitlesOn ? "开" : "关";
          sub.classList.toggle("btn-primary", subtitlesOn);
          sub.classList.toggle("btn-ghost", !subtitlesOn);
        };
        paintSub();
        sub.onclick = function () { setSubtitles(!subtitlesOn); paintSub(); };
      }
      if (slider && !slider.dataset.wired) {
        slider.dataset.wired = "1";
        slider.value = String(Math.round(volume * 100));
        if (label) label.textContent = Math.round(volume * 100) + "%";
        slider.oninput = function () {
          var v = setVolume(Number(slider.value) / 100);
          if (label) label.textContent = Math.round(v * 100) + "%";
        };
      }
      if (!boot.wired) {
        boot.wired = true;
        document.addEventListener("gok-voice-change", function () {
          var t = document.getElementById("btn-voice-toggle");
          var sb = document.getElementById("btn-voice-sub");
          if (t) { t.textContent = enabled ? "开" : "关"; t.classList.toggle("btn-primary", enabled); t.classList.toggle("btn-ghost", !enabled); }
          if (sb) { sb.textContent = subtitlesOn ? "开" : "关"; sb.classList.toggle("btn-primary", subtitlesOn); sb.classList.toggle("btn-ghost", !subtitlesOn); }
        });
      }
      if (toggle && sub && slider) clearInterval(timer);
      if (tries > 60) clearInterval(timer);
    }, 300);
  }

  window.GokVoice = {
    play: play,
    stop: stop,
    setEnabled: setEnabled,
    setSubtitles: setSubtitles,
    setVolume: setVolume,
    manifest: load,
    get enabled() { return enabled; },
    get ready() { return !!manifest; }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
