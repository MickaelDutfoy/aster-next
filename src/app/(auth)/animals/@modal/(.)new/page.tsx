'use client';

import { Modal } from '@/components/Modal';
import { AddAnimal } from '@/components/animals/AddAnimal';
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
