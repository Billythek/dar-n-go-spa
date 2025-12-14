/**
 * DarDZ - Service Worker
 * Cache-first strategy pour les assets statiques
 */

const CACHE_NAME = 'dardz-v1.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/utils.js',
    '/js/data.js',
    '/js/app.js',
    '/manifest.json'
];

const FONT_CACHE = 'dardz-fonts-v1';
const IMAGE_CACHE = 'dardz-images-v1';

// Installation - Pre-cache les assets statiques
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Pre-caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activation - Nettoyer les anciens caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name.startsWith('dardz-') && name !== CACHE_NAME)
                        .map(name => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch - Strategie selon le type de ressource
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requetes non-GET
    if (request.method !== 'GET') return;

    // Ignorer les requetes externes (sauf images Unsplash)
    if (url.origin !== location.origin && !url.hostname.includes('unsplash')) {
        return;
    }

    // Strategie selon le type de ressource
    if (isImage(request)) {
        event.respondWith(cacheFirst(request, IMAGE_CACHE));
    } else if (isFont(request)) {
        event.respondWith(cacheFirst(request, FONT_CACHE));
    } else if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request, CACHE_NAME));
    } else {
        event.respondWith(networkFirst(request));
    }
});

// Helpers
function isImage(request) {
    const url = new URL(request.url);
    return request.destination === 'image' ||
           url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i) ||
           url.hostname.includes('unsplash') ||
           url.hostname.includes('pravatar');
}

function isFont(request) {
    const url = new URL(request.url);
    return request.destination === 'font' ||
           url.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i);
}

function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(js|css|html)$/i) ||
           url.pathname === '/';
}

// Cache-first: Essayer le cache d'abord, puis le reseau
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Fetch failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

// Network-first: Essayer le reseau d'abord, puis le cache
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Offline', { status: 503 });
    }
}

// Message handler pour la mise a jour du cache
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
