self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-pwa-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/watched',
                '/index.html',
                '/manifest.json',
                '/static/js/bundle.js',
                // Add other assets and routes to cache
            ]);
        })
    );
});
self.addEventListener('fetch', (event) => {
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response
            })
        );
    }

});