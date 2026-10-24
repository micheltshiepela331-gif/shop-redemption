// Shop Rédemption — fonctionnement sans Internet
// Ne garde en mémoire que les fichiers de l'application elle-même (jamais ceux d'autres sites).
const CACHE = "shop-redemption-v2";
const FICHIERS = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("shop-redemption") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(rep => {
      if (rep.ok && rep.type === "basic") { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); }
      return rep;
    })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
// toucher une notification ouvre l'application
self.addEventListener("notificationclick", e => { e.notification.close(); e.waitUntil(self.clients.matchAll({type:"window"}).then(l => l.length ? l[0].focus() : self.clients.openWindow("./"))); });
