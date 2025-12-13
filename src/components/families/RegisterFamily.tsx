'use client';

import { Member } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { FamilyForm } from './FamilyForm';

export const RegisterFamily = ({ user }: { user: Member }) => {
  const t = useTranslations();

  return (
    <div className="register-form">
      <h3>{t('families.addTitle')}</h3>
      <FamilyForm user={user} />
    </div>
  );
};
