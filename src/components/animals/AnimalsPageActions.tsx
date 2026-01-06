'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const AnimalsPageActions = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="links-box">
      <button onClick={() => router.push('/animals/new')} className="little-button">
        {t('animals.addTitle')}
      </button>
    </div>
  );
};
