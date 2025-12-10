'use client';

import { Animal, Family } from '@/lib/types';
import { AnimalForm } from './AnimalForm';

export const UpdateAnimal = ({ animal, families }: { animal: Animal; families: Family[] }) => {
  return (
    <div className="register-form">
      <h3>Éditer les informations</h3>
      <AnimalForm animal={animal} families={families} />
    </div>
  );
};
