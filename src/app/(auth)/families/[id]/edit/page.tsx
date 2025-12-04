import { UpdateFamily } from '@/components/families/UpdateFamily';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { Family } from '@/lib/types';

const UpdateFamilyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  return <UpdateFamily family={family} />;
};

export default UpdateFamilyPage;
