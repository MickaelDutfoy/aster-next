import { Dashboard } from '@/components/Dashboard';
import { DeniedPage } from '@/components/DeniedPage';
import { getPendingOrgRequests } from '@/lib/organizations/getPendingOrgRequests';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization, PendingOrgRequest } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const DashboardPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);

  const pending: PendingOrgRequest[] = await getPendingOrgRequests(org?.id);

  return <Dashboard user={user} org={org} pending={pending} />;
};

export default DashboardPage;
