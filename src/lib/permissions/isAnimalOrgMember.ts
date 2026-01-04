import { MemberStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { ActionValidation, Member } from '../types';
import { getUser } from '../user/getUser';

export const isAnimalOrgMember = async (
  animalId: number,
): Promise<{ validation: ActionValidation; user: Member | null }> => {
  const user: Member | null = await getUser();
  if (!user) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.noUser' },
      user: null,
    };
  }

  const animalPrev = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { orgId: true },
  });

  if (!animalPrev) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.genericError' },
      user: null,
    };
  }

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId: animalPrev.orgId } },
    select: { status: true },
  });

  if (membership?.status !== MemberStatus.VALIDATED) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      user: null,
    };
  }

  return { validation: { ok: true }, user };
};
