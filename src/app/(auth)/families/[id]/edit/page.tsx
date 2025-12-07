import { UpdateFamily } from '@/components/families/UpdateFamily';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { Family, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const UpdateFamilyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  return <UpdateFamily user={user} family={family} />;
};

export default UpdateFamilyPage;
