# Phase 1: Security & Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix critical security and stability issues: access control gaps, calendar event deletion on cancellation, OAuth token auto-refresh, and rate limiting.

**Architecture:**

1. **Access Control** — Add `auth()` session check to all protected API routes. Host can only access their own bookings/event-types. Guests can still create bookings (POST without auth) but cannot list/modify.
2. **Cancel Delete** — When a booking is cancelled, fetch stored `googleEventId`/`outlookEventId` and call the respective delete functions before updating booking status.
3. **Token Refresh** — Before any calendar write operation, check if the token is expired. If expired, call refresh function and update the stored tokens in DB.
4. **Rate Limiting** — Make rate limiting auth-aware. If user is logged in, rate limit per userId. If Redis unavailable, fall back to in-memory sliding window (not IP-only).

**Tech Stack:** Next.js API Routes, Prisma, NextAuth.js v5, Upstash Redis

---

## Task 1: Access Control — Fix Booking API

**Files:**
- Modify: `apps/web/app/api/bookings/route.ts`
- Modify: `apps/web/app/api/bookings/[id]/route.ts`
- Modify: `apps/web/app/api/event-types/route.ts`
- Test: `apps/web/__tests__/access-control.test.ts`

**Notes:**
- `POST /api/bookings` is guest-facing — no auth required (correct)
- `GET /api/bookings` must be restricted to session users — only return their own bookings
- `GET /api/bookings/[id]` must verify the requester is the host or has the cancelToken
- `POST /api/event-types` must use session userId, not body userId

---

### Step 1.1: Write access control tests

- [ ] **Step 1.1: Write access control tests**

Create `apps/web/__tests__/access-control.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { POST as guestBookingPOST, GET as bookingsGET } from '@/app/api/bookings/route'
import { GET as bookingGET, DELETE as bookingDELETE } from '@/app/api/bookings/[id]/route'
import { POST as eventTypesPOST } from '@/app/api/event-types/route'

// Mock auth - simulate authenticated user
vi.mock('@/lib/auth', () => ({
  auth: vi.fn()
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    booking: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    eventType: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    }
  }
}))

describe('Access Control', () => {
  it('GET /api/bookings returns only requesters bookings', async () => {
    // TODO: write test
  })

  it('GET /api/bookings/[id] returns 403 for non-owner without cancelToken', async () => {
    // TODO: write test
  })

  it('POST /api/event-types uses session userId, not body userId', async () => {
    // TODO: write test
  })
})
```

- [ ] **Step 1.2: Run test to verify it fails**

Run: `cd /Users/alperatigan/meetra && npm run test -- --run apps/web/__tests__/access-control.test.ts 2>&1 | head -30`
Expected: FAIL (file not found or tests fail)

---

### Step 1.2: Fix GET /api/bookings access control

- [ ] **Step 1: Read current implementation**

Read `apps/web/app/api/bookings/route.ts` lines 1-120

- [ ] **Step 2: Add auth check to GET handler**

Locate the `GET` function (around line 67) and add session check:

```typescript
export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ... existing code that reads hostId from params/search
  const hostId = searchParams.get('hostId')
```

Then after fetching `hostId`, add:
```typescript
if (hostId !== session.user.id) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

Or if hostId is not provided (list own bookings):
```typescript
const bookings = await prisma.booking.findMany({
  where: { hostId: session.user.id }  // Force filter to session user
})
```

- [ ] **Step 3: Verify GET /api/bookings/[id] has proper authorization**

Read `apps/web/app/api/bookings/[id]/route.ts` lines 1-50. The current code at lines 8-26 does:
```typescript
const session = await auth()
const isHost = session?.user?.id === booking.hostId
if (!isHost && booking.cancelToken !== token) {
  return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
}
```

This looks correct — but verify it handles the case where `session` is null.

- [ ] **Step 4: Fix POST /api/event-types to use session userId**

Read `apps/web/app/api/event-types/route.ts` lines 28-65. The POST handler extracts `userId` from request body. Replace with session userId:

```typescript
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const validation = EventTypeSchema.safeParse(body)
  // ...
  // Remove userId from destructuring or ignore body userId:
  const { slug, title, description, durationMin, bufferBefore, bufferAfter, color } = validation.data
  
  const eventType = await prisma.eventType.create({
    data: {
      userId: session.user.id,  // Use session userId, not body userId
      slug, title, description, durationMin, bufferBefore, bufferAfter, color
    }
  })
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/api/bookings/route.ts apps/web/app/api/bookings/\[id\]/route.ts apps/web/app/api/event-types/route.ts
git commit -m "feat(security): add session-based access control to booking and event-type APIs"
```

---

## Task 2: Cancel Delete — Remove Calendar Events on Booking Cancellation

**Files:**
- Modify: `apps/web/app/api/bookings/[id]/route.ts`
- Test: `apps/web/__tests__/booking-cancel.test.ts`

**Note:** The Booking model has `googleEventId` and `outlookEventId` fields. When cancelling a booking, we must:
1. Fetch the booking with these event IDs
2. Call `deleteGoogleCalendarEvent(hostId, googleEventId)` if `googleEventId` exists
3. Call `deleteOutlookCalendarEvent(hostId, outlookEventId)` if `outlookEventId` exists
4. Then update booking status to 'cancelled'

---

### Step 2.1: Write cancel delete tests

- [ ] **Step 1: Create booking cancel test with calendar event deletion**

Create `apps/web/__tests__/booking-cancel.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { DELETE as bookingDELETE } from '@/app/api/bookings/[id]/route'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    booking: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    calendarIntegration: {
      findMany: vi.fn(),
    }
  }
}))

