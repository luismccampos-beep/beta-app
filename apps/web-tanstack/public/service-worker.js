// --- CONFIGURATION ---
const CACHE_NAME = 'akmleva-cache-v2'; // Increment version on asset changes
const OFFLINE_URL = '/offline.html';
const DEBUG = true; // Set to false for production

const IS_LOCALHOST = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// Assets to pre-cache on installation for offline functionality
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/site.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// --- INSTALL: Pre-cache core assets ---
self.addEventListener('install', (event) => {
  if (IS_LOCALHOST) {
    if (DEBUG) console.log('[SW] Skipping install caching on localhost');
    self.skipWaiting();
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      if (DEBUG) console.log('[SW] Caching core assets on install');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force the new service worker to become active
});

// --- ACTIVATE: Clean up old caches ---
self.addEventListener('activate', (event) => {
  if (IS_LOCALHOST) {
    event.waitUntil(
      (async () => {
        if (DEBUG) console.log('[SW] Unregistering service worker on localhost');
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
        await self.registration.unregister();
      })()
    );
    return;
  }
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            if (DEBUG) console.log(`[SW] Deleting old cache: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// --- FETCH: Smartly handle requests with different strategies ---
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (IS_LOCALHOST) {
    return;
  }

  // Don't interfere with Next.js runtime/dev assets or HMR.
  // Intercepting these can cause stale chunk caching and ChunkLoadError.
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/__nextjs_original-stack-frames') ||
    url.pathname.includes('webpack-hmr')
  ) {
    return;
  }

  // 1. Navigation Requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithCacheFallback(event));
    return;
  }

  // 2. Static Assets (CSS, JS, Images) - Stale-While-Revalidate
  // Serve from cache first for speed, then update from network in the background.
  if (/\.(css|js|png|jpg|jpeg|svg|gif|woff|woff2)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event));
    return;
  }

  // Example for API calls (optional):
  // if (url.pathname.startsWith('/api/')) {
  //   event.respondWith(staleWhileRevalidate(event));
  //   return;
  // }
});


// --- Caching Strategy Functions ---

/**
 * Strategy: Stale-While-Revalidate for assets
 * Fetches from cache first. In parallel, fetches a fresh version from the network
 * to update the cache for the next visit.
 */
async function staleWhileRevalidate(event) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(event.request);

  const fetchPromise = fetch(event.request).then((networkResponse) => {
    // Only cache successful responses for basic requests (same origin).
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
      cache.put(event.request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((_error) => {
    // Network request failed, return cached response if available
    if (DEBUG) console.log('[SW] Fetch failed for asset, serving from cache if available.');
    return cachedResponse ?? Response.error();
  });

  // Return cached response immediately if available, otherwise wait for the network.
  // This ensures the page works offline if assets are cached.
  return cachedResponse ?? await fetchPromise;
}

/**
 * Strategy: Network-First with Cache Fallback for navigation
 * Tries the network first. If it fails, falls back to cache, then to the offline page.
 */
async function networkFirstWithCacheFallback(event) {
  try {
    const networkResponse = await fetch(event.request);
    // Cache the page on successful navigation for future offline access.
    const cache = await caches.open(CACHE_NAME);
    cache.put(event.request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    if (DEBUG) console.log('[SW] Network request for navigation failed, trying cache.', error);
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    // If page is in cache, serve it. Otherwise, serve the main offline page.
    const offline = await cache.match(OFFLINE_URL);
    return (
      cachedResponse ??
      offline ??
      new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    );
  }
}

// --- Background Sync ---
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-contact-form') {
    if (DEBUG) console.log('[SW] Background sync triggered for contact form.');
    event.waitUntil(sendStoredData());
  }
});

// --- Push Notifications ---
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  if (DEBUG) console.log('[SW] Push notification received.', data);

  const options = {
    body: data.body || 'Nova atualização na AKMLEVA!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge.png', // A small monochrome icon for the notification bar
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [ // Example actions for notifications
      { action: 'explore', title: 'Explorar Agora', icon: '/icons/explore.png' },
      { action: 'close', title: 'Fechar', icon: '/icons/close.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'AKMLEVA', options)
  );
});

// --- Notification Click Handler ---
self.addEventListener('notificationclick', (event) => {
  const notificationDataUrl = event.notification.data.url;
  event.notification.close();

  // If user clicks an action button
  if (event.action === 'explore') {
    if (DEBUG) console.log('[SW] Notification "Explore" action clicked');
    clients.openWindow(notificationDataUrl);
  }

  // Default click behavior (focus existing window or open a new one)
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const matchingClient = windowClients.find(client => new URL(client.url).pathname === new URL(notificationDataUrl).pathname);
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(notificationDataUrl);
      }
    })
  );
});


async function sendStoredData() {
  // Logic to get data from IndexedDB and send to the server
  // Example: const data = await idb.get('outbox');
  // if (data) await fetch('/api/contact', { method: 'POST', body: data });
  console.log('Sincronizando dados em background...');
}