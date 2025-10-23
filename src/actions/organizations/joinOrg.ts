'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole, MemberStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const joinOrg = async (orgId: number): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) return { ok: false };

  try {
    if (user.organizations.some((org) => org.id === orgId)) {
      return {
        ok: false,
        status: 'error',
        message: 'Vous faites déjà partie de cette association.',
      };
    }

    await prisma.memberOrganization.create({
      data: {
        orgId: orgId,
        memberId: user.id,
        role: MemberRole.MEMBER,
        status: MemberStatus.PENDING,
      },
    });

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: "Votre demande d'adhésion a été envoyée." };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'Une erreur est survenue.' };
  }
};
