'use client';

import { deleteOrg } from '@/actions/organizations/deleteOrg';
import { useRouter } from '@/i18n/routing';
import { Organization } from '@/lib/types';
import { MemberRole } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DeniedPage } from '../main/DeniedPage';
import { showToast } from '../tools/ToastProvider';

export const DeleteOrg = ({ org }: { org: Organization }) => {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [orgNameCheck, setOrgNameCheck] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (orgNameCheck !== org.name) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.orgNameRequired'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await deleteOrg(org.id, formData);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace(`/organizations`);
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
    <form className="delete-account-or-org" onSubmit={handleSubmit}>
      <h3>{t('organizations.deleteTitle')}</h3>
      <p className="notice" style={{ fontSize: '0.8rem' }}>
        {t('common.requiredFieldsNotice')}
      </p>
      <p>{t('organizations.deleteOrg.readBefore', { orgName: org.name })}</p>
      <ul>
        {t.raw('organizations.deleteOrg.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p>{t('organizations.deleteOrg.mustWriteOrgName')}</p>
      <input type="text" name="verifyOrgName" onChange={(e) => setOrgNameCheck(e.target.value)} />
      <div className="yes-no">
        <button
          type="submit"
          className="little-button"
          aria-busy={isLoading || orgNameCheck !== org.name}
          disabled={isLoading || orgNameCheck !== org.name}
        >
          {isLoading ? t('common.deleting') : t('common.confirm')}
        </button>
        <button type="button" className="little-button" onClick={() => router.back()}>
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
};
