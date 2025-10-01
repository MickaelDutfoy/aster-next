import { getOrg } from "@/lib/getOrg";
import { getUser } from "@/lib/getUser";
import { Member, Organization } from "@/lib/types";

const Animals = async () => {
    const user: Member | null = await getUser();
    if (!user) return null;

    const org: Organization | null = await getOrg(user);
    if (!org) return null;

    const openAnimalForm = async () => {
        'use server'

    }

    return <>
        {org.animals.length === 0 && <p>Vous n'avez enregistré aucun animal pour l'association {org.name}.</p>}
        {org.animals.length > 0 && <ul>
            {org.animals.map(animal => <li key={animal.id}>{animal.name}</li>)}
        </ul>}
        <form action={openAnimalForm}>
            <button className="little-button">Ajouter un animal</button>
        </form>
    </>
}

export default Animals;