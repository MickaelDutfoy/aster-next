'use server';

import { canEditOrDeleteFamily } from '@/lib/permissions/canEditOrDeleteFamily';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseFamilyData } from './parseFamilyData';

export const updateFamily = async (
  familyId: number,
  formData: FormData,
  bindToMember: boolean,
): Promise<ActionValidation> => {
  const guard = await canEditOrDeleteFamily(familyId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.memberId) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }

  const memberId = bindToMember ? guard.memberId : null;
  const family = parseFamilyData(formData);

  if (!family) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    const res = await prisma.family.update({
      where: { id: familyId },
      data: {
        ...family,
        memberId,
      },
    });

    revalidatePath('/families');

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
