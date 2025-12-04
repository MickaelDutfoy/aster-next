import { DeleteFamily } from '@/components/families/DeleteFamily';

const DeleteFamilyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <DeleteFamily id={id} />;
};

export default DeleteFamilyPage;
