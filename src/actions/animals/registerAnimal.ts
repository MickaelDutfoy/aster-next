'use server';

import { isOrgMember } from '@/lib/permissions/isOrgMember';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseAnimalData } from './parseAnimalData';

export const registerAnimal = async (formData: FormData): Promise<ActionValidation> => {
  const guard = await isOrgMember();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.org || !guard.user)
    return { ok: false, status: 'error', message: 'toasts.genericError' };

  const orgId = guard.org.id;
  const userId = guard.user.id;

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
          createdByMemberId: userId,
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
