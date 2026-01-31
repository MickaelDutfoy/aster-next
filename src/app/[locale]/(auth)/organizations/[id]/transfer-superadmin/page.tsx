import { DeniedPage } from '@/components/main/DeniedPage';
import { TransferSuperAdmin } from '@/components/organizations/TransferSuperAdmin';
import { getMembersByOrg } from '@/lib/members/getMembersByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, MemberOfOrg, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const transferAdminPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.id !== Number(id)) return <DeniedPage cause="refused" />;

  const members: MemberOfOrg[] = await getMembersByOrg(org?.id);

  return (
    <div className="full-page-form">
      <TransferSuperAdmin user={user} org={org} members={members} />
    </div>
  );
};

export default transferAdminPage;
