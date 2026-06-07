'use client';

import { useRouter } from '@/i18n/routing';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { HelpButton } from '../main/HelpButton';

export const PublicPageActions = ({ canManagePage }: { canManagePage: boolean }) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="help-and-buttons">
      <HelpButton message="help.publish" />
      <div className="links-box">
        <button
          onClick={() => router.push('/publish/manage')}
          className={'little-button' + clsx(!canManagePage && ' disabled')}
        >
          {t('publish.managePage')}
        </button>
      </div>
    </div>
  );
};
