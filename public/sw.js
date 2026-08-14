// Service Worker pour GALF FORMATION PWA
const CACHE_NAME = 'galf-pwa-v1';
const DYNAMIC_CACHE = 'galf-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/images/headers/accueil.png',
  '/images/headers/formations.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache : Network First avec fallback sur le Cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non GET ou d'extensions
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la réponse réseau est valide, met à jour le cache dynamique
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // En cas de panne réseau, cherche dans le cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si la page principale est demandée hors-ligne
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
        });
      })
  );
});
