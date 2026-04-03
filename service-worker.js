const CACHE = 'app-v1';
const ASSETS = [
  '/',                 // főoldal
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  // ha vannak aloldalaid:
  '/arlista/',
  '/nyitvatartas/'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});