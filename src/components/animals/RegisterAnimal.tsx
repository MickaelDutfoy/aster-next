'use client';

import { Family, Member } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { AnimalForm } from './AnimalForm';

export const RegisterAnimal = ({ user, families }: { user: Member; families: Family[] }) => {
  const t = useTranslations();

  return (
    <div className="animal-form">
      <h3>{t('animals.addTitle')}</h3>
      <AnimalForm user={user} families={families} />
    </div>
  );
};
