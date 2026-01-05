import { DeleteFamily } from '@/components/families/DeleteFamily';
import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function DeleteFamilyRouteModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <DeniedPage cause="error" />;

  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  return (
    <RouteModal expectedPath={`/families/${family.id}/delete`}>
      <DeleteFamily user={user} org={org} family={family} />
    </RouteModal>
  );
}
