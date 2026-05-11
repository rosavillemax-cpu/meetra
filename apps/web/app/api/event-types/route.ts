import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EventTypeSchema } from '@/lib/schemas'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const active = searchParams.get('active')

  const where: Record<string, unknown> = {}
  if (userId) where.userId = userId
  if (active !== null) where.active = active === 'true'

  const eventTypes = await prisma.eventType.findMany({
    where,
    include: {
      user: { select: { id: true, handle: true, name: true, image: true } },
      _count: { select: { bookings: true } }
    },
    orderBy: { id: 'desc' }
  })

  return NextResponse.json(eventTypes)
}

export async function POST(request: Request) {
  const body = await request.json()

  const validation = EventTypeSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.issues },
      { status: 400 }
    )
  }

  const { userId, slug, title, description, durationMin, bufferBefore, bufferAfter, color } = validation.data

  const existingSlug = await prisma.eventType.findFirst({
    where: { userId, slug }
  })

  if (existingSlug) {
    return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 409 })
  }

  const eventType = await prisma.eventType.create({
    data: {
      userId,
      slug,
      title,
      description,
      durationMin: durationMin || 30,
      bufferBefore: bufferBefore || 0,
      bufferAfter: bufferAfter || 0,
      color: color || '#000000'
    },
    include: {
      user: { select: { id: true, handle: true, name: true, image: true } }
    }
  })

  return NextResponse.json(eventType, { status: 201 })
}