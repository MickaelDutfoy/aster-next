'use server';

import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { MemberRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const transferOrgAdmin = async (orgId: number, newAdminId: number): Promise<ActionValidation> => {
  const guard = await isOrgAdmin(orgId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const userId = guard.user.id;

  if (userId === newAdminId) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.memberOrganization.update({
        where: { memberId_orgId: { memberId: userId, orgId } },
        data: { role: MemberRole.MEMBER },
      });
      await prismaTransaction.memberOrganization.update({
        where: { memberId_orgId: { memberId: newAdminId, orgId } },
        data: { role: MemberRole.SUPERADMIN },
      });
    });

    revalidatePath(`/organizations/${orgId}`);

    return { ok: true, status: 'success', message: 'toasts.orgAdminTransfered' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
