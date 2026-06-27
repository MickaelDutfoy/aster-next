'use server';

import { isAdminOfOrg } from '@/lib/permissions/isAdminOfOrg';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { MemberRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const downgradeToMember = async (
  memberId: number,
  orgId: number,
): Promise<ActionValidation> => {
  const guard = await isAdminOfOrg(orgId);
  if (!guard.validation.ok) return guard.validation;

  try {
    await prisma.memberOrganization.update({
      where: { memberId_orgId: { memberId, orgId } },
      data: { role: MemberRole.MEMBER },
    });

    revalidatePath(`/organizations/${orgId}`);

    return { ok: true, status: 'success', message: 'toasts.adminDowngradedToMember' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
