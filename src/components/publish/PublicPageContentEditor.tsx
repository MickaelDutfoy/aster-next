'use client';

import { toggleAnimalPublishing } from '@/actions/animals/toggleAnimalPublishing';
import { setAnimalPublicDescription } from '@/actions/publish/setAnimalPublicDescription';
import { setSheetsFooter } from '@/actions/publish/setSheetsFooter';
import { Link } from '@/i18n/routing';
import { AnimalWithoutDetails, OrganizationPublicPage } from '@/lib/types';
import clsx from 'clsx';
import { Copy, SquareArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';
import { SharePublicPage } from './SharePublicPage';

export const PublicPageContentEditor = ({
  publicPage,
  animals,
  canManagePage,
}: {
  publicPage: OrganizationPublicPage | null;
  animals: AnimalWithoutDetails[];
  canManagePage: boolean;
}) => {
  const t = useTranslations();

  const [openedAnimal, setOpenedAnimal] = useState<number | null>(null);
  const [descriptions, setDescriptions] = useState<Record<number, string>>(
    Object.fromEntries(animals.map((animal) => [animal.id, animal.publicDescription ?? ''])),
  );
  const [footer, setFooter] = useState<string>(publicPage?.publicAnimalSheetFooter ?? '');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSaveDescription = async (animalId: number, description: string) => {
    if (!description) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await setAnimalPublicDescription(animalId, description);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFooter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!footer) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await setSheetsFooter(footer);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!publicPage) {
    return <p>{t('publish.cannotManagePage')}</p>;
  }

  const embedCode = `<iframe
  src="https://aster-app.eu/embed/${publicPage.slug}"
  width="100%"
  loading="lazy"
></iframe>`;

  return (
    <>
      {publicPage.isPublished ? (
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
      ) : (
        <p className="page-status">{t('publish.offlinePage')}</p>
      )}

      {publicPage.isPublished && (
        <div className="page-with-share">
          <div className="page-status">
            <p>{t('publish.iframe')}</p>
            <pre>
              <code>{embedCode}</code>
            </pre>
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
            <Link className="little-button" href={`/organizations/${publicPage.orgId}/edit`}>
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
                  <div className="labeled-checkbox">
                    <p>{t('publish.publishedLabel')}</p>
                    <input
                      type="checkbox"
                      defaultChecked={animal.isPubliclyAdoptable}
                      disabled={!animal.imageKey || !animal.publicDescription || !canManagePage}
                      onChange={() => handleAnimalToggle(animal.id)}
                    />
                  </div>
                  <Link className="action link" href={`/animals/${animal.id}`}>
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
                      onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = 'auto';
                        el.style.height = `${el.scrollHeight}px`;
                      }}
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
        {canManagePage && (
          <form onSubmit={handleSaveFooter}>
            <p>{t('publish.footerLabel')}</p>
            <textarea
              placeholder={t('publish.footerPlaceholder')}
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
            <button
              type="submit"
              className="little-button"
              aria-busy={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : t('common.submit')}
            </button>
          </form>
        )}
      </div>
    </>
  );
};
