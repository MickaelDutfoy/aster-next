import { Dashboard } from '@/components/Dashboard';
import { DeniedPage } from '@/components/DeniedPage';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getPendingOrgRequests } from '@/lib/organizations/getPendingOrgRequests';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, Organization, PendingOrgRequest } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const DashboardPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  let families: Family[] = [];
  if (org) families = await getFamiliesByOrg(org.id);

  const pending: PendingOrgRequest[] = await getPendingOrgRequests(org?.id);

  return <Dashboard user={user} org={org} families={families} pending={pending} />;
};

export default DashboardPage;
