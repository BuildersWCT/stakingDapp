// Service Worker for Crystal Stakes PWA

const CACHE_NAME = 'crystal-stakes-v1';
const STATIC_CACHE = 'crystal-stakes-static-v1';
const API_CACHE = 'crystal-stakes-api-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/pwa-192x192.svg',
  '/pwa-512x512.svg',
  '/vite.svg'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/staking-positions',
  '/api/rewards',
  '/api/protocol-stats'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful GET requests
            if (request.method === 'GET' && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Return cached version if available
            return cache.match(request);
          });
      })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          // Cache static assets
          if (request.destination === 'document' ||
              request.destination === 'script' ||
              request.destination === 'style') {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push received:', event);

  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'New staking update available!',
    icon: '/pwa-192x192.svg',
    badge: '/pwa-192x192.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Crystal Stakes',
      options
    )
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received.');

  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for transactions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'background-sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

// Function to sync pending transactions
async function syncTransactions() {
  try {
    // Get pending transactions from IndexedDB or local storage
    const pendingTransactions = await getPendingTransactions();

    for (const transaction of pendingTransactions) {
      try {
        await retryTransaction(transaction);
        // Remove from pending if successful
        await removePendingTransaction(transaction.id);
      } catch (error) {
        console.error('Failed to sync transaction:', transaction.id, error);
        // Could implement retry logic with exponential backoff
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Placeholder functions - implement based on your transaction system
async function getPendingTransactions() {
  // Implement: retrieve from IndexedDB
  return [];
}

async function retryTransaction(transaction) {
  // Implement: retry the transaction
  throw new Error('Not implemented');
}

async function removePendingTransaction(id) {
  // Implement: remove from storage
}