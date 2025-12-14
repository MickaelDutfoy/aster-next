'use client';

import { Link, usePathname } from '@/i18n/routing';
import { Member } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { Bell, HouseHeart, MailQuestionMark, Settings } from 'lucide-react';
import { useUser } from './providers/UserProvider';

export const NavBarBottom = () => {
  const user: Member | null = useUser();
  const pathname = usePathname();

  const disableMenu = (): string => {
    return user?.organizations?.length === 0 ||
      user?.organizations.every((org) => org.userStatus === MemberStatus.PENDING)
      ? 'disabled'
      : '';
  };

  return (
    <footer>
      <nav>
        <Link href="/">
          <HouseHeart
            fill={pathname === '/' ? '#999' : '"000'}
            fillOpacity={pathname === '/' ? 0.5 : 0}
            size={42}
            strokeWidth={pathname === '/' ? 2.2 : 0.8}
          />
        </Link>
        <Link style={{ display: 'none' }} href="/contact">
          <MailQuestionMark
            fill={pathname.startsWith('/contact') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/contact') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/contact') ? 2.2 : 0.8}
          />
        </Link>
        <Link style={{ display: 'none' }} href="/notifications">
          <Bell
            fill={pathname.startsWith('/notifications') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/notifications') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/notifications') ? 2.2 : 0.8}
          />
        </Link>
        <Link href="/settings">
          <Settings
            fill={pathname.startsWith('/settings') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/settings') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/settings') ? 2.2 : 0.8}
          />
        </Link>
      </nav>
    </footer>
  );
};
