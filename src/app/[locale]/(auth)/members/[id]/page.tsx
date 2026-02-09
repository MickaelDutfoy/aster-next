import { DeniedPage } from '@/components/main/DeniedPage';
import { MemberDetails } from '@/components/members/MemberDetails';
import { getMemberById } from '@/lib/members/getMemberById';
import { getMutualOrgs } from '@/lib/members/getMutualOrgs';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import '@/styles/members.scss';

const MemberPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user: Member | null = await getUser();
  const member: Member | null = await getMemberById(Number(id));
  if (!user || !member) return <DeniedPage cause="error" />;

  const isUser = user.id === member.id;
  const orgsInCommon = !isUser ? await getMutualOrgs(user.id, member.id) : [];

  if (!isUser && orgsInCommon.length === 0) return <DeniedPage cause="refused" />;

  return <MemberDetails isUser={isUser} member={member} orgsInCommon={orgsInCommon} />;
};

export default MemberPage;
