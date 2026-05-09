import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params

  const user = await prisma.user.findUnique({
    where: { handle },
    include: {
      eventTypes: {
        where: { active: true },
        orderBy: { title: 'asc' }
      }
    }
  })

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  return NextResponse.json(user)
}