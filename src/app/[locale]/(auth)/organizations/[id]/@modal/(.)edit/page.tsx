import { DeniedPage } from '@/components/main/DeniedPage';
import { OrgForm } from '@/components/organizations/OrgForm';
import { RouteModal } from '@/components/tools/RouteModal';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const EditOrgModal = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.id !== Number(id)) return <DeniedPage cause="refused" />;

  return (
    <RouteModal expectedPath={`/organizations/${id}/edit`}>
      <OrgForm org={org} />
    </RouteModal>
  );
};

export default EditOrgModal;
