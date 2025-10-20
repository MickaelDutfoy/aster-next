'use server';

import { prisma } from '@/lib/prisma';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { revalidateTag } from 'next/cache';

export const cancelOrgRequest = async (orgId: number) => {
  const user: Member | null = await getUser();
  if (!user) return;

  try {
    await prisma.memberOrganization.deleteMany({
      where: { memberId: user.id, organizationId: orgId },
    });

    console.log('request has been canceled');

    revalidateTag('user');
  } catch (error) {
    console.log(error);
  }
};
