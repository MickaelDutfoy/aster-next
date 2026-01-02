import { DeniedPage } from '@/components/main/DeniedPage';
import { DeleteAccount } from '@/components/settings/DeleteAccount';
import { Modal } from '@/components/tools/Modal';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function AddAnimalModal() {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return (
    <Modal expectedPath="/settings/delete-account">
      <DeleteAccount />
    </Modal>
  );
}
