const CACHE_NAME = 'alcorosal-wrapper-v1';
const OFFLINE_URL = '/';

// Файлы для кэширования (только обёртка)
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Установка: кэшируем обёртку
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Кэширование обёртки Alcorosal');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация: чистим старые кэши
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Удаление:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
    // Если запрос к вашему сайту alcorosal.ru — пропускаем (не кэшируем)
    if (event.request.url.includes('alcorosal.ru')) {
        return; // Пусть загружается как обычно
    }
    
    // Для всех остальных запросов (обёртка) — используем кэш
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
