import { NextResponse } from 'next/server'

// Temporary debug endpoint — remove after fixing auth
export async function GET() {
  const googleSecret = process.env.AUTH_GOOGLE_SECRET ?? ''
  const authSecret = process.env.AUTH_SECRET ?? ''
  const dbUrl = process.env.DATABASE_URL ?? ''
  const authUrl = process.env.AUTH_URL ?? ''

  return NextResponse.json({
    hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
    googleIdLength: (process.env.AUTH_GOOGLE_ID ?? '').length,
    hasGoogleSecret: !!googleSecret,
    googleSecretLength: googleSecret.length,
    googleSecretPreview: googleSecret.slice(0, 6) + '...',
    hasAuthSecret: !!authSecret,
    authSecretLength: authSecret.length,
    hasAuthUrl: !!authUrl,
    authUrl: authUrl,
    authUrlHasNewline: authUrl.includes('\n'),
    hasDatabaseUrl: !!dbUrl,
    dbUrlLength: dbUrl.length,
    nodeEnv: process.env.NODE_ENV,
  })
}
