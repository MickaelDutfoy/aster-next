'use client';

import { CircleX } from 'lucide-react';

export const InfoModal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <CircleX className="close" size={32} onClick={onClose} />
        {children}
      </div>
    </div>
  );
};
