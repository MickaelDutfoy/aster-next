'use server';

import { canCreateAnimalOrFamily } from '@/lib/permissions/canCreateAnimalOrFamily';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseAnimalData } from './parseAnimalData';

export const registerAnimal = async (formData: FormData): Promise<ActionValidation> => {
  const guard = await canCreateAnimalOrFamily();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.orgId) return { ok: false, status: 'error', message: 'toasts.genericError' };

  const orgId = guard.orgId;
  const memberId = guard.memberId;

  const { animal, adopter } = await parseAnimalData(formData);

  if (!animal || !adopter) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      const res = await prismaTransaction.animal.create({
        data: {
          ...animal,
          orgId,
          createdByMemberId: memberId,
        },
      });

      await prismaTransaction.animalAdoption.create({
        data: {
          ...adopter,
          animalId: res.id,
        },
      });
    });

    revalidatePath('/animals');

    return { ok: true, status: 'success', message: 'toasts.animalAdd' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
