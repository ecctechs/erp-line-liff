// sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // ให้ SW ใช้งานทันที
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  // ล้าง cache เก่า
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => caches.delete(cache))
      );
    })
  );
});
