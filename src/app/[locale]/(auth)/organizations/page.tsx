import { DeniedPage } from '@/components/main/DeniedPage';
import { CreateOrg } from '@/components/organizations/CreateOrg';
import { OrgPicker } from '@/components/organizations/OrgPicker';
import { SearchOrg } from '@/components/organizations/SearchOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const Organizations = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);

  return (
    <div className="org-page">
      {org && <OrgPicker org={org} />}
      <CreateOrg />
      <SearchOrg />
    </div>
  );
};

export default Organizations;
