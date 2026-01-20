'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUserWithOrgs } from '@/lib/user/getUserWithOrgs';
import { revalidatePath } from 'next/cache';

export const switchUserToOrg = async (orgId: number): Promise<ActionValidation> => {
  const user: Member | null = await getUserWithOrgs();

  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  if (user.selectedOrgId === orgId) {
    return { ok: true };
  }

  try {
    if (user.organizations?.find((org) => org.id === orgId)) {
      await prisma.member.update({
        where: { id: user.id },
        data: { selectedOrgId: orgId },
      });

      revalidatePath('/', 'layout');

      return { ok: true };
    } else {
      return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
    }
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
