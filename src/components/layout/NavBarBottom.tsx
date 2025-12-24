'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { Bell, HouseHeart, MailQuestionMark, Settings } from 'lucide-react';

export const NavBarBottom = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <footer>
      <nav>
        <button onClick={() => router.replace('/')}>
          <HouseHeart
            fill={pathname === '/' ? '#999' : '"000'}
            fillOpacity={pathname === '/' ? 0.5 : 0}
            size={42}
            strokeWidth={pathname === '/' ? 2.2 : 0.8}
          />
        </button>
        <button onClick={() => router.replace('/contact')}>
          <MailQuestionMark
            fill={pathname.startsWith('/contact') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/contact') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/contact') ? 2.2 : 0.8}
          />
        </button>
        <button style={{ display: 'none' }} onClick={() => router.replace('/notifications')}>
          <Bell
            fill={pathname.startsWith('/notifications') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/notifications') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/notifications') ? 2.2 : 0.8}
          />
        </button>
        <button onClick={() => router.replace('/settings')}>
          <Settings
            fill={pathname.startsWith('/settings') ? '#999' : '"000'}
            fillOpacity={pathname.startsWith('/settings') ? 0.5 : 0}
            size={42}
            strokeWidth={pathname.startsWith('/settings') ? 2.2 : 0.8}
          />
        </button>
      </nav>
    </footer>
  );
};
