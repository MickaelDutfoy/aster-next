'use client';

import { deleteFamily } from '@/actions/families/deleteFamily';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';

export const DeleteFamily = ({ id }: { id: string }) => {
  const familyId = Number(id);

  const [res, handleDeleteFamily, isLoading] = useActionState(
    deleteFamily.bind(null, familyId),
    null,
  );

  const router = useRouter();

  useEffect(() => {
    if (!res) return;
    showToast(res);
    if (res.ok) {
      router.replace(`/families`);
      router.refresh();
    }
  }, [res]);

  return (
    <>
      <h3 style={{ paddingBottom: 10 }}>Supprimer la famille</h3>
      <p>Êtes-vous sûr(e) ?</p>
      <div className="yes-no">
        <form action={handleDeleteFamily}>
          <button className="little-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? 'Suppression...' : 'Confirmer'}
          </button>
        </form>
        <button className="little-button" onClick={() => router.back()}>
          Annuler
        </button>
      </div>
    </>
  );
};