vi.mock('@/lib/google-calendar', () => ({
  deleteGoogleCalendarEvent: vi.fn().mockResolvedValue(true),
}))

vi.mock('@/lib/outlook-calendar', () => ({
  deleteOutlookCalendarEvent: vi.fn().mockResolvedValue(true),
}))

describe('Booking Cancellation', () => {
  it('deletes google calendar event when booking is cancelled', async () => {
    // TODO: write test
  })

  it('deletes outlook calendar event when booking is cancelled', async () => {
    // TODO: write test
  })
})
```

- [ ] **Step 2: Run test**

Run: `npm run test -- --run apps/web/__tests__/booking-cancel.test.ts`

---

### Step 2.2: Implement calendar event deletion in cancel flow

- [ ] **Step 1: Read the current DELETE handler**

Read `apps/web/app/api/bookings/[id]/route.ts` lines 59-73

- [ ] **Step 2: Add calendar deletion before status update**

In the DELETE handler, after the auth check but before updating booking status:

```typescript
// Fetch full booking with event IDs
const booking = await prisma.booking.findUnique({
  where: { id },
  include: { 
    eventType: { include: { user: true } } 
  }
})

if (!booking) {
  return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
}

// Delete Google calendar event if exists
if (booking.googleEventId) {
  try {
    await deleteGoogleCalendarEvent(booking.hostId, booking.googleEventId)
  } catch (err) {
    console.error('Failed to delete Google calendar event:', err)
  }
}

// Delete Outlook calendar event if exists
if (booking.outlookEventId) {
  try {
    await deleteOutlookCalendarEvent(booking.hostId, booking.outlookEventId)
  } catch (err) {
    console.error('Failed to delete Outlook calendar event:', err)
  }
}

const updated = await prisma.booking.update({
  where: { id },
  data: { status: 'cancelled' }
})
```

- [ ] **Step 3: Verify imports are present**

Check that `deleteGoogleCalendarEvent` and `deleteOutlookCalendarEvent` are imported at the top of the file. If not, add:

```typescript
import { deleteGoogleCalendarEvent } from '@/lib/google-calendar'
import { deleteOutlookCalendarEvent } from '@/lib/outlook-calendar'
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/api/bookings/\[id\]/route.ts
git commit -m "feat(calendar): delete calendar events when booking is cancelled"
```

---

## Task 3: OAuth Token Auto-Refresh

**Files:**
- Modify: `apps/web/src/lib/google-calendar.ts`
- Modify: `apps/web/src/lib/outlook-calendar.ts`
- Test: `apps/web/__tests__/token-refresh.test.ts`

**Architecture:** Before any write operation (create event, delete event), check if `expiresAt` is in the past. If expired, refresh the token and update the DB record, then proceed.

---

### Step 3.1: Write token refresh tests

- [ ] **Step 1: Create token refresh tests**

Create `apps/web/__tests__/token-refresh.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'

