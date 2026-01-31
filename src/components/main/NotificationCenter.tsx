'use client';

import { markAllAsRead } from '@/actions/notifications/markAllAsRead';
import { markAsRead } from '@/actions/notifications/markAsRead';
import { switchUserToOrg } from '@/actions/organizations/switchUserToOrg';
import { useRouter } from '@/i18n/routing';
import { getAnimalOrg } from '@/lib/organizations/getAnimalOrg';
import { Member } from '@/lib/types';
import { Notification } from '@prisma/client';
import clsx from 'clsx';
import { SquareArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { showToast } from '../tools/ToastProvider';

export const NotificationCenter = ({
  user,
  notifications,
}: {
  user: Member;
  notifications: Notification[];
}) => {
  const t = useTranslations();
  const router = useRouter();

  const readOne = async (notifId: number, url: string | null) => {
    await markAsRead(notifId);
    if (url) {
      if (url.startsWith('/organizations/') && Number(url.split('/')[2]) !== user.selectedOrgId) {
        const res = await switchUserToOrg(Number(url.split('/')[2]));

        if (!res.ok) {
          showToast({
            ...res,
            message: res.message ? t(res.message) : undefined,
          });
          return;
        }
      }

      if (url.startsWith('/animals/')) {
        const org = await getAnimalOrg(Number(url.split('/')[2]));
        console.log(org);

        if (!org) {
          showToast({
            ok: false,
            status: 'error',
            message: t('toasts.cantAccess'),
          });
          return;
        }

        const res = await switchUserToOrg(org.id);

        if (!res.ok) {
          showToast({
            ...res,
            message: res.message ? t(res.message) : undefined,
          });
          return;
        }
      }

      router.push(url);
    }
  };

  const readAll = async () => {
    await markAllAsRead();
  };

  return (
    <>
      <div className="links-box">
        <button className="little-button" onClick={readAll}>
          {t('notifications.markAsReadButton')}
        </button>
      </div>
      {notifications.length === 0 && <h3 className="denied-page">{t('notifications.noNotif')}</h3>}
      <ul className="notif-list">
        {notifications.map((notif) => (
          <li
            className={'notif' + clsx(notif.href && ' clickable')}
            key={notif.id}
            onClick={() => readOne(notif.id, notif.href)}
          >
            <div className={clsx(!notif.readAt && 'unread')}>
              <p>{t(notif.messageKey, notif.messageParams as Record<string, string>)}</p>
              {notif.href && <SquareArrowRight className="link" size={26} />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
