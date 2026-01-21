'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { Member } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { Bell, Cat, HouseHeart, MapPinned } from 'lucide-react';

export const NavBarTop = ({ user, notifCounter }: { user: Member; notifCounter: number }) => {
  const pathname = usePathname();
  const router = useRouter();

  const disableMenu = (): string => {
    return user?.organizations?.length === 0 ||
      user?.organizations?.every((org) => org.userStatus === MemberStatus.PENDING) ||
      !user.selectedOrgId
      ? 'disabled'
      : '';
  };

  return (
    <div className="top-menu">
      <nav>
        <button className={disableMenu()} onClick={() => router.replace('/animals')}>
          <Cat
            fill={pathname.startsWith('/animals') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/animals') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/animals') ? 2.2 : 0.8}
          />
        </button>
        <button className={disableMenu()} onClick={() => router.replace('/families')}>
          <HouseHeart
            fill={pathname.startsWith('/families') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/families') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/families') ? 2.2 : 0.8}
          />
        </button>
        <button
          style={{ display: 'none' }}
          className={disableMenu()}
          onClick={() => router.replace('/map')}
        >
          <MapPinned
            fill={pathname.startsWith('/map') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/map') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/map') ? 2.2 : 0.8}
          />
        </button>

        <button className="notif-bell" onClick={() => router.replace('/notifications')}>
          <Bell
            fill={pathname.startsWith('/notifications') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/notifications') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/notifications') ? 2.2 : 0.8}
          />
          {notifCounter > 0 && (
            <div className="notif-counter">
              <p style={{ fontSize: notifCounter < 10 ? '0.9rem' : '0.8rem' }}>
                {notifCounter <= 99 ? notifCounter : '99+'}
              </p>
            </div>
          )}
        </button>
      </nav>
    </div>
  );
};
