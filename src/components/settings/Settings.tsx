'use client';

import { useRouter } from '@/i18n/routing';
import { MailQuestionMark } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSelector } from './LanguageSelector';
import { ManageAccount } from './ManageAccount';
import { ThemeSelector } from './ThemeSelector';

export const Settings = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="settings">
      <ManageAccount />
      <div className="settings-body">
        <div className="lang-change">
          <p>{t('settings.changeLanguage')}</p>
          <LanguageSelector size={26} />
        </div>
        <ThemeSelector />
        <div className="contact-link">
          <p>{t('settings.contactIntro')}</p>
          <MailQuestionMark className="link" size={32} onClick={() => router.replace('/contact')} />
        </div>
      </div>
    </div>
  );
};
