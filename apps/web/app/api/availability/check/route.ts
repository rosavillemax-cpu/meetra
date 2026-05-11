import { NextResponse } from 'next/server'
import { checkConflict, findAlternativeSlots } from '@/lib/calendar/checkConflict'
import { ConflictCheckSchema } from '@/lib/schemas'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventTypeId = searchParams.get('eventTypeId')
  const startAt = searchParams.get('startAt')
  const endAt = searchParams.get('endAt')
  const findAlternatives = searchParams.get('findAlternatives') === 'true'

  if (!eventTypeId || !startAt || !endAt) {
    return NextResponse.json(
      { error: 'eventTypeId, startAt, and endAt are required' },
      { status: 400 }
    )
  }

  const validation = ConflictCheckSchema.safeParse({
    eventTypeId,
    startAt,
    endAt
  })

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.issues },
      { status: 400 }
    )
  }

  try {
    const requestedSlot = {
      start: new Date(startAt),
      end: new Date(endAt)
    }

    const conflictResult = await checkConflict(eventTypeId, requestedSlot)

    const response: Record<string, unknown> = {
      hasConflict: conflictResult.hasConflict,
      conflicts: conflictResult.conflicts.map(c => ({
        source: c.source,
        start: c.start.toISOString(),
        end: c.end.toISOString()
      }))
    }

    if (conflictResult.hasConflict && findAlternatives) {
      const durationMs = requestedSlot.end.getTime() - requestedSlot.start.getTime()
      const durationMin = Math.round(durationMs / 60000)

      const alternatives = await findAlternativeSlots(eventTypeId, requestedSlot.start, durationMin)

      response.alternatives = alternatives.map(slot => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString()
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Conflict check error:', error)
    return NextResponse.json(
      { error: 'Failed to check for conflicts' },
      { status: 500 }
    )
  }
}