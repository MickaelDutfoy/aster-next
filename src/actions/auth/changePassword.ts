'use server';

import { prisma } from '@/lib/prisma';
import { newPasswordSchema } from '@/lib/schemas/authSchemas';
import { ActionValidation } from '@/lib/types';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { TokenType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const changePassword = async (formData: FormData): Promise<ActionValidation> => {
  const token = formData.get('token')?.toString();

  const newPasswordForm = {
    password: formData.get('userPassword')?.toString(),
    passwordConfirm: formData.get('userPasswordConfirm')?.toString(),
  };

  const parsedNewPassword = newPasswordSchema.safeParse(newPasswordForm);

  if (!parsedNewPassword.success) {
    return {
      ok: false,
      status: 'error',
      message: zodErrorMessage(parsedNewPassword.error),
    };
  }

  const newPassword = parsedNewPassword.data;

  if (!token) {
    return {
      ok: false,
      status: 'error',
      message: 'Demande de réinitialisation invalide ou expirée.',
    };
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const authToken = await prisma.authToken.findFirst({
    where: {
      tokenHash,
      type: TokenType.RESET_PASSWORD,
      expiresAt: { gt: new Date() },
    },
  });

  if (!authToken) {
    return {
      ok: false,
      status: 'error',
      message: 'Demande de réinitialisation invalide ou expirée.',
    };
  }

  const passwordHash = await bcrypt.hash(newPassword.password, 12);

  try {
    await prisma.member.update({
      where: { id: authToken.memberId },
      data: { passwordHash },
    });

    await prisma.authToken.delete({
      where: { id: authToken.id },
    });

    return {
      ok: true,
      status: 'success',
      message: 'Votre mot de passe a été mis à jour.',
    };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'Une erreur est survenue.' };
  }
};
