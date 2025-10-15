import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import 'server-only';
import { Member, Organization } from './types';

export const getUser = async (): Promise<Member | null> => {
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
      where: { id: { in: res.memberOrganizations?.map((mo) => mo.organizationId) } },
      select: { id: true, name: true, animals: true },
    });

    // add member role and status for each organization
    const organizations =
      memberOrgs.map((org) => ({
        ...org,
        role:
          res.memberOrganizations?.find((mo) => mo.organizationId === org.id)?.role ?? undefined,
        status:
          res.memberOrganizations?.find((mo) => mo.organizationId === org.id)?.status ?? undefined,
      })) ?? [];

    const member: Member = {
      id: res.id,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      organizations: organizations,
    };

    return member;
  } catch (error) {
    console.log(error);
    return null;
  }
};
