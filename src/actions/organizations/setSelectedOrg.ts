'use server';

import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const setSelectedOrg = async (orgId: number | null): Promise<ActionValidation> => {
  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const userId = guard.user.id;

  try {
    if (orgId !== null) {
      const membership = await prisma.memberOrganization.findUnique({
        where: {
          memberId_orgId: {
            memberId: userId,
            orgId,
          },
        },
        select: {
          memberId: true,
        },
      });

      if (!membership) {
        return {
          ok: false,
          status: 'error',
          message: 'toasts.notAllowed',
        };
      }
    }

    await prisma.member.update({
      where: { id: userId },
      data: { selectedOrgId: orgId },
    });

    revalidatePath('/', 'layout');

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
