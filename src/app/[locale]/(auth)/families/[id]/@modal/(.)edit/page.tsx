import { UpdateFamily } from '@/components/families/UpdateFamily';
import { Modal } from '@/components/Modal';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { Family, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function UpdateFamilyModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  return (
    <Modal expectedPath={`/families/${family.id}/edit`}>
      <UpdateFamily user={user} family={family} />
    </Modal>
  );
}
