'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { revalidatePath } from 'next/cache';

export const leaveOrg = async (orgId: number): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.noUser' };
  }

  try {
    await prisma.memberOrganization.delete({
      where: { memberId_orgId: { memberId: user.id, orgId } },
    });

    revalidatePath('/organizations');

    return { ok: true, message: 'toasts.orgLeft' };
  } catch (err) {
    console.error(err);
        return {
          ok: false,
          status: 'error',
          message: 'toasts.errorGeneric',
        };
  }
};
