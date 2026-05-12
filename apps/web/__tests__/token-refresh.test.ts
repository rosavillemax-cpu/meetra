import { describe, it, expect } from 'vitest'
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent } from '../src/lib/google-calendar'
import { createOutlookCalendarEvent, deleteOutlookCalendarEvent } from '../src/lib/outlook-calendar'

describe('Token Refresh Implementation', () => {
  describe('Google Calendar', () => {
    it('createGoogleCalendarEvent should be a function', () => {
      expect(typeof createGoogleCalendarEvent).toBe('function')
    })

    it('deleteGoogleCalendarEvent should be a function', () => {
      expect(typeof deleteGoogleCalendarEvent).toBe('function')
    })
  })

  describe('Outlook Calendar', () => {
    it('createOutlookCalendarEvent should be a function', () => {
      expect(typeof createOutlookCalendarEvent).toBe('function')
    })

    it('deleteOutlookCalendarEvent should be a function', () => {
      expect(typeof deleteOutlookCalendarEvent).toBe('function')
    })
  })
})

describe('Token Refresh Logic Verification', () => {
  it('should have token refresh logic in createGoogleCalendarEvent source', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/google-calendar.ts'),
      'utf-8'
    )

    expect(source).toContain('expiresAt < new Date()')
    expect(source).toContain('refreshGoogleToken')
    expect(source).toContain('prisma.calendarIntegration.update')
  })

  it('should have token refresh logic in deleteGoogleCalendarEvent source', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/google-calendar.ts'),
      'utf-8'
    )

    expect(source).toContain('Google token expired, refreshing')
  })

  it('should have token refresh logic in createOutlookCalendarEvent source', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/outlook-calendar.ts'),
      'utf-8'
    )

    expect(source).toContain('expiresAt < new Date()')
    expect(source).toContain('refreshOutlookToken')
    expect(source).toContain('prisma.calendarIntegration.update')
  })

  it('should have token refresh logic in deleteOutlookCalendarEvent source', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/outlook-calendar.ts'),
      'utf-8'
    )

    expect(source).toContain('Outlook token expired, refreshing')
  })
})
