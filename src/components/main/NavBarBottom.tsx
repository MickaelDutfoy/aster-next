'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { Member } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { FileSpreadsheet, Notebook, Settings, Users } from 'lucide-react';

export const NavBarBottom = ({ user }: { user: Member }) => {
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
    <footer>
      <nav>
        <button onClick={() => router.replace('/')}>
          <Notebook
            fill={pathname === '/' ? '#999' : '"000'}
            fillOpacity={pathname === '/' ? 0.5 : 0}
            size={42}
            strokeWidth={pathname === '/' ? 2.2 : 0.8}
          />
        </button>

        <button onClick={() => router.replace('/organizations')}>
          <Users
            fill={
              pathname.startsWith('/organizations') || pathname.startsWith('/members')
                ? '#999'
                : '"000'
            }
            fillOpacity={
              pathname.startsWith('/organizations') || pathname.startsWith('/members') ? 0.5 : 0
            }
            size={42}
            strokeWidth={
              pathname.startsWith('/organizations') || pathname.startsWith('/members') ? 2.2 : 0.8
            }
          />
        </button>

        <button className={disableMenu()} onClick={() => router.replace('/transactions')}>
          <FileSpreadsheet
            fill={pathname.startsWith('/transactions') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/transactions') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/transactions') ? 2.2 : 0.8}
          />
        </button>

        <button onClick={() => router.replace('/settings')}>
          <Settings
            fill={
              pathname.startsWith('/settings') || pathname.startsWith('/contact') ? '#999' : '"000'
            }
            fillOpacity={
              pathname.startsWith('/settings') || pathname.startsWith('/contact') ? 0.5 : 0
            }
            size={42}
            strokeWidth={
              pathname.startsWith('/settings') || pathname.startsWith('/contact') ? 2.2 : 0.8
            }
          />
        </button>
      </nav>
    </footer>
  );
};
