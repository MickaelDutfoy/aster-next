import { prisma } from '../prisma';
import { MemberOfOrg } from '../types';

export const getMembersByOrg = async (orgId: number | undefined): Promise<MemberOfOrg[]> => {
  const membersLinks = await prisma.memberOrganization.findMany({
    where: { orgId },
    select: {
      role: true,
      status: true,
      member: {
        select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true },
      },
    },
  });

  return membersLinks.map((link) => ({
    ...link.member,
    role: link.role,
    status: link.status,
  }));
};
