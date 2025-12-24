'use client';

import { Link } from '@/i18n/routing';
import { Member, Organization } from '@/lib/types';
import { useTranslations } from 'next-intl';

export const OrgPicker = ({ user, org }: { user: Member; org: Organization }) => {
  const t = useTranslations();

  return (
    <div className="org-picker">
      <h3>{t('organizations.seeDetails', { orgName: org.name })}</h3>
      <Link className="little-button" href={`/organizations/${org.id}`}>
        {t('organizations.goToOrg')}
      </Link>
    </div>
  );
};
