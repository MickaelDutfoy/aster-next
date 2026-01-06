'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const FamiliesPageActions = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="links-box">
      <button onClick={() => router.push('/families/new')} className="little-button">
        {t('families.addTitle')}
      </button>
    </div>
  );
};
