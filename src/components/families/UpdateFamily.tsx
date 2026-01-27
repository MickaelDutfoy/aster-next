'use client';

import { Family, Member, Organization } from '@/lib/types';
import { MemberRole } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { DeniedPage } from '../main/DeniedPage';
import { FamilyForm } from './FamilyForm';

export const UpdateFamily = ({
  user,
  org,
  family,
}: {
  user: Member;
  org: Organization;
  family: Family;
}) => {
  const t = useTranslations();

  if (
    family.members.length > 0 &&
    family.members.every((member) => member.id !== user.id) &&
    org.userRole !== MemberRole.SUPERADMIN
  ) {
    return <DeniedPage cause="refused" />;
  }

  return (
    <div className="family-form">
      <h3>{t('families.editInfoTitle')}</h3>
      <FamilyForm user={user} family={family} />
    </div>
  );
};
