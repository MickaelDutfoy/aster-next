'use client';

import { Animal } from '@/lib/types';

export const AnimalForm = ({
  animal,
  action,
  isLoading,
}: {
  animal?: Animal;
  action: (formdata: FormData) => void;
  isLoading: boolean;
}) => {
  return (
    <form action={action}>
      <p>(Les champs marqués d'un * sont requis.)</p>
      <div className="name-species-color">
        <input type="text" name="animalName" placeholder="Nom *" defaultValue={animal?.name} />
        <input
          type="text"
          name="animalSpecies"
          placeholder="Espèce *"
          defaultValue={animal?.species}
        />
        <input
          type="text"
          name="animalColor"
          placeholder="Couleur"
          defaultValue={animal?.color ?? ''}
        />
      </div>
      <div className="sex">
        <p>Sexe * :</p>
        <select name="animalSex" defaultValue={animal?.sex}>
          <option value="M">Mâle</option>
          <option value="F">Femelle</option>
        </select>
        <p>Stérilisé(e) ?</p>
        <input type="checkbox" name="animalIsNeutered" defaultChecked={animal?.isNeutered} />
      </div>
      <div className="birth-vax-deworm">
        <p>Né(e) le * :</p>
        <input
          type="date"
          name="animalBirthDate"
          defaultValue={animal?.birthDate.toISOString().slice(0, 10)}
        />
      </div>
      <div className="birth-vax-deworm">
        <p>Vacciné(e) le :</p>
        <input
          type="date"
          name="animalLastVax"
          defaultValue={animal?.lastVax?.toISOString().slice(0, 10)}
        />
      </div>
      <label className="vax-deworm-info" htmlFor="animalPrimeVax">
        Primo-vaccination ?
        <input
          type="checkbox"
          name="animalPrimeVax"
          id="animalPrimeVax"
          defaultChecked={animal?.isPrimoVax}
        />
      </label>
      <div className="birth-vax-deworm">
        <p>Déparasité(e) le :</p>
        <input
          type="date"
          name="animalLastDeworm"
          defaultValue={animal?.lastDeworm?.toISOString().slice(0, 10)}
        />
      </div>
      <label className="vax-deworm-info" htmlFor="animalFirstDeworm">
        Premier déparasitage ?
        <input
          type="checkbox"
          name="animalFirstDeworm"
          id="animalFirstDeworm"
          defaultChecked={animal?.isFirstDeworm}
        />
      </label>
      <p>Informations complémentaires :</p>
      <textarea
        name="animalInformation"
        defaultValue={animal?.information ?? ''}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = 'auto';
          el.style.height = `${el.scrollHeight}px`;
        }}
      />
      <button className="little-button" aria-busy={isLoading} disabled={isLoading}>
        {' '}
        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
};
