'use client'

import { deleteAnimal } from "@/actions/deleteAnimal";
import { useRouter } from "next/navigation";

export const RemoveAnimal = ({ id }: { id: string }) => {
    const router = useRouter();
    const animalId = Number(id);

    const handleDeleteAnimal = async (id: number) => {
        await deleteAnimal(id);
        router.push("/animals");
        router.refresh();
    }

    return <>
        <h3 style={{ paddingBottom: 10 }}>Supprimer l'animal</h3>
        <p>Êtes-vous sûr(e) ?</p>
        <div className="yes-no">
            <button className="little-button" onClick={() => handleDeleteAnimal(animalId)}>Confirmer</button>
            <button className="little-button" onClick={() => router.back()}>Annuler</button>
        </div>
    </>
}