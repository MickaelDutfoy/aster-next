import { DeleteFamily } from '@/components/families/DeleteFamily';
import { Modal } from '@/components/Modal';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { Family } from '@/lib/types';

export default async function DeleteFamilyModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  return (
    <Modal expectedPath={`/families/${family.id}/delete`}>
      <DeleteFamily id={id} />
    </Modal>
  );
}
