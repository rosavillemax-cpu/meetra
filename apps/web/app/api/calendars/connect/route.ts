import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { disconnectGoogleCalendar } from '@/lib/google-calendar'
import { disconnectOutlookCalendar } from '@/lib/outlook-calendar'

export async function DELETE(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const provider = searchParams.get('provider')

  if (!provider || !['google', 'outlook'].includes(provider)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }

  if (provider === 'google') {
    await disconnectGoogleCalendar(session.user.id)
  } else {
    await disconnectOutlookCalendar(session.user.id)
  }

  return NextResponse.json({ success: true, message: `${provider} calendar disconnected` })
}

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const integrations = await prisma.calendarIntegration.findMany({
    where: { userId: session.user.id },
    select: {
      provider: true,
      isActive: true,
      calendarId: true,
      expiresAt: true,
      createdAt: true
    }
  })

  return NextResponse.json(integrations)
}