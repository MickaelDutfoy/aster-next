import { Animal } from '@prisma/client';
import { prisma } from '../prisma';

export const getAnimalsByOrg = async (id: number): Promise<Animal[] | null> => {
  const animals: Animal[] | null = await prisma.animal.findMany({
    where: { orgId: id },
    include: { adoption: true },
  });

  return animals;
};
