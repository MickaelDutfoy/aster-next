import { Modal } from '@/components/Modal';
import { EditAnimal } from '@/components/animals/EditAnimal';

export default async function EditAnimalModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Modal>
      <EditAnimal id={id} />
    </Modal>
  );
}
