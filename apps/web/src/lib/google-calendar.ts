import { google } from 'googleapis'
import { prisma } from './prisma'

function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    process.env.NEXTAUTH_URL + '/api/calendars/google/callback'
  )
}

export async function getGoogleOAuthUrl(userId: string, redirectUri?: string) {
  const oauth2Client = createOAuth2Client()
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    state: userId,
    redirect_uri: redirectUri || baseUrl + '/api/calendars/google/callback',
    prompt: 'consent'
  })

  return url
}

export async function getGoogleTokensFromCode(code: string) {
  const oauth2Client = createOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export async function refreshGoogleToken(refreshToken: string) {
  const oauth2Client = createOAuth2Client()
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  const { credentials } = await oauth2Client.refreshAccessToken()
  return credentials
}

export async function saveGoogleCalendarToken(
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: number
) {
  const integration = await prisma.calendarIntegration.upsert({
    where: {
      userId_provider: {
        userId,
        provider: 'google'
      }
    },
    update: {
      accessToken,
      refreshToken,
      expiresAt: new Date(expiresAt * 1000),
      isActive: true
    },
    create: {
      userId,
      provider: 'google',
      accessToken,
      refreshToken,
      expiresAt: new Date(expiresAt * 1000),
      isActive: true
    }
  })

  return integration
}

export async function getGoogleCalendarIntegration(userId: string) {
  return prisma.calendarIntegration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: 'google'
      }
    }
  })
}

interface CreateCalendarEventParams {
  userId: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  guestEmail: string
  guestName: string
}

export async function createGoogleCalendarEvent(params: CreateCalendarEventParams) {
  const integration = await getGoogleCalendarIntegration(params.userId)

  if (!integration || !integration.isActive) {
    console.log('No active Google Calendar integration for user:', params.userId)
    return null
  }

  let accessToken = integration.accessToken
  let refreshToken = integration.refreshToken

  if (integration.expiresAt && integration.expiresAt < new Date()) {
    console.log('Google token expired, refreshing for user:', params.userId)
    const credentials = await refreshGoogleToken(integration.refreshToken)
    await prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: {
        accessToken: credentials.access_token!,
        refreshToken: credentials.refresh_token ?? integration.refreshToken,
        expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : new Date(Date.now() + 3600 * 1000)
      }
    })
    accessToken = credentials.access_token!
    refreshToken = credentials.refresh_token ?? integration.refreshToken
  }

  const client = createOAuth2Client()
  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  const calendar = google.calendar({ version: 'v3', auth: client })

  const event = await calendar.events.insert({
    calendarId: integration.calendarId || 'primary',
    requestBody: {
      summary: params.title,
      description: params.description,
      start: {
        dateTime: params.startTime.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: params.endTime.toISOString(),
        timeZone: 'UTC'
      },
      attendees: [
        { email: params.guestEmail, displayName: params.guestName }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 }
        ]
      }
    },
    sendUpdates: 'all'
  })

  return event.data.id
}

export async function deleteGoogleCalendarEvent(userId: string, eventId: string) {
  const integration = await getGoogleCalendarIntegration(userId)

  if (!integration || !integration.isActive) {
    return false
  }

  let accessToken = integration.accessToken
  let refreshToken = integration.refreshToken

  if (integration.expiresAt && integration.expiresAt < new Date()) {
    console.log('Google token expired, refreshing for user:', userId)
    const credentials = await refreshGoogleToken(integration.refreshToken)
    await prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: {
        accessToken: credentials.access_token!,
        refreshToken: credentials.refresh_token ?? integration.refreshToken,
        expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : new Date(Date.now() + 3600 * 1000)
      }
    })
    accessToken = credentials.access_token!
    refreshToken = credentials.refresh_token ?? integration.refreshToken
  }

  const client = createOAuth2Client()
  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  const calendar = google.calendar({ version: 'v3', auth: client })

  try {
    await calendar.events.delete({
      calendarId: integration.calendarId || 'primary',
      eventId
    })
    return true
  } catch (error: any) {
    if (error.code === 404) {
      return true
    }
    throw error
  }
}

export async function getGoogleCalendarBusyTimes(
  userId: string,
  startTime: Date,
  endTime: Date
): Promise<{ start: string; end: string }[]> {
  const integration = await getGoogleCalendarIntegration(userId)

  if (!integration || !integration.isActive) {
    return []
  }

  const client = createOAuth2Client()
  client.setCredentials({
    access_token: integration.accessToken,
    refresh_token: integration.refreshToken
  })

  const calendar = google.calendar({ version: 'v3', auth: client })

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: [
          { id: integration.calendarId || 'primary' }
        ]
      }
    })

    const busy = response.data.calendars?.[integration.calendarId || 'primary']?.busy || []
    return busy
      .filter((period): period is { start: string; end: string } =>
        Boolean(period.start && period.end)
      )
      .map((period) => ({ start: period.start!, end: period.end! }))
  } catch (error) {
    console.error('Failed to fetch Google Calendar busy times:', error)
    return []
  }
}

export async function disconnectGoogleCalendar(userId: string) {
  await prisma.calendarIntegration.updateMany({
    where: {
      userId,
      provider: 'google'
    },
    data: {
      isActive: false
    }
  })
}