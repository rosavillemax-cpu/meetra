import { NextResponse } from 'next/server'
import { getOutlookTokensFromCode, saveOutlookCalendarToken } from '@/lib/outlook-calendar'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard/settings?calendar_error=${error}`, request.url))
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/dashboard/settings?calendar_error=missing_params', request.url))
  }

  try {
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/calendars/outlook/callback`
    const tokens = await getOutlookTokensFromCode(code, redirectUri)

    await saveOutlookCalendarToken(
      state,
      tokens.accessToken,
      tokens.refreshToken,
      tokens.expiresAt
    )

    return NextResponse.redirect(new URL('/dashboard/settings?calendar_success=outlook', request.url))
  } catch (error) {
    console.error('Outlook Calendar OAuth error:', error)
    return NextResponse.redirect(new URL('/dashboard/settings?calendar_error=auth_failed', request.url))
  }
}