import { AnimalAdoption } from '../types';

export const isAdoptionSheetEmpty = (adopter: AnimalAdoption) => {
  return !(
    adopter.adopterFullName ||
    adopter.adopterAddress ||
    adopter.adopterZip ||
    adopter.adopterCity ||
    adopter.adopterEmail ||
    adopter.adopterPhoneNumber ||
    adopter.homeVisitDone ||
    adopter.neuteringPlannedAt ||
    adopter.adoptionContractSignedAt ||
    adopter.adoptionFeePaid ||
    adopter.legalTransferAt ||
    adopter.information
  );
};
