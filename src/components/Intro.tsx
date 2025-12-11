'use client';

import { markIntroSeen } from '@/actions/intro/markIntroSeen';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Language } from '@/lib/types';
import '@/styles/intro.scss';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export const Intro = () => {
  const locale = useLocale() as Language;
  const t = useTranslations('Intro');
  const tCommon = useTranslations('Common');
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
          <h2>{t('selectLanguage')}</h2>
          <LanguageSelector size={44} />
          <button className="main-button" onClick={nextFrame}>
            {tCommon('seeMore')}
          </button>
        </div>
      )}
      {step === 1 && (
        <div>
          <h2>{t('welcomeTitle')}</h2>
          <p>{t('welcomeSubtitle')}</p>
          <button className="main-button" onClick={nextFrame}>
            {tCommon('seeMore')}
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>{t('whyTitle')}</h2>
          <p>{t('whyWhatIsAster')}</p>
          <p>{t('whyHowHelps')}</p>
          <button className="main-button" onClick={nextFrame}>
            {tCommon('seeMore')}
          </button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>{t('howTitle')}</h2>
          <p>{t('howFirstParagraph')}</p>
          <p>{t('howSecondParagraph')}</p>
          <button className="main-button" onClick={nextFrame}>
            {tCommon('seeMore')}
          </button>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2>{t('whatsNextTitle')}</h2>
          <p>{t('whatsNextParagraph1')}</p>
          <p>{t('whatsNextParagraph2')}</p>
          <p>{t('whatsNextQuestion')}</p>
          <button className="main-button" onClick={nextFrame}>
            {tCommon('letsGo')}
          </button>
        </div>
      )}
    </div>
  );
};
