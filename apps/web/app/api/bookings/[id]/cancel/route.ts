import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { cancelToken } = body

  const booking = await prisma.booking.findUnique({ where: { id } })

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.cancelToken !== cancelToken) {
    return NextResponse.json({ error: 'Invalid cancel token' }, { status: 403 })
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'cancelled' }
  })

  return NextResponse.json(updated)
}