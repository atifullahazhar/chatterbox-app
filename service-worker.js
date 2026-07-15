const CACHE_NAME = 'chatterbox-v3-network-first'; // Naya version

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Turant naya service worker activate karo
});

self.addEventListener('activate', (event) => {
    // Purane saare kachre (caches) ko delete karo
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Naye pages ko turant control mein lo
});

// 🔥 NETWORK FIRST STRATEGY (Development ke liye sabse best)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Agar internet se naya data mil gaya, toh usko cache mein save karke user ko dikhao
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Agar internet nahi chal raha (offline), tab hi cache (purana data) dikhao
                return caches.match(event.request);
            })
    );
});