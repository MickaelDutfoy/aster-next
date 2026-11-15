import { FamilyForm } from '@/components/families/FamilyForm';
import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { isRelatedToFamily } from '@/lib/permissions/isRelatedToFamily';
import { Family, Member, Organization } from '@/lib/types';
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

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (family.orgId !== org.id) return <DeniedPage cause="refused" />;

  const guard = await isRelatedToFamily(family.id);
  if (!guard.validation.ok) return <DeniedPage cause="refused" />;

  return (
    <RouteModal expectedPath={`/families/${family.id}/edit`}>
      <FamilyForm user={user} family={family} />
    </RouteModal>
  );
}
