import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId zorunlu' }, { status: 400 })
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
    return NextResponse.json({ error: 'userId, weekday, startTime ve endTime zorunlu' }, { status: 400 })
  }

  if (weekday < 0 || weekday > 6) {
    return NextResponse.json({ error: 'weekday 0-6 arasında olmalı (Pazar=0, Cumartesi=6)' }, { status: 400 })
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