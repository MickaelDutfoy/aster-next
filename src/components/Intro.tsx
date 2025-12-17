'use client';

import { markIntroSeen } from '@/actions/intro/markIntroSeen';
import { LanguageSelector } from '@/components/settings/LanguageSelector';
import { Language } from '@/lib/types';
import '@/styles/intro.scss';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export const Intro = () => {
  const locale = useLocale() as Language;
  const t = useTranslations();
  const [step, setStep] = useState(0);

  const nextFrame = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      markIntroSeen(locale);
    }
  };

  return (
    <div className="intro">
      {step === 0 && (
        <div>
          <h2>{t('intro.selectLanguage')}</h2>
          <LanguageSelector size={44} />
          <button className="main-button" onClick={nextFrame}>
            {t('common.seeMore')}
          </button>
        </div>
      )}
      {step === 1 && (
        <div>
          <h2>{t('intro.welcomeTitle')}</h2>
          <p>{t('intro.welcomeSubtitle')}</p>
          <button className="main-button" onClick={nextFrame}>
            {t('common.seeMore')}
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>{t('intro.whyTitle')}</h2>
          <p>{t('intro.whyWhatIsAster')}</p>
          <p>{t('intro.whyHowHelps')}</p>
          <button className="main-button" onClick={nextFrame}>
            {t('common.seeMore')}
          </button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>{t('intro.howTitle')}</h2>
          <p>{t('intro.howFirstParagraph')}</p>
          <p>{t('intro.howSecondParagraph')}</p>
          <button className="main-button" onClick={nextFrame}>
            {t('common.seeMore')}
          </button>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2>{t('intro.whatsNextTitle')}</h2>
          <p>{t('intro.whatsNextParagraph1')}</p>
          <p>{t('intro.whatsNextParagraph2')}</p>
          <p>{t('intro.whatsNextParagraph3')}</p>
          <p>{t('intro.whatsNextQuestion')}</p>
          <button className="main-button" onClick={nextFrame}>
            {t('common.letsGo')}
          </button>
        </div>
      )}
    </div>
  );
};
