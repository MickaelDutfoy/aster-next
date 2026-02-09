'use client';

import { switchUserToOrg } from '@/actions/organizations/switchUserToOrg';
import { useRouter } from '@/i18n/routing';
import { Member, Organization } from '@/lib/types';
import { MailOpen, Phone, SquareArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { showToast } from '../tools/ToastProvider';

export const MemberDetails = ({
  isUser,
  member,
  orgsInCommon,
}: {
  isUser: boolean;
  member: Member;
  orgsInCommon: Organization[];
}) => {
  const t = useTranslations();
  const router = useRouter();

  const navigateToOrgPage = async (orgId: number) => {
    const res = await switchUserToOrg(orgId);

    if (!res.ok) {
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      return;
    }

    router.push(`/organizations/${orgId}`);
  };

  return (
    <div className="member-sheet">
      <h3>
        {member.firstName} {member.lastName}
      </h3>
      {isUser && <p style={{ paddingTop: 5 }}>{t('members.ownSheet')}</p>}

      <div className="contact-display">
        <div className="contact-item">
          <MailOpen size={18} />
          <span>:</span>
          <a className="link" href={`mailto:${member.email}`}>
            {member.email}
          </a>
        </div>
        <div className="contact-item">
          <Phone size={18} />
          <span>:</span>
          <a className="link" href={`tel:${member.phoneNumber}`}>
            {member.phoneNumber}
          </a>
        </div>
      </div>

      {orgsInCommon.length > 0 && (
        <div>
          <p>{t('members.orgsInCommonTitle')}</p>
          <ul>
            {orgsInCommon.map((org) => (
              <li key={org.id}>
                <span>{org.name}</span>
                <button className="link" onClick={() => navigateToOrgPage(org.id)}>
                  <SquareArrowRight size={26} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
