import { Dashboard } from '@/components/main/Dashboard';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getPendingOrgRequests } from '@/lib/organizations/getPendingOrgRequests';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { FamilyWithoutDetails, Member, Organization, PendingOrgRequest } from '@/lib/types';
import { getUserWithOrgs } from '@/lib/user/getUserWithOrgs';

const DashboardPage = async () => {
  const user: Member | null = await getUserWithOrgs();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);

  let families: FamilyWithoutDetails[] = [];
  if (org) families = await getFamiliesByOrg(org.id);

  const pending: PendingOrgRequest[] = await getPendingOrgRequests(org?.id);

  return <Dashboard user={user} org={org} families={families} pending={pending} />;
};

export default DashboardPage;
