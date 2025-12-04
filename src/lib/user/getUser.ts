import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import 'server-only';
import { Member, Organization } from '../types';

export const getUser = cache(async (): Promise<Member | null> => {
  const session = await auth();
  if (!session?.user?.email) return null;

  try {
    // fetch member info
    const res = await prisma.member.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        memberOrganizations: true,
      },
    });

    if (!res) return null;

    // fetch member's organizations
    const memberOrgs: Organization[] = await prisma.organization.findMany({
      where: { id: { in: res.memberOrganizations?.map((mo) => mo.orgId) } },
      select: { id: true, name: true },
    });

    // add member role and status for each organization
    const organizations =
      memberOrgs.map((org) => ({
        ...org,
        userRole: res.memberOrganizations?.find((mo) => mo.orgId === org.id)?.role ?? undefined,
        userStatus: res.memberOrganizations?.find((mo) => mo.orgId === org.id)?.status ?? undefined,
      })) ?? [];

    const member: Member = {
      id: res.id,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      organizations: organizations,
    };

    return member;
  } catch (err) {
    console.log(err);
    return null;
  }
});
