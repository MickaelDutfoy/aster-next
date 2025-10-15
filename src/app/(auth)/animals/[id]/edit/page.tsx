import { EditAnimal } from "@/components/EditAnimal";

const EditAnimalPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return <EditAnimal id={id} />
}

export default EditAnimalPage;