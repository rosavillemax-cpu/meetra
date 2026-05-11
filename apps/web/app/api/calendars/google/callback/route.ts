import { NextResponse } from 'next/server'
import { getGoogleTokensFromCode, saveGoogleCalendarToken } from '@/lib/google-calendar'

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
    const tokens = await getGoogleTokensFromCode(code)

    await saveGoogleCalendarToken(
      state,
      tokens.access_token!,
      tokens.refresh_token!,
      tokens.expiry_date!
    )

    return NextResponse.redirect(new URL('/dashboard/settings?calendar_success=google', request.url))
  } catch (error) {
    console.error('Google Calendar OAuth error:', error)
    return NextResponse.redirect(new URL('/dashboard/settings?calendar_error=auth_failed', request.url))
  }
}