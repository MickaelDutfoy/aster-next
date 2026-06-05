import { prisma } from '../prisma';

export const getPublicPageByOrgId = async (orgId: number) => {
  return prisma.organizationPublicPage.findUnique({
    where: { orgId },
    include: {
      organization: {
        select: {
          publicAnimalSheetFooter: true,
        },
      },
    },
  });
};
