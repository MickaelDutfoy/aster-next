'use server';

import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';

export const toggleAnimalPublishing = async (animalId: number): Promise<ActionValidation> => {
  const guard = await isOrgAdmin();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.orgId) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const orgId = guard.orgId;

  const animal = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { isPubliclyAdoptable: true },
  });

  if (!animal) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  try {
    await prisma.animal.update({
      where: { id: animalId, orgId },
      data: { isPubliclyAdoptable: !animal.isPubliclyAdoptable },
    });

    return { ok: true, status: 'success' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
