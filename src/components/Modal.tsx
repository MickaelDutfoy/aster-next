'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { CircleX } from 'lucide-react';

export const Modal = ({
  expectedPath, // prevents modal from re-opening after validation
  children,
}: {
  expectedPath: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return pathname === expectedPath ? (
    <div className="overlay" onClick={() => router.back()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <CircleX className="close" size={35} onClick={() => router.back()} />
        {children}
      </div>
    </div>
  ) : null;
};
