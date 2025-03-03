self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("static").then((cache) => {
        return cache.addAll([
          "/",
          "/index.html",
          "/src/main.js",  // Il tuo file principale JS
          "/style.css",  // Il tuo file CSS
          "/Sprites/meFestaPxArt.png",  // Il file immagine
        ]);
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  