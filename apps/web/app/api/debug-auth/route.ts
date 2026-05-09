import { NextResponse } from 'next/server'

export async function GET() {
  const hasGoogleId = Boolean(process.env.AUTH_GOOGLE_ID)
  const hasGoogleSecret = Boolean(process.env.AUTH_GOOGLE_SECRET)
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET)
  const hasAuthUrl = Boolean(process.env.AUTH_URL)
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL)

  const googleIdValue = process.env.AUTH_GOOGLE_ID || ''
  const googleSecretValue = process.env.AUTH_GOOGLE_SECRET ? '***' : ''
  const authSecretValue = process.env.AUTH_SECRET ? '***' : ''
  const dbUrlValue = process.env.DATABASE_URL ? '***' : ''

  return NextResponse.json({
    hasGoogleId,
    hasGoogleSecret,
    hasAuthSecret,
    hasAuthUrl,
    hasDatabaseUrl,
    googleIdLength: googleIdValue.length,
    googleSecretLength: googleSecretValue.length,
    authSecretLength: authSecretValue.length,
    authUrl: process.env.AUTH_URL || '',
    dbUrlLength: dbUrlValue.length,
    allOk: hasGoogleId && hasGoogleSecret && hasAuthSecret && hasAuthUrl && hasDatabaseUrl,
  })
}