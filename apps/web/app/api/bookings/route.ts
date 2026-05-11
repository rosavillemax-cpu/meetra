import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmation } from '@/lib/email'
import { createGoogleCalendarEvent } from '@/lib/google-calendar'
import { createOutlookCalendarEvent } from '@/lib/outlook-calendar'

export const dynamic = 'force-dynamic'

async function syncBookingToCalendars(bookingId: string, hostId: string) {
  const integrations = await prisma.calendarIntegration.findMany({
    where: { userId: hostId, isActive: true }
  })

  if (integrations.length === 0) return

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { eventType: true }
  })

  if (!booking) return

  const updateData: Record<string, string> = {}

  for (const integration of integrations) {
    try {
      let eventId: string | null | undefined = null

      if (integration.provider === 'google') {
        eventId = await createGoogleCalendarEvent({
          userId: hostId,
          title: booking.eventType.title || 'Meeting',
          description: `Booking with ${booking.guestName}`,
          startTime: new Date(booking.startAt),
          endTime: new Date(booking.endAt),
          guestEmail: booking.guestEmail,
          guestName: booking.guestName
        })
        if (eventId) updateData.googleEventId = eventId
      }

      if (integration.provider === 'outlook') {
        eventId = await createOutlookCalendarEvent({
          userId: hostId,
          title: booking.eventType.title || 'Meeting',
          description: `Booking with ${booking.guestName}`,
          startTime: new Date(booking.startAt),
          endTime: new Date(booking.endAt),
          guestEmail: booking.guestEmail,
          guestName: booking.guestName
        })
        if (eventId) updateData.outlookEventId = eventId
      }
    } catch (err) {
      console.error(`Failed to sync to ${integration.provider}:`, err)
    }
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: updateData
    })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hostId = searchParams.get('hostId')
  const status = searchParams.get('status')
  const upcoming = searchParams.get('upcoming')

  if (!hostId) {
    return NextResponse.json({ error: 'hostId required' }, { status: 400 })
  }

  const where: Record<string, unknown> = { hostId }

  if (status) {
    where.status = status
  } else {
    where.status = { not: 'cancelled' }
  }

  if (upcoming === 'true') {
    where.startAt = { gte: new Date() }
  } else if (upcoming === 'false') {
    where.startAt = { lt: new Date() }
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      eventType: {
        select: { id: true, slug: true, title: true, color: true, durationMin: true }
      },
      host: {
        select: { id: true, handle: true, name: true, image: true }
      }
    },
    orderBy: { startAt: upcoming === 'true' ? 'asc' : 'desc' }
  })

  return NextResponse.json(bookings)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventTypeId, guestEmail, guestName, startAt, endAt } = body

    if (!eventTypeId || !guestEmail || !guestName || !startAt || !endAt) {
      return NextResponse.json(
        { error: 'eventTypeId, guestEmail, guestName, startAt, endAt are required' },
        { status: 400 }
      )
    }

    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: { user: true }
    })

    if (!eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
    }

    const cancelToken = crypto.randomUUID()

    const booking = await prisma.booking.create({
      data: {
        eventTypeId,
        hostId: eventType.userId,
        guestEmail,
        guestName,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        cancelToken,
      }
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const cancelUrl = `${baseUrl}/bookings/${booking.id}/cancel?token=${cancelToken}`

    const emailResult = await sendBookingConfirmation({
      guestName,
      guestEmail,
      eventTypeTitle: eventType.title,
      startTime: startAt,
      endTime: endAt,
      durationMin: eventType.durationMin,
      hostName: eventType.user.name || eventType.user.handle,
      hostEmail: eventType.user.email,
      cancelUrl,
    })

    if (emailResult.success) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { confirmationSentAt: new Date() }
      })
    }

    syncBookingToCalendars(booking.id, eventType.userId)

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}