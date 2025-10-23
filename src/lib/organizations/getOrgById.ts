'use server';

import { prisma } from '../prisma';
import { Organization } from '../types';

export const getOrgById = async (orgId: number): Promise<Organization | null> => {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  return org;
};
