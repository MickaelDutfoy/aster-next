'use client';

import { deleteFamily } from '@/actions/families/deleteFamily';
import { useRouter } from '@/i18n/routing';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const DeleteFamily = ({ id }: { id: string }) => {
  const familyId = Number(id);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await deleteFamily(familyId);
      showToast(res);
      if (res.ok) router.replace('/families');
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: 'Une erreur est survenue.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 style={{ paddingBottom: 10 }}>Supprimer la famille</h3>
      <p>Êtes-vous sûr(e) ?</p>
      <div className="yes-no">
        <button
          onClick={handleSubmit}
          className="little-button"
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Suppression...' : 'Confirmer'}
        </button>
        <button className="little-button" onClick={() => router.back()}>
          Annuler
        </button>
      </div>
    </>
  );
};
