'use client';

import { AddAnimal } from '@/components/AddAnimal';
import { Modal } from '@/components/Modal';
import { usePathname } from 'next/navigation';

export default function AddAnimalModal() {
  const pathname = usePathname();

  if (pathname !== '/animals/new') return null; // empêche réouverture de modale

  return (
    <Modal>
      <AddAnimal />
    </Modal>
  );
}
