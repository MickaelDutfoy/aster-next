import { DeniedPage } from '@/components/main/DeniedPage';
import { OrgMembersList } from '@/components/organizations/OrgMembersList';
import { getMembersByOrg } from '@/lib/members/getMembersByOrg';
import { getOrgById } from '@/lib/organizations/getOrgById';
import { Member, MemberOfOrg, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const OrganizationPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getOrgById(Number(id));
  if (!org) return <DeniedPage cause="error" />;

  if (user.selectedOrgId !== Number(id)) {
    return <DeniedPage cause="refused" />;
  }

  const members: MemberOfOrg[] = await getMembersByOrg(org.id);

  return <OrgMembersList user={user} org={org} members={members} />;
};

export default OrganizationPage;
