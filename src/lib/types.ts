import { AnimalStatus, MemberRole, MemberStatus, Sex } from '@prisma/client';

export type ActionValidation = {
  ok: boolean;
  status?: 'success' | 'error' | 'info';
  message?: string;
};

export type Family = {
  id: number; // WIP
};

export type Animal = {
  id: number;
  name: string;
  species: string;
  sex: Sex;
  color: string | null;
  birthDate: Date;
  isNeutered: boolean;
  status: AnimalStatus;
  lastVax: Date | null;
  vaxHistory: Date[];
  isPrimoVax: boolean;
  lastDeworm: Date | null;
  dewormHistory: Date[];
  isFirstDeworm: boolean;
  information: string | null;
  familyId: number | null;
  orgId: number;
  adoption?: AnimalAdoption | null;
};

export type AnimalAdoption = {
  id: number;
  animalId: number;
  adopterFullName: string;
  adopterEmail: string | null;
  adopterPhoneNumber: string;
  adopterAddress: string;
  adopterZip: string;
  adopterCity: string;
  homeVisitDone: boolean;
  knowledgeCertSignedAt: Date | null;
  neuteringPlannedAt: Date | null;
  adoptionContractSignedAt: Date | null;
  adoptionFeePaid: boolean;
  legalTransferAt: Date | null;
  notes: string | null;
};

export type Organization = {
  id: number;
  name: string;
  superAdmin?: string;
  userRole?: MemberRole;
  userStatus?: MemberStatus;
  animals?: Animal[];
};

export type PendingOrgRequest = {
  memberId: number;
  orgId: number;
  memberName?: string;
  orgName?: string;
};

export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  organizations: Organization[];
};
