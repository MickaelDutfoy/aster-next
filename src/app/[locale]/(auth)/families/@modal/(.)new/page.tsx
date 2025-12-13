import { DeniedPage } from '@/components/DeniedPage';
import { RegisterFamily } from '@/components/families/RegisterFamily';
import { Modal } from '@/components/Modal';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function AddFamilyModal() {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return (
    <Modal expectedPath="/families/new">
      <RegisterFamily user={user} />
    </Modal>
  );
}
