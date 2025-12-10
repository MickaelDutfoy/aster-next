import { prisma } from '@/lib/prisma';
import { AnimalStatus, Sex } from '@prisma/client';

export const parseAnimalData = async (formData: FormData, animalId?: number) => {
  const animalForm = {
    name: formData.get('animalName')?.toString().trim(),
    species: formData.get('animalSpecies')?.toString().trim(),
    sex: formData.get('animalSex') as Sex,
    color: formData.get('animalColor')?.toString().trim(),
    findLocation: formData.get('findLocation')?.toString().trim(),
    birthDate: formData.get('animalBirthDate')?.toString(),
    lastVax: formData.get('animalLastVax')?.toString(),
    lastDeworm: formData.get('animalLastDeworm')?.toString(),
    isNeutered: formData.has('animalIsNeutered'),
    isPrimeVax: formData.has('animalPrimeVax'),
    isFirstDeworm: formData.has('animalFirstDeworm'),
    information: formData.get('animalInformation')?.toString().trim(),
    status: formData.get('animalStatus') as AnimalStatus,
  };

  let animalFamilyId: number | null = null;

  if (animalForm.status === AnimalStatus.FOSTERED) {
    animalFamilyId = formData.get('animalFamily') ? Number(formData.get('animalFamily')) : null;
  }

  const adopterForm = {
    fullName: formData.get('adopterFullName')?.toString().trim(),
    email: formData.get('adopterEmail')?.toString().trim(),
    phoneNumber: formData.get('adopterPhoneNumber')?.toString().trim(),
    address: formData.get('adopterAddress')?.toString().trim(),
    zip: formData.get('adopterZip')?.toString().trim(),
    city: formData.get('adopterCity')?.toString().trim(),
    homeVisitDone: formData.has('homeVisitDone'),
    knowledgeCertSignedAt: formData.get('knowledgeCertSignedAt')?.toString(),
    neuteringPlannedAt: formData.get('neuteringPlannedAt')?.toString(),
    adoptionContractSignedAt: formData.get('adoptionContractSignedAt')?.toString(),
    adoptionFeePaid: formData.has('adoptionFeePaid'),
    legalTransferAt: formData.get('legalTransferAt')?.toString(),
  };

  if (
    !animalForm.name ||
    !animalForm.species ||
    !animalForm.birthDate ||
    (animalForm.status === 'ADOPTED' && !adopterForm.fullName)
  ) {
    return { animal: undefined, adopter: undefined };
  }

  const adopter = {
    adopterFullName: adopterForm.fullName as string,
    adopterEmail: adopterForm.email as string,
    adopterPhoneNumber: adopterForm.phoneNumber as string,
    adopterAddress: adopterForm.address as string,
    adopterZip: adopterForm.zip as string,
    adopterCity: adopterForm.city as string,
    homeVisitDone: adopterForm.homeVisitDone,
    knowledgeCertSignedAt: adopterForm.knowledgeCertSignedAt
      ? new Date(adopterForm.knowledgeCertSignedAt)
      : undefined,
    neuteringPlannedAt: adopterForm.neuteringPlannedAt
      ? new Date(adopterForm.neuteringPlannedAt)
      : undefined,
    adoptionContractSignedAt: adopterForm.adoptionContractSignedAt
      ? new Date(adopterForm.adoptionContractSignedAt)
      : undefined,
    adoptionFeePaid: adopterForm.adoptionFeePaid,
    legalTransferAt: adopterForm.legalTransferAt
      ? new Date(adopterForm.legalTransferAt)
      : undefined,
  };

  if (animalId) {
    try {
      const data = await prisma.animal.findUnique({ where: { id: animalId } });

      if (
        data &&
        data.lastVax &&
        animalForm.lastVax?.slice(0, 10) !== data.lastVax.toISOString().slice(0, 10)
      ) {
        data.vaxHistory.push(data.lastVax);
      }

      if (
        data &&
        data.lastDeworm &&
        animalForm.lastDeworm?.slice(0, 10) !== data.lastDeworm.toISOString().slice(0, 10)
      ) {
        data.dewormHistory.push(data.lastDeworm);
      }

      const animal = {
        name: animalForm.name,
        species: animalForm.species,
        sex: animalForm.sex,
        color: animalForm.color,
        findLocation: animalForm.findLocation,
        birthDate: new Date(animalForm.birthDate),
        lastVax: animalForm.lastVax ? new Date(animalForm.lastVax) : undefined,
        vaxHistory: data?.vaxHistory,
        lastDeworm: animalForm.lastDeworm ? new Date(animalForm.lastDeworm) : undefined,
        dewormHistory: data?.dewormHistory,
        isNeutered: animalForm.isNeutered,
        isPrimoVax: animalForm.isPrimeVax,
        isFirstDeworm: animalForm.isFirstDeworm,
        information: animalForm.information,
        status: animalForm.status,
        familyId: animalFamilyId,
      };

      return { animal, adopter };
    } catch (err) {
      console.error(err);
      return { animal: undefined, adopter: undefined };
    }
  }

  const animal = {
    name: animalForm.name,
    species: animalForm.species,
    sex: animalForm.sex,
    color: animalForm.color,
    findLocation: animalForm.findLocation,
    birthDate: new Date(animalForm.birthDate),
    lastVax: animalForm.lastVax ? new Date(animalForm.lastVax) : undefined,
    lastDeworm: animalForm.lastDeworm ? new Date(animalForm.lastDeworm) : undefined,
    isNeutered: animalForm.isNeutered,
    isPrimoVax: animalForm.isPrimeVax,
    isFirstDeworm: animalForm.isFirstDeworm,
    information: animalForm.information,
    status: animalForm.status,
    familyId: animalFamilyId,
  };

  return { animal, adopter };
};
