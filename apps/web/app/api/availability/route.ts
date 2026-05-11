import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
  const { userId, weekday, startTime, endTime, isOverride, overrideDate } = body

  if (!userId || weekday === undefined || !startTime || !endTime) {
    return NextResponse.json({ error: 'userId, weekday, startTime and endTime are required' }, { status: 400 })
  }

  if (weekday < 0 || weekday > 6) {
    return NextResponse.json({ error: 'weekday must be 0-6 (Sunday=0, Saturday=6)' }, { status: 400 })
  }

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