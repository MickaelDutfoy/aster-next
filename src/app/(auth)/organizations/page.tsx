import { OrgList } from '@/components/organizations/OrgList';
import { RegisterOrg } from '@/components/organizations/RegisterOrg';
import { SearchOrg } from '@/components/organizations/SearchOrg';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import '@/styles/organizations.scss';

const Organizations = async () => {
  const user: Member | null = await getUser();
  if (!user) return;

  return (
    // repenser la mise en forme ici
    <div className="org-page">
      <div className="org-wrapper">
        <RegisterOrg />
      </div>
      <div className="org-wrapper">
        <SearchOrg />
      </div>
      <div className="pending-list">
        <OrgList />
      </div>
    </div>
  );
};

export default Organizations;
