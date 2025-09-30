'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { db } from '@/lib/storage/indexed-db'
import { AuthProvider } from '@/lib/auth/auth-context'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: 1,
            retryDelay: 1000,
          },
        },
      })
  )

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
      // Refetch queries
      queryClient.refetchQueries()
    }

    const handleOffline = () => {
      console.log('Gone offline - using local storage')
      // Could show a toast notification here
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Performance monitoring
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).duration > 50) {
              console.warn('Long task detected:', entry)
            }
          }
        })
        observer.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        // Not all browsers support longtask
      }

      // Monitor paint timing
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log(`${entry.name}: ${entry.startTime}`)
          }
        })
        paintObserver.observe({ entryTypes: ['paint'] })
      } catch (e) {
        // Not all browsers support paint timing
      }
    }

    return () => {
      clearInterval(cleanupInterval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [queryClient])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}