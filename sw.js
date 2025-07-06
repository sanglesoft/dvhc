const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './bt.css',
    './bt.js',
    './db.js',
    './apple-touch-icon.png',
    './favicon-32x32.png',
    './favicon-16x16.png',
    './site.webmanifest'
];

// Cài đặt Service Worker và cache sẵn file cần thiết
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Xóa cache cũ khi có version mới
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});

// Chiến lược Network First → Ưu tiên mạng, fallback cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Nếu response OK → update cache
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => caches.match(event.request)) // Không có mạng → lấy từ cache
    );
});
