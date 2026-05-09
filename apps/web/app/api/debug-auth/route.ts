import { NextResponse } from 'next/server'

// Temporary debug endpoint — remove after fixing auth
export async function GET() {
  return NextResponse.json({
    hasSecret: !!process.env.AUTH_SECRET,
    hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
    hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
    hasDbUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    authUrl: process.env.AUTH_URL,
  })
}
