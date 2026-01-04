import { UpdateFamily } from '@/components/families/UpdateFamily';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { Family, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const UpdateFamilyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <DeniedPage cause="error" />;

  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return <UpdateFamily user={user} family={family} />;
};

export default UpdateFamilyPage;
