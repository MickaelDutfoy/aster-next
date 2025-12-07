'use client';

import { Member } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { Cat, FolderOpen, HouseHeart, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from './providers/UserProvider';

export const NavBar = () => {
  const user: Member | null = useUser();
  const pathname = usePathname();

  const disableMenu = (): string => {
    return user?.organizations?.length === 0 ||
      user?.organizations.every((org) => org.userStatus === MemberStatus.PENDING)
      ? 'disabled'
      : '';
  };

  return (
    <>
      <nav>
        <Link href="/">
          <HouseHeart size={42} strokeWidth={pathname === '/' ? 2.2 : 0.8} />
        </Link>
        <Link className={disableMenu()} href="/animals">
          <Cat size={42} strokeWidth={pathname.startsWith('/animals') ? 2.2 : 0.8} />
        </Link>
        <Link className={disableMenu()} href="/families">
          <Users size={42} strokeWidth={pathname.startsWith('/families') ? 2.2 : 0.8} />
        </Link>
        {/* <Link className={disableMenu()} href="/map">
          <MapPinned size={42} strokeWidth={pathname.startsWith('/map') ? 2.2 : 0.8} />
        </Link> */}
        <Link href="/organizations">
          <FolderOpen size={42} strokeWidth={pathname.startsWith('/organizations') ? 2.2 : 0.8} />
        </Link>
        <Link href="/settings">
          <Settings size={42} strokeWidth={pathname.startsWith('/settings') ? 2.2 : 0.8} />
        </Link>
      </nav>
      <hr />
    </>
  );
};
