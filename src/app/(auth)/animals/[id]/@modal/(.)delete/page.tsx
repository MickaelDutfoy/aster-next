import { RemoveAnimal } from "@/components/RemoveAnimal";
import { Modal } from "@/components/Modal";

export default async function RemoveAnimalModal({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <Modal>
            <RemoveAnimal id={id} />
        </Modal>
    );
}