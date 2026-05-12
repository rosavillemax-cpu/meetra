import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendBookingCancellation } from '@/lib/email'
import { deleteGoogleCalendarEvent } from '@/lib/google-calendar'
import { deleteOutlookCalendarEvent } from '@/lib/outlook-calendar'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      eventType: { include: { user: true } },
      host: true
    }
  })

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const isHost = session.user.id === booking.hostId
  const hasValidToken = token && booking.cancelToken === token

  if (!isHost && !hasValidToken) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(booking)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { eventType: { include: { user: true } } }
  })

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (token) {
    if (booking.cancelToken !== token) {
      return NextResponse.json({ error: 'Invalid cancel token' }, { status: 403 })
    }
  }

  const session = await auth()
  const isHost = session?.user?.id === booking.hostId

  if (!isHost && booking.cancelToken !== token) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  if (booking.googleEventId) {
    try {
      await deleteGoogleCalendarEvent(booking.hostId, booking.googleEventId)
    } catch (error) {
      console.error('Failed to delete Google Calendar event:', error)
    }
  }

  if (booking.outlookEventId) {
    try {
      await deleteOutlookCalendarEvent(booking.hostId, booking.outlookEventId)
    } catch (error) {
      console.error('Failed to delete Outlook Calendar event:', error)
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'cancelled' }
  })

  await sendBookingCancellation({
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    eventTypeTitle: booking.eventType.title,
    startTime: booking.startAt.toISOString(),
    hostName: booking.eventType.user.name || booking.eventType.user.handle,
    hostEmail: booking.eventType.user.email,
  })

  return NextResponse.json(updated)
}