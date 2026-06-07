import { prisma } from '../prisma';

export const getAllPagesSlugs = async (): Promise<string[]> => {
  const pages = await prisma.organizationPublicPage.findMany({
    select: {
      slug: true,
    },
  });

  return pages.map((page) => page.slug);
};
