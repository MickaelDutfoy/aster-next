'use server';

import { isOrgSuperAdmin } from '@/lib/permissions/isOrgSuperAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { AnimalStatus } from '@prisma/client';

export const deleteFamily = async (familyId: number): Promise<ActionValidation> => {
  const family = await prisma.family.findUnique({
    where: { id: familyId },
    select: { orgId: true },
  });

  if (!family) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const guard = await isOrgSuperAdmin(family.orgId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  try {
    await prisma.animal.updateMany({
      where: { familyId },
      data: { status: AnimalStatus.UNHOSTED, familyId: null },
    });

    await prisma.family.delete({ where: { id: familyId } });

    return { ok: true, status: 'success', message: 'toasts.familyDelete' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
