// Rate limiting implementation for API routes
import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
  keyGenerator?: (req: NextRequest) => string // Custom key generator
  handler?: (req: NextRequest) => NextResponse // Custom rate limit handler
  message?: string // Custom error message
}

interface RateLimitStore {
  hits: number
  resetTime: number
}

class RateLimiter {
  private store: Map<string, RateLimitStore> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(private config: RateLimitConfig) {
    // Start cleanup interval to remove expired entries
    this.startCleanup()
  }

  private startCleanup() {
    if (this.cleanupInterval) return

    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      const entries = Array.from(this.store.entries())
      for (const [key, value] of entries) {
        if (value.resetTime <= now) {
          this.store.delete(key)
        }
      }
    }, this.config.windowMs)
  }

  private getKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req)
    }

    // Default key generator uses IP address + pathname
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    const pathname = new URL(req.url).pathname
    return `${ip}:${pathname}`
  }

  async check(req: NextRequest): Promise<NextResponse | null> {
    const key = this.getKey(req)
    const now = Date.now()

    let record = this.store.get(key)

    if (!record || record.resetTime <= now) {
      // Create new record or reset expired one
      record = {
        hits: 1,
        resetTime: now + this.config.windowMs
      }
      this.store.set(key, record)
      return null // Allow request
    }

    // Increment hit count
    record.hits++

    if (record.hits > this.config.maxRequests) {
      // Rate limit exceeded
      if (this.config.handler) {
        return this.config.handler(req)
      }

      return NextResponse.json(
        {
          error: this.config.message || 'Too many requests, please try again later',
          retryAfter: Math.ceil((record.resetTime - now) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((record.resetTime - now) / 1000)),
            'X-RateLimit-Limit': String(this.config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
          }
        }
      )
    }

    // Update store
    this.store.set(key, record)
    return null // Allow request
  }

  reset(key?: string) {
    if (key) {
      this.store.delete(key)
    } else {
      this.store.clear()
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.store.clear()
  }
}

// Rate limiter instances for different endpoints
const limiters = new Map<string, RateLimiter>()

// Factory function to create or get rate limiter
export function createRateLimiter(
  name: string,
  config: RateLimitConfig
): RateLimiter {
  let limiter = limiters.get(name)

  if (!limiter) {
    limiter = new RateLimiter(config)
    limiters.set(name, limiter)
  }

  return limiter
}

// Middleware factory for common rate limiting scenarios
export function rateLimit(config: Partial<RateLimitConfig> = {}) {
  const finalConfig: RateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute default
    maxRequests: 10, // 10 requests per minute default
    ...config
  }

  const limiter = new RateLimiter(finalConfig)

  return async function middleware(req: NextRequest) {
    return await limiter.check(req)
  }
}

// Preset configurations for different API endpoints
export const rateLimitPresets = {
  // Strict rate limiting for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later'
  },

  // Standard rate limiting for API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
    message: 'API rate limit exceeded, please slow down'
  },

  // Lenient rate limiting for read operations
  read: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'Too many requests, please try again shortly'
  },

  // Strict rate limiting for write operations
  write: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
    message: 'Too many write operations, please wait before trying again'
  },

  // AI generation endpoints (expensive operations)
  ai: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 5, // 5 requests per 5 minutes
    message: 'AI generation limit reached, please wait a few minutes'
  }
}

// IP-based rate limiter for DDoS protection
export function createIPRateLimiter() {
  return createRateLimiter('ip-limiter', {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute per IP
    keyGenerator: (req: NextRequest) => {
      const forwarded = req.headers.get('x-forwarded-for')
      return forwarded ? forwarded.split(',')[0] : 'unknown'
    },
    message: 'Too many requests from this IP address'
  })
}

// User-based rate limiter (requires authentication)
export function createUserRateLimiter() {
  return createRateLimiter('user-limiter', {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute per user
    keyGenerator: (req: NextRequest) => {
      // Extract user ID from JWT or session
      // This is a placeholder - implement based on your auth system
      const authHeader = req.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        // Parse JWT and extract user ID
        return `user:${authHeader.slice(7).split('.')[1]}` // Simplified
      }
      return 'anonymous'
    },
    message: 'User rate limit exceeded'
  })
}

// Endpoint-specific rate limiter
export function createEndpointRateLimiter(endpoint: string, config?: Partial<RateLimitConfig>) {
  return createRateLimiter(`endpoint:${endpoint}`, {
    windowMs: 60 * 1000,
    maxRequests: 20,
    ...config,
    keyGenerator: (req: NextRequest) => {
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return `${ip}:${endpoint}`
    }
  })
}

// Sliding window rate limiter for more accurate rate limiting
export class SlidingWindowRateLimiter {
  private requests: Map<string, number[]> = new Map()

  constructor(
    private windowMs: number,
    private maxRequests: number
  ) {}

  check(key: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Get or create request timestamps array
    let timestamps = this.requests.get(key) || []

    // Remove expired timestamps
    timestamps = timestamps.filter(t => t > windowStart)

    // Check if limit exceeded
    if (timestamps.length >= this.maxRequests) {
      return false // Rate limit exceeded
    }

    // Add current timestamp
    timestamps.push(now)
    this.requests.set(key, timestamps)

    return true // Allow request
  }

  reset(key: string) {
    this.requests.delete(key)
  }

  cleanup() {
    const now = Date.now()
    const windowStart = now - this.windowMs

    const entries = Array.from(this.requests.entries())
    for (const [key, timestamps] of entries) {
      const validTimestamps = timestamps.filter(t => t > windowStart)
      if (validTimestamps.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, validTimestamps)
      }
    }
  }
}