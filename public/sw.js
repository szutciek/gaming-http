self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll([
        "./",
        "./home.css",
        "./home.js",
        "./logo.png",
        "./favicon.ico",
        "./logoOnly.png",
        "./svg/wheelofluck.svg",
        "./svg/shuter.svg",
        "./svg/tuhak.svg",
        "./svg/fir.svg",
        "./profiles/1F-turkish-alien.png",
      ]);
    })
  );
});

// self.addEventListener("fetch", (e) => {
//   // console.log(e.request.url);
//   e.respondWith(
//     caches.match(e.request).then((res) => {
//       return res || fetch(e.request); // Return cached or request
//     })
//   );
// });
