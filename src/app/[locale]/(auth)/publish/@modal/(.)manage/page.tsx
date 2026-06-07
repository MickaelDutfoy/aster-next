import { DeniedPage } from '@/components/main/DeniedPage';
import { ManagePublicPage } from '@/components/publish/ManagePublicPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { getAllPagesSlugs } from '@/lib/publish/getAllPagesSlugs';
import { getOrganizationPageDetails } from '@/lib/publish/getOrganizationPageDetails';
import { Member, Organization, OrganizationPublicPage } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

export default async function ManagePublicPageModal() {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userRole !== MemberRole.SUPERADMIN && org.userRole !== MemberRole.ADMIN) {
    return <DeniedPage cause="publish" />;
  }

  const orgPageDetails: OrganizationPublicPage | null = await getOrganizationPageDetails(org.id);
  const slugs = await getAllPagesSlugs();

  return (
    <RouteModal expectedPath="/publish/manage">
      <ManagePublicPage orgName={org.name} orgPageDetails={orgPageDetails} slugs={slugs} />
    </RouteModal>
  );
}
