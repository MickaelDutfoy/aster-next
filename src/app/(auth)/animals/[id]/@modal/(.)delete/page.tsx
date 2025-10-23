import { Modal } from '@/components/Modal';
import { DeleteAnimal } from '@/components/animals/DeleteAnimal';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { Animal } from '@/lib/types';

export default async function RemoveAnimalModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  return (
    <Modal expectedPath={`/animals/${animal.id}/delete`}>
      <DeleteAnimal id={id} />
    </Modal>
  );
}
