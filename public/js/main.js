/* 启动入口：等 DOM 就绪后交给 UI。 */
window.addEventListener("error", function (event) {
  const msg = event && event.message ? event.message : "未知错误";
  const t = document.getElementById("toast");
  if (t) {
    t.textContent = "界面错误：" + msg;
    t.classList.add("show");
  }
  console.error(event.error || msg);
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.GokUI && window.GokUI.init) window.GokUI.init();
  // 离线壳：网页端（含局域网 http 与在线部署）注册 Service Worker；file:// 下的桌面壳不适用
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
  // 自动化截图入口：?capture=home|setup|sim|game
  var params = new URLSearchParams(window.location.search);
  var capture = params.get("capture");
  if (capture && capture !== "home") {
    setTimeout(function () {
      if (capture === "setup") window.GokUI.showScreen("setup");
      if (capture === "sim") { window.GokUI.showScreen("sim"); window.GokUI.runSimulation(100); }
      if (capture === "game") window.GokUI.startGame({ mode: "ai", faction: "pus" });
    }, 300);
  }
});
