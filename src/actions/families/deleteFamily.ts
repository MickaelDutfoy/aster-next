'use server';

import { isFamilyOrgMember } from '@/lib/permissions/isFamilyOrgMember';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { AnimalStatus } from '@prisma/client';

export const deleteFamily = async (familyId: number): Promise<ActionValidation> => {
  const guard = await isFamilyOrgMember(familyId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
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
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
