import { MemberRole, MemberStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { Animal } from '../types';

export const getAnimalsRelatedToUser = async (userId: number): Promise<Animal[]> => {
  const relatedAnimals: Animal[] = await prisma.animal.findMany({
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
          family: { memberId: userId },
          organization: {
            memberOrganizations: {
              some: {
                memberId: userId,
                role: MemberRole.MEMBER,
                status: MemberStatus.VALIDATED,
              },
            },
          },
        },
      ],
    },
    include: { healthActs: true },
  });

  return relatedAnimals;
};
