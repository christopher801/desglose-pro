const CACHE_NAME = 'desglose-pro-v4.9.0'

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/404.html',
  '/favicon.svg',
  '/favicon.png',
]

// ===== INSTALL =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  )
})

// ===== ACTIVATE =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName)
        })
      )
    }).then(() => self.clients.claim())
  )
})

// ===== FETCH =====
self.addEventListener('fetch', event => {
  // Pa cache Firebase API calls — toujou rezo dirèk
  if (
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('identitytoolkit.googleapis.com') ||
    event.request.url.includes('securetoken.googleapis.com') ||
    event.request.url.includes('fcm.googleapis.com')
  ) {
    event.respondWith(fetch(event.request))
    return
  }

  // Navegasyon (HTML pages) — Network first, offline.html kòm fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/offline.html'))
    )
    return
  }

  // Tout lòt resous — Cache first, rezo kòm fallback
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response
        return fetch(event.request)
          .then(networkResponse => {
            // Cache dinamikman JS/CSS/imaj yo
            if (
              networkResponse.ok &&
              (event.request.destination === 'script' ||
               event.request.destination === 'style' ||
               event.request.destination === 'image')
            ) {
              const responseClone = networkResponse.clone()
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone))
            }
            return networkResponse
          })
          .catch(() => {
            // Si imaj pa disponib offline
            if (event.request.destination === 'image') return new Response('')
            return caches.match('/offline.html')
          })
      })
  )
})
