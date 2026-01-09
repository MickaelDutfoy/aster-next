import { Animal } from '@prisma/client';
import { prisma } from '../prisma';

export const getAnimalsByOrg = async (id: number): Promise<Animal[]> => {
  const animals: Animal[] = await prisma.animal.findMany({
    where: { orgId: id },
  });

  return animals;
};
