import { prisma } from '../prisma';
import { OrganizationPublicPage } from '../types';

export const getOrganizationPageDetails = async (
  orgId: number,
): Promise<OrganizationPublicPage | null> => {
  const orgPageDetails: OrganizationPublicPage | null =
    await prisma.organizationPublicPage.findUnique({
      where: { orgId },
    });

  return orgPageDetails;
};
