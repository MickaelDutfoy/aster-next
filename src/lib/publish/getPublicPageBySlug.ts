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
            },
            select: {
              id: true,
              name: true,
              species: true,
              sex: true,
              color: true,
              birthDate: true,
              isNeutered: true,
              status: true,
              updatedAt: true,
              healthActs: true,
              testEntries: true,
              imageKey: true,
              publicDescription: true,
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
