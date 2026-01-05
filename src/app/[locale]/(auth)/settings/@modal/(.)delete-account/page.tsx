import { DeniedPage } from '@/components/main/DeniedPage';
import { DeleteAccount } from '@/components/settings/DeleteAccount';
import { RouteModal } from '@/components/tools/RouteModal';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function AddAnimalRouteModal() {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return (
    <RouteModal expectedPath="/settings/delete-account">
      <DeleteAccount />
    </RouteModal>
  );
}
