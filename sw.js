// WasteSortAI Service Worker
// Version 1.0.0

const CACHE_NAME = ‘wastesort-ai-v1.0.0’;
const DYNAMIC_CACHE = ‘wastesort-ai-dynamic-v1.0.0’;
const MODEL_CACHE = ‘wastesort-ai-models-v1.0.0’;

// Cache strategies
const CACHE_FIRST = ‘cache-first’;
const NETWORK_FIRST = ‘network-first’;
const STALE_WHILE_REVALIDATE = ‘stale-while-revalidate’;

// Static assets to cache immediately
const STATIC_ASSETS = [
‘/’,
‘/static/js/bundle.js’,
‘/static/css/main.css’,
‘/manifest.json’,
‘/logo192.png’,
‘/logo512.png’,
‘https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap’,
‘https://unpkg.com/lucide@latest/dist/umd/lucide.js’
];

// AI model files to cache
const MODEL_ASSETS = [
‘/ai-models/yolov8-waste-model.json’,
‘/ai-models/model.bin’,
‘/ai-models/waste-classes.json’
];

// API endpoints that should use network-first strategy
const API_ENDPOINTS = [
‘/api/auth’,
‘/api/analysis’,
‘/api/user’,
‘/api/dashboard’
];

// Install event - cache static assets
self.addEventListener(‘install’, (event) => {
console.log(‘Service Worker installing…’);

event.waitUntil(
Promise.all([
// Cache static assets
caches.open(CACHE_NAME).then((cache) => {
console.log(‘Caching static assets’);
return cache.addAll(STATIC_ASSETS);
}),
// Cache AI models
caches.open(MODEL_CACHE).then((cache) => {
console.log(‘Caching AI models’);
return cache.addAll(MODEL_ASSETS).catch((error) => {
console.warn(‘Failed to cache some AI models:’, error);
});
})
]).then(() => {
console.log(‘Service Worker installed successfully’);
return self.skipWaiting();
})
);
});

// Activate event - clean up old caches
self.addEventListener(‘activate’, (event) => {
console.log(‘Service Worker activating…’);

event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((cacheName) => {
// Delete old caches
if (cacheName !== CACHE_NAME &&
cacheName !== DYNAMIC_CACHE &&
cacheName !== MODEL_CACHE) {
console.log(‘Deleting old cache:’, cacheName);
return caches.delete(cacheName);
}
})
);
}).then(() => {
console.log(‘Service Worker activated’);
return self.clients.claim();
})
);
});

// Fetch event - handle network requests
self.addEventListener(‘fetch’, (event) => {
const { request } = event;
const url = new URL(request.url);

// Skip non-GET requests
if (request.method !== ‘GET’) {
return;
}

// Skip chrome-extension and other protocols
if (!url.protocol.startsWith(‘http’)) {
return;
}

event.respondWith(handleRequest(request));
});

// Handle different types of requests
async function handleRequest(request) {
const url = new URL(request.url);

try {
// API requests - network first
if (isApiRequest(url)) {
return await networkFirst(request);
}

```
// AI model files - cache first
if (isModelRequest(url)) {
  return await cacheFirst(request, MODEL_CACHE);
}

// Static assets - cache first
if (isStaticAsset(url)) {
  return await cacheFirst(request, CACHE_NAME);
}

// Images and other assets - stale while revalidate
if (isAsset(url)) {
  return await staleWhileRevalidate(request);
}

// Everything else - network first with cache fallback
return await networkFirst(request);
```

} catch (error) {
console.error(‘Fetch error:’, error);
return await getCacheResponse(request) || createErrorResponse();
}
}

// Cache strategies implementation
async function cacheFirst(request, cacheName = CACHE_NAME) {
const cache = await caches.open(cacheName);
const cachedResponse = await cache.match(request);

if (cachedResponse) {
return cachedResponse;
}

try {
const networkResponse = await fetch(request);
if (networkResponse.ok) {
cache.put(request, networkResponse.clone());
}
return networkResponse;
} catch (error) {
console.error(‘Cache first failed:’, error);
throw error;
}
}

async function networkFirst(request) {
try {
const networkResponse = await fetch(request);

```
// Cache successful responses
if (networkResponse.ok) {
  const cache = await caches.open(DYNAMIC_CACHE);
  cache.put(request, networkResponse.clone());
}

return networkResponse;
```

} catch (error) {
console.warn(‘Network request failed, trying cache:’, error);
const cachedResponse = await getCacheResponse(request);
if (cachedResponse) {
return cachedResponse;
}
throw error;
}
}

