'use client';

import { toggleAnimalPublishing } from '@/actions/animals/toggleAnimalPublishing';
import { Link, useRouter } from '@/i18n/routing';
import { AnimalWithoutDetails, OrganizationPublicPage } from '@/lib/types';
import { SquareArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const PublicPageContentEditor = ({
  publicPage,
  animals,
}: {
  publicPage: OrganizationPublicPage | null;
  animals: AnimalWithoutDetails[];
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [openedAnimal, setOpenedAnimal] = useState<number | null>(null);

  const openOrCollapseAnimal = (animalId: number) => {
    if (animalId === openedAnimal) {
      setOpenedAnimal(null);
    } else {
      setOpenedAnimal(animalId);
    }
  };

  const handleAnimalToggle = async (animalId: number) => {
    const res = await toggleAnimalPublishing(animalId);

    if (res.message) {
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
    }
  };

  if (!publicPage) {
    return <p>{t('publish.cannotManagePage')}</p>;
  }

  return (
    <>
      {publicPage.isPublished ? (
        <div className="page-status">
          <p>{t('publish.onlinePage')}</p>
          <Link
            className="link"
            href={`/page/${publicPage.slug}`}
            target="_blank"
          >{`https://aster-app.eu/page/${publicPage.slug}`}</Link>
        </div>
      ) : (
        <p className="page-status">{t('publish.offlinePage')}</p>
      )}
      <div className="page-managment-content">
        <div className="text-with-link">
          <p>{t('publish.editOrgDesc')}</p>
          <Link className="little-button" href={`/organizations/${publicPage.orgId}/edit`}>
            {t('common.view')}
          </Link>
        </div>
        <ul className="publish-animals">
          {animals
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
            .map((animal) => (
              <li key={animal.id}>
                <div className="line">
                  <p className="link" onClick={() => openOrCollapseAnimal(animal.id)}>
                    <span>{animal.name}</span>
                    <span> {openedAnimal === animal.id ? '▾' : '▸'}</span>
                  </p>
                  <div className="labeled-checkbox">
                    <p>{t('publish.publishedLabel')}</p>
                    <input
                      type="checkbox"
                      defaultChecked={animal.isPubliclyAdoptable}
                      disabled={!animal.imageKey}
                      onChange={() => handleAnimalToggle(animal.id)}
                    />
                  </div>
                  <Link className="action link" href={`/animals/${animal.id}`}>
                    <SquareArrowRight size={26} />
                  </Link>
                </div>
                {openedAnimal === animal.id && (
                  <div className="edit-public-desc">
                    <textarea
                      placeholder={t('publish.descPlaceholder', { name: animal.name })}
                      defaultValue={animal.publicDescription ?? ''}
                      onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = 'auto';
                        el.style.height = `${el.scrollHeight}px`;
                      }}
                    />
                    <button className="little-button">{t('common.submit')}</button>
                  </div>
                )}
              </li>
            ))}
        </ul>
        <p>{t('publish.footerLabel')}</p>
        <textarea
          placeholder={t('publish.footerPlaceholder')}
          defaultValue={publicPage.publicAnimalSheetFooter}
        />
      </div>
    </>
  );
};
