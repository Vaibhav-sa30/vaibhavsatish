/* ===== SERVICE WORKER FOR PORTFOLIO WEBSITE ===== */

const CACHE_NAME = 'portfolio-v1.0.0';
const STATIC_CACHE = 'portfolio-static-v1.0.0';
const DYNAMIC_CACHE = 'portfolio-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/components.css',
    '/css/responsive.css',
    '/js/main.js',
    '/js/components/navigation.js',
    '/js/components/projects.js',
    '/js/components/research.js',
    '/js/components/contact.js',
    '/js/components/animations.js',
    '/js/components/performance.js',
    '/assets/images/profile.jpg',
    '/manifest.json'
];

// Assets to cache on demand
const DYNAMIC_ASSETS = [
    '/assets/images/',
    '/assets/icons/',
    '/assets/documents/'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    'https://fonts.gstatic.com/'
];

/* ===== INSTALL EVENT ===== */
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static assets', error);
            })
    );
});

/* ===== ACTIVATE EVENT ===== */
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

/* ===== FETCH EVENT ===== */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (url.origin === location.origin) {
        // Same origin requests
        event.respondWith(handleSameOriginRequest(request));
    } else if (EXTERNAL_RESOURCES.some(resource => url.href.startsWith(resource))) {
        // External resources (fonts, etc.)
        event.respondWith(handleExternalResource(request));
    } else {
        // Other external requests (APIs, etc.)
        event.respondWith(handleExternalRequest(request));
    }
});

/* ===== REQUEST HANDLERS ===== */
async function handleSameOriginRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Check if it's a static asset
        if (STATIC_ASSETS.includes(url.pathname) || url.pathname === '/') {
            return await cacheFirst(request, STATIC_CACHE);
        }
        
        // Check if it's a dynamic asset
        if (DYNAMIC_ASSETS.some(pattern => url.pathname.startsWith(pattern))) {
            return await staleWhileRevalidate(request, DYNAMIC_CACHE);
        }
        
        // For HTML pages, use network first strategy
        if (request.headers.get('accept').includes('text/html')) {
            return await networkFirst(request, DYNAMIC_CACHE);
        }
        
        // Default to network first
        return await networkFirst(request, DYNAMIC_CACHE);
        
    } catch (error) {
        console.error('Service Worker: Error handling same origin request', error);
        return await handleOffline(request);
    }
}

async function handleExternalResource(request) {
    try {
        return await staleWhileRevalidate(request, STATIC_CACHE);
    } catch (error) {
        console.error('Service Worker: Error handling external resource', error);
        return new Response('External resource unavailable', { status: 503 });
    }
}

async function handleExternalRequest(request) {
    try {
        // For external APIs, always try network first
        return await fetch(request);
    } catch (error) {
        console.error('Service Worker: External request failed', error);
        return new Response('Service unavailable', { status: 503 });
    }
}

/* ===== CACHING STRATEGIES ===== */
async function cacheFirst(request, cacheName) {
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
        console.error('Service Worker: Network request failed', error);
        throw error;
    }
}

async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Network request failed, trying cache', error);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Fetch from network in background
    const networkResponsePromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(error => {
            console.error('Service Worker: Background fetch failed', error);
        });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // If no cached version, wait for network
    return await networkResponsePromise;
}

async function handleOffline(request) {
    const url = new URL(request.url);
    
    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
        const cache = await caches.open(STATIC_CACHE);
        return await cache.match('/') || new Response('Offline', { status: 503 });
    }
    
    // Return placeholder for images
    if (request.headers.get('accept').includes('image')) {
        return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#999">Image Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
    
    return new Response('Offline', { status: 503 });
}

/* ===== BACKGROUND SYNC ===== */
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    try {
        // Get pending form submissions from IndexedDB
        const pendingForms = await getPendingForms();
        
        for (const form of pendingForms) {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form.data)
                });
                
                if (response.ok) {
                    await removePendingForm(form.id);
                    console.log('Service Worker: Form synced successfully');
                }
            } catch (error) {
                console.error('Service Worker: Form sync failed', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Background sync failed', error);
    }
}

/* ===== PUSH NOTIFICATIONS ===== */
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: data.data,
        actions: data.actions
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

/* ===== UTILITY FUNCTIONS ===== */
async function getPendingForms() {
    // This would typically use IndexedDB
    // Placeholder implementation
    return [];
}

async function removePendingForm(id) {
    // This would typically remove from IndexedDB
    // Placeholder implementation
    console.log('Removing pending form:', id);
}

/* ===== MESSAGE HANDLING ===== */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});