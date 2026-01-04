'use server';

import { isAnimalOrgMember } from '@/lib/permissions/isAnimalOrgMember';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseAnimalData } from './parseAnimalData';

export const updateAnimal = async (
  animalId: number,
  formData: FormData,
): Promise<ActionValidation> => {
  const guard = await isAnimalOrgMember(animalId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }

  const userId = guard.user.id;

  const { animal, adopter } = await parseAnimalData(formData, animalId);

  if (!animal || !adopter) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    await prisma.animal.update({
      where: { id: animalId },
      data: {
        ...animal,
        updatedByMemberId: userId,
      },
    });

    const adoptSheet = await prisma.animalAdoption.findUnique({ where: { animalId } });

    if (!adoptSheet) {
      await prisma.animalAdoption.create({
        data: {
          animalId,
          ...adopter,
        },
      });
    } else {
      await prisma.animalAdoption.update({
        where: { animalId },
        data: {
          ...adopter,
        },
      });
    }

    revalidatePath(`/animals/${animalId}`);

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
