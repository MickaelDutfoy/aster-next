'use client';

import { CircleX } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export const Modal = ({
  expectedPath, // bloque les réouvertures de modale post-validation
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
