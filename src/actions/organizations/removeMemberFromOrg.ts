'use server';

import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const removeMemberFromOrg = async (
  memberId: number,
  orgId: number,
): Promise<ActionValidation> => {
  const guard = await isOrgAdmin(orgId);
  if (!guard.validation.ok) return guard.validation;

  try {
    await prisma.memberOrganization.delete({
      where: { memberId_orgId: { memberId, orgId } },
    });

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: 'toasts.orgMemberRemoved' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
