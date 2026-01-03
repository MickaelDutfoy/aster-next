'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { revalidatePath } from 'next/cache';

export const setSelectedOrg = async (orgId: number | null): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.noUser' };
  }

  try {
    await prisma.member.update({
      where: { id: user.id },
      data: { selectedOrgId: orgId },
    });

    revalidatePath('/', 'layout'); // invalide large, marche partout

    return { ok: true };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
