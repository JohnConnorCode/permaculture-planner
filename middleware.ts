import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createRateLimiter, rateLimitPresets, createIPRateLimiter } from '@/lib/api/rate-limiter'
import { createCache, cachePresets } from '@/lib/api/cache'

// Initialize rate limiters
const ipRateLimiter = createIPRateLimiter()
const authRateLimiter = createRateLimiter('auth', rateLimitPresets.auth)
const apiRateLimiter = createRateLimiter('api', rateLimitPresets.api)
const aiRateLimiter = createRateLimiter('ai', rateLimitPresets.ai)

// Initialize caches
const apiCache = createCache(cachePresets.medium)
const userCache = createCache(cachePresets.user)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Apply IP-based rate limiting to all requests
  const ipLimitResponse = await ipRateLimiter.check(request)
  if (ipLimitResponse) {
    return ipLimitResponse
  }

  // Authentication endpoints rate limiting
  if (pathname.startsWith('/api/auth')) {
    const authLimitResponse = await authRateLimiter.check(request)
    if (authLimitResponse) {
      return authLimitResponse
    }
  }

  // AI generation endpoints rate limiting
  if (pathname.startsWith('/api/generate') || pathname.startsWith('/api/ai')) {
    const aiLimitResponse = await aiRateLimiter.check(request)
    if (aiLimitResponse) {
      return aiLimitResponse
    }
  }

  // General API endpoints rate limiting and caching
  if (pathname.startsWith('/api')) {
    const apiLimitResponse = await apiRateLimiter.check(request)
    if (apiLimitResponse) {
      return apiLimitResponse
    }

    // Apply caching for GET requests
    if (request.method === 'GET') {
      const isUserEndpoint = pathname.includes('/user/') || pathname.includes('/profile/')
      const cache = isUserEndpoint ? userCache : apiCache
      const cachedResponse = await cache.get(request)
      if (cachedResponse) {
        return cachedResponse
      }
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  if (!session && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/plans') ||
    request.nextUrl.pathname.startsWith('/editor') ||
    request.nextUrl.pathname.startsWith('/api/plans')
  )) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  if (session && (
    request.nextUrl.pathname === '/auth/login' ||
    request.nextUrl.pathname === '/auth/signup'
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Add rate limit info headers for API routes
  if (pathname.startsWith('/api')) {
    const limits = pathname.startsWith('/api/auth')
      ? rateLimitPresets.auth
      : pathname.startsWith('/api/ai')
      ? rateLimitPresets.ai
      : rateLimitPresets.api

    response.headers.set('X-RateLimit-Limit', String(limits.maxRequests))
    response.headers.set('X-RateLimit-Window', String(limits.windowMs / 1000) + 's')
  }

  // CORS headers for API routes
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://permaculture-planner.vercel.app'
    ]

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}