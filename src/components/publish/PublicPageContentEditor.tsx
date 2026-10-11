'use client';

import { toggleAnimalPublishing } from '@/actions/animals/toggleAnimalPublishing';
import { toggleAnimalReserved } from '@/actions/animals/toggleAnimalReserved';
import { setAnimalPublicDescription } from '@/actions/publish/setAnimalPublicDescription';
import { Link } from '@/i18n/routing';
import { AnimalPublicSetup, OrganizationPublicPage } from '@/lib/types';
import { autoResizeTextarea } from '@/lib/utils/autoResizeTextarea';
import clsx from 'clsx';
import { Copy, SquareArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';
import { SharePublicPage } from './SharePublicPage';

export const PublicPageContentEditor = ({
  publicPage,
  animals,
  canManagePage,
}: {
  publicPage: OrganizationPublicPage | null;
  animals: AnimalPublicSetup[];
  canManagePage: boolean;
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const [openedAnimal, setOpenedAnimal] = useState<number | null>(null);
  const [publishedAnimals, setPublishedAnimals] = useState<Record<number, boolean>>(
    Object.fromEntries(animals.map((animal) => [animal.id, animal.isPubliclyAdoptable])),
  );
  const [reservedAnimals, setReservedAnimals] = useState<Record<number, boolean>>(
    Object.fromEntries(animals.map((animal) => [animal.id, animal.isReserved])),
  );
  const [descriptions, setDescriptions] = useState<Record<number, string>>(
    Object.fromEntries(animals.map((animal) => [animal.id, animal.publicDescription ?? ''])),
  );
  const [savedDescriptions, setSavedDescriptions] = useState<Record<number, string>>(
    Object.fromEntries(animals.map((animal) => [animal.id, animal.publicDescription ?? ''])),
  );
  const [isLoading, setIsLoading] = useState(false);

  const openOrCollapseAnimal = (animalId: number) => {
    if (animalId === openedAnimal) {
      setOpenedAnimal(null);
    } else {
      setOpenedAnimal(animalId);
    }
  };

  const handleAnimalPublishing = async (animalId: number, checked: boolean) => {
    const res = await toggleAnimalPublishing(animalId);

    if (res.ok) {
      setPublishedAnimals((prev) => ({
        ...prev,
        [animalId]: checked,
      }));
    }

    if (res.message) {
      showToast({
        ...res,
        message: t(res.message),
      });
    }
  };

  const handleAnimalReserved = async (animalId: number, checked: boolean) => {
    const res = await toggleAnimalReserved(animalId);

    if (res.ok) {
      setReservedAnimals((prev) => ({
        ...prev,
        [animalId]: checked,
      }));
    }

    if (res.message) {
      showToast({
        ...res,
        message: t(res.message),
      });
    }
  };

  const handleSaveDescription = async (animalId: number, description: string) => {
    const trimmedDescription = description.trim();

    if (!trimmedDescription && publishedAnimals[animalId]) {
      showToast({
        status: 'error',
        message: t('toasts.animalPublicDescriptionError'),
      });

      setDescriptions((prev) => ({
        ...prev,
        [animalId]: savedDescriptions[animalId],
      }));

      return;
    }

    setIsLoading(true);

    try {
      const res = await setAnimalPublicDescription(animalId, trimmedDescription);

      if (res.ok) {
        setSavedDescriptions((prev) => ({
          ...prev,
          [animalId]: trimmedDescription,
        }));
      }

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!publicPage) {
    return <p>{t('publish.cannotManagePage')}</p>;
  }

  const embedCode = `<script
  src="https://aster-app.eu/aster-embed.js"
  data-slug="${publicPage.slug}"
  data-locale="${locale}"
  data-theme="light"
  data-appearance="seamless"
></script>
<!-- you can remove data-appearance, change data-theme
to "dark" and choose which combination you prefer -->`;

  return (
    <>
      {!publicPage.isEmbeddable && !publicPage.isPublished && (
        <p className="page-status">{t('publish.offlinePage')}</p>
      )}
      {publicPage.isPublished && (
        <div className="page-with-share">
          <div className="page-status">
            <p>{t('publish.onlinePage')}</p>
            <Link
              className="link"
              href={`/page/${publicPage.slug}`}
              target="_blank"
            >{`https://aster-app.eu/page/${publicPage.slug}`}</Link>
          </div>
          <SharePublicPage url={`https://aster-app.eu/page/${publicPage.slug}`} />
        </div>
      )}
      {publicPage.isEmbeddable && (
        <div className="page-with-share">
          <div className="page-status">
            <p>{t('publish.iframe')}</p>
            <textarea defaultValue={embedCode} readOnly></textarea>
          </div>

          <button
            className="link"
            onClick={() => {
              navigator.clipboard.writeText(embedCode);
              showToast({ status: 'success', message: t('common.copiedToClipboard') });
            }}
          >
            <Copy size={26} />
          </button>
        </div>
      )}

      <div className="page-managment-content">
        {canManagePage && (
          <div className="text-with-link">
            <p>{t('publish.editOrgDesc')}</p>
            <Link className="little-button" href={`/organizations/${publicPage.orgId}`}>
              {t('common.view')}
            </Link>
          </div>
        )}
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
                  <div
                    className={
                      'labeled-checkbox' +
                      clsx(
                        (!animal.imageKey || !animal.publicDescription || !canManagePage) &&
                          ' disabled',
                      )
                    }
                  >
                    <div className="checkboxes">
                      <div>
                        <p>{t('publish.publishedLabel')}</p>
                        <input
                          type="checkbox"
                          checked={publishedAnimals[animal.id]}
                          disabled={!animal.imageKey || !animal.publicDescription || !canManagePage}
                          onChange={(e) =>
                            handleAnimalPublishing(animal.id, e.currentTarget.checked)
                          }
                        />
                      </div>
                      <div>
                        <p>{t('publish.reservedLabel')}</p>
                        <input
                          type="checkbox"
                          checked={reservedAnimals[animal.id]}
                          disabled={!publishedAnimals[animal.id] || !canManagePage}
                          onChange={(e) => handleAnimalReserved(animal.id, e.currentTarget.checked)}
                        />
                      </div>
                    </div>
                  </div>
                  <Link className="action link" href={`/animals/${animal.id}`} prefetch={false}>
                    <SquareArrowRight size={26} />
                  </Link>
                </div>
                {openedAnimal === animal.id && (
                  <div className={'edit-public-desc' + clsx(!animal.canUserEdit && ' disabled')}>
                    <textarea
                      placeholder={t('publish.descPlaceholder', { name: animal.name })}
                      value={descriptions[animal.id] ?? ''}
                      onChange={(e) =>
                        setDescriptions((prev) => ({
                          ...prev,
                          [animal.id]: e.target.value,
                        }))
                      }
                      onFocus={(e) => autoResizeTextarea(e.currentTarget)}
                      onInput={(e) => autoResizeTextarea(e.currentTarget)}
                    />
                    <button
                      className="little-button"
                      aria-busy={isLoading}
                      disabled={isLoading}
                      onClick={() => handleSaveDescription(animal.id, descriptions[animal.id])}
                    >
                      {isLoading ? t('common.loading') : t('common.submit')}
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};
