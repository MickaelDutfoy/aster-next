import { isAdoptionSheetEmpty } from '@/lib/animals/isAdoptionSheetEmpty';
import { AnimalHealthAct, AnimalTestEntry, AnimalWeightEntry } from '@/lib/types';
import { AnimalStatus, AnimalTestResult, Sex } from '@prisma/client';

export const parseAnimalData = async (formData: FormData, trialDateStart: Date | null) => {
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

    let animalFamilyId: number | null = null;
    if (animalForm.status === AnimalStatus.FOSTERED) {
      animalFamilyId = formData.get('animalFamily') ? Number(formData.get('animalFamily')) : null;
    }

    if (
      !animalForm.name ||
      !animalForm.species ||
      (animalForm.status === AnimalStatus.FOSTERED && !animalFamilyId)
    ) {
      return { animal: undefined, adopter: undefined, health: undefined };
    }

  const healthTypes = formData.getAll('healthType[]').map((value) => value.toString());
  const healthDates = formData.getAll('healthDate[]').map((value) => value.toString());
  const healthIsFirsts = formData.getAll('healthIsFirst[]').map((value) => value.toString());

  const health: AnimalHealthAct[] = [];
  const count = Math.min(healthTypes.length, healthDates.length, healthIsFirsts.length);

  for (let i = 0; i < count; i++) {
    const type = healthTypes[i] as AnimalHealthAct['type'];
    const dateISO = healthDates[i];
    const isFirst = healthIsFirsts[i] === '1';

    if (!type || !dateISO) continue;

    const date = new Date(dateISO);
    if (Number.isNaN(date.getTime())) continue;

    health.push({ type, date, isFirst });
  }

  const weightDates = formData.getAll('weightDate[]').map((value) => value.toString());
  const weightGramsValues = formData.getAll('weightGrams[]').map((value) => value.toString());

  const weightEntries: AnimalWeightEntry[] = [];
  const weightCount = Math.min(weightDates.length, weightGramsValues.length);

  for (let i = 0; i < weightCount; i++) {
    const dateISO = weightDates[i];
    const weightGrams = Number(weightGramsValues[i]);

    if (!dateISO || Number.isNaN(weightGrams) || weightGrams <= 0) continue;

    const date = new Date(dateISO);
    if (Number.isNaN(date.getTime())) continue;

    weightEntries.push({
      date,
      weightGrams,
    });
  }

  const testNames = formData.getAll('testName[]').map((value) => value.toString());
  const testDates = formData.getAll('testDate[]').map((value) => value.toString());
  const testResults = formData.getAll('testResult[]').map((value) => value.toString());

  const tests: AnimalTestEntry[] = [];
  const testsCount = Math.min(testNames.length, testDates.length, testResults.length);

  for (let i = 0; i < testsCount; i++) {
    const testName = testNames[i]?.trim();
    const dateISO = testDates[i];
    const result = testResults[i] as AnimalTestResult;

    if (!testName || !dateISO || !result) continue;

    const date = new Date(dateISO);
    if (Number.isNaN(date.getTime())) continue;

    tests.push({
      testName,
      date,
      result,
    });
  }

  let newTrialDate: Date | null = trialDateStart;
  if (!trialDateStart && animalForm.status === AnimalStatus.IN_TRIAL) {
    newTrialDate = new Date();
  } else if (animalForm.status !== AnimalStatus.IN_TRIAL) {
    newTrialDate = null;
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
    birthDate: animalForm.birthDate ? new Date(animalForm.birthDate) : null,
    isNeutered: animalForm.isNeutered,
    information: animalForm.information ?? null,
    healthInformation: animalForm.healthInformation ?? null,
    status: animalForm.status,
    trialDateStart: newTrialDate,
    familyId: animalFamilyId,
  };

  return {
    animal,
    adopter: isAdoptionSheetEmpty(adopter) ? undefined : adopter,
    health,
    weightEntries,
    tests,
  };
};
