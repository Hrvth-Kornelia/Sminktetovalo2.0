const CACHE = "app-cache-v6";

const ASSETS = [
  './manifest.json',
  './uj-index.css',
  './sminktetovalo.js',
  './icon.192.jfif',
  './icon.512.jfif'
];



/* =========================

   ÉRTESÍTÉSRE KATTINTÁS

========================= */

self.addEventListener("notificationclick", (event) => {
event.notification.close();

  const targetUrl =
  event.notification.data?.url ||
  self.location.origin + self.registration.scope;
  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {
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

});

/* =========================

   FIREBASE BETÖLTÉSE

========================= */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"

);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"

);

/* =========================

   FIREBASE KONFIGURÁCIÓ

========================= */

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
/*
A Firebase Console-ból küldött normál értesítést
az FCM automatikusan megjeleníti, amikor az oldal
háttérben van vagy be van zárva.
*/
messaging.onBackgroundMessage((payload) => {
console.log("Háttérben érkezett Firebase üzenet:", payload);

});








self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});