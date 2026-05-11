import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: { userId: session.user.id }
      }
    },
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

  return NextResponse.json(teams)
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const existingTeam = await prisma.team.findUnique({
      where: { slug }
    })

    if (existingTeam) {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
    }

    const team = await prisma.team.create({
      data: {
        name,
        slug,
        members: {
          create: {
            userId: session.user.id,
            role: 'admin',
            priority: 100
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true, handle: true }
            }
          }
        }
      }
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error('Team creation error:', error)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}