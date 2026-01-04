'use client';

import { Family, Member } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { DeniedPage } from '../main/DeniedPage';
import { FamilyForm } from './FamilyForm';

export const UpdateFamily = ({ user, family }: { user: Member; family: Family }) => {
  const t = useTranslations();

  if (family.memberId && family.memberId !== user.id) {
    return <DeniedPage cause="refused" />;
  }

  return (
    <div className="family-form">
      <h3>{t('families.editInfoTitle')}</h3>
      <FamilyForm user={user} family={family} />
    </div>
  );
};
