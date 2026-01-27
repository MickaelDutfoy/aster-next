import { prisma } from '../prisma';
import { Family } from '../types';

export const getFamilyOfAnimal = async (id: number): Promise<Family | null> => {
  const familyLink = await prisma.animal.findUnique({
    where: { id },
    select: {
      family: {
        include: {
          familyMembers: { include: { member: true } },
        },
      },
    },
  });

  if (!familyLink || !familyLink.family) return null;

  return {
    ...familyLink.family,
    members: familyLink.family.familyMembers.map((famMem) => famMem.member),
  };
};
