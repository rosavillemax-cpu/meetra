import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AvailabilitySchema } from '@/lib/schemas'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const rules = await prisma.availabilityRule.findMany({
    where: { userId },
    orderBy: [{ isOverride: 'asc' }, { weekday: 'asc' }]
  })

  return NextResponse.json(rules)
}

export async function POST(request: Request) {
  const body = await request.json()

  const validation = AvailabilitySchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.issues },
      { status: 400 }
    )
  }

  const { userId, weekday, startTime, endTime, isOverride, overrideDate } = validation.data

  const rule = await prisma.availabilityRule.create({
    data: {
      userId,
      weekday,
      startTime,
      endTime,
      isOverride: isOverride || false,
      overrideDate: overrideDate ? new Date(overrideDate) : null
    }
  })

  return NextResponse.json(rule, { status: 201 })
}