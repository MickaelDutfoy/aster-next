'use server';

import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { TokenType } from '@prisma/client';
import crypto from 'crypto';

const RESET_TOKEN_LIFETIME_MS = 1000 * 60 * 60;

export const sendResetPasswordMail = async (
  prevState: any,
  formData: FormData,
): Promise<ActionValidation> => {
  const origin = process.env.AUTH_URL;

  const email = formData.get('userEmail')?.toString().trim();

  if (!email) {
    return {
      ok: false,
      status: 'error',
      message: 'Merci de renseigner votre adresse e-mail.',
    };
  }

  try {
    const member = await prisma.member.findUnique({
      where: { email },
    });

    if (!member) {
      return {
        ok: true,
        status: 'success',
        message: 'Si un compte existe avec cet e-mail, un message vient de lui être envoyé.',
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

    const resetUrl = `${origin}/new-password?token=${encodeURIComponent(token)}`;

    await sendEmail({
      to: email,
      subject: 'Aster – réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img
              src="https://aster-pearl.vercel.app/icons/aster-icon-192.png"
              alt="Logo Aster"
              width="64"
              style="border-radius: 8px;"
            />
            <h1 style="font-size: 20px; margin: 16px 0 0;">Aster</h1>
          </div>

          <p>Bonjour,</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe Aster.</p>
          <p>Pour choisir un nouveau mot de passe, cliquez sur le lien ci-dessous&nbsp;:</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#653d24;color:white;text-decoration:none;border-radius:4px;">
              Définir un nouveau mot de passe
            </a>
          </p>
          <p style="font-size: 13px; color:#666;">
            Ce lien est valable pendant 1 heure. Passé ce délai, il faudra refaire une demande de réinitialisation.
          </p>
          <p>Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer ce message.</p>
          <p>À bientôt sur Aster 🐾</p>
        </div>
      `,
    });

    return {
      ok: true,
      status: 'success',
      message: 'Si un compte existe avec cet e-mail, un message vient de lui être envoyé.',
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: "Une erreur est survenue lors de l'envoi de l'e-mail.",
    };
  }
};
