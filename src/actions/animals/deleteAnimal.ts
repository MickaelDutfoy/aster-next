'use server';

import { isAnimalOrgMember } from '@/lib/permissions/isAnimalOrgMember';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';

export const deleteAnimal = async (animalId: number): Promise<ActionValidation> => {
  const guard = await isAnimalOrgMember(animalId);
  if (!guard.validation.ok) return guard.validation;

  try {
    await prisma.animal.delete({ where: { id: animalId } });

    return { ok: true, status: 'success', message: 'toasts.animalDelete' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
