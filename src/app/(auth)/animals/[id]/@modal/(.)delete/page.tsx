import { Modal } from '@/components/Modal';
import { RemoveAnimal } from '@/components/animals/RemoveAnimal';

export default async function RemoveAnimalModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Modal>
      <RemoveAnimal id={id} />
    </Modal>
  );
}
