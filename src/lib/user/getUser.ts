import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import 'server-only';
import { Member } from '../types';

export const getUser = async (): Promise<Member | null> => {
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
        favoriteSpecies: true,
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
      favoriteSpecies: member.favoriteSpecies,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};
