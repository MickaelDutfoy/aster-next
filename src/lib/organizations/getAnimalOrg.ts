'use server';

import { prisma } from '../prisma';
import { Organization } from '../types';

export const getAnimalOrg = async (animalId: number): Promise<Organization | null> => {
  const animal = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { organization: true },
  });

  if (!animal) return null;

  return animal.organization;
};
