'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { AnimalStatus, Sex } from '@prisma/client';
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
    findLocation: formdata.get('findLocation')?.toString().trim(),
    birthDate: formdata.get('animalBirthDate')?.toString(),
    lastVax: formdata.get('animalLastVax')?.toString(),
    lastDeworm: formdata.get('animalLastDeworm')?.toString(),
    isNeutered: formdata.has('animalIsNeutered'),
    isPrimeVax: formdata.has('animalPrimeVax'),
    isFirstDeworm: formdata.has('animalFirstDeworm'),
    information: formdata.get('animalInformation')?.toString().trim(),
    status: formdata.get('animalStatus') as AnimalStatus,
  };

  const animalFamilyId =
    animal.status === AnimalStatus.FOSTERED ? Number(formdata.get('animalFamily')) : null;

  const adopter = {
    fullName: formdata.get('adopterFullName')?.toString().trim(),
    email: formdata.get('adopterEmail')?.toString().trim(),
    phoneNumber: formdata.get('adopterPhoneNumber')?.toString().trim(),
    address: formdata.get('adopterAddress')?.toString().trim(),
    zip: formdata.get('adopterZip')?.toString().trim(),
    city: formdata.get('adopterCity')?.toString().trim(),
    homeVisitDone: formdata.has('homeVisitDone'),
    knowledgeCertSignedAt: formdata.get('knowledgeCertSignedAt')?.toString(),
    neuteringPlannedAt: formdata.get('neuteringPlannedAt')?.toString(),
    adoptionContractSignedAt: formdata.get('adoptionContractSignedAt')?.toString(),
    adoptionFeePaid: formdata.has('adoptionFeePaid'),
    legalTransferAt: formdata.get('legalTransferAt')?.toString(),
  };

  if (
    !animal.name ||
    !animal.species ||
    !animal.birthDate ||
    (animal.status === 'ADOPTED' && !adopter.fullName)
  ) {
    return { ok: false, status: 'error', message: 'Des champs obligatoires sont incomplets.' };
  }

  try {
    const previous = await prisma.animal.findUnique({ where: { id: animalId } });

    if (
      previous &&
      previous.lastVax &&
      animal.lastVax?.slice(0, 9) !== previous.lastVax.toISOString().slice(0, 9)
    ) {
      previous.vaxHistory.push(previous.lastVax);
    }

    if (
      previous &&
      previous.lastDeworm &&
      animal.lastDeworm?.slice(0, 9) !== previous.lastDeworm.toISOString().slice(0, 9)
    ) {
      previous.dewormHistory.push(previous.lastDeworm);
    }

    await prisma.animal.update({
      where: { id: animalId },
      data: {
        name: animal.name.charAt(0).toUpperCase() + animal.name.slice(1).toLowerCase(),
        species: animal.species,
        sex: animal.sex,
        color: animal.color,
        findLocation: animal.findLocation,
        birthDate: new Date(animal.birthDate),
        lastVax: animal.lastVax ? new Date(animal.lastVax) : undefined,
        vaxHistory: previous?.vaxHistory,
        lastDeworm: animal.lastDeworm ? new Date(animal.lastDeworm) : undefined,
        dewormHistory: previous?.dewormHistory,
        isNeutered: animal.isNeutered,
        isPrimoVax: animal.isPrimeVax,
        isFirstDeworm: animal.isFirstDeworm,
        information: animal.information,
        status: animal.status,
        familyId: animalFamilyId,
      },
    });

    const adoptSheet = await prisma.animalAdoption.findUnique({ where: { animalId } });

    if (!adoptSheet) {
      await prisma.animalAdoption.create({
        data: {
          animalId,
          adopterFullName: adopter.fullName as string,
          adopterEmail: adopter.email as string,
          adopterPhoneNumber: adopter.phoneNumber as string,
          adopterAddress: adopter.address as string,
          adopterZip: adopter.zip as string,
          adopterCity: adopter.city as string,
          homeVisitDone: adopter.homeVisitDone,
          knowledgeCertSignedAt: adopter.knowledgeCertSignedAt
            ? new Date(adopter.knowledgeCertSignedAt)
            : undefined,
          neuteringPlannedAt: adopter.neuteringPlannedAt
            ? new Date(adopter.neuteringPlannedAt)
            : undefined,
          adoptionContractSignedAt: adopter.adoptionContractSignedAt
            ? new Date(adopter.adoptionContractSignedAt)
            : undefined,
          adoptionFeePaid: adopter.adoptionFeePaid,
          legalTransferAt: adopter.legalTransferAt ? new Date(adopter.legalTransferAt) : undefined,
        },
      });
    } else {
      await prisma.animalAdoption.update({
        where: { animalId },
        data: {
          adopterFullName: adopter.fullName,
          adopterEmail: adopter.email,
          adopterPhoneNumber: adopter.phoneNumber,
          adopterAddress: adopter.address,
          adopterZip: adopter.zip,
          adopterCity: adopter.city,
          homeVisitDone: adopter.homeVisitDone,
          knowledgeCertSignedAt: adopter.knowledgeCertSignedAt
            ? new Date(adopter.knowledgeCertSignedAt)
            : undefined,
          neuteringPlannedAt: adopter.neuteringPlannedAt
            ? new Date(adopter.neuteringPlannedAt)
            : undefined,
          adoptionContractSignedAt: adopter.adoptionContractSignedAt
            ? new Date(adopter.adoptionContractSignedAt)
            : undefined,
          adoptionFeePaid: adopter.adoptionFeePaid,
          legalTransferAt: adopter.legalTransferAt ? new Date(adopter.legalTransferAt) : undefined,
        },
      });
    }

    revalidatePath(`/animals/${animalId}`);

    return { ok: true, status: 'success', message: 'Les informations ont été modifiées.' };
  } catch (err) {
    console.log(err);
    return { ok: false, status: 'error', message: "Une erreur s'est produite." };
  }
};
