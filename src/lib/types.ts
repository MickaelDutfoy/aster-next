import { AnimalStatus, MemberRole, MemberStatus, Sex } from '@prisma/client';

export type Language = 'fr' | 'en' | 'nb';

export type ThemeChoice = 'system' | 'light' | 'dark';

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
  memberId: number | null;
};

export type Animal = {
  id: number;
  name: string;
  species: string;
  sex: Sex;
  color: string | null;
  findLocation: string | null;
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
  createdByMemberId: number;
  adoption?: AnimalAdoption | null;
};

export type AnimalAdoption = {
  id: number;
  animalId: number;
  adopterFullName: string;
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
};

export type Organization = {
  id: number;
  name: string;
  superAdmin?: string;
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
  selectedOrgId?: number;
  organizations: Organization[];
};

export type MemberOfOrg = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  actions?: Action[];
};

export type Action = {
  name: string;
  handler: () => Promise<void>;
};