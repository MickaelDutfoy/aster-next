'use server';

import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { MemberRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const promoteAdminOfOrg = async (
  memberId: number,
  orgId: number,
): Promise<ActionValidation> => {
  const guard = await isOrgAdmin(orgId);
  if (!guard.validation.ok) return guard.validation;

  try {
    await prisma.memberOrganization.update({
      where: { memberId_orgId: { memberId, orgId } },
      data: { role: MemberRole.ADMIN },
    });

    revalidatePath(`/organizations/${orgId}`);

    return { ok: true, status: 'success', message: 'toasts.memberPromotedToAdmin' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
