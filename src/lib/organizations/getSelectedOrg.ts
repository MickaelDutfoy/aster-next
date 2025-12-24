import { prisma } from '../prisma';
import { Member, Organization } from '../types';

export const getSelectedOrg = async (user: Member): Promise<Organization | null> => {
  const org: Organization | null =
    user.organizations.find((org) => org.id === user.selectedOrgId) ?? null;

  if (!org) return null;

  const memberId = user.id;
  const orgId = org.id;

  const memberOrg = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId, orgId } },
    select: {
      status: true,
      role: true,
    },
  });

  org.userRole = memberOrg?.role;
  org.userStatus = memberOrg?.status;

  return org;
};
