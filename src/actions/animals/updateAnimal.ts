'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { revalidatePath } from 'next/cache';
import { parseAnimalData } from './parseAnimalData';

export const updateAnimal = async (animalId: number, formData: FormData): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.noUser' };
  }

  const { animal, adopter } = await parseAnimalData(formData, animalId);

  if (!animal || !adopter) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    await prisma.animal.update({
      where: { id: animalId },
      data: {
        ...animal,
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
