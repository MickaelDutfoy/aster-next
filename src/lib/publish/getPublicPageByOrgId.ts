import { prisma } from '../prisma';
import { OrganizationPublicPage } from '../types';

export const getPublicPageByOrgId = async (
  orgId: number,
): Promise<OrganizationPublicPage | null> => {
  const publicPage = await prisma.organizationPublicPage.findUnique({
    where: { orgId },
  });

  return publicPage;
};