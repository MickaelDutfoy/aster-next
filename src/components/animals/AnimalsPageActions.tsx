'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { HelpButton } from '../main/HelpButton';

export const AnimalsPageActions = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="help-and-buttons">
      <HelpButton message="help.animals" />
      <div className="links-box">
        <button onClick={() => router.push('/animals/new')} className="little-button">
          {t('animals.addTitle')}
        </button>
      </div>
    </div>
  );
};
