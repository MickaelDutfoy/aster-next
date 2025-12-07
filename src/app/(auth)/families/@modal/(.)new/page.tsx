import { RegisterFamily } from '@/components/families/RegisterFamily';
import { Modal } from '@/components/Modal';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function AddFamilyModal() {
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  return (
    <Modal expectedPath="/families/new">
      <RegisterFamily user={user} />
    </Modal>
  );
}
