const CACHE_NAME = "v1";
const ASSETS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/main.js",
  "/images/defualtUser.png",
  "/images/nocontacts.png"
];

// Install event
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch event
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
