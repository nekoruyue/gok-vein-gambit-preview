/* 更新器 UI：只负责页面上的「检查更新 / 下载」面板
 * 依赖：window.gokUpdater（Electron 预加载注入），网页版没有就整体跳过
 * 从 ui.js 拆出，行为与拆分前一致
 */
(function () {
  var api = window.gokUpdater;
  if (!api || typeof api.check !== "function") return;

  var elCurrent = document.getElementById("gok-update-current");
  var elStatus = document.getElementById("gok-update-status");
  var elBadge = document.getElementById("gok-update-badge");
  var elNotes = document.getElementById("gok-update-notes");
  var elProgress = document.getElementById("gok-update-progress");
  var elBar = document.getElementById("gok-update-bar");
  var elRow = document.getElementById("gok-update-action-row");
  var elTitle = document.getElementById("gok-update-action-title");
  var elSub = document.getElementById("gok-update-action-sub");
  var btnCheck = document.getElementById("gok-update-check");
  var btnGo = document.getElementById("gok-update-go");
  var info = null;
  var last = null;
  var downloaded = false;

  function setStatus(text) { if (elStatus) elStatus.textContent = text; }

  function fmtSize(n) {
    if (!n) return "体积未知";
    return n > 1024 * 1024 * 100 ? Math.round(n / 1048576) + " MB" : (n / 1048576).toFixed(1) + " MB";
  }

  function render(state) {
    if (!state) return;
    last = state;
    if (state.reason === "no-feed") {
      setStatus("尚无更新清单（发布后自动检查）");
      if (elBadge) elBadge.hidden = true;
      if (elRow) elRow.hidden = true;
      return;
    }
    if (state.reason === "network") {
      setStatus("连不上更新服务器，稍后再试");
      if (elBadge) elBadge.hidden = true;
      return;
    }
    if (state.reason === "bad-manifest") {
      setStatus("更新清单异常，已跳过");
      return;
    }
    if (!state.ok) { setStatus("检查失败"); return; }
    if (!state.updateAvailable) {
      setStatus("已是最新版本（" + state.current + "）");
      if (elBadge) elBadge.hidden = true;
      if (elRow) elRow.hidden = true;
      if (elNotes) elNotes.hidden = true;
      return;
    }
    setStatus("发现新版本 " + state.latest + " · " + fmtSize(state.size) + (state.mandatory ? " · 必须更新" : ""));
    if (elBadge) { elBadge.hidden = false; elBadge.textContent = "v" + state.latest; elBadge.classList.add("ready"); }
    if (elNotes) {
      elNotes.innerHTML = "";
      (state.notes || []).slice(0, 6).forEach(function (note) {
        var d = document.createElement("div");
        d.className = "gk-note";
        d.textContent = String(note);
        elNotes.appendChild(d);
      });
      elNotes.hidden = !(state.notes && state.notes.length);
    }
    if (elRow) elRow.hidden = false;
    if (elTitle) elTitle.textContent = "下载 " + state.latest;
    if (elSub) elSub.textContent = downloaded ? "已下载，点右侧完成安装" : "下载完成后可立即安装，存档不受影响";
    if (btnGo) btnGo.textContent = downloaded ? "重启安装" : "下载";
    var nav = document.getElementById("btn-settings");
    if (nav) nav.classList.add("has-update");
  }

  function onProgress(p) {
    if (!elProgress || !elBar) return;
    elProgress.hidden = false;
    elBar.style.width = (p && p.percent ? p.percent : 0) + "%";
    setStatus("正在下载 " + (p && p.percent ? p.percent : 0) + "%（" + fmtSize(p ? p.received : 0) + " / " + fmtSize(p ? p.total : 0) + "）");
  }

  if (btnCheck) {
    btnCheck.addEventListener("click", function () {
      setStatus("正在检查…");
      downloaded = false;
      if (elProgress) elProgress.hidden = true;
      api.check().then(render).catch(function () { setStatus("检查失败"); });
    });
  }

  if (btnGo) {
    btnGo.addEventListener("click", function () {
      if (downloaded) { api.install(); return; }
      btnGo.disabled = true;
      btnGo.textContent = "下载中";
      api.download().then(function (r) {
        btnGo.disabled = false;
        if (r && r.ok) {
          downloaded = true;
          if (elProgress) elProgress.hidden = true;
          setStatus("已下载完成，点「重启安装」后游戏会关闭并自动安装");
          if (btnGo) btnGo.textContent = "重启安装";
        } else {
          btnGo.textContent = "重试下载";
          setStatus("下载失败：" + ((r && r.message) || "未知原因"));
        }
      }).catch(function (e) {
        btnGo.disabled = false;
        btnGo.textContent = "重试下载";
        setStatus("下载失败：" + (e && e.message ? e.message : "未知原因"));
      });
    });
  }


  if (api.onProgress) api.onProgress(onProgress);
  if (api.onState) api.onState(render);

  api.info().then(function (i) {
    info = i;
    if (elCurrent) elCurrent.textContent = "桌面版 " + i.version + " · 通道 " + i.channel;
  }).catch(function () {});
})();
