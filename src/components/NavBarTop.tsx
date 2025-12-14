'use client';

import { Link, usePathname } from '@/i18n/routing';
import { Member } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { Cat, FolderOpen, MapPinned, Users } from 'lucide-react';
import { useUser } from './providers/UserProvider';

export const NavBarTop = () => {
  const user: Member | null = useUser();
  const pathname = usePathname();

  const disableMenu = (): string => {
    return user?.organizations?.length === 0 ||
      user?.organizations.every((org) => org.userStatus === MemberStatus.PENDING)
      ? 'disabled'
      : '';
  };

  return (
    <div className="top-menu">
      <nav>
        <Link className={disableMenu()} href="/animals">
          <Cat
            fill={pathname.startsWith('/animals') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/animals') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/animals') ? 2.2 : 0.8}
          />
        </Link>
        <Link className={disableMenu()} href="/families">
          <Users
            fill={pathname.startsWith('/families') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/families') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/families') ? 2.2 : 0.8}
          />
        </Link>
        <Link className={disableMenu()} href="/map">
          <MapPinned
            fill={pathname.startsWith('/map') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/map') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/map') ? 2.2 : 0.8}
          />
        </Link>
        <Link href="/organizations">
          <FolderOpen
            fill={pathname.startsWith('/organizations') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/organizations') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/organizations') ? 2.2 : 0.8}
          />
        </Link>
      </nav>
    </div>
  );
};
