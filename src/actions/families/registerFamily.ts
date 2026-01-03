'use server';

import { canCreateAnimalOrFamily } from '@/lib/permissions/canCreateAnimalOrFamily';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseFamilyData } from './parseFamilyData';

export const registerFamily = async (
  formData: FormData,
  bindToMember: boolean,
): Promise<ActionValidation> => {
  const guard = await canCreateAnimalOrFamily();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.orgId || !guard.memberId) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }

  const orgId = guard.orgId;
  const memberId = bindToMember ? guard.memberId : null;

  const family = parseFamilyData(formData);

  if (!family) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    await prisma.family.create({
      data: {
        ...family,
        orgId,
        memberId,
      },
    });

    revalidatePath('/families');

    return { ok: true, status: 'success', message: 'toasts.familyAdd' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
