'use server';

import { getUser } from '@/lib/getUser';
import { prisma } from '@/lib/prisma';
import { Member } from '@/lib/types';
import { revalidateTag } from 'next/cache';

export const joinOrg = async (orgId: number) => {
  const user: Member | null = await getUser();
  if (!user) return;

  try {
    if (user.organizations.some((org) => org.id === orgId)) {
      console.log('user already in org');
      return;
    }

    await prisma.memberOrganization.create({
      data: {
        organizationId: orgId,
        memberId: user.id,
        role: 'member',
        status: 'pending',
      },
    });

    console.log('join req sent');

    revalidateTag('user');
  } catch (error) {
    console.log(error);
  }
};
