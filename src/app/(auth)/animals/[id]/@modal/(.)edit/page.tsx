import { Modal } from '@/components/Modal';
import { UpdateAnimal } from '@/components/animals/UpdateAnimal';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { Animal } from '@/lib/types';

export default async function UpdateAnimalModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  return (
    <Modal expectedPath={`/animals/${animal.id}/edit`}>
      <UpdateAnimal animal={animal} />
    </Modal>
  );
}
