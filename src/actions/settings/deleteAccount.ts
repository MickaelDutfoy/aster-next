'use server';

import { signOut } from '@/auth';
import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { MemberRole } from '@prisma/client';

export const deleteAccount = async (deleteFosterFamilies: boolean): Promise<ActionValidation> => {
  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const userId = guard.user.id;

  const hasSuperAdminRole = await prisma.memberOrganization.findFirst({
    where: {
      memberId: userId,
      role: MemberRole.SUPERADMIN,
    },
    select: { orgId: true },
  });

  if (hasSuperAdminRole) {
    return {
      ok: false,
      status: 'error',
      message: 'settings.deleteAccount.cantIfSuperAdmin',
    };
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      if (deleteFosterFamilies) {
        await prismaTransaction.family.deleteMany({
          where: {
            members: {
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
