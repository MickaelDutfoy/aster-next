'use client';

import { Member } from '@/lib/types';
import { FamilyForm } from './FamilyForm';

export const RegisterFamily = ({ user }: { user: Member }) => {
  return (
    <div className="register-form">
      <h3>Ajouter une famille</h3>
      <FamilyForm user={user} />
    </div>
  );
};
