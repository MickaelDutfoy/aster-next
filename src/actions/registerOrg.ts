'use server';

import { getUser } from '@/lib/getUser';
import { prisma } from '@/lib/prisma';
import { Member } from '@/lib/types';
import { revalidateTag } from 'next/cache';

export const registerOrg = async (formdata: FormData) => {
  const user: Member | null = await getUser();
  if (!user) return;

  const org = {
    name: formdata.get('orgName')?.toString(),
  };

  if (!org.name) {
    console.log('an organization must have a name');
    return;
  }

  try {
    const res = await prisma.organization.create({
      data: { name: org.name },
    });

    await prisma.memberOrganization.create({
      data: {
        memberId: user?.id,
        organizationId: res.id,
        role: 'superadmin',
        status: 'validated',
      },
    });

    revalidateTag('user');
  } catch (error) {
    console.log('process failed');
  }
};
