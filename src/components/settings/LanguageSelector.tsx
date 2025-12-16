'use client';

import { routing, usePathname, useRouter } from '@/i18n/routing';
import enFlag from '@/img/en.png';
import frFlag from '@/img/fr.png';
import nbFlag from '@/img/nb.png';
import { Language } from '@/lib/types';
import Image from 'next/image';

export function LanguageSelector({ size }: { size: number }) {
  const pathname = usePathname();
  const router = useRouter();

  const flagByLocale = {
    fr: frFlag,
    en: enFlag,
    nb: nbFlag,
  };

  const changeLocale = (lang: Language) => {
    document.cookie = `aster_locale=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.replace(pathname, { locale: lang });
    router.refresh();
  };

  return (
    <div className="lang-select">
      {routing.locales.map((lang) => (
        <button key={lang} onClick={() => changeLocale(lang)}>
          <Image style={{ height: size, width: 1.2 * size }} src={flagByLocale[lang]} alt={lang} />
        </button>
      ))}
    </div>
  );
}
