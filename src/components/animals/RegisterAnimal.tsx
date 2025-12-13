'use client';

import { Family } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { AnimalForm } from './AnimalForm';

export const RegisterAnimal = ({ families }: { families: Family[] }) => {
  const t = useTranslations();

  return (
    <div className="register-form">
      <h3>{t('animals.addTitle')}</h3>
      <AnimalForm families={families} />
    </div>
  );
};
