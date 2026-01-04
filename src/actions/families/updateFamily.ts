'use server';

import { isFamilyOrgMember } from '@/lib/permissions/isFamilyOrgMember';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseFamilyData } from './parseFamilyData';

export const updateFamily = async (
  familyId: number,
  formData: FormData,
  bindToMember: boolean,
): Promise<ActionValidation> => {
  const guard = await isFamilyOrgMember(familyId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user || !guard.org) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }

  const orgId = guard.org.id;
  const userId = bindToMember ? guard.user.id : null;

  if (bindToMember) {
    const checkUnique = await prisma.family.findFirst({ where: { orgId, memberId: userId } });

    if (checkUnique) {
      return { ok: false, status: 'error', message: 'families.fosterInOrgToast' };
    }
  }

  const family = parseFamilyData(formData);

  if (!family) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    const res = await prisma.family.update({
      where: { id: familyId },
      data: {
        ...family,
        memberId: userId,
      },
    });

    revalidatePath('/families');

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
