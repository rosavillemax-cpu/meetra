import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface TimeSlot {
  start: string
  end: string
}

function parseTime(timeStr: string, dateStr: string): Date {
  const parts = timeStr.split(':').map(Number)
  const hours = parts[0] ?? 0
  const minutes = parts[1] ?? 0
  const date = new Date(dateStr)
  date.setHours(hours, minutes, 0, 0)
  return date
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')

  if (!dateStr) {
    return NextResponse.json({ error: 'date parameter is required (YYYY-MM-DD)' }, { status: 400 })
  }

  const eventType = await prisma.eventType.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          availabilityRules: true,
          bookingsAsHost: {
            where: { status: { not: 'cancelled' } }
          }
        }
      }
    }
  })

  if (!eventType) {
    return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
  }

  const requestedDate = new Date(dateStr)
  const dayOfWeek = requestedDate.getDay()
  const mondayWeekday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  const overrideRule = eventType.user.availabilityRules.find(
    (rule: { isOverride: boolean; overrideDate: Date | null; startTime: string; endTime: string }) =>
      rule.isOverride && rule.overrideDate?.toISOString().split('T')[0] === dateStr
  )

  const weekdayRules = eventType.user.availabilityRules.filter(
    (rule: { isOverride: boolean; weekday: number; startTime: string; endTime: string }) =>
      !rule.isOverride && rule.weekday === mondayWeekday
  )

  const rules = overrideRule ? [overrideRule] : weekdayRules

  if (rules.length === 0) {
    return NextResponse.json({ slots: [] })
  }

  const existingBookings = eventType.user.bookingsAsHost.filter((booking: { startAt: Date; endAt: Date }) => {
    const bookingDate = booking.startAt.toISOString().split('T')[0]
    return bookingDate === dateStr
  })

  const slots: TimeSlot[] = []

  for (const rule of rules) {
    let current = parseTime(rule.startTime, dateStr)
    const end = parseTime(rule.endTime, dateStr)

    while (current < end) {
      const slotEnd = addMinutes(current, eventType.durationMin)
      const slotStartWithBuffer = addMinutes(current, -eventType.bufferBefore)
      const slotEndWithBuffer = addMinutes(slotEnd, eventType.bufferAfter)

      if (slotEnd <= end) {
        const isAvailable = !existingBookings.some((booking: { startAt: Date; endAt: Date }) => {
          const bookingStart = new Date(booking.startAt)
          const bookingEnd = new Date(booking.endAt)
          return (
            (slotStartWithBuffer >= bookingStart && slotStartWithBuffer < bookingEnd) ||
            (slotEndWithBuffer > bookingStart && slotEndWithBuffer <= bookingEnd) ||
            (slotStartWithBuffer <= bookingStart && slotEndWithBuffer >= bookingEnd)
          )
        })

        if (isAvailable) {
          slots.push({
            start: current.toISOString(),
            end: slotEnd.toISOString()
          })
        }
      }

      current = slotEnd
    }
  }

  slots.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  return NextResponse.json({ slots })
}