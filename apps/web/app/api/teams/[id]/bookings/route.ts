import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = await params

  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId: id, userId: session.user.id }
    }
  })

  if (!membership) {
    return NextResponse.json({ error: 'Not a team member' }, { status: 403 })
  }

  const teamEventTypes = await prisma.teamEventType.findMany({
    where: { teamId: id },
    include: {
      eventType: true
    }
  })

  const eventTypeIds = teamEventTypes.map(te => te.eventTypeId)
  const memberIds = await prisma.teamMember.findMany({
    where: { teamId: id },
    select: { userId: true }
  }).then(m => m.map(m => m.userId))

  const bookings = await prisma.booking.findMany({
    where: {
      eventTypeId: { in: eventTypeIds },
      hostId: { in: memberIds },
      status: { not: 'cancelled' }
    },
    include: {
      eventType: true,
      host: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { startAt: 'asc' }
  })

  return NextResponse.json(bookings)
}

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { eventTypeId, guestEmail, guestName, startTime, endTime } = body

    if (!eventTypeId || !guestEmail || !guestName || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const teamEventType = await prisma.teamEventType.findUnique({
      where: {
        teamId_eventTypeId: { teamId: id, eventTypeId }
      }
    })

    if (!teamEventType) {
      return NextResponse.json({ error: 'Event type not part of this team' }, { status: 404 })
    }

    const members = await prisma.teamMember.findMany({
      where: { teamId: id },
      orderBy: { priority: 'desc' }
    })

    if (members.length === 0) {
      return NextResponse.json({ error: 'No team members' }, { status: 400 })
    }

    let selectedHost = members[0].userId

    if (teamEventType.routingType === 'round_robin') {
      const bookings = await prisma.booking.findMany({
        where: {
          hostId: { in: members.map(m => m.userId) },
          startAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        orderBy: { startAt: 'desc' }
      })

      const bookingCounts: Record<string, number> = {}
      for (const member of members) {
        bookingCounts[member.userId] = 0
      }
      for (const booking of bookings) {
        if (bookingCounts[booking.hostId] !== undefined) {
          bookingCounts[booking.hostId]++
        }
      }

      let minCount = Infinity
      for (const member of members) {
        if (bookingCounts[member.userId] < minCount) {
          minCount = bookingCounts[member.userId]
          selectedHost = member.userId
        }
      }
    } else if (teamEventType.routingType === 'collective') {
      const startDate = new Date(startTime)
      const endDate = new Date(endTime)

      const availabilityRules = await prisma.availabilityRule.findMany({
        where: {
          userId: { in: members.map(m => m.userId) },
          weekday: startDate.getDay(),
          isOverride: false
        }
      })

      const dayRules = availabilityRules.filter(r => {
        const ruleStart = r.startTime.split(':')[0].padStart(2, '0') + r.startTime.split(':')[1].padStart(2, '0')
        const ruleEnd = r.endTime.split(':')[0].padStart(2, '0') + r.endTime.split(':')[1].padStart(2, '0')
        const slotStart = startTime.split('T')[1].replace(':', '').replace('-', '')
        const slotEnd = endTime.split('T')[1].replace(':', '').replace('-', '')
        return parseInt(ruleStart) <= parseInt(slotStart) && parseInt(ruleEnd) >= parseInt(slotEnd)
      })

      if (dayRules.length > 0) {
        const userIdsWithAvailability = [...new Set(dayRules.map(r => r.userId))]

        const existingBookings = await prisma.booking.findMany({
          where: {
            hostId: { in: userIdsWithAvailability },
            status: { not: 'cancelled' },
            OR: [
              {
                startAt: { lte: new Date(startTime) },
                endAt: { gt: new Date(startTime) }
              },
              {
                startAt: { lt: new Date(endTime) },
                endAt: { gte: new Date(endTime) }
              }
            ]
          }
        })

        const bookedUserIds = new Set(existingBookings.map(b => b.hostId))
        const availableUserIds = userIdsWithAvailability.filter(uid => !bookedUserIds.has(uid))

        if (availableUserIds.length > 0) {
          const member = members.find(m => m.userId === availableUserIds[0])
          selectedHost = member ? member.userId : members[0].userId
        } else {
          const member = members.find(m => m.userId === userIdsWithAvailability[0])
          selectedHost = member ? member.userId : members[0].userId
        }
      }
    }

    const cancelToken = crypto.randomUUID()

    const booking = await prisma.booking.create({
      data: {
        eventTypeId,
        hostId: selectedHost,
        guestEmail,
        guestName,
        startAt: new Date(startTime),
        endAt: new Date(endTime),
        cancelToken
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Team booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}