const CACHE = "bautagebuch-v053";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request,{cache:"no-store"}).then(resp => { const copy=resp.clone(); caches.open(CACHE).then(c=>c.put("./index.html",copy)); return resp; }).catch(() => caches.match("./index.html"))); return;
  }
  event.respondWith(fetch(event.request).then(resp => { const copy=resp.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); return resp; }).catch(() => caches.match(event.request)));
});
