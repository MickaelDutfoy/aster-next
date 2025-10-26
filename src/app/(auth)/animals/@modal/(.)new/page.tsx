import { Modal } from '@/components/Modal';
import { RegisterAnimal } from '@/components/animals/RegisterAnimal';

export default function AddAnimalModal() {
  return (
    <Modal expectedPath="/animals/new">
      <RegisterAnimal />
    </Modal>
  );
}
