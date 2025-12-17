import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'no-reply@aster.test';
const APP_NAME = 'Aster';
const LOGO_URL = 'https://aster-pearl.vercel.app/icons/aster-icon-192.png';

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

function withEmailLayout(bodyHtml: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px">
      <div style="text-align: center; margin-bottom: 14px">
        <img
          src="${LOGO_URL}"
          alt="Logo ${APP_NAME}"
          width="64"
          style="border-radius: 8px"
        />
        <h1 style="font-size: 20px; margin: 16px 0 0">${APP_NAME}</h1>
      </div>
      ${bodyHtml}
    </div>
  `;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing');
    throw new Error('Email service not configured');
  }

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html: withEmailLayout(html),
  });

  if (result.error) {
    console.error('Error sending email with Resend:', result.error);
    throw new Error('Failed to send email');
  }

  return result;
}
