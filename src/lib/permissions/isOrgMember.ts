import { MemberStatus } from '@prisma/client';
import { getSelectedOrg } from '../organizations/getSelectedOrg';
import { prisma } from '../prisma';
import { ActionValidation, Member, Organization } from '../types';
import { getUser } from '../user/getUser';

export const isOrgMember = async (): Promise<{
  validation: ActionValidation;
  org: Organization | null;
  user: Member | null;
}> => {
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
      validation: { ok: false, status: 'error', message: 'toasts.genericError' },
      org: null,
      user: null,
    };

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId: org.id } },
    select: { status: true },
  });

  if (membership?.status !== MemberStatus.VALIDATED) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      org: null,
      user: null,
    };
  }

  return { validation: { ok: true }, org, user };
};
