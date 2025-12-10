'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { revalidatePath } from 'next/cache';
import { parseAnimalData } from './parseAnimalData';

export const updateAnimal = async (animalId: number, formData: FormData): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'Utilisateur non authentifié.' };
  }

  const { animal, adopter } = await parseAnimalData(formData, animalId);

  if (!animal || !adopter) {
    return { ok: false, status: 'error', message: 'Des champs obligatoires sont incomplets.' };
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

    return { ok: true, status: 'success', message: 'Les informations ont été modifiées.' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: "Une erreur s'est produite." };
  }
};
