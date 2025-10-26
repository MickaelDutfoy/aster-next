'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { Sex } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const updateAnimal = async (
  animalId: number,
  prevstate: any,
  formdata: FormData,
): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) return { ok: false };

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
    return { ok: false, status: 'error', message: 'Des champs obligatoires sont incomplets.' };
  }

  try {
    await prisma.animal.update({
      where: { id: animalId },
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
      },
    });

    revalidatePath(`/animals/${animalId}`);

    return { ok: true, status: 'success', message: 'Les informations ont été modifiées.' };
  } catch (err) {
    console.log(err);
    return { ok: false, status: 'error', message: "Une erreur s'est produite." };
  }
};
