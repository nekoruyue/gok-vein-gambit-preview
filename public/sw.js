/* 戈克世界：流脉牌局 · 离线壳
 * 只缓存同源静态资源；/api/ 一律直连，不参与缓存。
 * 换版本时改 CACHE 名字即可，旧缓存会在 activate 时清掉。
 */
const CACHE = "gok-shell-20261117";
const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "favicon-32.png",
  "assets/icons/pwa-192.png",
  "assets/icons/apple-touch-icon.png"
];
const MAX_CACHE_BYTES = 2 * 1024 * 1024;

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // 逐个 add：任何一个 404 都不该让整次安装失败
    await Promise.all(PRECACHE.map((url) => cache.add(new Request(url, { cache: "reload" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function skip(url, request) {
  if (request.method !== "GET") return true;
  if (url.origin !== self.location.origin) return true;
  if (url.pathname.startsWith("/api/")) return true;
  return false;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (skip(url, request)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE);
          cache.put("index.html", fresh.clone());
        }
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE);
        const hit = (await cache.match("index.html")) || (await cache.match("./"));
        return hit || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(request);
    if (hit) {
      // 命中缓存的同时后台更新，下次拿新的
      fetch(request).then((res) => {
        if (res && res.ok) cache.put(request, res.clone());
      }).catch(() => {});
      return hit;
    }
    const res = await fetch(request);
    if (res && res.ok) {
      const len = Number(res.headers.get("content-length") || 0);
      if (!len || len <= MAX_CACHE_BYTES) cache.put(request, res.clone()).catch(() => {});
    }
    return res;
  })());
});
