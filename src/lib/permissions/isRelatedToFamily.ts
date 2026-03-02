import { MemberRole, MemberStatus } from '@prisma/client';
import { getSelectedOrg } from '../organizations/getSelectedOrg';
import { prisma } from '../prisma';
import { ActionValidation, Member, Organization } from '../types';
import { getUser } from '../user/getUser';

export const isRelatedToFamily = async (
  familyId: number,
): Promise<{ validation: ActionValidation; org: Organization | null; user: Member | null }> => {
  const user: Member | null = await getUser();
  if (!user) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.noUser' },
      org: null,
      user: null,
    };
  }

  const org: Organization | null = await getSelectedOrg(user);
  if (!org)
    return {
      validation: { ok: false, status: 'error', message: 'toasts.errorGeneric' },
      org: null,
      user: null,
    };

  const family = await prisma.family.findUnique({
    where: { id: familyId },
    select: { orgId: true, createdByMemberId: true },
  });

  if (!family) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.errorGeneric' },
      org: null,
      user: null,
    };
  }

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId: family.orgId } },
    select: { role: true, status: true },
  });

  if (membership?.status !== MemberStatus.VALIDATED) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      org: null,
      user: null,
    };
  }

  if (membership.role === MemberRole.MEMBER) {
    const familyLink = await prisma.familyMember.findUnique({
      where: {
        familyId_memberId: { familyId, memberId: user.id },
      },
      select: { familyId: true },
    });

    if (!familyLink && user.id !== family.createdByMemberId) {
      return {
        validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
        org: null,
        user: null,
      };
    }
  }

  return { validation: { ok: true }, org, user };
};
