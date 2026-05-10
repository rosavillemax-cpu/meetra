import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      eventType: { include: { user: true } },
      host: true
    }
  })

  if (!booking) {
    return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 })
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

  const booking = await prisma.booking.findUnique({ where: { id } })

  if (!booking) {
    return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 })
  }

  if (token) {
    if (booking.cancelToken !== token) {
      return NextResponse.json({ error: 'Geçersiz iptal token' }, { status: 403 })
    }
  }

  const session = await auth()
  const isHost = session?.user?.id === booking.hostId

  if (!isHost && booking.cancelToken !== token) {
    return NextResponse.json({ error: 'Yetkilendirme hatası' }, { status: 403 })
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'cancelled' }
  })

  return NextResponse.json(updated)
}