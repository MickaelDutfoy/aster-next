import { OrgList } from '@/components/organizations/OrgList';
import { OrgMembersList } from '@/components/organizations/OrgMembersList';
import { RegisterOrg } from '@/components/organizations/RegisterOrg';
import { SearchOrg } from '@/components/organizations/SearchOrg';
import { getMembersByOrg } from '@/lib/members/getMembersByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, MemberOfOrg, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import '@/styles/organizations.scss';

const Organizations = async () => {
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);

  const members: MemberOfOrg[] = await getMembersByOrg(org?.id);

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
        <OrgMembersList user={user} org={org} members={members} />
      </div>
    </div>
  );
};

export default Organizations;
