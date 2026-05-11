import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { bookingId, action } = body

    if (action === 'sync') {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { eventType: { include: { user: true } } }
      })

      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      }

      if (booking.hostId !== session.user.id) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
      }

      const integrations = await prisma.calendarIntegration.findMany({
        where: { userId: session.user.id, isActive: true }
      })

      for (const integration of integrations) {
        if (integration.provider === 'google') {
          const { createGoogleCalendarEvent } = await import('@/lib/google-calendar')

          const eventId = await createGoogleCalendarEvent({
            userId: session.user.id,
            title: booking.eventType.title,
            description: `Booking with ${booking.guestName}`,
            startTime: new Date(booking.startAt),
            endTime: new Date(booking.endAt),
            guestEmail: booking.guestEmail,
            guestName: booking.guestName
          })

          if (eventId) {
            await prisma.booking.update({
              where: { id: bookingId },
              data: { googleEventId: eventId }
            })
          }
        }

        if (integration.provider === 'outlook') {
          const { createOutlookCalendarEvent } = await import('@/lib/outlook-calendar')

          const eventId = await createOutlookCalendarEvent({
            userId: session.user.id,
            title: booking.eventType.title,
            description: `Booking with ${booking.guestName}`,
            startTime: new Date(booking.startAt),
            endTime: new Date(booking.endAt),
            guestEmail: booking.guestEmail,
            guestName: booking.guestName
          })

          if (eventId) {
            await prisma.booking.update({
              where: { id: bookingId },
              data: { outlookEventId: eventId }
            })
          }
        }
      }

      return NextResponse.json({ success: true, message: 'Calendar sync complete' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const bookings = await prisma.booking.findMany({
    where: {
      hostId: session.user.id,
      status: 'confirmed',
      startAt: { gte: new Date() },
      googleEventId: null,
      outlookEventId: null
    },
    include: {
      eventType: true
    },
    take: 10
  })

  return NextResponse.json(bookings)
}