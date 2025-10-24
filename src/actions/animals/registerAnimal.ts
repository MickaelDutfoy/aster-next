'use server';

import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { prisma } from '@/lib/prisma';
import { ActionValidation, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import type { Sex } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const registerAnimal = async (formdata: FormData): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) return { ok: false };

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return { ok: false };

  const animal = {
    name: formdata.get('animalName')?.toString().trim(),
    species: formdata.get('animalSpecies')?.toString().trim(),
    sex: formdata.get('animalSex') as Sex,
    color: formdata.get('animalColor')?.toString().trim(),
    birthDate: formdata.get('animalBirthDate')?.toString(),
    lastVax: formdata.get('animalLastVax')?.toString(),
    lastDeworm: formdata.get('animalLastDeworm')?.toString(),
    isNeutered: formdata.has('animalIsNeutered'),
    isPrimeVax: formdata.has('animalPrimeVax'),
    isFirstDeworm: formdata.has('animalFirstDeworm'),
    information: formdata.get('animalInformation')?.toString().trim(),
  };

  if (!animal.name || !animal.species || !animal.birthDate) {
    console.log('champs invalides');
    return { ok: false };
  }

  try {
    await prisma.animal.create({
      data: {
        name: animal.name.charAt(0).toUpperCase() + animal.name.slice(1).toLowerCase(),
        species: animal.species,
        sex: animal.sex,
        color: animal.color,
        birthDate: new Date(animal.birthDate),
        lastVax: animal.lastVax ? new Date(animal.lastVax) : undefined,
        lastDeworm: animal.lastDeworm ? new Date(animal.lastDeworm) : undefined,
        isNeutered: animal.isNeutered,
        isPrimoVax: animal.isPrimeVax,
        isFirstDeworm: animal.isFirstDeworm,
        information: animal.information,
        orgId: org.id,
      },
    });

    revalidatePath('/animals');

    return { ok: true, status: 'success', message: "L'animal a bien été ajouté." };
  } catch (err) {
    console.log(err);
    return { ok: false, status: 'error', message: "Une erreur s'est produite." };
  }
};
