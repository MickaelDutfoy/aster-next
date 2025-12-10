'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole, MemberStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const registerOrg = async (formData: FormData): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'Utilisateur non authentifié.' };
  }

  const orgName = formData.get('orgName')?.toString().trim();

  if (!orgName) {
    return {
      ok: false,
      status: 'error',
      message: "Vous devez saisir un nom d'association.",
    };
  }

  try {
    const res = await prisma.organization.create({
      data: { name: orgName },
    });

    await prisma.memberOrganization.create({
      data: {
        memberId: user?.id,
        orgId: res.id,
        role: MemberRole.SUPERADMIN,
        status: MemberStatus.VALIDATED,
      },
    });

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: 'Votre association a bien été enregistrée.' };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'Une erreur est survenue.' };
  }
};
