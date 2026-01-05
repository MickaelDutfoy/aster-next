import { DeniedPage } from '@/components/main/DeniedPage';
import { TransferAdmin } from '@/components/organizations/TransferAdmin';
import { RouteModal } from '@/components/tools/RouteModal';
import { getMembersByOrg } from '@/lib/members/getMembersByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, MemberOfOrg, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const transferAdminRouteModal = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.id !== Number(id)) return <DeniedPage cause="refused" />;

  const members: MemberOfOrg[] = await getMembersByOrg(org?.id);

  return (
    <RouteModal expectedPath={`/organizations/${id}/transfer-admin`}>
      <TransferAdmin user={user} org={org} members={members} />
    </RouteModal>
  );
};

export default transferAdminRouteModal;
