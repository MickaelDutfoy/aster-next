import { Modal } from '@/components/app/Modal';
import { DeleteFamily } from '@/components/families/DeleteFamily';
import { DeniedPage } from '@/components/layout/DeniedPage';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { Family } from '@/lib/types';

export default async function DeleteFamilyModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <DeniedPage cause="error" />;

  return (
    <Modal expectedPath={`/families/${family.id}/delete`}>
      <DeleteFamily id={id} />
    </Modal>
  );
}
