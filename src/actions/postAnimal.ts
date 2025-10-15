'use server';

import { getSelectedOrg } from '@/lib/getSelectedOrg';
import { getUser } from '@/lib/getUser';
import { prisma } from '@/lib/prisma';
import { Member, Organization } from '@/lib/types';
import { Sex } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const postAnimal = async (formdata: FormData) => {
  const user: Member | null = await getUser();
  if (!user) return;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return;

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
    return;
  }

  console.log('ready to insert', animal);

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
        organizationId: org.id,
      },
    });
  } catch (error) {
    console.log('process failed', error);
  }

  revalidatePath('/animals');
};
