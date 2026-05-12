import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { inMemoryRateLimit, getClientIdentifier, inMemoryStore } from '../middleware'

function createMockToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = 'mock-signature'
  return `${header}.${body}.${signature}`
}

describe('Rate Limiting', () => {
  beforeEach(() => {
    inMemoryStore.clear()
  })

  afterEach(() => {
    inMemoryStore.clear()
  })

  describe('In-memory rate limiter blocks after maxRequests', () => {
    it('should block requests exceeding maxRequests in a window', () => {
      const windowMs = 60000
      const maxRequests = 3
      const key = 'test-key'

      for (let i = 0; i < maxRequests; i++) {
        expect(inMemoryRateLimit(key, windowMs, maxRequests)).toBe(true)
      }

      expect(inMemoryRateLimit(key, windowMs, maxRequests)).toBe(false)
    })

    it('should allow requests after window expires', async () => {
      const windowMs = 100
      const maxRequests = 2
      const key = 'test-key-expiry'

      expect(inMemoryRateLimit(key, windowMs, maxRequests)).toBe(true)
      expect(inMemoryRateLimit(key, windowMs, maxRequests)).toBe(true)
      expect(inMemoryRateLimit(key, windowMs, maxRequests)).toBe(false)

      await new Promise(resolve => setTimeout(resolve, 150))

      expect(inMemoryRateLimit(key, windowMs, maxRequests)).toBe(true)
    })
  })

  describe('Auth-aware client identifier', () => {
    it('should extract userId from authjs.session-token', () => {
      const userId = 'user_abc123'
      const token = createMockToken({ sub: userId, email: 'test@example.com' })

      const request = {
        cookies: {
          get: (name: string) => {
            if (name === 'authjs.session-token') return { value: token }
            return undefined
          },
        },
        headers: {
          get: () => null,
        },
      } as unknown as NextRequest

      const identifier = getClientIdentifier(request)
      expect(identifier).toBe(`user:${userId}`)
    })

    it('should extract userId from __Secure-authjs.session-token', () => {
      const userId = 'user_secure123'
      const token = createMockToken({ sub: userId })

      const request = {
        cookies: {
          get: (name: string) => {
            if (name === '__Secure-authjs.session-token') return { value: token }
            return undefined
          },
        },
        headers: {
          get: () => null,
        },
      } as unknown as NextRequest

      const identifier = getClientIdentifier(request)
      expect(identifier).toBe(`user:${userId}`)
    })

    it('should fall back to IP when no session token', () => {
      const request = {
        cookies: {
          get: () => undefined,
        },
        headers: {
          get: (name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.100, 10.0.0.1'
            return null
          },
        },
      } as unknown as NextRequest

      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('ip:192.168.1.100')
    })

    it('should fall back to IP when session token is invalid', () => {
      const request = {
        cookies: {
          get: (name: string) => {
            if (name === 'authjs.session-token') return { value: 'invalid-token' }
            return undefined
          },
        },
        headers: {
          get: () => null,
        },
      } as unknown as NextRequest

      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('ip:unknown')
    })
  })
})
