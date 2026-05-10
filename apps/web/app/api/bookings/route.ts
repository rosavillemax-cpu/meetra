import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hostId = searchParams.get('hostId')
  const status = searchParams.get('status')
  const upcoming = searchParams.get('upcoming')

  if (!hostId) {
    return NextResponse.json({ error: 'hostId zorunlu' }, { status: 400 })
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