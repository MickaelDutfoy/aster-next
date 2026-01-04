'use server';

import { isNotOrgAdmin } from '@/lib/permissions/isNotOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const leaveOrg = async (orgId: number): Promise<ActionValidation> => {
  const guard = await isNotOrgAdmin(orgId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }

  const userId = guard.user.id;

  try {
    await prisma.memberOrganization.delete({
      where: { memberId_orgId: { memberId: userId, orgId } },
    });

    revalidatePath('/organizations');

    return { ok: true, message: 'toasts.orgLeft' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
