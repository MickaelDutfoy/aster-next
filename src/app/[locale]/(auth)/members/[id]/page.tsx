import { DeniedPage } from '@/components/main/DeniedPage';
import { MemberDetails } from '@/components/members/MemberDetails';
import { getMemberById } from '@/lib/members/getMemberById';
import { getMutualOrgs } from '@/lib/members/getMutualOrgs';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, MemberWithoutDetails, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import '@/styles/members.scss';
import { MemberRole } from '@prisma/client';

const MemberPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user: Member | null = await getUser();

  const member: MemberWithoutDetails | null = await getMemberById(Number(id));
  if (!user || !member) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  const isUser = user.id === member.id;
  const orgsInCommon = !isUser ? await getMutualOrgs(user.id, member.id) : [];

  if (!isUser && orgsInCommon.length === 0) return <DeniedPage cause="refused" />;

  const canSeeDetails =
    isUser || org.userRole === MemberRole.SUPERADMIN || org.userRole === MemberRole.ADMIN;

  const memberInfo: MemberWithoutDetails = canSeeDetails
    ? member
    : { id: member.id, firstName: member.firstName, lastName: member.lastName };

  return <MemberDetails isUser={isUser} memberInfo={memberInfo} orgsInCommon={orgsInCommon} />;
};

export default MemberPage;
