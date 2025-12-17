'use server';

import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/schemas/authSchemas';
import { ActionValidation } from '@/lib/types';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { TokenType } from '@prisma/client';
import crypto from 'crypto';
import { getTranslations } from 'next-intl/server';

const RESET_TOKEN_LIFETIME_MS = 1000 * 60 * 60;

export const sendResetPasswordMail = async (
  formData: FormData,
  locale: string,
): Promise<ActionValidation> => {
  const t = await getTranslations({ locale, namespace: 'emails' });

  const emailForm = formData.get('userEmail')?.toString().trim().toLowerCase();
  const parsedEmail = resetPasswordSchema.safeParse(emailForm);

  if (!parsedEmail.success) {
    return {
      ok: false,
      status: 'error',
      message: zodErrorMessage(parsedEmail.error),
    };
  }

  const email = parsedEmail.data;

  try {
    const member = await prisma.member.findUnique({
      where: { email },
    });

    if (!member) {
      return {
        ok: true,
        status: 'success',
        message: 'auth.resetPassword.sent',
      };
    }

    await prisma.authToken.deleteMany({
      where: {
        memberId: member.id,
        type: TokenType.RESET_PASSWORD,
      },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + RESET_TOKEN_LIFETIME_MS);

    await prisma.authToken.create({
      data: {
        memberId: member.id,
        tokenHash,
        type: TokenType.RESET_PASSWORD,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.AUTH_URL}/new-password?token=${encodeURIComponent(token)}`;

    await sendEmail({
      to: email,
      subject: t('resetPassword.subject'),
      html: `
        <p>${t('common.hello')}</p>
        <p>${t('resetPassword.intro')}</p>
        <p>${t('resetPassword.ctaIntro')}</p>
        <p style="text-align: center">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 10px 16px;
              background: #653d24;
              color: white;
              text-decoration: none;
              border-radius: 4px;
            "
          >
            ${t('resetPassword.cta')}
          </a>
        </p>
        <p style="font-size: 13px; color: #666">
          ${t('resetPassword.expiry')}
        </p>
        <p>${t('resetPassword.ignore')}</p>
        <p>${t('common.footer')}</p>
      `,
    });

    return {
      ok: true,
      status: 'success',
      message: 'auth.resetPassword.sent',
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'auth.resetPassword.error',
    };
  }
};
