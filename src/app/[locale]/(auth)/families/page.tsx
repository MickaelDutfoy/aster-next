import { FamiliesList } from '@/components/families/FamiliesList';
import { FamiliesPageActions } from '@/components/families/FamiliesPageActions';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getFamiliesByOrgId } from '@/lib/families/getFamiliesByOrgId';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const FamiliesPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userStatus === 'PENDING') return <DeniedPage cause="refused" />;

  const families: Family[] = await getFamiliesByOrgId(org.id);

  return (
    <>
      <FamiliesPageActions />
      <FamiliesList org={org} families={families} />
    </>
  );
};

export default FamiliesPage;
