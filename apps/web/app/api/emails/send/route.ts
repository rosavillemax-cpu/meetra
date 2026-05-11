import { NextResponse } from 'next/server'
import { sendTestEmail } from '@/lib/email'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const result = await sendTestEmail(session.user.email)

  if (result.success) {
    return NextResponse.json({ success: true, message: `Test email sent to ${session.user.email}` })
  } else {
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email } = body

    const targetEmail = email || session.user.email
    const result = await sendTestEmail(targetEmail)

    if (result.success) {
      return NextResponse.json({ success: true, message: `Test email sent to ${targetEmail}` })
    } else {
      return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}