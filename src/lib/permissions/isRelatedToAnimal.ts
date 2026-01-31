import { MemberRole, MemberStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { ActionValidation, Member } from '../types';
import { getUser } from '../user/getUser';

export const isRelatedToAnimal = async (
  animalId: number,
): Promise<{ validation: ActionValidation; user: Member | null }> => {
  const user: Member | null = await getUser();
  if (!user) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.noUser' },
      user: null,
    };
  }

  const animal = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { orgId: true, familyId: true, createdByMemberId: true },
  });

  if (!animal) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.genericError' },
      user: null,
    };
  }

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId: animal.orgId } },
    select: { role: true, status: true },
  });

  if (membership?.status !== MemberStatus.VALIDATED) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      user: null,
    };
  }

  if (membership.role === MemberRole.MEMBER) {
    if (user.id !== animal.createdByMemberId) {
      if (!animal.familyId) {
        return {
          validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
          user: null,
        };
      }

      const familyLink = await prisma.familyMember.findUnique({
        where: {
          familyId_memberId: { familyId: animal.familyId, memberId: user.id },
        },
        select: { familyId: true },
      });

      if (!familyLink) {
        return {
          validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
          user: null,
        };
      }
    }
  }

  return { validation: { ok: true }, user };
};
