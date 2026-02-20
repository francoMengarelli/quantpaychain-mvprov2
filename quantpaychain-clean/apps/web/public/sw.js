const CACHE_NAME = 'quantpaychain-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/marketplace',
  '/earnings',
  '/reports',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('🗑️ Service Worker: Clearing old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API calls
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseClone = response.clone();
        
        // Cache the response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request);
      })
  );
});
