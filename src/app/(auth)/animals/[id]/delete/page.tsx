import { DeleteAnimal } from '@/components/animals/DeleteAnimal';

const DeleteAnimalPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <DeleteAnimal id={id} />;
};

export default DeleteAnimalPage;
