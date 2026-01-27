import { ManageFamilyMembers } from '@/components/families/ManageFamilyMembers';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { getMembersByOrg } from '@/lib/members/getMembersByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, MemberOfOrg, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const UpdateFamilyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <DeniedPage cause="error" />;

  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  const orgMembers: MemberOfOrg[] = await getMembersByOrg(org?.id);

  return (
    <div className="full-page-form">
      <ManageFamilyMembers orgMembers={orgMembers} family={family} />
    </div>
  );
};

export default UpdateFamilyPage;
