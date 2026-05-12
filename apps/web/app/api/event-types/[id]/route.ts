import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const eventType = await prisma.eventType.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, handle: true, name: true, image: true } },
      _count: { select: { bookings: true } }
    }
  })

  if (!eventType) {
    return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
  }

  return NextResponse.json(eventType)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const eventType = await prisma.eventType.findUnique({ where: { id } })

  if (!eventType) {
    return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
  }

  const { slug, title, description, durationMin, bufferBefore, bufferAfter, color, active } = body

  if (slug && slug !== eventType.slug) {
    const existingSlug = await prisma.eventType.findFirst({
      where: { userId: eventType.userId, slug, id: { not: id } }
    })
    if (existingSlug) {
      return NextResponse.json({ error: 'This slug is already in use' }, { status: 409 })
    }
  }

  const updated = await prisma.eventType.update({
    where: { id },
    data: {
      ...(slug !== undefined && { slug }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(durationMin !== undefined && { durationMin }),
      ...(bufferBefore !== undefined && { bufferBefore }),
      ...(bufferAfter !== undefined && { bufferAfter }),
      ...(color !== undefined && { color }),
      ...(active !== undefined && { active })
    },
    include: {
      user: { select: { id: true, handle: true, name: true, image: true } }
    }
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const eventType = await prisma.eventType.findUnique({ where: { id } })

  if (!eventType) {
    return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
  }

  await prisma.eventType.delete({ where: { id } })

  return NextResponse.json({ success: true })
}