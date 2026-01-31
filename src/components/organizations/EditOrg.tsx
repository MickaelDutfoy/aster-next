'use client';

import { editOrg } from '@/actions/organizations/editOrg';
import { useRouter } from '@/i18n/routing';
import { Organization } from '@/lib/types';
import { MemberRole } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DeniedPage } from '../main/DeniedPage';
import { showToast } from '../tools/ToastProvider';

export const EditOrg = ({ org }: { org: Organization }) => {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newOrgName = formData.get('newOrgName')?.toString().trim();

    if (!newOrgName) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.orgNameRequired'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await editOrg(org.id, formData);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace(`/organizations/${org.id}`);
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

  if (org.userRole !== MemberRole.SUPERADMIN) {
    return <DeniedPage cause="refused" />;
  }

  return (
    <form className="superadmin-transfer" onSubmit={handleSubmit}>
      <h3>{t('organizations.editInfoTitle')}</h3>
      <p className="notice">{t('common.requiredFieldsNotice')}</p>
      <p>{t('organizations.orgNameLabel')}</p>
      <input type="text" name="newOrgName" defaultValue={org.name} />
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
