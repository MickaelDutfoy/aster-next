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

  const { animal, adopter, health } = await parseAnimalData(formData, animalId);

  if (!animal) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.animal.update({
        where: { id: animalId },
        data: {
          ...animal,
          updatedByMemberId: userId,
        },
      });

      await prismaTransaction.animalHealthAct.deleteMany({
        where: {
          animalId,
        },
      });

      if (health && health.length > 0) {
        await prismaTransaction.animalHealthAct.createMany({
          data: health.map((act) => ({
            ...act,
            animalId,
          })),
        });
      }

      const adoptSheet = await prismaTransaction.animalAdoption.findUnique({ where: { animalId } });

      if (!adoptSheet && adopter) {
        await prismaTransaction.animalAdoption.create({
          data: {
            animalId,
            ...adopter,
          },
        });
      } else if (!adopter) {
        await prismaTransaction.animalAdoption.deleteMany({
          where: { animalId },
        });
      } else {
        await prismaTransaction.animalAdoption.update({
          where: { animalId },
          data: {
            ...adopter,
          },
        });
      }
    });

    revalidatePath(`/animals/${animalId}`);

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
