'use client';

import { deleteFamily } from '@/actions/families/deleteFamily';
import { useRouter } from '@/i18n/routing';
import { Family, Member, Organization } from '@/lib/types';
import { MemberRole } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DeniedPage } from '../main/DeniedPage';
import { showToast } from '../tools/ToastProvider';

export const DeleteFamily = ({
  user,
  org,
  family,
}: {
  user: Member;
  org: Organization;
  family: Family;
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await deleteFamily(family.id);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace('/families');
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

  if (family.memberId && family.memberId !== user.id && org.userRole !== MemberRole.SUPERADMIN) {
    return <DeniedPage cause="refused" />;
  }

  return (
    <div className="delete-popup">
      <h3>{t('families.deleteTitle')}</h3>
      <p>{t('common.areYouSure')}</p>
      <p>{t('common.actionWarning')}</p>
      <div className="yes-no">
        <button
          type="submit"
          onClick={handleSubmit}
          className="little-button"
          aria-busy={isLoading}
          disabled={isLoading}
        >
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
    </div>
  );
};
