import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import 'server-only';
import { Member } from '../types';

export const getUserWithOrgs = async (): Promise<Member | null> => {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  try {
    const member = await prisma.member.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        selectedOrgId: true,
        memberOrganizations: {
          select: {
            role: true,
            status: true,
            organization: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!member) return null;

    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email,
      phoneNumber: member.phoneNumber,
      selectedOrgId: member.selectedOrgId ?? undefined,
      organizations: member.memberOrganizations.map((memOrg) => ({
        ...memOrg.organization,
        userRole: memOrg.role,
        userStatus: memOrg.status,
      })),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};
