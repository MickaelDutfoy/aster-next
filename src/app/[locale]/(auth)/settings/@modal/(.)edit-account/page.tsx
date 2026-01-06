import { DeniedPage } from '@/components/main/DeniedPage';
import { EditAccount } from '@/components/settings/EditAccount';
import { RouteModal } from '@/components/tools/RouteModal';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function AddAnimalRouteModal() {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return (
    <RouteModal expectedPath="/settings/edit-account">
      <EditAccount user={user} />
    </RouteModal>
  );
}
