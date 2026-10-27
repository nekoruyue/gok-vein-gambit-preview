/* 权威联机客户端：状态由服务器推，动作发给服务器
 * - SSE 下行：/api/aroom/:code/events
 * - POST 上行：/api/aroom/:code/action
 * - 断线用 token 自动重连；重连后补一次 /state
 */
(function (root) {
  "use strict";

  const SESSION_KEY = "gok_auth_session_v1";

  function loadSession() {
    try {
      const raw = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      return raw && raw.code && raw.token != null ? raw : null;
    } catch (e) { return null; }
  }

  function saveSession(s) {
    try {
      if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function createRoom(opts) {
    return fetch("/api/aroom/create", {
      method: "POST", cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts || {})
    }).then((r) => r.json().then((d) => ({ ok: r.ok, ...d })));
  }

  function joinRoom(code, seat) {
    return fetch("/api/aroom/join", {
      method: "POST", cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, seat })
    }).then((r) => r.json().then((d) => ({ ok: r.ok, ...d })));
  }

  function send(session, action) {
    return fetch("/api/aroom/" + encodeURIComponent(session.code) + "/action", {
      method: "POST", cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: session.seat, token: session.token, action })
    }).then((r) => r.json().then((d) => ({ ok: r.ok && d.ok, ...d })));
  }

  function fetchState(session) {
    const q = "/api/aroom/" + encodeURIComponent(session.code) + "/state?player=" + session.seat + "&token=" + encodeURIComponent(session.token);
    return fetch(q, { cache: "no-store" }).then((r) => r.json().then((d) => ({ ok: r.ok, ...d })));
  }

  /**
   * 开一条 SSE。onState 收快照，onStatus 收连接状态（"live" / "reconnect"）。
   * 返回 { close }
   */
  function openStream(session, handlers) {
    handlers = handlers || {};
    const onState = handlers.onState || function () {};
    const onStatus = handlers.onStatus || function () {};
    let closed = false;
    let es = null;
    let retry = 0;

    function connect() {
      if (closed) return;
      const q = "/api/aroom/" + encodeURIComponent(session.code) + "/events?player=" +
        session.seat + "&token=" + encodeURIComponent(session.token);
      es = new EventSource(q);
      es.addEventListener("state", (ev) => {
        retry = 0;
        onStatus("live");
        try { onState(JSON.parse(ev.data)); } catch (e) {}
      });
      es.onerror = () => {
        if (closed) return;
        onStatus("reconnect");
        try { es.close(); } catch (e) {}
        retry = Math.min(8000, 800 * Math.pow(1.6, retry || 1));
        setTimeout(connect, retry);
      };
    }

    connect();
    return { close() { closed = true; try { es && es.close(); } catch (e) {} } };
  }

  root.GokAuthority = {
    createRoom, joinRoom, send, fetchState, openStream,
    loadSession, saveSession,
    clearSession() { saveSession(null); }
  };
})(window);
