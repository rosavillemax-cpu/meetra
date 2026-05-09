import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

function generateIcalUid(): string {
  return `${randomBytes(16).toString('hex')}@meetra`
}

export async function POST(request: Request) {
  const body = await request.json()
  const { eventTypeId, guestEmail, guestName, startAt, endAt, answers } = body

  if (!eventTypeId || !guestEmail || !guestName || !startAt || !endAt) {
    return NextResponse.json({ error: 'Eksik alanlar var' }, { status: 400 })
  }

  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    include: { user: true }
  })

  if (!eventType) {
    return NextResponse.json({ error: 'Event type bulunamadı' }, { status: 404 })
  }

  const startDate = new Date(startAt)
  const endDate = new Date(endAt)

  const existingBooking = await prisma.booking.findFirst({
    where: {
      eventTypeId,
      status: { not: 'cancelled' },
      OR: [
        {
          startAt: { lte: startDate },
          endAt: { gt: startDate }
        },
        {
          startAt: { lt: endDate },
          endAt: { gte: endDate }
        },
        {
          startAt: { gte: startDate },
          endAt: { lte: endDate }
        }
      ]
    }
  })

  if (existingBooking) {
    return NextResponse.json({ error: 'Bu saat aralığı zaten dolu' }, { status: 409 })
  }

  const cancelToken = randomBytes(24).toString('base64url')
  const icalUid = generateIcalUid()

  const booking = await prisma.booking.create({
    data: {
      eventTypeId,
      hostId: eventType.userId,
      guestEmail,
      guestName,
      startAt: startDate,
      endAt: endDate,
      answers,
      cancelToken,
      icalUid
    },
    include: {
      eventType: { include: { user: true } },
      host: true
    }
  })

  return NextResponse.json(booking, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventTypeId = searchParams.get('eventTypeId')
  const hostId = searchParams.get('hostId')

  if (!eventTypeId && !hostId) {
    return NextResponse.json({ error: 'eventTypeId veya hostId gerekli' }, { status: 400 })
  }

  const where: Record<string, unknown> = { status: { not: 'cancelled' } }
  if (eventTypeId) where.eventTypeId = eventTypeId
  if (hostId) where.hostId = hostId

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      eventType: true,
      host: true
    },
    orderBy: { startAt: 'asc' }
  })

  return NextResponse.json(bookings)
}