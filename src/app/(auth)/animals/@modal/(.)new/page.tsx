import { Modal } from '@/components/Modal';
import { CreateAnimal } from '@/components/animals/CreateAnimal';

export default function AddAnimalModal() {
  return (
    <Modal expectedPath="/animals/new">
      <CreateAnimal />
    </Modal>
  );
}
