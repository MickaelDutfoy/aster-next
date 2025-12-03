import { RegisterFamily } from '@/components/families/RegisterFamily';
import { Modal } from '@/components/Modal';

export default function AddFamilyModal() {
  return (
    <Modal expectedPath="/families/new">
      <RegisterFamily />
    </Modal>
  );
}
