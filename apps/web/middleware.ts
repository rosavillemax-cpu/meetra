import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

export function inMemoryRateLimit(key: string, windowMs: number, maxRequests: number): boolean {
  const now = Date.now()
  const record = inMemoryStore.get(key)

  if (!record || record.resetAt < now) {
    inMemoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

setInterval(() => {
  const now = Date.now()
  for (const [key, record] of inMemoryStore.entries()) {
    if (record.resetAt < now) {
      inMemoryStore.delete(key)
    }
  }
}, 60000)

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  default: { windowMs: 60000, maxRequests: 100 },
  auth: { windowMs: 60000, maxRequests: 20 },
  booking: { windowMs: 60000, maxRequests: 30 },
}

export function getClientIdentifier(request: NextRequest): string {
  const sessionToken = request.cookies.get('authjs.session-token')?.value
    || request.cookies.get('__Secure-authjs.session-token')?.value

  let userId: string | null = null
  if (sessionToken) {
    try {
      const payload = JSON.parse(Buffer.from(sessionToken.split('.')[1], 'base64').toString())
      userId = payload.sub
    } catch {
      // Invalid token
    }
  }

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  return userId ? `user:${userId}` : `ip:${ip}`
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

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ limited: boolean; remaining: number; reset: number }> {
  if (redis) {
    try {
      const windowSeconds = Math.ceil(config.windowMs / 1000)
      const key = `ratelimit:${identifier}:${Math.floor(Date.now() / config.windowMs)}`

      const current = await redis.incr(key)

      if (current === 1) {
        await redis.expire(key, windowSeconds)
      }

      const ttl = await redis.ttl(key)
      const reset = Date.now() + (ttl > 0 ? ttl * 1000 : config.windowMs)

      if (current > config.maxRequests) {
        return { limited: true, remaining: 0, reset }
      }

      return {
        limited: false,
        remaining: Math.max(0, config.maxRequests - current),
        reset,
      }
    } catch (error) {
      console.error('Rate limit error:', error)
    }
  }

  const allowed = inMemoryRateLimit(identifier, config.windowMs, config.maxRequests)
  if (!allowed) {
    return { limited: true, remaining: 0, reset: Date.now() + config.windowMs }
  }
  return { limited: false, remaining: config.maxRequests - 1, reset: Date.now() + config.windowMs }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const identifier = getClientIdentifier(request)
  const config = getRateLimitConfig(pathname)
  const { limited, remaining, reset } = await rateLimit(identifier, config)

  const response = limited
    ? new NextResponse(
        JSON.stringify({ error: 'Too many requests', retryAfter: Math.ceil((reset - Date.now()) / 1000) }),
        { status: 429 }
      )
    : NextResponse.next()

  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())
  response.headers.set('Cache-Control', 'no-store')

  return response
}

export const config = {
  matcher: '/api/:path*',
}