'use server';

import { isRelatedToFamily } from '@/lib/permissions/isRelatedToFamily';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseFamilyData } from './parseFamilyData';

export const updateFamily = async (familyId: number, formData: FormData): Promise<ActionValidation> => {
  const guard = await isRelatedToFamily(familyId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user || !guard.org) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const userId = guard.user.id;

  const family = parseFamilyData(formData);

  if (!family) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.family.update({
        where: { id: familyId },
        data: {
          ...family,
        },
      });
    });

    revalidatePath(`/families/${familyId}`);

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
