import { isAdoptionSheetEmpty } from '@/lib/animals/isAdoptionSheetEmpty';
import { AnimalHealthAct } from '@/lib/types';
import { AnimalStatus, Sex } from '@prisma/client';

export const parseAnimalData = async (formData: FormData, animalId?: number) => {
  const selectedSpeciesFromForm = formData.get('animalSpeciesSelector')?.toString();
  const otherSpeciesFromForm = formData.get('animalSpecies')?.toString().trim();

  const speciesToSave =
    selectedSpeciesFromForm === 'other'
      ? otherSpeciesFromForm || undefined
      : selectedSpeciesFromForm;

  const animalForm = {
    name: formData.get('animalName')?.toString().trim(),
    species: speciesToSave,
    sex: formData.get('animalSex') as Sex,
    color: formData.get('animalColor')?.toString().trim(),
    legalId: formData.get('legalId')?.toString().trim(),
    findLocation: formData.get('findLocation')?.toString().trim(),
    birthDate: formData.get('animalBirthDate')?.toString(),
    isNeutered: formData.has('animalIsNeutered'),
    information: formData.get('animalInformation')?.toString().trim(),
    healthInformation: formData.get('healthInformation')?.toString().trim(),
    status: formData.get('animalStatus') as AnimalStatus,
  };

  const healthTypes = formData.getAll('healthType[]').map((value) => value.toString());
  const healthDates = formData.getAll('healthDate[]').map((value) => value.toString());
  const healthIsFirsts = formData.getAll('healthIsFirst[]').map((value) => value.toString());

  const health: AnimalHealthAct[] = [];
  const count = Math.min(healthTypes.length, healthDates.length, healthIsFirsts.length);

  for (let i = 0; i < count; i++) {
    const type = healthTypes[i] as AnimalHealthAct['type'];
    const dateISO = healthDates[i];
    const isFirst = healthIsFirsts[i] === '1';

    // ignore lignes vides / broken
    if (!type || !dateISO) continue;

    const date = new Date(dateISO);
    if (Number.isNaN(date.getTime())) continue;

    health.push({ type, date, isFirst });
  }

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
    adoptInformation: formData.get('adoptInformation')?.toString().trim(),
  };

  if (
    !animalForm.name ||
    !animalForm.species ||
    !animalForm.birthDate ||
    (animalForm.status === AnimalStatus.FOSTERED && !animalFamilyId)
  ) {
    return { animal: undefined, adopter: undefined, health: undefined };
  }

  const adopter = {
    adopterFullName: adopterForm.fullName as string,
    adopterEmail: adopterForm.email as string,
    adopterPhoneNumber: adopterForm.phoneNumber as string,
    adopterAddress: adopterForm.address as string,
    adopterZip: adopterForm.zip as string,
    adopterCity: adopterForm.city as string,
    homeVisitDone: adopterForm.homeVisitDone,
    neuteringPlannedAt: adopterForm.neuteringPlannedAt
      ? new Date(adopterForm.neuteringPlannedAt)
      : null,
    adoptionContractSignedAt: adopterForm.adoptionContractSignedAt
      ? new Date(adopterForm.adoptionContractSignedAt)
      : null,
    adoptionFeePaid: adopterForm.adoptionFeePaid,
    legalTransferAt: adopterForm.legalTransferAt ? new Date(adopterForm.legalTransferAt) : null,
    information: adopterForm.adoptInformation ?? null,
  };

  const animal = {
    name: animalForm.name,
    species: animalForm.species,
    sex: animalForm.sex,
    color: animalForm.color,
    legalId: animalForm.legalId,
    findLocation: animalForm.findLocation,
    birthDate: new Date(animalForm.birthDate),
    isNeutered: animalForm.isNeutered,
    information: animalForm.information ?? null,
    healthInformation: animalForm.healthInformation ?? null,
    status: animalForm.status,
    familyId: animalFamilyId,
  };

  return { animal, adopter: isAdoptionSheetEmpty(adopter) ? undefined : adopter, health };
};
