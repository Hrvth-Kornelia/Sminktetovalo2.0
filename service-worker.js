const CACHE = "app-cache-v9";

const ASSETS = [
  "./manifest.json",
  "./192favicon.jfif",
  "./icon.512.jfif"
];


/* =========================
   TELEPÍTÉS
========================= */

self.addEventListener("install", (event) => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
  );

});


/* =========================
   AKTIVÁLÁS
========================= */

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys()
      .then((keys) => {

        return Promise.all(

          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key))

        );

      })
      .then(() => self.clients.claim())

  );

});


/* =========================
   FETCH / CACHE
========================= */

self.addEventListener("fetch", (event) => {

  const request = event.request;

  if (request.method !== "GET") {
    return;
  }


  /* HTML OLDALAK:
     mindig először internet */

  if (request.mode === "navigate") {

    event.respondWith(

      fetch(request)
        .then((response) => {

          const copy = response.clone();

          caches.open(CACHE)
            .then((cache) => {
              cache.put(request, copy);
            });

          return response;

        })
        .catch(() => caches.match(request))

    );

    return;
  }


  /* CSS + JS:
     mindig először friss verzió */

  if (
    request.destination === "style" ||
    request.destination === "script"
  ) {

    event.respondWith(

      fetch(request)
        .then((response) => {

          const copy = response.clone();

          caches.open(CACHE)
            .then((cache) => {
              cache.put(request, copy);
            });

          return response;

        })
        .catch(() => caches.match(request))

    );

    return;
  }


  /* KÉPEK:
     cache-ből gyorsan */

  if (request.destination === "image") {

    event.respondWith(

      caches.match(request)
        .then((cached) => {

          if (cached) {
            return cached;
          }

          return fetch(request)
            .then((response) => {

              const copy = response.clone();

              caches.open(CACHE)
                .then((cache) => {
                  cache.put(request, copy);
                });

              return response;

            });

        })

    );

    return;
  }

});


/* =========================
   FIREBASE
========================= */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);


firebase.initializeApp({

  apiKey: "AIzaSyDMCR4wwStafbPxpY2eNffJ895ZLm4Js5w",
  authDomain: "sienna-bloom-pushup.firebaseapp.com",
  projectId: "sienna-bloom-pushup",
  storageBucket: "sienna-bloom-pushup.firebasestorage.app",
  messagingSenderId: "341488518116",
  appId: "1:341488518116:web:563707b1314856e8033df1",
  measurementId: "G-2GG43SCGEN"

});


const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {

  console.log(
    "Háttérben érkezett Firebase üzenet:",
    payload
  );

});


/* =========================
   ÉRTESÍTÉS KATTINTÁS
========================= */

self.addEventListener(
  "notificationclick",
  (event) => {

    event.notification.close();

    const targetUrl =
      event.notification.data?.url ||
      self.location.origin +
      self.registration.scope;


    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      })

      .then((clientList) => {

        for (const client of clientList) {

          if ("focus" in client) {

            client.navigate(targetUrl);

            return client.focus();

          }

        }


        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

      })

    );

  }
);