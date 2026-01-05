import { UpdateFamily } from '@/components/families/UpdateFamily';
import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { Family, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function UpdateFamilyRouteModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <DeniedPage cause="error" />;

  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return (
    <RouteModal expectedPath={`/families/${family.id}/edit`}>
      <UpdateFamily user={user} family={family} />
    </RouteModal>
  );
}
