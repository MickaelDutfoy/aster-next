import { EditAnimal } from "@/components/EditAnimal";
import { Modal } from "@/components/Modal";

export default async function EditAnimalModal({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <Modal>
            <EditAnimal id={id} />
        </Modal>
    );
}