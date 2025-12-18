import { Modal } from '@/components/app/Modal';
import { UpdateFamily } from '@/components/families/UpdateFamily';
import { DeniedPage } from '@/components/layout/DeniedPage';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { Family, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function UpdateFamilyModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <DeniedPage cause="error" />;

  return (
    <Modal expectedPath={`/families/${family.id}/edit`}>
      <UpdateFamily user={user} family={family} />
    </Modal>
  );
}
