import { auth } from '@/auth';
import { DeniedPage } from '@/components/main/DeniedPage';
import { DeleteAccount } from '@/components/settings/DeleteAccount';
import { RouteModal } from '@/components/tools/RouteModal';

export default async function AddAnimalRouteModal() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return <DeniedPage cause="error" />;

  return (
    <RouteModal expectedPath="/settings/delete-account">
      <DeleteAccount />
    </RouteModal>
  );
}
