import { AnimalStatus } from '@prisma/client';
import { prisma } from '../prisma';

export const getPublicPageBySlug = async (slug: string) => {
  return prisma.organizationPublicPage.findUnique({
    where: { slug },
    include: {
      organization: {
        include: {
          animals: {
            where: {
              isPubliclyAdoptable: true,
              status: { in: [AnimalStatus.UNHOSTED, AnimalStatus.FOSTERED, AnimalStatus.IN_TRIAL] },
            },
            select: {
              id: true,
              name: true,
              species: true,
              sex: true,
              birthDate: true,
              isNeutered: true,
              status: true,
              healthActs: true,
              testEntries: true,
              imageKey: true,
              imageUpdatedAt: true,
              publicDescription: true,
              family: {
                select: {
                  city: true,
                },
              },
            },
            orderBy: {
              name: 'asc',
            },
          },
        },
      },
    },
  });
};
