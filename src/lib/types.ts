import { Sex } from '@prisma/client';

export type Family = {
  id: number;
};

export type Animal = {
  id: number;
  name: string;
  species: string;
  sex: Sex;
  color: string | null;
  birthDate: Date;
  isNeutered: boolean;
  status: string;
  lastVax: Date | null;
  isPrimoVax: boolean;
  lastDeworm: Date | null;
  isFirstDeworm: boolean;
  information: string | null;
  familyId: number | null;
  organizationId: number;
};

export type Organization = {
  id: number;
  name: string;
  superAdmin?: string;
  userRole?: string;
  status?: string;
  animals?: Animal[];
};

export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  organizations: Organization[];
};
