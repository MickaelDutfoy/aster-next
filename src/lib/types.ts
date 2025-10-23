import { MemberRole, MemberStatus, Sex } from '@prisma/client';

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
  status: string;
  lastVax: Date | null;
  isPrimoVax: boolean;
  lastDeworm: Date | null;
  isFirstDeworm: boolean;
  information: string | null;
  familyId: number | null;
  orgId: number;
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
