'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const PublicPageActions = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="links-box">
      <button onClick={() => router.push('/publish/manage')} className="little-button">
        {t('publish.managePage')}
      </button>
    </div>
  );
};
