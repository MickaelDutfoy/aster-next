'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { TokenType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const changePassword = async (
  prevstate: any,
  formdata: FormData,
): Promise<ActionValidation> => {
  const password = formdata.get('userPassword')?.toString();
  const passwordConfirm = formdata.get('userPasswordConfirm')?.toString();
  const token = formdata.get('token')?.toString();

  if (!password) {
    return { ok: false, status: 'error', message: 'Tous les champs doivent être remplis.' };
  }

  if (password !== passwordConfirm) {
    return { ok: false, status: 'error', message: 'Les mots de passe ne correspondent pas.' };
  }

  console.log('=========', token);

  if (!token) {
    return {
      ok: false,
      status: 'error',
      message: 'Demande de réinitialisation invalide.',
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

  const passwordHash = await bcrypt.hash(password, 12);

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
