const CACHE_NAME = 'gakuto-pwa-v3';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css', 
  '/manifest.json',
  '/icon-144x144.png',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Don't cache API routes or dynamic content
  if (url.pathname.startsWith('/api/') || 
      url.pathname.includes('/sessions') ||
      url.pathname.includes('/spaces') ||
      url.pathname.includes('/notifications') ||
      url.pathname.includes('/profile') ||
      url.pathname.includes('/resources') ||
      request.method !== 'GET') {
    // Always fetch from network for API routes
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Return a fallback for API routes when offline
          if (url.pathname.includes('/sessions')) {
            return new Response(JSON.stringify({ error: 'Offline - Sessions not available' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(request);
      })
      .catch(() => {
        // Return a fallback page when both cache and network fail
        if (request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 