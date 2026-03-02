'use server';

import { isOrgSuperAdmin } from '@/lib/permissions/isOrgSuperAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';

export const deleteAnimal = async (animalId: number): Promise<ActionValidation> => {
  const animal = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { orgId: true },
  });

  if (!animal) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const guard = await isOrgSuperAdmin(animal.orgId);
  if (!guard.validation.ok) return guard.validation;

  try {
    await prisma.animal.delete({ where: { id: animalId } });

    return { ok: true, status: 'success', message: 'toasts.animalDelete' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
