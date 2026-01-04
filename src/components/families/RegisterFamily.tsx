'use client';

import { Family, Member } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { FamilyForm } from './FamilyForm';

export const RegisterFamily = ({ user, orgFamilies }: { user: Member; orgFamilies?: Family[] }) => {
  const t = useTranslations();

  return (
    <div className="family-form">
      <h3>{t('families.addTitle')}</h3>
      <FamilyForm user={user} orgFamilies={orgFamilies} />
    </div>
  );
};
