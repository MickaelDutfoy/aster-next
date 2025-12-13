'use client';

import { Animal, Family } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { AnimalForm } from './AnimalForm';

export const UpdateAnimal = ({ animal, families }: { animal: Animal; families: Family[] }) => {
  const t = useTranslations();

  return (
    <div className="register-form">
      <h3>{t('animals.editInfoTitle')}</h3>
      <AnimalForm animal={animal} families={families} />
    </div>
  );
};
