import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'Meetra <noreply@meetra.com>';

interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  eventTypeTitle: string;
  startTime: string;
  endTime: string;
  durationMin: number;
  hostName: string;
  hostEmail: string;
  cancelUrl: string;
}

interface ReminderEmailData {
  guestName: string;
  guestEmail: string;
  eventTypeTitle: string;
  startTime: string;
  endTime: string;
  durationMin: number;
  hostName: string;
}

interface CancellationEmailData {
  guestName: string;
  guestEmail: string;
  eventTypeTitle: string;
  startTime: string;
  hostName: string;
  hostEmail: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const { guestName, guestEmail, eventTypeTitle, startTime, endTime, durationMin, hostName, hostEmail, cancelUrl } = data;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: guestEmail,
      subject: `Booking Confirmed: ${eventTypeTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #6332E5; margin: 0;">✓ Booking Confirmed</h1>
          </div>
          
          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 18px;">${eventTypeTitle}</h2>
            
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #666;">📅</span>
                <span>${formatDate(startTime)}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #666;">⏰</span>
                <span>${formatTime(startTime)} - ${formatTime(endTime)} (${durationMin} min)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #666;">👤</span>
                <span>With ${hostName}</span>
              </div>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">
            A calendar invitation has been sent to your email.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 24px;">
            <p style="color: #999; font-size: 12px; margin-bottom: 16px;">
              Need to cancel? <a href="${cancelUrl}" style="color: #dc2626; text-decoration: none;">Cancel Booking →</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Powered by <strong style="color: #6332E5;">Meetra</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendBookingReminder(data: ReminderEmailData) {
  const { guestName, guestEmail, eventTypeTitle, startTime, endTime, durationMin, hostName } = data;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: guestEmail,
      subject: `Reminder: ${eventTypeTitle} starts in 2 hours`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #F59E0B; margin: 0;">⏰ Reminder</h1>
            <p style="color: #666; margin: 8px 0 0 0;">Your booking starts in 2 hours</p>
          </div>
          
          <div style="background: #fef3c7; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 18px;">${eventTypeTitle}</h2>
            
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #666;">📅</span>
                <span>${formatDate(startTime)}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #666;">⏰</span>
                <span>${formatTime(startTime)} - ${formatTime(endTime)} (${durationMin} min)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #666;">👤</span>
                <span>With ${hostName}</span>
              </div>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Make sure you're ready a few minutes early. The meeting link will be available in your calendar.
          </p>
          
          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Powered by <strong style="color: #6332E5;">Meetra</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    return { success: false, error };
  }
}

export async function sendBookingCancellation(data: CancellationEmailData) {
  const { guestName, guestEmail, eventTypeTitle, startTime, hostName, hostEmail } = data;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: [guestEmail, hostEmail],
      subject: `Booking Cancelled: ${eventTypeTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #dc2626; margin: 0;">✕ Booking Cancelled</h1>
          </div>
          
          <div style="background: #fef2f2; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 18px;">${eventTypeTitle}</h2>
            
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #666;">📅</span>
                <span>${formatDate(startTime)}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #666;">👤</span>
                <span>With ${hostName}</span>
              </div>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This booking has been cancelled. If you did not request this cancellation, please contact the host directly.
          </p>
          
          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Powered by <strong style="color: #6332E5;">Meetra</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
    return { success: false, error };
  }
}

export async function sendTestEmail(to: string) {
  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: 'Meetra Email Test',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #6332E5; margin: 0;">✓ Email Working!</h1>
          </div>
          <p style="color: #666;">This is a test email from Meetra. Your email system is configured correctly.</p>
          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Powered by <strong style="color: #6332E5;">Meetra</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Failed to send test email:', error);
    return { success: false, error };
  }
}
