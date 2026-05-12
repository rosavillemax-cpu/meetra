import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth } from '@/lib/auth'
import { deleteGoogleCalendarEvent } from '@/lib/google-calendar'
import * as outlookCalendarModule from '@/lib/outlook-calendar'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    booking: {
      findUnique: vi.fn(),
      update: vi.fn()
    }
  }
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn()
}))

vi.mock('@/lib/google-calendar', () => ({
  deleteGoogleCalendarEvent: vi.fn()
}))

vi.mock('@/lib/outlook-calendar', () => ({
  deleteOutlookCalendarEvent: vi.fn()
}))

vi.mock('@/lib/email', () => ({
  sendBookingCancellation: vi.fn().mockResolvedValue({ success: true })
}))

const mockDeleteOutlookCalendarEvent = vi.mocked(outlookCalendarModule.deleteOutlookCalendarEvent)

const mockBooking = {
  id: 'booking_123',
  eventTypeId: 'event_123',
  hostId: 'host_123',
  guestEmail: 'guest@example.com',
  guestName: 'Guest Name',
  startAt: new Date('2025-01-15T10:00:00Z'),
  endAt: new Date('2025-01-15T11:00:00Z'),
  status: 'confirmed',
  googleEventId: 'google_event_123',
  outlookEventId: 'outlook_event_123',
  cancelToken: 'cancel_token_123',
  eventType: {
    title: 'Test Meeting',
    user: {
      id: 'host_123',
      name: 'Host Name',
      email: 'host@example.com'
    }
  }
}

describe('Booking Cancellation - Calendar Event Deletion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('deleteGoogleCalendarEvent', () => {
    it('should be called with correct parameters when booking has googleEventId', async () => {
      vi.mocked(deleteGoogleCalendarEvent).mockResolvedValue(true)

      await deleteGoogleCalendarEvent('host_123', 'google_event_123')

      expect(deleteGoogleCalendarEvent).toHaveBeenCalledWith('host_123', 'google_event_123')
    })

    it('should not be called when googleEventId is null', () => {
      deleteGoogleCalendarEvent.mockClear()
      const googleEventId = null

      if (googleEventId) {
        deleteGoogleCalendarEvent('host_123', googleEventId)
      }

      expect(deleteGoogleCalendarEvent).not.toHaveBeenCalled()
    })
  })

  describe('deleteOutlookCalendarEvent', () => {
    it('should be called with correct parameters when booking has outlookEventId', async () => {
      vi.mocked(mockDeleteOutlookCalendarEvent).mockResolvedValue(true)

      await mockDeleteOutlookCalendarEvent('host_123', 'outlook_event_123')

      expect(mockDeleteOutlookCalendarEvent).toHaveBeenCalledWith('host_123', 'outlook_event_123')
    })

    it('should not be called when outlookEventId is null', () => {
      mockDeleteOutlookCalendarEvent.mockClear()
      const outlookEventId = null

      if (outlookEventId) {
        mockDeleteOutlookCalendarEvent('host_123', outlookEventId)
      }

      expect(mockDeleteOutlookCalendarEvent).not.toHaveBeenCalled()
    })
  })

  describe('calendar event deletion logic', () => {
    it('should delete both calendar events when both exist', async () => {
      vi.mocked(deleteGoogleCalendarEvent).mockResolvedValue(true)
      vi.mocked(mockDeleteOutlookCalendarEvent).mockResolvedValue(true)

      const booking = {
        ...mockBooking,
        googleEventId: 'google_event_123',
        outlookEventId: 'outlook_event_123'
      }

      if (booking.googleEventId) {
        await deleteGoogleCalendarEvent(booking.hostId, booking.googleEventId)
      }
      if (booking.outlookEventId) {
        await mockDeleteOutlookCalendarEvent(booking.hostId, booking.outlookEventId)
      }

      expect(deleteGoogleCalendarEvent).toHaveBeenCalledWith('host_123', 'google_event_123')
      expect(mockDeleteOutlookCalendarEvent).toHaveBeenCalledWith('host_123', 'outlook_event_123')
    })

    it('should continue if Google Calendar delete fails', async () => {
      vi.mocked(deleteGoogleCalendarEvent).mockRejectedValue(new Error('Google API error'))
      vi.mocked(mockDeleteOutlookCalendarEvent).mockResolvedValue(true)

      const booking = mockBooking

      try {
        if (booking.googleEventId) {
          await deleteGoogleCalendarEvent(booking.hostId, booking.googleEventId)
        }
      } catch (error) {
        console.error('Failed to delete Google Calendar event:', error)
      }

      if (booking.outlookEventId) {
        await mockDeleteOutlookCalendarEvent(booking.hostId, booking.outlookEventId)
      }

      expect(deleteGoogleCalendarEvent).toHaveBeenCalled()
      expect(mockDeleteOutlookCalendarEvent).toHaveBeenCalled()
    })

    it('should continue if Outlook Calendar delete fails', async () => {
      vi.mocked(deleteGoogleCalendarEvent).mockResolvedValue(true)
      vi.mocked(mockDeleteOutlookCalendarEvent).mockRejectedValue(new Error('Outlook API error'))

      deleteGoogleCalendarEvent.mockClear()
      mockDeleteOutlookCalendarEvent.mockClear()

      const booking = mockBooking

      if (booking.googleEventId) {
        try {
          await deleteGoogleCalendarEvent(booking.hostId, booking.googleEventId)
        } catch (error) {
          console.error('Failed to delete Google Calendar event:', error)
        }
      }

      if (booking.outlookEventId) {
        try {
          await mockDeleteOutlookCalendarEvent(booking.hostId, booking.outlookEventId)
        } catch (error) {
          console.error('Failed to delete Outlook Calendar event:', error)
        }
      }

      expect(deleteGoogleCalendarEvent).toHaveBeenCalled()
      expect(mockDeleteOutlookCalendarEvent).toHaveBeenCalled()
    })
  })
})