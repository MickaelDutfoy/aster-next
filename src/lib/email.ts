// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'no-reply@aster.test';

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing');
    throw new Error('Email service not configured');
  }

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (result.error) {
    console.error('Error sending email with Resend:', result.error);
    throw new Error('Failed to send email');
  }

  return result;
}
