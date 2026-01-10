import { prisma } from '../prisma';
import { AnimalWithoutDetails } from '../types';

export const getAnimalsByOrg = async (id: number): Promise<AnimalWithoutDetails[]> => {
  const animals: AnimalWithoutDetails[] = await prisma.animal.findMany({
    where: { orgId: id },
    select: {
      id: true,
      name: true,
      species: true,
      sex: true,
      birthDate: true,
      status: true,
    },
  });

  return animals;
};
