import { prisma } from '../prisma';

export const getOrgDetailsBySlug = async (slug: string) => {
  return prisma.organizationPublicPage.findUnique({
    where: { slug },
    include: {
      organization: {
        select: {
          name: true,
          description: true,
        },
      },
    },
  });
};
