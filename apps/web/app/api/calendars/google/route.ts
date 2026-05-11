import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getGoogleOAuthUrl } from '@/lib/google-calendar'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const url = await getGoogleOAuthUrl(session.user.id)
  return NextResponse.redirect(url)
}