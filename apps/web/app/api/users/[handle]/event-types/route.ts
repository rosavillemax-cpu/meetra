import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params

  const user = await prisma.user.findUnique({ where: { handle } })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const eventTypes = await prisma.eventType.findMany({
    where: { userId: user.id, active: true },
    orderBy: { title: 'asc' }
  })

  return NextResponse.json(eventTypes)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params
  const body = await request.json()

  const user = await prisma.user.findUnique({ where: { handle } })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { slug, title, description, durationMin, bufferBefore, bufferAfter, color } = body

  if (!slug || !title) {
    return NextResponse.json({ error: 'slug and title are required' }, { status: 400 })
  }

  const eventType = await prisma.eventType.create({
    data: {
      userId: user.id,
      slug,
      title,
      description,
      durationMin: durationMin || 30,
      bufferBefore: bufferBefore || 0,
      bufferAfter: bufferAfter || 0,
      color: color || '#000000'
    }
  })

  return NextResponse.json(eventType)
}