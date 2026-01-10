import { RegisterFamily } from '@/components/families/RegisterFamily';
import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { FamilyWithoutDetails, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function AddFamilyRouteModal() {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userStatus === 'PENDING') return <DeniedPage cause="refused" />;

  const orgFamilies: FamilyWithoutDetails[] = await getFamiliesByOrg(org.id);

  return (
    <RouteModal expectedPath="/families/new">
      <RegisterFamily user={user} orgFamilies={orgFamilies} />
    </RouteModal>
  );
}
