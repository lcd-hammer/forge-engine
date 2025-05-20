// sw.js – Service Worker

const CACHE_NAME = 'forge-engine-cache-v1'; // bump this if you update files
const urlsToCache = [
  './',                      // site root
  './index.html', // ← updated
  './manifest.json',
  // add any other local assets here, e.g.:
  // './css/style.css',
  // './js/app.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install: cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching core assets');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Install cache failed:', err))
  );
});

// Activate: clean up old caches if needed
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(oldKey => caches.delete(oldKey))
      )
    )
  );
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
