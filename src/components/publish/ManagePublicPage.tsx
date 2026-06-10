'use client';

import { setOrgPublicPage } from '@/actions/publish/setOrgPublicPage';
import { useRouter } from '@/i18n/routing';
import { OrganizationPublicPage } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const ManagePublicPage = ({
  orgName,
  orgPageDetails,
  slugs,
}: {
  orgName: string;
  orgPageDetails: OrganizationPublicPage | null;
  slugs: string[];
}) => {
  const t = useTranslations();
  const router = useRouter();

  const orgNameToSlug = (orgName: string): string => {
    return orgName
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // é -> e, å -> a
      .replace(/'/g, '') // l'asso -> lasso
      .replace(/[^a-z0-9\s-]/g, '') // caractères spéciaux
      .replace(/\s+/g, '-') // espaces -> tirets
      .replace(/-+/g, '-') // --- -> -
      .replace(/^-|-$/g, ''); // retire - début/fin
  };

  const [slug, setSlug] = useState<string>(orgPageDetails?.slug ?? orgNameToSlug(orgName));
  const [isLoading, setIsLoading] = useState(false);
  const [saveWarning, setSaveWarning] = useState(false);

  const isValidSlug = (slug: string): boolean => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  };

  const handleFirstChange = () => {
    if (!saveWarning) {
      setSaveWarning(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const slug = formData.get('slug')?.toString().trim();

    if (!slug) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.requiredFieldsMissing'),
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await setOrgPublicPage(formData);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      if (res.ok) {
        router.back();
      }
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

  return (
    <div className="pulish-managment">
      <h3>{t('publish.managePage')}</h3>
      <p className="notice">{t('common.requiredFieldsNotice')}</p>
      <form onSubmit={handleSubmit} onChange={handleFirstChange}>
        <div className="form-tab">
          <p>{t('publish.publicURLNotice')}</p>
          <div className="full-url">
            <p>{`https://aster-app.eu/page/`}</p>
            <input type="text" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          {(!isValidSlug(slug) || (slugs.includes(slug) && slug !== orgPageDetails?.slug)) && (
            <p className="invalid-slug">{t('publish.invalidSlug')}</p>
          )}
          {(slug === orgPageDetails?.slug || (isValidSlug(slug) && !slugs.includes(slug))) && (
            <p className="valid-slug">{t('publish.validSlug')}</p>
          )}
          <div>
            <div className="labeled-checkbox">
              <p>{t('publish.displayHealthInfo')}</p>
              <input
                type="checkbox"
                name="displayHealthInfo"
                defaultChecked={orgPageDetails?.displayHealthInfo ?? false}
              />
            </div>
            <p className="notice">{t('publish.healthInfoNotice')}</p>
          </div>
          <div>
            <div className="labeled-checkbox">
              <p>{t('publish.displayLocations')}</p>
              <input
                type="checkbox"
                name="displayLocations"
                defaultChecked={orgPageDetails?.displayLocations ?? false}
              />
            </div>
            <p className="notice">{t('publish.locationsNotice')}</p>
          </div>
          <div className="labeled-checkbox">
            <p>{t('publish.isSitePublishedNotice')}</p>
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={orgPageDetails?.isPublished ?? false}
            />
          </div>
          <div className="labeled-checkbox">
            <p>{t('publish.isSiteEmbeddableNotice')}</p>
            <input
              type="checkbox"
              name="isEmbeddable"
              defaultChecked={orgPageDetails?.isEmbeddable ?? false}
            />
          </div>
        </div>

        {saveWarning && <p className="save-warning">{t('common.saveWarning')}</p>}
        <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
          {isLoading ? t('common.loading') : t('common.submit')}
        </button>
      </form>
    </div>
  );
};
