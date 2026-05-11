import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params

  const user = await prisma.user.findUnique({
    where: { handle },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      handle: true,
      timezone: true,
      createdAt: true,
      eventTypes: {
        where: { active: true },
        orderBy: { title: 'asc' }
      },
      _count: {
        select: { bookingsAsHost: true }
      }
    }
  })

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params
  const body = await request.json()

  const user = await prisma.user.findUnique({ where: { handle } })

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  const { name, timezone, handle: newHandle } = body

  if (newHandle && newHandle !== handle) {
    const existingHandle = await prisma.user.findUnique({ where: { handle: newHandle } })
    if (existingHandle) {
      return NextResponse.json({ error: 'Bu handle zaten kullanılıyor' }, { status: 409 })
    }
  }

  const updated = await prisma.user.update({
    where: { handle },
    data: {
      ...(name !== undefined && { name }),
      ...(timezone !== undefined && { timezone }),
      ...(newHandle !== undefined && { handle: newHandle })
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      handle: true,
      timezone: true
    }
  })

  return NextResponse.json(updated)
}