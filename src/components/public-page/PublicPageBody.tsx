'use client';

import { Link } from '@/i18n/routing';
import { AnimalPublicSheet } from '@/lib/types';
import { MailOpen, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { PublicAnimalCard } from './PublicAnimalCard';
import { PublicAnimalModal } from './PublicAnimaModal';

export const PublicPageBody = ({
  title,
  description,
  animals,
  animalFooter,
  displayHealthInfo,
  displayLocations,
  email,
  phoneNumber,
  embed,
}: {
  title: string;
  description: string;
  animals: AnimalPublicSheet[];
  animalFooter: string;
  displayHealthInfo: boolean;
  displayLocations: boolean;
  email: string;
  phoneNumber: string;
  embed: boolean;
}) => {
  const t = useTranslations();

  const [openedAnimalId, setOpenedAnimalId] = useState<number | null>(null);

  useEffect(() => {
    if (!openedAnimalId) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [openedAnimalId]);

  const openedAnimal = animals.find((animal) => animal.id === openedAnimalId) ?? null;

  return (
    <div className="public-page">
      {openedAnimal && (
        <PublicAnimalModal
          animal={openedAnimal}
          animalFooter={animalFooter}
          displayHealthInfo={displayHealthInfo}
          displayLocations={displayLocations}
          onClose={() => setOpenedAnimalId(null)}
        />
      )}

      <Link className="aster-power" href="/discover" target="_blank">
        <img src="/icons/aster-icon-192.png" alt="Aster icon" />
        <span>Powered by Aster</span>
      </Link>

      {!embed && (
        <header className="box">
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
      )}
      <main className="box">
        {!embed && <h2>{t('publish.page.animals')}</h2>}
        <div className="animals">
          {animals.map((animal) => (
            <PublicAnimalCard key={animal.id} animal={animal} onOpenAnimal={setOpenedAnimalId} />
          ))}
        </div>
      </main>
      {!embed && (email || phoneNumber) && (
        <footer className="box">
          <h2>{t('publish.page.contact')}</h2>
          <div className="contact">
            {email && (
              <div className="contact-item">
                <MailOpen size={18} />
                <span>:</span>
                <a className="link" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            )}
            {phoneNumber && (
              <div className="contact-item">
                <Phone size={18} />
                <span>:</span>
                <a className="link" href={`tel:${phoneNumber}`}>
                  {phoneNumber}
                </a>
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};
