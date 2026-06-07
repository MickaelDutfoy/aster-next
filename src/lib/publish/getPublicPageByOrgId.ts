import { prisma } from '../prisma';

export const getPublicPageByOrgId = async (orgId: number) => {
  const publicPage = await prisma.organizationPublicPage.findUnique({
    where: { orgId },
    include: {
      organization: {
        select: {
          publicAnimalSheetFooter: true,
        },
      },
    },
  });

  if (!publicPage) return null;

  return {
    ...publicPage,
    publicAnimalSheetFooter: publicPage.organization.publicAnimalSheetFooter,
  };
};