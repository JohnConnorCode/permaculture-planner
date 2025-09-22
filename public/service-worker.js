const CACHE_NAME = 'permaculture-planner-v1'
const urlsToCache = [
  '/',
  '/wizard',
  '/demo',
  '/auth/login',
  '/auth/signup',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching files')
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return
  }

  // Network first strategy for API calls
  if (request.url.includes('/api/') || request.url.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request).then((response) => {
            if (response) {
              return response
            }
            // Return offline fallback for API calls
            return new Response(
              JSON.stringify({
                error: 'Offline',
                message: 'You are currently offline. Some features may not be available.'
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              }
            )
          })
        })
    )
    return
  }

  // Cache first strategy for static assets
  if (
    request.url.includes('/_next/static/') ||
    request.url.includes('/images/') ||
    request.url.includes('.css') ||
    request.url.includes('.js') ||
    request.url.includes('.woff')
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response
        }
        return fetch(request).then((response) => {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })
          return response
        })
      })
    )
    return
  }

  // Network first with cache fallback for HTML pages
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache)
        })
        return response
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          if (response) {
            return response
          }
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/').then((response) => {
              if (response) {
                return response
              }
              // Last resort offline page
              return new Response(
                `<!DOCTYPE html>
                <html>
                <head>
                  <title>Offline - Permaculture Planner</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body {
                      font-family: system-ui, -apple-system, sans-serif;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      min-height: 100vh;
                      margin: 0;
                      background: linear-gradient(to bottom, #f0fdf4, #ffffff);
                    }
                    .container {
                      text-align: center;
                      padding: 2rem;
                      max-width: 400px;
                    }
                    h1 { color: #166534; }
                    p { color: #4b5563; margin: 1rem 0; }
                    button {
                      background: #16a34a;
                      color: white;
                      border: none;
                      padding: 0.75rem 1.5rem;
                      border-radius: 0.375rem;
                      cursor: pointer;
                      font-size: 1rem;
                    }
                    button:hover { background: #15803d; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>You're Offline</h1>
                    <p>It looks like you've lost your internet connection. Some features may not be available.</p>
                    <p>Your work has been saved locally and will sync when you're back online.</p>
                    <button onclick="window.location.reload()">Try Again</button>
                  </div>
                </body>
                </html>`,
                {
                  headers: { 'Content-Type': 'text/html' },
                  status: 200
                }
              )
            })
          }
        })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-plans') {
    event.waitUntil(syncPlans())
  }
})

async function syncPlans() {
  try {
    // Get pending changes from IndexedDB
    const pendingChanges = await getPendingChanges()

    for (const change of pendingChanges) {
      try {
        const response = await fetch(change.url, {
          method: change.method,
          headers: change.headers,
          body: JSON.stringify(change.body)
        })

        if (response.ok) {
          await markChangeAsSynced(change.id)
        }
      } catch (error) {
        console.error('Failed to sync change:', change.id, error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Helper functions for IndexedDB
async function getPendingChanges() {
  // This would be implemented with actual IndexedDB
  return []
}

async function markChangeAsSynced(changeId) {
  // This would be implemented with actual IndexedDB
  return true
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  event.waitUntil(
    self.registration.showNotification('Permaculture Planner', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})