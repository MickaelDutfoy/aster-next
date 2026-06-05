import { AnimalStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { AnimalWithoutDetails } from '../types';

export const getAnimalsInCare = async (orgId: number): Promise<AnimalWithoutDetails[]> => {
  const animals: AnimalWithoutDetails[] = await prisma.animal.findMany({
    where: {
      orgId,
      status: { in: [AnimalStatus.UNHOSTED, AnimalStatus.FOSTERED, AnimalStatus.IN_TRIAL] },
    },
    select: {
      id: true,
      name: true,
      species: true,
      sex: true,
      birthDate: true,
      status: true,
      imageKey: true,
      isPubliclyAdoptable: true,
      publicDescription: true,
    },
  });

  return animals;
};
