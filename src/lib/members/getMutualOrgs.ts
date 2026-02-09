import { prisma } from '../prisma';
import { Organization } from '../types';

export const getMutualOrgs = async (userId: number, memberId: number): Promise<Organization[]> => {
  const orgsInCommon = prisma.organization.findMany({
    where: {
      AND: [
        {
          memberOrganizations: {
            some: { memberId: userId },
          },
        },
        {
          memberOrganizations: {
            some: { memberId },
          },
        },
      ],
    },
  });

  return orgsInCommon;
};
