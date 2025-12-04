'use client';

import { updateFamily } from '@/actions/families/updateFamily';
import { Family } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';
import { FamilyForm } from './FamilyForm';

export const UpdateFamily = ({ family }: { family: Family }) => {
  const [res, handleUpdateFamily, isLoading] = useActionState(
    updateFamily.bind(null, family.id),
    null,
  );

  const router = useRouter();

  useEffect(() => {
    if (!res) return;
    showToast(res);
    if (res.ok) router.replace(`/families/${family.id}`);
  }, [res]);

  return (
    <>
      <div className="register-form">
        <h3>Éditer les informations</h3>
        <FamilyForm family={family} action={handleUpdateFamily} isLoading={isLoading} />
      </div>
    </>
  );
};
