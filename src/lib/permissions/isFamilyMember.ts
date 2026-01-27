import { getSelectedOrg } from '../organizations/getSelectedOrg';
import { prisma } from '../prisma';
import { ActionValidation, Member, Organization } from '../types';
import { getUser } from '../user/getUser';

export const isFamilyMember = async (
  familyId: number,
): Promise<{
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

  const link = await prisma.familyMember.findUnique({
    where: { familyId_memberId: { familyId, memberId: user.id } },
  });

  if (!link) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      org: null,
      user: null,
    };
  }

  return { validation: { ok: true }, org, user };
};
