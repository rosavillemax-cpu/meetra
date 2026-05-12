import { Client } from '@microsoft/microsoft-graph-client'
import { prisma } from './prisma'

let microsoftClient: Client | null = null

function getMicrosoftClient(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken)
    }
  })
}

export async function getOutlookOAuthUrl(userId: string) {
  const clientId = process.env.AUTH_MICROSOFT_ID || process.env.AUTH_GOOGLE_ID
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/calendars/outlook/callback`

  const scopes = encodeURIComponent('Calendars.ReadWrite offline_access')
  const state = encodeURIComponent(userId)

  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scopes}` +
    `&state=${state}` +
    `&prompt=consent`

  return url
}

export async function getOutlookTokensFromCode(code: string, redirectUri: string) {
  const clientId = process.env.AUTH_MICROSOFT_ID || process.env.AUTH_GOOGLE_ID
  const clientSecret = process.env.AUTH_MICROSOFT_SECRET || process.env.AUTH_GOOGLE_SECRET

  const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  })

  const data = await response.json()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    expiresAt: Date.now() + (data.expires_in * 1000)
  }
}

export async function refreshOutlookToken(refreshToken: string) {
  const clientId = process.env.AUTH_MICROSOFT_ID || process.env.AUTH_GOOGLE_ID
  const clientSecret = process.env.AUTH_MICROSOFT_SECRET || process.env.AUTH_GOOGLE_SECRET
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/calendars/outlook/callback`

  const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      redirect_uri: redirectUri
    })
  })

  const data = await response.json()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    expiresAt: Date.now() + (data.expires_in * 1000)
  }
}

export async function saveOutlookCalendarToken(
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  calendarId?: string
) {
  const integration = await prisma.calendarIntegration.upsert({
    where: {
      userId_provider: {
        userId,
        provider: 'outlook'
      }
    },
    update: {
      accessToken,
      refreshToken,
      expiresAt: new Date(expiresAt),
      calendarId,
      isActive: true
    },
    create: {
      userId,
      provider: 'outlook',
      accessToken,
      refreshToken,
      expiresAt: new Date(expiresAt),
      calendarId,
      isActive: true
    }
  })

  return integration
}

export async function getOutlookCalendarIntegration(userId: string) {
  return prisma.calendarIntegration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: 'outlook'
      }
    }
  })
}

interface CreateOutlookEventParams {
  userId: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  guestEmail: string
  guestName: string
}

export async function createOutlookCalendarEvent(params: CreateOutlookEventParams) {
  const integration = await getOutlookCalendarIntegration(params.userId)

  if (!integration || !integration.isActive) {
    console.log('No active Outlook Calendar integration for user:', params.userId)
    return null
  }

  let accessToken = integration.accessToken

  if (integration.expiresAt && integration.expiresAt < new Date()) {
    console.log('Outlook token expired, refreshing for user:', params.userId)
    const tokens = await refreshOutlookToken(integration.refreshToken)
    await prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || integration.refreshToken,
        expiresAt: new Date(tokens.expiresAt)
      }
    })
    accessToken = tokens.accessToken
  }

  const client = getMicrosoftClient(accessToken)

  const event = await client.api('/me/events').post({
    subject: params.title,
    body: {
      contentType: 'HTML',
      content: params.description
    },
    start: {
      dateTime: params.startTime.toISOString(),
      timeZone: 'UTC'
    },
    end: {
      dateTime: params.endTime.toISOString(),
      timeZone: 'UTC'
    },
    attendees: [
      {
        emailAddress: {
          address: params.guestEmail,
          name: params.guestName
        },
        type: 'required'
      }
    ],
    reminders: {
      reminderMinutesBeforeStart: 60,
      isReminderOn: true
    }
  })

  return event.id
}

export async function deleteOutlookCalendarEvent(userId: string, eventId: string) {
  const integration = await getOutlookCalendarIntegration(userId)

  if (!integration || !integration.isActive) {
    return false
  }

  let accessToken = integration.accessToken

  if (integration.expiresAt && integration.expiresAt < new Date()) {
    console.log('Outlook token expired, refreshing for user:', userId)
    const tokens = await refreshOutlookToken(integration.refreshToken)
    await prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || integration.refreshToken,
        expiresAt: new Date(tokens.expiresAt)
      }
    })
    accessToken = tokens.accessToken
  }

  const client = getMicrosoftClient(accessToken)

  try {
    await client.api(`/me/events/${eventId}`).delete()
    return true
  } catch (error: any) {
    if (error.statusCode === 404) {
      return true
    }
    throw error
  }
}

export async function getOutlookCalendarBusyTimes(
  userId: string,
  startTime: Date,
  endTime: Date
): Promise<{ start: string; end: string }[]> {
  const integration = await getOutlookCalendarIntegration(userId)

  if (!integration || !integration.isActive) {
    return []
  }

  const client = getMicrosoftClient(integration.accessToken)

  try {
    const response = await client.api('/me/calendar/getSchedule').post({
      schedules: [integration.calendarId || 'me'],
      startTime: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC'
      },
      endTime: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC'
      },
      availabilityViewInterval: 30
    })

    const busyTimes: { start: string; end: string }[] = []
    const scheduleInfo = response.value?.[0]

    if (scheduleInfo?.scheduleItems) {
      for (const item of scheduleInfo.scheduleItems) {
        if (item.status !== 'free') {
          busyTimes.push({
            start: item.start.dateTime,
            end: item.end.dateTime
          })
        }
      }
    }

    return busyTimes
  } catch (error) {
    console.error('Failed to fetch Outlook Calendar busy times:', error)
    return []
  }
}

export async function disconnectOutlookCalendar(userId: string) {
  await prisma.calendarIntegration.updateMany({
    where: {
      userId,
      provider: 'outlook'
    },
    data: {
      isActive: false
    }
  })
}