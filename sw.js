const CACHE_NAME = 'pesinat-takip-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.24.4/babel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn-icons-png.flaticon.com/512/2942/2942544.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Eski cache temizlendi:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Firebase ve Firestore API isteklerini cache'lememek için (Canlı verinin bozulmaması için)
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('firebase')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache'de varsa onu döndür, yoksa internetten çek
      return response || fetch(event.request);
    })
  );
});