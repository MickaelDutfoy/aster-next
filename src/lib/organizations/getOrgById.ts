'use server';

import { prisma } from '../prisma';
import { Organization } from '../types';

export const getOrgById = async (orgId: number | null): Promise<Organization | null> => {
  if (orgId) {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    return org;
  } else {
    return null;
  }
};
