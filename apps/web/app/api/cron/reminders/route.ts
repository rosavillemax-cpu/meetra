import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingReminder } from '@/lib/email'

export const dynamic = 'force-dynamic'

const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret-change-in-production'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    const twoAndHalfHoursFromNow = new Date(now.getTime() + 2.5 * 60 * 60 * 1000)

    const bookingsToRemind = await prisma.booking.findMany({
      where: {
        status: 'confirmed',
        reminderSentAt: null,
        startAt: {
          gte: twoHoursFromNow,
          lte: twoAndHalfHoursFromNow
        }
      },
      include: {
        eventType: {
          include: { user: true }
        }
      }
    })

    const results = []
    for (const booking of bookingsToRemind) {
      const result = await sendBookingReminder({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        eventTypeTitle: booking.eventType.title,
        startTime: booking.startAt.toISOString(),
        endTime: booking.endAt.toISOString(),
        durationMin: booking.eventType.durationMin,
        hostName: booking.eventType.user.name || booking.eventType.user.handle,
      })

      if (result.success) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminderSentAt: new Date() }
        })
      }

      results.push({
        bookingId: booking.id,
        email: booking.guestEmail,
        success: result.success
      })
    }

    return NextResponse.json({
      processed: results.length,
      results
    })
  } catch (error) {
    console.error('Reminder cron error:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}