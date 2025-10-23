'use server';

import { MemberStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { PendingOrgRequest } from '../types';

export const getPendingOrgRequests = async (
  orgId: number | undefined,
): Promise<PendingOrgRequest[] | null> => {
  if (!orgId) return null;

  const rawRequests = await prisma.memberOrganization.findMany({
    where: { orgId, status: MemberStatus.PENDING },
    select: { member: true, organization: true },
  });

  const requests: PendingOrgRequest[] = rawRequests.map((req) => {
    return {
      memberId: req.member.id,
      orgId: req.organization.id,
      memberName: req.member.firstName + ' ' + req.member.lastName,
      orgName: req.organization.name,
    };
  });

  return requests;
};
