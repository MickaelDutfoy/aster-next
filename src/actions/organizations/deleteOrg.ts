'use server';

import { isOrgSuperAdmin } from '@/lib/permissions/isOrgSuperAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const deleteOrg = async (orgId: number, formData: FormData): Promise<ActionValidation> => {
  const guard = await isOrgSuperAdmin(orgId);
  if (!guard.validation.ok) return guard.validation;

  const verifyOrgName = formData.get('verifyOrgName')?.toString().trim();

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { name: true },
  });

  if (!org || verifyOrgName !== org.name) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.orgNameRequired',
    };
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.member.updateMany({
        where: { selectedOrgId: orgId },
        data: { selectedOrgId: null },
      });

      await prismaTransaction.organization.delete({ where: { id: orgId } });
    });

    revalidatePath(`/organizations`);

    return { ok: true, status: 'success', message: 'toasts.orgEditSuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'toasts.genericError' };
  }
};
