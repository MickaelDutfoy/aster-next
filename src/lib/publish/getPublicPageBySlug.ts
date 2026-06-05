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
            orderBy: {
              name: 'asc',
            },
          },
        },
      },
    },
  });
};
