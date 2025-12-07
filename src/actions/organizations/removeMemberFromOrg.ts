'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { revalidatePath } from 'next/cache';

export const removeMemberFromOrg = async (
  memberId: number,
  orgId: number,
): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) return { ok: false };

  try {
    await prisma.memberOrganization.delete({
      where: { memberId_orgId: { memberId, orgId } },
    });

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: "Ce membre a été retiré de l'association." };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'Une erreur est survenue.' };
  }
};
