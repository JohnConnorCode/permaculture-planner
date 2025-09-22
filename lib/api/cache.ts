// API Response caching utility
import { NextRequest, NextResponse } from 'next/server'

interface CacheEntry {
  data: any
  timestamp: number
  etag: string
  headers?: Record<string, string>
}

interface CacheConfig {
  ttl?: number // Time to live in milliseconds
  keyGenerator?: (req: NextRequest) => string
  shouldCache?: (req: NextRequest, res: any) => boolean
  varyBy?: string[] // Headers to vary cache by
  staleWhileRevalidate?: number // Serve stale content while revalidating
}

// In-memory cache store
class CacheStore {
  private cache: Map<string, CacheEntry> = new Map()
  private revalidating: Set<string> = new Set()

  set(key: string, value: CacheEntry) {
    this.cache.set(key, value)
  }

  get(key: string): CacheEntry | undefined {
    return this.cache.get(key)
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  isRevalidating(key: string): boolean {
    return this.revalidating.has(key)
  }

  setRevalidating(key: string, status: boolean) {
    if (status) {
      this.revalidating.add(key)
    } else {
      this.revalidating.delete(key)
    }
  }

  cleanup(ttl: number) {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache store
const globalCache = new CacheStore()

// Generate ETag from data
function generateETag(data: any): string {
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `"${Math.abs(hash).toString(36)}"`
}

// Cache middleware factory
export function createCache(config: CacheConfig = {}) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    keyGenerator,
    shouldCache = () => true,
    varyBy = [],
    staleWhileRevalidate = 0
  } = config

  return {
    async get(req: NextRequest): Promise<NextResponse | null> {
      const key = keyGenerator ? keyGenerator(req) : req.url

      // Add vary headers to key
      const varyKey = varyBy.length > 0
        ? key + ':' + varyBy.map(h => req.headers.get(h) || '').join(':')
        : key

      const cached = globalCache.get(varyKey)

      if (!cached) {
        return null // Cache miss
      }

      const age = Date.now() - cached.timestamp
      const isStale = age > ttl

      // Check if client has cached version (ETag)
      const ifNoneMatch = req.headers.get('if-none-match')
      if (ifNoneMatch === cached.etag) {
        return new NextResponse(null, {
          status: 304,
          headers: {
            'ETag': cached.etag,
            'Cache-Control': `max-age=${Math.round(ttl / 1000)}`,
            'X-Cache': 'HIT'
          }
        })
      }

      // Serve stale content while revalidating
      if (isStale && staleWhileRevalidate > 0 && age < ttl + staleWhileRevalidate) {
        if (!globalCache.isRevalidating(varyKey)) {
          // Trigger background revalidation
          globalCache.setRevalidating(varyKey, true)
          return null // Let the request proceed to refresh cache
        }

        // Serve stale content
        return NextResponse.json(cached.data, {
          headers: {
            ...cached.headers,
            'ETag': cached.etag,
            'Cache-Control': `max-age=${Math.round(ttl / 1000)}, stale-while-revalidate=${Math.round(staleWhileRevalidate / 1000)}`,
            'X-Cache': 'STALE',
            'Age': String(Math.round(age / 1000))
          }
        })
      }

      if (isStale) {
        return null // Cache expired, need fresh data
      }

      // Serve from cache
      return NextResponse.json(cached.data, {
        headers: {
          ...cached.headers,
          'ETag': cached.etag,
          'Cache-Control': `max-age=${Math.round((ttl - age) / 1000)}`,
          'X-Cache': 'HIT',
          'Age': String(Math.round(age / 1000))
        }
      })
    },

    set(req: NextRequest, data: any, headers?: Record<string, string>) {
      if (!shouldCache(req, data)) {
        return
      }

      const key = keyGenerator ? keyGenerator(req) : req.url
      const varyKey = varyBy.length > 0
        ? key + ':' + varyBy.map(h => req.headers.get(h) || '').join(':')
        : key

      const etag = generateETag(data)
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        etag,
        headers
      }

      globalCache.set(varyKey, entry)
      globalCache.setRevalidating(varyKey, false)
    },

    invalidate(pattern?: string | RegExp) {
      if (!pattern) {
        globalCache.clear()
        return
      }

      if (typeof pattern === 'string') {
        globalCache.delete(pattern)
      } else {
        // Invalidate by pattern
        const keys = Array.from((globalCache as any).cache.keys()) as string[]
        for (const key of keys) {
          if (pattern.test(key)) {
            globalCache.delete(key)
          }
        }
      }
    }
  }
}

// Cache presets for different scenarios
export const cachePresets = {
  // Short-lived cache for frequently changing data
  short: {
    ttl: 60 * 1000, // 1 minute
  },

  // Medium cache for semi-static data
  medium: {
    ttl: 5 * 60 * 1000, // 5 minutes
  },

  // Long cache for static data
  long: {
    ttl: 60 * 60 * 1000, // 1 hour
  },

  // Cache with stale-while-revalidate
  swr: {
    ttl: 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate: 60 * 1000, // 1 minute
  },

  // User-specific cache
  user: {
    ttl: 10 * 60 * 1000, // 10 minutes
    keyGenerator: (req: NextRequest) => {
      const authHeader = req.headers.get('authorization')
      const userId = authHeader ? authHeader.split(' ')[1] : 'anonymous'
      return `${req.url}:${userId}`
    }
  },

  // Query-based cache
  query: {
    ttl: 5 * 60 * 1000,
    keyGenerator: (req: NextRequest) => {
      const url = new URL(req.url)
      return `${url.pathname}?${url.searchParams.toString()}`
    }
  }
}

// Response cache wrapper for easier use in API routes
export async function withCache<T>(
  req: NextRequest,
  config: CacheConfig,
  handler: () => Promise<T>
): Promise<NextResponse> {
  const cache = createCache(config)

  // Check cache first
  const cached = await cache.get(req)
  if (cached) {
    return cached
  }

  // Execute handler
  const data = await handler()

  // Cache the response
  cache.set(req, data)

  // Return response
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `max-age=${Math.round((config.ttl || 300000) / 1000)}`,
      'X-Cache': 'MISS'
    }
  })
}

// Cache invalidation utilities
export const cacheInvalidation = {
  // Invalidate all caches for a specific user
  invalidateUser(userId: string) {
    const entries = Array.from((globalCache as any).cache.entries()) as [string, any][]
    for (const [key, _] of entries) {
      if (key.includes(`:${userId}`)) {
        globalCache.delete(key)
      }
    }
  },

  // Invalidate all caches for a specific resource
  invalidateResource(resourceType: string, resourceId?: string) {
    const pattern = resourceId
      ? new RegExp(`/${resourceType}/${resourceId}`)
      : new RegExp(`/${resourceType}/`)

    const entries = Array.from((globalCache as any).cache.entries()) as [string, any][]
    for (const [key, _] of entries) {
      if (pattern.test(key)) {
        globalCache.delete(key)
      }
    }
  },

  // Invalidate all API caches
  invalidateAll() {
    globalCache.clear()
  }
}

// Cleanup expired cache entries periodically
setInterval(() => {
  globalCache.cleanup(24 * 60 * 60 * 1000) // Clean entries older than 24 hours
}, 60 * 60 * 1000) // Run every hour

// Export cache store for testing
export { globalCache }