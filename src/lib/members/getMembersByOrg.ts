import { prisma } from '../prisma';
import { MemberOfOrg } from '../types';

export const getMembersByOrg = async (orgId: number | undefined): Promise<MemberOfOrg[]> => {
  const rawMembers = await prisma.member.findMany({
    where: {
      memberOrganizations: {
        some: { orgId },
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      memberOrganizations: {
        where: { orgId },
        select: {
          role: true,
          status: true,
        },
      },
    },
  });

  const members: MemberOfOrg[] = rawMembers.map((member) => {
    const link = member.memberOrganizations[0];

    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: link.role,
      status: link.status,
    };
  });

  return members;
};
