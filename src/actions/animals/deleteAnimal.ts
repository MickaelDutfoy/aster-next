'use server';

import { canEditOrDeleteAnimal } from '@/lib/permissions/canEditOrDeleteAnimal';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';

export const deleteAnimal = async (animalId: number): Promise<ActionValidation> => {
  const guard = await canEditOrDeleteAnimal(animalId);
  if (!guard.ok) return guard;

  try {
    await prisma.animal.delete({ where: { id: animalId } });

    return { ok: true, status: 'success', message: 'toasts.animalDelete' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
