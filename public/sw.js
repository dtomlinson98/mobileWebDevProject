const staticCache = "Static-cache-v12";
const dynamicCache = "Dynamic-cache-v11";

const assets = [
  "/public/",
  "/public/index.html",
  "/public/pages/search.html",
  "/public/pages/contact.html",
  "/public/pages/favorites.html",
  "/public/js/app.js",
  "/public/js/ui.js",
  "/public/js/materialize.min.js",
  "/public/css/materialize.min.css",
  "/public/css/app.css",
  "/public/img/basset-hound.jpg",
  "/public/img/dachshund.jpg",
  "/public/img/french-bulldog.jpg",
  "/public/img/golden-doodle.jpg",
  "/public/img/golden-retriever.jpg",
  "/public/img/great-dane.jpg",
  "/public/img/saint-bernard.jpg",
  "/public/img/shih-tzu.jpg",
  "/public/img/favicon.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
];

self.addEventListener("install", function (event) {
  console.log(`SW: Event fired: ${event.type}`);
  event.waitUntil(
    caches.open(staticCache).then(function (cache) {
      console.log("SW: Precaching App shell");
      return cache.addAll(assets).catch((error) => {
        console.error("SW: Error caching assets:", error);
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  //fires after the service worker completes its installation.
  // It's a place for the service worker to clean up from
  // previous service worker versions.
  console.log(`SW: Event fired: ${event.type}`);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCache && key !== dynamicCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  //fires whenever the app requests a resource (file or data)
  console.log(`SW: Fetching ${event.request.url}`);
  //next, go get the requested resource from the network
  if (event.request.url.indexOf("firestore.googleapis.com") === -1) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          return (
            response ||
            fetch(event.request).then((fetchRes) => {
              return caches.open(dynamicCache).then((cache) => {
                cache.put(event.request.url, fetchRes.clone());
                limitCacheSize(dynamicCache, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(() => caches.match("/public/pages/fallback.html"))
    );
  }
});
