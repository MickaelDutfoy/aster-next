'use server';

import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { prisma } from '@/lib/prisma';
import { ActionValidation, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { revalidatePath } from 'next/cache';

export const updateFamily = async (
  familyId: number,
  prevstate: any,
  formdata: FormData,
): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) return { ok: false };

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return { ok: false };

  const family = {
    contactFullName: formdata.get('contactFullName')?.toString().trim(),
    email: formdata.get('email')?.toString().trim(),
    phoneNumber: formdata.get('phoneNumber')?.toString().trim(),
    address: formdata.get('address')?.toString().trim(),
    zip: formdata.get('zip')?.toString().trim(),
    city: formdata.get('city')?.toString().trim(),
    hasChildren: formdata.has('hasChildren'),
    otherAnimals: formdata.get('otherAnimals')?.toString().trim(),
    // orgId: number;
  };

  if (!family.contactFullName || !family.address || !family.zip || !family.city) {
    return { ok: false, status: 'error', message: 'Des champs obligatoires sont incomplets.' };
  }

  try {
    const res = await prisma.family.update({
      where: { id: familyId },
      data: {
        contactFullName: family.contactFullName,
        email: family.email,
        phoneNumber: family.phoneNumber,
        address: family.address,
        zip: family.zip,
        city: family.city,
        hasChildren: family.hasChildren,
        otherAnimals: family.otherAnimals,
        orgId: org.id,
      },
    });

    revalidatePath('/families');

    return { ok: true, status: 'success', message: 'Les informations ont été modifiées.' };
  } catch (err) {
    console.log(err);
    return { ok: false, status: 'error', message: "Une erreur s'est produite." };
  }
};
