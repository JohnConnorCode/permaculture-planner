'use client'

import { useEffect } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { db } from '@/lib/storage/indexed-db'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    // Initialize IndexedDB
    db.init().catch(console.error)

    // Clean up expired cache periodically
    const cleanupInterval = setInterval(() => {
      db.cleanupCache().catch(console.error)
    }, 3600000) // Every hour

    // Request persistent storage
    if ('storage' in navigator && 'persist' in navigator.storage) {
      navigator.storage.persist().then((persistent) => {
        if (persistent) {
          console.log('Storage will not be cleared except by explicit user action')
        } else {
          console.log('Storage may be cleared under storage pressure')
        }
      })
    }

    // Handle online/offline events
    const handleOnline = () => {
      console.log('Back online - syncing pending changes')
      // Trigger background sync
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          if ('sync' in registration) {
            (registration as any).sync.register('sync-plans')
          }
        })
      }
    }

    const handleOffline = () => {
      console.log('Gone offline - using local storage')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(cleanupInterval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}