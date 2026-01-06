import { DeniedPage } from '@/components/main/DeniedPage';
import { OrgPicker } from '@/components/organizations/OrgPicker';
import { RegisterOrg } from '@/components/organizations/RegisterOrg';
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
      <div>
        <RegisterOrg />
      </div>
      <div>
        <SearchOrg />
      </div>
      {org && <OrgPicker org={org} />}
    </div>
  );
};

export default Organizations;
