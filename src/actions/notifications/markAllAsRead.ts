'use server';

import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const markAllAsRead = async (): Promise<ActionValidation> => {
  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }

  const userId = guard.user.id;

  const now = new Date();

  try {
    await prisma.notification.updateMany({ where: { memberId: userId }, data: { readAt: now } });

    revalidatePath('/notifications');

    return { ok: true };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
