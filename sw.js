// A unique name for your cache.
// You should change 'v1' to 'v2', 'v3', etc., whenever you update any of the cached files.
const CACHE_NAME = 'forge-engine-cache-v2';

// The list of files that make up your app's core shell.
const urlsToCache = [
  './',                      // Caches the root of your site
  './index.html',     // Your main HTML file
  './manifest.json',         // The app manifest
  // The icons used in the manifest, so they work offline
  'https://placehold.co/192x192/4f46e5/white?text=Forge&font=inter',
  'https://placehold.co/512x512/4f46e5/white?text=Forge&font=inter'
];

// Install Event: This runs when the service worker is first installed.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service worker is caching core assets.');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Service Worker: Cache addAll failed:', err);
      })
  );
});

// Activate Event: This runs after install and is used to clean up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // Filter out caches that don't match the current name
          .map(oldKey => caches.delete(oldKey)) // Delete the old caches
      );
    })
  );
});

// Fetch Event: This runs for every request, allowing the app to work offline.
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // First, try to find a matching response in the cache.
    caches.match(event.request)
      .then(cachedResponse => {
        // If a cached response is found, return it.
        if (cachedResponse) {
          return cachedResponse;
        }
        // If not found in cache, fetch it from the network.
        return fetch(event.request);
      })
  );
});