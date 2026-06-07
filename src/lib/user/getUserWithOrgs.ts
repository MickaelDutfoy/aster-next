import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import 'server-only';
import { Language, Member } from '../types';

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
        lastSeenAt: true,
        lastKnownLocale: true,
        memberOrganizations: {
          select: {
            role: true,
            status: true,
            organization: {
              select: {
                id: true,
                name: true,
                description: true,
                email: true,
                phoneNumber: true,
                defaultCurrency: true,
              },
            },
          },
        },
      },
    });

    if (!member) return null;

    const today = new Date();

    const cookieStore = await cookies();
    const locale = cookieStore.get('aster_locale')?.value as Language | undefined;

    const shouldUpdateLastSeen =
      !member.lastSeenAt || member.lastSeenAt.toDateString() !== today.toDateString();

    const shouldUpdateLocale = member.lastKnownLocale !== locale;

    if (shouldUpdateLastSeen || shouldUpdateLocale) {
      await prisma.member.update({
        where: { id: member.id },
        data: {
          ...(shouldUpdateLastSeen && { lastSeenAt: today }),
          ...(shouldUpdateLocale && { lastKnownLocale: locale }),
        },
      });
    }

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
