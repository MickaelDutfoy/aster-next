'use client';

import { Family, Member } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { FamilyForm } from './FamilyForm';

export const UpdateFamily = ({ user, family }: { user: Member; family: Family }) => {
  const t = useTranslations();

  return (
    <div className="register-form">
      <h3>{t('families.editInfoTitle')}</h3>
      <FamilyForm user={user} family={family} />
    </div>
  );
};