async function staleWhileRevalidate(request) {
const cache = await caches.open(DYNAMIC_CACHE);
const cachedResponse = await cache.match(request);

// Start network request
const networkPromise = fetch(request).then((networkResponse) => {
if (networkResponse.ok) {
cache.put(request, networkResponse.clone());
}
return networkResponse;
}).catch((error) => {
console.warn(‘Background update failed:’, error);
});

// Return cached response immediately if available
if (cachedResponse) {
// Update in background
networkPromise;
return cachedResponse;
}

// Wait for network if no cache
return await networkPromise;
}

// Helper functions
function isApiRequest(url) {
return API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint));
}

function isModelRequest(url) {
return url.pathname.includes(’/ai-models/’) ||
url.pathname.includes(‘model.json’) ||
url.pathname.includes(‘model.bin’);
}

function isStaticAsset(url) {
return STATIC_ASSETS.includes(url.pathname) ||
url.pathname.startsWith(’/static/’) ||
url.pathname.includes(‘bundle.js’) ||
url.pathname.includes(‘main.css’);
}

function isAsset(url) {
const assetExtensions = [’.png’, ‘.jpg’, ‘.jpeg’, ‘.gif’, ‘.svg’, ‘.webp’, ‘.ico’];
return assetExtensions.some(ext => url.pathname.endsWith(ext));
}

async function getCacheResponse(request) {
const caches_to_check = [CACHE_NAME, DYNAMIC_CACHE, MODEL_CACHE];

for (const cacheName of caches_to_check) {
const cache = await caches.open(cacheName);
const response = await cache.match(request);
if (response) {
return response;
}
}

return null;
}

function createErrorResponse() {
return new Response(
JSON.stringify({
error: ‘Network error occurred’,
message: ‘Please check your internet connection’,
offline: true
}),
{
status: 503,
statusText: ‘Service Unavailable’,
headers: { ‘Content-Type’: ‘application/json’ }
}
);
}

// Background sync for offline actions
self.addEventListener(‘sync’, (event) => {
if (event.tag === ‘background-sync’) {
event.waitUntil(handleBackgroundSync());
}
});

async function handleBackgroundSync() {
console.log(‘Background sync triggered’);

try {
// Get pending analyses from IndexedDB
const pendingAnalyses = await getPendingAnalyses();

```
for (const analysis of pendingAnalyses) {
  try {
    await uploadAnalysis(analysis);
    await removePendingAnalysis(analysis.id);
  } catch (error) {
    console.error('Failed to sync analysis:', error);
  }
}
```

} catch (error) {
console.error(‘Background sync failed:’, error);
}
}

// Push notifications
self.addEventListener(‘push’, (event) => {
const options = {
body: event.data ? event.data.text() : ‘New notification from WasteSortAI’,
icon: ‘/logo192.png’,
badge: ‘/badge-72x72.png’,
vibrate: [100, 50, 100],
data: {
dateOfArrival: Date.now(),
primaryKey: 1
},
actions: [
{
action: ‘explore’,
title: ‘Open App’,
icon: ‘/images/checkmark.png’
},
{
action: ‘close’,
title: ‘Close’,
icon: ‘/images/xmark.png’
}
]
};

event.waitUntil(
self.registration.showNotification(‘WasteSortAI’, options)
);
});

// Notification click handler
self.addEventListener(‘notificationclick’, (event) => {
event.notification.close();

if (event.action === ‘explore’) {
event.waitUntil(
self.clients.openWindow(’/’)
);
}
});

// Message handler for communication with main thread
self.addEventListener(‘message’, (event) => {
if (event.data && event.data.type === ‘SKIP_WAITING’) {
self.skipWaiting();
}

if (event.data && event.data.type === ‘GET_VERSION’) {
event.ports[0].postMessage({ version: CACHE_NAME });
}

if (event.data && event.data.type === ‘CLEAR_CACHE’) {
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((cacheName) => caches.delete(cacheName))
);
})
);
}
});

// Utility functions for IndexedDB operations
async function getPendingAnalyses() {
// Implementation would depend on IndexedDB setup
return [];
}

async function uploadAnalysis(analysis) {
// Implementation would upload to server
const response = await fetch(’/api/analysis/upload’, {
method: ‘POST’,
body: analysis.formData
});
return response.json();
}

async function removePendingAnalysis(id) {
// Implementation would remove from IndexedDB
console.log(‘Removing pending analysis:’, id);
}