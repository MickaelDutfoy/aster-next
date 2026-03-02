'use server';

import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const markAsRead = async (notifId: number) => {
  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const userId = guard.user.id;

  const now = new Date();

  try {
    const res = await prisma.notification.updateMany({
      where: { id: notifId, memberId: userId, readAt: null },
      data: { readAt: now },
    });

    revalidatePath('/notifications');
  } catch (err) {
    console.error(err);
  }
};
