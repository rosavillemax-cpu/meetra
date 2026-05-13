import { z } from 'zod'

export const BookingSchema = z.object({
  eventTypeId: z.string().min(1, 'eventTypeId is required'),
  guestEmail: z.string().email('Invalid email address'),
  guestName: z.string().min(1, 'Guest name is required').max(100, 'Name too long'),
  startAt: z.string().datetime({ message: 'Invalid start time format' }),
  endAt: z.string().datetime({ message: 'Invalid end time format' }),
}).refine(
  (data) => new Date(data.startAt) < new Date(data.endAt),
  { message: 'End time must be after start time', path: ['endAt'] }
)

export const EventTypeSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(50, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  durationMin: z.number().int().min(5, 'Minimum duration is 5 minutes').max(480, 'Maximum duration is 480 minutes').optional(),
  bufferBefore: z.number().int().min(0).max(60).optional(),
  bufferAfter: z.number().int().min(0).max(60).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  locationType: z.enum(['google-meet', 'phone', 'in-person', 'custom']).optional(),
  customLocation: z.string().max(200, 'Custom location too long').optional(),
})

export const EventTypeUpdateSchema = EventTypeSchema.partial().extend({
  locationType: z.enum(['google-meet', 'phone', 'in-person', 'custom']).optional(),
  customLocation: z.string().max(200, 'Custom location too long').optional(),
})

export const AvailabilitySchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  weekday: z.number().int().min(0).max(6, 'Weekday must be 0-6 (Sunday=0)'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  isOverride: z.boolean().optional(),
  overrideDate: z.string().datetime().optional(),
})

export const ConflictCheckSchema = z.object({
  eventTypeId: z.string().min(1, 'eventTypeId is required'),
  startAt: z.string().datetime({ message: 'Invalid start time format' }),
  endAt: z.string().datetime({ message: 'Invalid end time format' }),
})

export const BookingWithRelationsSchema = z.object({
  id: z.string(),
  eventTypeId: z.string(),
  hostId: z.string(),
  guestEmail: z.string().email(),
  guestName: z.string(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  status: z.enum(['confirmed', 'pending', 'cancelled']),
  answers: z.record(z.string(), z.unknown()).optional(),
  icalUid: z.string().nullable().optional(),
  cancelToken: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  confirmationSentAt: z.string().datetime().nullable().optional(),
  reminderSentAt: z.string().datetime().nullable().optional(),
  googleEventId: z.string().nullable().optional(),
  outlookEventId: z.string().nullable().optional(),
  eventType: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    color: z.string(),
    durationMin: z.number(),
  }),
  host: z.object({
    id: z.string(),
    handle: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
})

export type BookingInput = z.infer<typeof BookingSchema>
export type EventTypeInput = z.infer<typeof EventTypeSchema>
export type AvailabilityInput = z.infer<typeof AvailabilitySchema>
export type ConflictCheckInput = z.infer<typeof ConflictCheckSchema>