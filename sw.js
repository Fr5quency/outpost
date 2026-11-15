// Outpost offline cache. Bump the version when you upload a new index.html.
const CACHE = "outpost-v11";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-180.png", "./icon-512.png", "./quran.json", "./duas.json", "./amiri-quran.woff2", "./games-more.js", "./pieces/wK.svg", "./pieces/wQ.svg", "./pieces/wR.svg", "./pieces/wB.svg", "./pieces/wN.svg", "./pieces/wP.svg", "./pieces/bK.svg", "./pieces/bQ.svg", "./pieces/bR.svg", "./pieces/bB.svg", "./pieces/bN.svg", "./pieces/bP.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
