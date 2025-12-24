'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const transferOrgAdmin = async (
  orgId: number,
  previousAdminId: number,
  newAdminId: number,
): Promise<ActionValidation> => {
  if (previousAdminId === newAdminId) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }

  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.noUser' };
  }

  const checkAdmin = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: previousAdminId, orgId } },
  });

  if (!checkAdmin || checkAdmin.role !== MemberRole.SUPERADMIN) {
    return { ok: false, status: 'error', message: 'toasts.notAllowed' };
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.memberOrganization.update({
        where: { memberId_orgId: { memberId: previousAdminId, orgId } },
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
