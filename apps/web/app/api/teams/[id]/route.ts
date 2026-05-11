import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = await params

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true, handle: true }
          }
        }
      },
      eventTypes: {
        include: {
          eventType: true
        }
      }
    }
  })

  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 })
  }

  const isMember = team.members.some(m => m.userId === session.user.id)
  if (!isMember) {
    return NextResponse.json({ error: 'Not a team member' }, { status: 403 })
  }

  return NextResponse.json(team)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = await params

  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId: id, userId: session.user.id }
    }
  })

  if (!membership || membership.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { name, slug } = body

    const team = await prisma.team.update({
      where: { id },
      data: { name, slug }
    })

    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = await params

  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId: id, userId: session.user.id }
    }
  })

  if (!membership || membership.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  await prisma.team.delete({ where: { id } })

  return NextResponse.json({ success: true })
}