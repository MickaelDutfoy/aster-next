'use server';

import { signOut } from '@/auth';
import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';

export const deleteAccount = async (deleteFosterFamilies: boolean): Promise<ActionValidation> => {
  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const userId = guard.user.id;

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      if (deleteFosterFamilies) {
        await prismaTransaction.family.deleteMany({
          where: {
            familyMembers: {
              some: { memberId: userId },
              every: { memberId: userId },
            },
          },
        });
      }

      await prismaTransaction.member.delete({ where: { id: userId } });
    });

    await signOut({ redirect: false });

    return { ok: true, message: 'settings.deleteAccount.success' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
