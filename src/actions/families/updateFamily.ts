'use server';

import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { prisma } from '@/lib/prisma';
import { ActionValidation, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { revalidatePath } from 'next/cache';
import { parseFamilyData } from './parseFamilyData';

export const updateFamily = async (
  familyId: number,
  formData: FormData,
  memberId: number | null,
): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.noUser' };
  }

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return { ok: false };

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
