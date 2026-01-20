'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { Notebook, Settings, Users } from 'lucide-react';

export const NavBarBottom = () => {
  const pathname = usePathname();
  const router = useRouter();

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
            fill={pathname.startsWith('/organizations') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/organizations') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/organizations') ? 2.2 : 0.8}
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
