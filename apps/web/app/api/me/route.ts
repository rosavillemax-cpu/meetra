import { NextResponse } from 'next/server'
import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      handle: true,
      timezone: true,
    }
  })

  if (!user) {
    // User exists in session but not in DB - stale session
    // Force signout to clear the invalid session
    await signOut({ redirect: false })
    return NextResponse.json({ error: 'User not found - session cleared' }, { status: 404 })
  }

  return NextResponse.json(user)
}