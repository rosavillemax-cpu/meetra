import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  default: { windowMs: 60000, maxRequests: 100 },
  auth: { windowMs: 60000, maxRequests: 20 },
  booking: { windowMs: 60000, maxRequests: 30 },
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return ip
}

function getRateLimitConfig(pathname: string): RateLimitConfig {
  if (pathname.includes('/api/auth')) {
    return RATE_LIMIT_CONFIGS.auth
  }
  if (pathname.includes('/api/bookings')) {
    return RATE_LIMIT_CONFIGS.booking
  }
  return RATE_LIMIT_CONFIGS.default
}

function isRateLimited(identifier: string, config: RateLimitConfig): { limited: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs
    rateLimitStore.set(identifier, { count: 1, resetAt })
    return { limited: false, remaining: config.maxRequests - 1, resetIn: config.windowMs }
  }

  if (entry.count >= config.maxRequests) {
    const resetIn = entry.resetAt - now
    return { limited: true, remaining: 0, resetIn }
  }

  entry.count++
  return { limited: false, remaining: config.maxRequests - entry.count, resetIn: entry.resetAt - now }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const identifier = getClientIdentifier(request)
  const config = getRateLimitConfig(pathname)
  const { limited, remaining, resetIn } = isRateLimited(identifier, config)

  const response = limited
    ? new NextResponse(
        JSON.stringify({ error: 'Too many requests', retryAfter: Math.ceil(resetIn / 1000) }),
        { status: 429 }
      )
    : NextResponse.next()

  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', resetIn.toString())
  response.headers.set('Cache-Control', 'no-store')

  return response
}

export const config = {
  matcher: '/api/:path*',
}