// Test that expired tokens are refreshed before calendar operations
describe('Token Refresh', () => {
  it('refreshes expired Google token before creating calendar event', async () => {
    // TODO: write test
  })
  
  it('refreshes expired Outlook token before creating calendar event', async () => {
    // TODO: write test
  })
})
```

---

### Step 3.2: Implement auto-refresh in Google Calendar lib

- [ ] **Step 1: Read google-calendar.ts create function**

Read `apps/web/src/lib/google-calendar.ts` lines 60-134 (createGoogleCalendarEvent function)

- [ ] **Step 2: Add token expiry check and refresh in createGoogleCalendarEvent**

Find the `createGoogleCalendarEvent` function. At the start of the function (after getting integration), add:

```typescript
export async function createGoogleCalendarEvent(params: CreateGoogleEventParams): Promise<string | null> {
  const integration = await getGoogleCalendarIntegration(params.userId)
  if (!integration || !integration.isActive) {
    return null
  }

  // Check if token is expired and refresh if needed
  if (integration.expiresAt && integration.expiresAt < new Date()) {
    try {
      const credentials = await refreshGoogleToken(integration.refreshToken)
      await prisma.calendarIntegration.update({
        where: { id: integration.id },
        data: {
          accessToken: credentials.access_token,
          refreshToken: credentials.refresh_token || integration.refreshToken,
          expiresAt: new Date(credentials.expiry_date),
        }
      })
      oauth2Client.setCredentials({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token || integration.refreshToken
      })
    } catch (err) {
      console.error('Failed to refresh Google token:', err)
      throw err
    }
  } else {
    oauth2Client.setCredentials({
      access_token: integration.accessToken,
      refresh_token: integration.refreshToken
    })
  }
  
  // ... rest of existing function
}
```

- [ ] **Step 3: Apply same pattern to deleteGoogleCalendarEvent**

Read `apps/web/src/lib/google-calendar.ts` lines 136-162 (deleteGoogleCalendarEvent)

Add the same token refresh check at the start of this function.

- [ ] **Step 4: Apply same pattern to Outlook**

Read `apps/web/src/lib/outlook-calendar.ts` and apply the same pattern to `createOutlookCalendarEvent` (lines 143-182) and `deleteOutlookCalendarEvent` (lines 185-203).

The Outlook refresh pattern differs slightly — update stored tokens in DB after refresh:

```typescript
if (integration.expiresAt && integration.expiresAt < new Date()) {
  try {
    const newTokens = await refreshOutlookToken(integration.refreshToken)
    await prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        expiresAt: new Date(newTokens.expiresAt),
      }
    })
    accessToken = newTokens.accessToken
  } catch (err) {
    console.error('Failed to refresh Outlook token:', err)
    throw err
  }
} else {
  accessToken = integration.accessToken
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/google-calendar.ts apps/web/src/lib/outlook-calendar.ts
git commit -m "feat(calendar): auto-refresh expired OAuth tokens before calendar operations"
```

---

## Task 4: Rate Limiting — Auth-Aware with Graceful Fallback

**Files:**
- Modify: `apps/web/middleware.ts`
- Test: `apps/web/__tests__/rate-limit.test.ts`

**Architecture:**
- When Redis is available: use Upstash with userId-based key (falls back to IP if no session)
- When Redis is unavailable: use in-memory sliding window rate limiter (per userId or IP)
- Per-route configurable limits: `default`, `auth`, `booking`

---

### Step 4.1: Write rate limiting tests

- [ ] **Step 1: Create rate limit tests**

Create `apps/web/__tests__/rate-limit.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

describe('Rate Limiting', () => {
  it('blocks requests over limit', async () => {
    // TODO: write test
  })
  
  it('allows requests under limit', async () => {
    // TODO: write test
  })
})
```

---

### Step 4.2: Implement in-memory fallback + auth-aware rate limiting

- [ ] **Step 1: Read current middleware.ts**

Read `apps/web/middleware.ts` full file

- [ ] **Step 2: Add in-memory fallback rate limiter**

Add at the top of `middleware.ts` (before the existing code):

```typescript
// In-memory fallback rate limiter (sliding window)
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

function inMemoryRateLimit(key: string, windowMs: number, maxRequests: number): boolean {
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

// Cleanup old entries every 60 seconds
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of inMemoryStore.entries()) {
    if (record.resetAt < now) {
      inMemoryStore.delete(key)
    }
  }
}, 60000)
```

- [ ] **Step 3: Update getClientIdentifier to be auth-aware**

Replace the `getClientIdentifier` function:

```typescript
function getClientIdentifier(request: NextRequest): string {
  // Try to get userId from session (JWT token in cookie)
  // Note: In middleware we can't use auth() directly - we need to decode the JWT
  const sessionToken = request.cookies.get('authjs.session-token')?.value 
    || request.cookies.get('__Secure-authjs.session-token')?.value
  
  let userId: string | null = null
  if (sessionToken) {
    try {
      // Decode JWT payload (base64)
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
```

- [ ] **Step 4: Update rate limit check to use in-memory fallback**

Modify the rate limit check to fallback to in-memory when Redis is unavailable:

```typescript
export async function middleware(request: NextRequest) {
  const ip = getClientIdentifier(request)
  const pathname = request.nextUrl.pathname
  
  const config = RATE_LIMIT_CONFIGS[pathname] || RATE_LIMIT_CONFIGS['default']
  const { windowMs, maxRequests } = config
  
  if (redis) {
    // Upstash logic (existing)
    const result = await redis.incr(ip)
    // ... existing Upstash code
  } else {
    // In-memory fallback
    if (!inMemoryRateLimit(ip, windowMs, maxRequests)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(windowMs / 1000)) } }
      )
    }
  }
  
  // Note: With in-memory store, we can't track per-window perfectly across instances
  // This is a reasonable fallback for single-instance dev/staging
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/middleware.ts
git commit -m "feat(rate-limit): add auth-aware rate limiting with in-memory fallback"
```

---

## Verification Steps (After Phase 1)

After completing all tasks, run:

```bash
# Type check
npm run check-types

# Lint
npm run lint

# Unit tests
npm run test -- --run

# E2E tests (if configured)
npm run e2e
```

---

## Self-Review Checklist

- [ ] All 4 tasks completed and committed separately
- [ ] Each task has tests that fail before and pass after implementation
- [ ] No placeholder code (TODO, TBD) in any implementation
- [ ] Type consistency verified across all modified files
- [ ] Session auth flow unchanged for guest booking creation
- [ ] Rate limiting fallback doesn't crash when Redis env vars are missing
- [ ] Calendar token refresh updates DB record with new tokens
