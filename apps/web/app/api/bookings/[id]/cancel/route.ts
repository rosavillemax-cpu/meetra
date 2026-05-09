import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { cancelToken } = body

  const booking = await prisma.booking.findUnique({ where: { id } })

  if (!booking) {
    return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 })
  }

  if (booking.cancelToken !== cancelToken) {
    return NextResponse.json({ error: 'Geçersiz iptal token' }, { status: 403 })
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'cancelled' }
  })

  return NextResponse.json(updated)
}