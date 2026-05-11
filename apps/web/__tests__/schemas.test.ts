import { describe, it, expect } from 'vitest'
import { BookingSchema, EventTypeSchema, AvailabilitySchema, ConflictCheckSchema } from '@/lib/schemas'

describe('BookingSchema', () => {
  it('validates a valid booking', () => {
    const validBooking = {
      eventTypeId: 'evt_123',
      guestEmail: 'guest@example.com',
      guestName: 'John Doe',
      startAt: '2024-12-20T10:00:00Z',
      endAt: '2024-12-20T10:30:00Z',
    }
    const result = BookingSchema.safeParse(validBooking)
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const invalidBooking = {
      eventTypeId: 'evt_123',
      guestEmail: 'not-an-email',
      guestName: 'John Doe',
      startAt: '2024-12-20T10:00:00Z',
      endAt: '2024-12-20T10:30:00Z',
    }
    const result = BookingSchema.safeParse(invalidBooking)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('guestEmail')
    }
  })

  it('rejects empty guest name', () => {
    const invalidBooking = {
      eventTypeId: 'evt_123',
      guestEmail: 'guest@example.com',
      guestName: '',
      startAt: '2024-12-20T10:00:00Z',
      endAt: '2024-12-20T10:30:00Z',
    }
    const result = BookingSchema.safeParse(invalidBooking)
    expect(result.success).toBe(false)
  })

  it('rejects end time before start time', () => {
    const invalidBooking = {
      eventTypeId: 'evt_123',
      guestEmail: 'guest@example.com',
      guestName: 'John Doe',
      startAt: '2024-12-20T11:00:00Z',
      endAt: '2024-12-20T10:00:00Z',
    }
    const result = BookingSchema.safeParse(invalidBooking)
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const invalidBooking = {
      eventTypeId: 'evt_123',
    }
    const result = BookingSchema.safeParse(invalidBooking)
    expect(result.success).toBe(false)
  })
})

describe('EventTypeSchema', () => {
  it('validates a valid event type', () => {
    const validEventType = {
      userId: 'user_123',
      slug: 'coffee-chat',
      title: 'Coffee Chat',
      description: 'A quick chat over coffee',
      durationMin: 30,
      color: '#FF5733',
    }
    const result = EventTypeSchema.safeParse(validEventType)
    expect(result.success).toBe(true)
  })

  it('rejects invalid slug format', () => {
    const invalidEventType = {
      userId: 'user_123',
      slug: 'Coffee Chat!', // spaces and special chars not allowed
      title: 'Coffee Chat',
    }
    const result = EventTypeSchema.safeParse(invalidEventType)
    expect(result.success).toBe(false)
  })

  it('rejects invalid color format', () => {
    const invalidEventType = {
      userId: 'user_123',
      slug: 'coffee-chat',
      title: 'Coffee Chat',
      color: 'red', // must be hex with #
    }
    const result = EventTypeSchema.safeParse(invalidEventType)
    expect(result.success).toBe(false)
  })

  it('accepts valid hex color', () => {
    const validEventType = {
      userId: 'user_123',
      slug: 'coffee-chat',
      title: 'Coffee Chat',
      color: '#000000',
    }
    const result = EventTypeSchema.safeParse(validEventType)
    expect(result.success).toBe(true)
  })

  it('rejects duration less than 5 minutes', () => {
    const invalidEventType = {
      userId: 'user_123',
      slug: 'quick-chat',
      title: 'Quick Chat',
      durationMin: 3,
    }
    const result = EventTypeSchema.safeParse(invalidEventType)
    expect(result.success).toBe(false)
  })

  it('rejects duration more than 480 minutes', () => {
    const invalidEventType = {
      userId: 'user_123',
      slug: 'long-meeting',
      title: 'Long Meeting',
      durationMin: 500,
    }
    const result = EventTypeSchema.safeParse(invalidEventType)
    expect(result.success).toBe(false)
  })
})

describe('AvailabilitySchema', () => {
  it('validates a valid availability rule', () => {
    const validRule = {
      userId: 'user_123',
      weekday: 1, // Monday
      startTime: '09:00',
      endTime: '17:00',
    }
    const result = AvailabilitySchema.safeParse(validRule)
    expect(result.success).toBe(true)
  })

  it('rejects invalid weekday', () => {
    const invalidRule = {
      userId: 'user_123',
      weekday: 7, // should be 0-6
      startTime: '09:00',
      endTime: '17:00',
    }
    const result = AvailabilitySchema.safeParse(invalidRule)
    expect(result.success).toBe(false)
  })

  it('rejects invalid time format', () => {
    const invalidRule = {
      userId: 'user_123',
      weekday: 1,
      startTime: '9am', // should be HH:MM
      endTime: '17:00',
    }
    const result = AvailabilitySchema.safeParse(invalidRule)
    expect(result.success).toBe(false)
  })

  it('rejects invalid minute in time', () => {
    const invalidRule = {
      userId: 'user_123',
      weekday: 1,
      startTime: '09:99',
      endTime: '17:00',
    }
    const result = AvailabilitySchema.safeParse(invalidRule)
    expect(result.success).toBe(false)
  })
})

describe('ConflictCheckSchema', () => {
  it('validates a valid conflict check request', () => {
    const validRequest = {
      eventTypeId: 'evt_123',
      startAt: '2024-12-20T10:00:00Z',
      endAt: '2024-12-20T10:30:00Z',
    }
    const result = ConflictCheckSchema.safeParse(validRequest)
    expect(result.success).toBe(true)
  })

  it('rejects missing eventTypeId', () => {
    const invalidRequest = {
      startAt: '2024-12-20T10:00:00Z',
      endAt: '2024-12-20T10:30:00Z',
    }
    const result = ConflictCheckSchema.safeParse(invalidRequest)
    expect(result.success).toBe(false)
  })
})