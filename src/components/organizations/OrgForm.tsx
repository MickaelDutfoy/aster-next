'use client';

import { editOrg } from '@/actions/organizations/editOrg';
import { useRouter } from '@/i18n/routing';
import { Organization } from '@/lib/types';
import { MemberRole } from '@prisma/client';

import { registerOrg } from '@/actions/organizations/registerOrg';
import { useCurrencies } from '@/lib/utils/useCurrencies';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DeniedPage } from '../main/DeniedPage';
import { showToast } from '../tools/ToastProvider';

export const OrgForm = ({ org }: { org?: Organization }) => {
  const t = useTranslations();
  const router = useRouter();
  const currencies = useCurrencies();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name')?.toString().trim();
    const defaultCurrency = formData.get('defaultCurrency')?.toString().trim();

    if (!name || !defaultCurrency) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.orgNameRequired'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = org ? await editOrg(org.id, formData) : await registerOrg(formData);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      if (org && res.ok) {
        router.replace(`/organizations/${org.id}`);
      } else if (res.ok) {
        router.replace(`/organizations`);
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

  if (org && org?.userRole !== MemberRole.SUPERADMIN) {
    return <DeniedPage cause="refused" />;
  }

  return (
    <form className="org-edition" onSubmit={handleSubmit}>
      <h3>{t('organizations.editInfoTitle')}</h3>
      <p className="notice">{t('common.requiredFieldsNotice')}</p>
      <p>{t('organizations.orgNameLabel')}</p>
      <input type="text" name="name" defaultValue={org?.name} />
      <p>{t('organizations.orgDescLabel')}</p>
      <textarea
        name="description"
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = 'auto';
          el.style.height = `${el.scrollHeight}px`;
        }}
        defaultValue={org?.description ?? ''}
      />
      <p>{t('organizations.orgCurrLabel')}</p>
      <select name="defaultCurrency" defaultValue={org?.defaultCurrency as string}>
        // retirer as string une fois obligé
        {currencies.map((curr) => (
          <option key={curr.value} value={curr.value}>
            {curr.label}
          </option>
        ))}
      </select>
      <p className="notice">{t('organizations.orgCurrNotice')}</p>
      <div className="yes-no">
        <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
          {isLoading ? t('common.deleting') : t('common.confirm')}
        </button>
        <button
          type="button"
          className="little-button"
          onClick={() => router.back()}
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
};
