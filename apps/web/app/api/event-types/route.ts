import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EventTypeSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'

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
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const validation = EventTypeSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.issues },
      { status: 400 }
    )
  }

  const { slug, title, description, durationMin, bufferBefore, bufferAfter, color, locationType, customLocation } = validation.data
  const userId = session.user.id

  const existingSlug = await prisma.eventType.findFirst({
    where: { userId, slug }
  })

  if (existingSlug) {
    return NextResponse.json({ error: 'This slug is already in use' }, { status: 409 })
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
      color: color || '#000000',
      locationType: locationType || 'google-meet',
      customLocation: customLocation || null,
    },
    include: {
      user: { select: { id: true, handle: true, name: true, image: true } }
    }
  })

  return NextResponse.json(eventType, { status: 201 })
}