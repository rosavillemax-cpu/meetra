import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const rule = await prisma.availabilityRule.findUnique({ where: { id } })

  if (!rule) {
    return NextResponse.json({ error: 'Availability rule not found' }, { status: 404 })
  }

  const { weekday, startTime, endTime, isOverride, overrideDate } = body

  const updated = await prisma.availabilityRule.update({
    where: { id },
    data: {
      ...(weekday !== undefined && { weekday }),
      ...(startTime !== undefined && { startTime }),
      ...(endTime !== undefined && { endTime }),
      ...(isOverride !== undefined && { isOverride }),
      ...(overrideDate !== undefined && { overrideDate: overrideDate ? new Date(overrideDate) : null })
    }
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const rule = await prisma.availabilityRule.findUnique({ where: { id } })

  if (!rule) {
    return NextResponse.json({ error: 'Availability rule not found' }, { status: 404 })
  }

  await prisma.availabilityRule.delete({ where: { id } })

  return NextResponse.json({ success: true })
}