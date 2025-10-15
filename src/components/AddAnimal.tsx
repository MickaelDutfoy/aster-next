'use client'

import { postAnimal } from "@/actions/postAnimal"
import { useRouter } from 'next/navigation'

export const AddAnimal = () => {
    const router = useRouter();

    const handlePostAnimal = async (formdata: FormData) => {
        await postAnimal(formdata);
        router.push("/animals");
        router.refresh();
    }

    return <div className="post-animal-form">
        <h3>Ajouter un animal</h3>
        <form action={handlePostAnimal}>
            <p>(Les champs marqués d'un * sont requis.)</p>
            <div className="name-species-color">
                <input type="text" name="animalName" placeholder="Nom *" />
                <input type="text" name="animalSpecies" placeholder="Espèce *" />
                <input type="text" name="animalColor" placeholder="Couleur" />
            </div>
            <div className="sex">
                <p>Sexe * :</p>
                <select name="animalSex">
                    <option value="M">Mâle</option>
                    <option value="F">Femelle</option>
                </select>
                <p>Stérilisé(e) ?</p>
                <input type="checkbox" name="animalIsNeutered" />
            </div>
            <div className="birth-vax-deworm">
                <p>Né(e) le * :</p>
                <input type="date" name="animalBirthDate" />
            </div>
            <div className="birth-vax-deworm">
                <p>Vacciné(e) le :</p>
                <input type="date" name="animalLastVax" />
            </div>
            <label className="vax-deworm-info" htmlFor="animalPrimeVax">Primo-vaccination ?<input type="checkbox" name="animalPrimeVax" id="animalPrimeVax" /></label>
            <div className="birth-vax-deworm">
                <p>Déparasité(e) le :</p>
                <input type="date" name="animalLastDeworm" />
            </div>
            <label className="vax-deworm-info" htmlFor="animalFirstDeworm">Premier déparasitage ?<input type="checkbox" name="animalFirstDeworm" id="animalFirstDeworm" /></label>
            <p>Informations complémentaires :</p>
            <textarea
                name="animalInformation"
                onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = `${el.scrollHeight}px`;
                }}
            />
            <button className="little-button">Enregistrer</button>
        </form>
    </div>
}