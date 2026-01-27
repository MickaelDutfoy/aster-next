import { prisma } from '../prisma';
import { Family } from '../types';

export const getFamilyById = async (id: number | null): Promise<Family | null> => {
  if (!id) return null;

  const family = await prisma.family.findUnique({
    where: { id },
    include: {
      familyMembers: {
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
    },
  });

  if (!family) return null;

  return {
    id: family.id,
    contactFullName: family.contactFullName,
    email: family.email,
    phoneNumber: family.phoneNumber,
    address: family.address,
    zip: family.zip,
    city: family.city,
    hasChildren: family.hasChildren,
    otherAnimals: family.otherAnimals,
    orgId: family.orgId,
    members: family.familyMembers.map((famMem) => famMem.member),
  };
};
