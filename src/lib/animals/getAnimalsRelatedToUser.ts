import { MemberRole, MemberStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { Animal } from '../types';

export const getAnimalsRelatedToUser = async (userId: number): Promise<Animal[]> => {
  return prisma.animal.findMany({
    where: {
      OR: [
        {
          organization: {
            memberOrganizations: {
              some: {
                memberId: userId,
                role: MemberRole.SUPERADMIN,
              },
            },
          },
        },
        {
          organization: {
            memberOrganizations: {
              some: {
                memberId: userId,
                role: MemberRole.MEMBER,
                status: MemberStatus.VALIDATED,
              },
            },
          },
          family: {
            is: {
              familyMembers: {
                some: { memberId: userId },
              },
            },
          },
        },
      ],
    },
    include: { healthActs: true },
  });
};
