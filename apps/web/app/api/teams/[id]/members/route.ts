import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
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

  if (!membership) {
    return NextResponse.json({ error: 'Not a team member' }, { status: 403 })
  }

  const members = await prisma.teamMember.findMany({
    where: { teamId: id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true, handle: true }
      }
    }
  })

  return NextResponse.json(members)
}

export async function POST(
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
    const { userId, role, priority } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId: id, userId }
      }
    })

    if (existingMembership) {
      return NextResponse.json({ error: 'User already in team' }, { status: 409 })
    }

    const newMember = await prisma.teamMember.create({
      data: {
        teamId: id,
        userId,
        role: role || 'member',
        priority: priority || 0
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, handle: true }
        }
      }
    })

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error('Add team member error:', error)
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 })
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
  const { searchParams } = new URL(request.url)
  const userIdToRemove = searchParams.get('userId')

  if (!userIdToRemove) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId: id, userId: session.user.id }
    }
  })

  if (!membership || membership.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  if (userIdToRemove === session.user.id) {
    return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 })
  }

  await prisma.teamMember.delete({
    where: {
      teamId_userId: { teamId: id, userId: userIdToRemove }
    }
  })

  return NextResponse.json({ success: true })
}