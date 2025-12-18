import { DeleteAnimal } from '@/components/animals/DeleteAnimal';
import { Modal } from '@/components/app/Modal';
import { DeniedPage } from '@/components/layout/DeniedPage';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { Animal } from '@/lib/types';

export default async function DeleteAnimalModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <DeniedPage cause="error" />;

  return (
    <Modal expectedPath={`/animals/${animal.id}/delete`}>
      <DeleteAnimal id={id} />
    </Modal>
  );
}
