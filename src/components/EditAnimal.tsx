'use client'

import { updateAnimal } from "@/actions/updateAnimal";
import { useRouter } from "next/navigation";

export const EditAnimal = ({ id }: { id: string }) => {
    const router = useRouter();

    const handleEditAnimal = async (formdata: FormData) => {
        const animalId = Number(id);

        await updateAnimal(animalId, formdata);
        router.push(`/animals/${animalId}`);
        router.refresh();
    }

    return <>
        <h3>Éditer les informations</h3>
    </>
}