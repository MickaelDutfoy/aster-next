import { OrgList } from '@/components/organizations/OrgList';
import { OrgMembersList } from '@/components/organizations/OrgMembersList';
import { RegisterOrg } from '@/components/organizations/RegisterOrg';
import { SearchOrg } from '@/components/organizations/SearchOrg';
import '@/styles/organizations.scss';

const Organizations = async () => {
  return (
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
      <div>
        <OrgMembersList />
      </div>
    </div>
  );
};

export default Organizations;
