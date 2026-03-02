'use server';

import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const cancelOrgRequest = async (orgId: number): Promise<ActionValidation> => {
  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const userId = guard.user.id;

  try {
    await prisma.memberOrganization.delete({
      where: { memberId_orgId: { memberId: userId, orgId } },
    });

    revalidatePath('/organizations');

    return { ok: true, message: 'toasts.orgRequestCanceled' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
