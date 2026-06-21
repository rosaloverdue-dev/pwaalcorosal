const CACHE_NAME = 'alcorosal-v1';
const OFFLINE_URL = '/';

// Файлы для кэширования (укажите все важные файлы вашего сайта)
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
    // Добавьте сюда пути к вашим CSS, JS, изображениям
    // Например:
    // '/css/style.css',
    // '/js/main.js',
    // '/images/logo.png'
];

// Установка: кэшируем файлы
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Кэширование файлов Alcorosal');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация: удаляем старые кэши
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Удаление старого кэша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Перехват запросов: сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Возвращаем из кэша
                }
                
                return fetch(event.request)
                    .then((response) => {
                        // Проверяем валидность ответа
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Если нет сети, показываем офлайн-страницу
                        return caches.match('/');
                    });
            })
    );
});
