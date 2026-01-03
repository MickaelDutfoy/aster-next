import { MemberStatus } from '@prisma/client';
import { getSelectedOrg } from '../organizations/getSelectedOrg';
import { prisma } from '../prisma';
import { ActionValidation, Member, Organization } from '../types';
import { getUser } from '../user/getUser';

export const canCreateAnimalOrFamily = async (): Promise<{
  validation: ActionValidation;
  orgId: number | undefined;
  memberId: number | undefined;
}> => {
  const user: Member | null = await getUser();
  if (!user) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.noUser' },
      orgId: undefined,
      memberId: undefined,
    };
  }

  const org: Organization | null = await getSelectedOrg(user);
  if (!org)
    return {
      validation: { ok: false, status: 'error', message: 'toasts.genericError' },
      orgId: undefined,
      memberId: undefined,
    };

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId: org.id } },
    select: { status: true },
  });

  if (membership?.status !== MemberStatus.VALIDATED) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      orgId: undefined,
      memberId: undefined,
    };
  }

  return { validation: { ok: true }, orgId: org.id, memberId: user.id };
};
