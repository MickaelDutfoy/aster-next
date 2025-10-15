import { RemoveAnimal } from "@/components/RemoveAnimal";

const RemoveAnimalPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return <RemoveAnimal id={id} />
}

export default RemoveAnimalPage;