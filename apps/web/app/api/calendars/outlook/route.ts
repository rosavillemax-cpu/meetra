import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getOutlookOAuthUrl } from '@/lib/outlook-calendar'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const url = await getOutlookOAuthUrl(session.user.id)
  return NextResponse.redirect(url)
}