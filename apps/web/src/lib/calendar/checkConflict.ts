import { prisma } from '@/lib/prisma'
import { getGoogleCalendarBusyTimes } from '@/lib/google-calendar'
import { getOutlookCalendarBusyTimes } from '@/lib/outlook-calendar'

export interface TimeSlot {
  start: Date
  end: Date
}

export interface ConflictResult {
  hasConflict: boolean
  conflicts: {
    source: 'database' | 'google_calendar' | 'outlook_calendar'
    start: Date
    end: Date
  }[]
}

function isOverlapping(a: TimeSlot, b: TimeSlot): boolean {
  return a.start < b.end && b.start < a.end
}

export async function checkDatabaseConflict(
  eventTypeId: string,
  requestedSlot: TimeSlot
): Promise<TimeSlot | null> {
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      eventTypeId,
      status: { not: 'cancelled' },
      OR: [
        {
          startAt: { lt: requestedSlot.end },
          endAt: { gt: requestedSlot.start }
        }
      ]
    }
  })

  if (conflictingBooking) {
    return {
      start: conflictingBooking.startAt,
      end: conflictingBooking.endAt
    }
  }

  return null
}

export async function checkGoogleCalendarConflict(
  userId: string,
  requestedSlot: TimeSlot
): Promise<TimeSlot | null> {
  const busyTimes = await getGoogleCalendarBusyTimes(userId, requestedSlot.start, requestedSlot.end)

  for (const busy of busyTimes) {
    const busySlot: TimeSlot = {
      start: new Date(busy.start),
      end: new Date(busy.end)
    }
    if (isOverlapping(requestedSlot, busySlot)) {
      return busySlot
    }
  }

  return null
}

export async function checkOutlookCalendarConflict(
  userId: string,
  requestedSlot: TimeSlot
): Promise<TimeSlot | null> {
  const busyTimes = await getOutlookCalendarBusyTimes(userId, requestedSlot.start, requestedSlot.end)

  for (const busy of busyTimes) {
    const busySlot: TimeSlot = {
      start: new Date(busy.start),
      end: new Date(busy.end)
    }
    if (isOverlapping(requestedSlot, busySlot)) {
      return busySlot
    }
  }

  return null
}

export async function checkConflict(
  eventTypeId: string,
  requestedSlot: TimeSlot
): Promise<ConflictResult> {
  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    select: { userId: true }
  })

  if (!eventType) {
    return { hasConflict: false, conflicts: [] }
  }

  const conflicts: ConflictResult['conflicts'] = []

  const dbConflict = await checkDatabaseConflict(eventTypeId, requestedSlot)
  if (dbConflict) {
    conflicts.push({ source: 'database', start: dbConflict.start, end: dbConflict.end })
  }

  const googleConflict = await checkGoogleCalendarConflict(eventType.userId, requestedSlot)
  if (googleConflict) {
    conflicts.push({ source: 'google_calendar', start: googleConflict.start, end: googleConflict.end })
  }

  const outlookConflict = await checkOutlookCalendarConflict(eventType.userId, requestedSlot)
  if (outlookConflict) {
    conflicts.push({ source: 'outlook_calendar', start: outlookConflict.start, end: outlookConflict.end })
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts
  }
}

export async function findAlternativeSlots(
  eventTypeId: string,
  requestedTime: Date,
  durationMin: number,
  searchDays: number = 7
): Promise<TimeSlot[]> {
  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    include: {
      user: {
        include: {
          availabilityRules: true
        }
      }
    }
  })

  if (!eventType) return []

  const availabilityRules = eventType.user.availabilityRules
  const alternatives: TimeSlot[] = []

  const searchEnd = new Date(requestedTime)
  searchEnd.setDate(searchEnd.getDate() + searchDays)

  for (let d = new Date(requestedTime); d < searchEnd; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay()

    const regularRule = availabilityRules.find(
      r => r.weekday === dayOfWeek && !r.isOverride
    )

    if (!regularRule) continue

    const [startHour, startMin] = regularRule.startTime.split(':').map(Number)
    const [endHour, endMin] = regularRule.endTime.split(':').map(Number)

    const dayStart = new Date(d)
    dayStart.setHours(startHour, startMin, 0, 0)

    const dayEnd = new Date(d)
    dayEnd.setHours(endHour, endMin, 0, 0)

    let slotStart = new Date(dayStart)

    while (slotStart < dayEnd) {
      const slotEnd = new Date(slotStart.getTime() + durationMin * 60000)

      if (slotEnd > dayEnd) break

      const slot: TimeSlot = { start: new Date(slotStart), end: slotEnd }

      const hasConflict = await checkConflict(eventTypeId, slot)

      if (!hasConflict.hasConflict && slot.start > new Date()) {
        alternatives.push(slot)
      }

      slotStart = new Date(slotStart.getTime() + 30 * 60000)
    }
  }

  return alternatives.slice(0, 10)
}