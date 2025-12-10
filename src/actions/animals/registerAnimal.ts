'use server';

import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { prisma } from '@/lib/prisma';
import { ActionValidation, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { revalidatePath } from 'next/cache';
import { parseAnimalData } from './parseAnimalData';

export const registerAnimal = async (formData: FormData): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'Utilisateur non authentifié.' };
  }

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return { ok: false };

  const { animal, adopter } = await parseAnimalData(formData);

  if (!animal || !adopter) {
    return { ok: false, status: 'error', message: 'Des champs obligatoires sont incomplets.' };
  }

  try {
    const res = await prisma.animal.create({
      data: {
        ...animal,
        orgId: org.id,
      },
    });

    await prisma.animalAdoption.create({
      data: {
        ...adopter,
        animalId: res.id,
      },
    });

    revalidatePath('/animals');

    return { ok: true, status: 'success', message: "L'animal a bien été ajouté." };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: "Une erreur s'est produite." };
  }
};
