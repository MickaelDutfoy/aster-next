'use server';

import { signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export const deleteAccount = async (deleteFosterFamilies: boolean): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.noUser' };
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      if (deleteFosterFamilies) {
        await prismaTransaction.family.deleteMany({ where: { memberId: user.id } });
      }

      await prismaTransaction.member.delete({ where: { id: user.id } });
    });

    await signOut({ redirect: false });

    return { ok: true, message: 'settings.deleteAccount.success' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
