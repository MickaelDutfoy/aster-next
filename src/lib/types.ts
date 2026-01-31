import { AnimalStatus, MemberRole, MemberStatus, Sex } from '@prisma/client';

export type Language = 'fr' | 'en' | 'nb';

export type ThemeChoice = 'system' | 'light' | 'dark';

export type AnimalHealthActType = 'VACCINATION' | 'DEWORM' | 'ANTIFLEA';

export type ActionValidation = {
  ok?: boolean;
  status?: 'success' | 'error' | 'info';
  message?: string;
};

export type Family = {
  id: number;
  contactFullName: string;
  email: string | null;
  phoneNumber: string | null;
  address: string;
  zip: string;
  city: string;
  hasChildren: boolean;
  otherAnimals: string | null;
  orgId: number;
  members: MemberOfFamily[];
};

export type FamilyWithoutDetails = {
  id: number;
  contactFullName: string;
  city: string;
  members: MemberOfFamily[];
};

export type Animal = {
  id: number;
  legalId: string | null;
  name: string;
  species: string;
  sex: Sex;
  color: string | null;
  findLocation: string | null;
  birthDate: Date;
  isNeutered: boolean;
  status: AnimalStatus;
  healthActs?: AnimalHealthAct[];
  information: string | null;
  healthInformation: string | null;
  familyId: number | null;
  orgId: number;
  createdByMemberId: number;
  adoption?: AnimalAdoption | null;
};

export type AnimalWithoutDetails = {
  id: number;
  name: string;
  species: string;
  sex: Sex;
  birthDate: Date;
  status: AnimalStatus;
};

export type AnimalHealthAct = {
  id?: number;
  animalId?: number;
  type: AnimalHealthActType;
  date: Date;
  isFirst: boolean;
};

export type AnimalHealthDraft = {
  type: AnimalHealthActType;
  date: string;
  isFirst: boolean;
};

export type AnimalAdoption = {
  id?: number;
  animalId?: number;
  adopterFullName: string | null;
  adopterEmail: string | null;
  adopterPhoneNumber: string | null;
  adopterAddress: string | null;
  adopterZip: string | null;
  adopterCity: string | null;
  homeVisitDone: boolean;
  neuteringPlannedAt: Date | null;
  adoptionContractSignedAt: Date | null;
  adoptionFeePaid: boolean;
  legalTransferAt: Date | null;
  information: string | null;
};

export type Organization = {
  id: number;
  name: string;
  superAdminName?: string;
  userRole?: MemberRole;
  userStatus?: MemberStatus;
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
  phoneNumber: string;
  selectedOrgId?: number | null;
  organizations?: Organization[];
};

export type MemberOfOrg = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: MemberRole;
  status: MemberStatus;
  actions?: Action[];
};

export type MemberOfFamily = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role?: MemberRole;
};

export type Action = {
  id: string;
  name: string;
  handler: () => Promise<void>;
};