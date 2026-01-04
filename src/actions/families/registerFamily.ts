'use server';

import { isOrgMember } from '@/lib/permissions/isOrgMember';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseFamilyData } from './parseFamilyData';

export const registerFamily = async (
  formData: FormData,
  bindToMember: boolean,
): Promise<ActionValidation> => {
  const guard = await isOrgMember();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.org || !guard.user) {
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
    await prisma.family.create({
      data: {
        ...family,
        orgId,
        memberId: userId,
      },
    });

    revalidatePath('/families');

    return { ok: true, status: 'success', message: 'toasts.familyAdd' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
