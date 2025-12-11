'use client';

import { registerAnimal } from '@/actions/animals/registerAnimal';
import { updateAnimal } from '@/actions/animals/updateAnimal';
import { useRouter } from '@/i18n/routing';
import { Animal, Family } from '@/lib/types';
import { AnimalStatus, Sex } from '@prisma/client';
import { clsx } from 'clsx';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const AnimalForm = ({ animal, families }: { animal?: Animal; families: Family[] }) => {
  const router = useRouter();

  const [form, setForm] = useState<'health' | 'adopt'>('health');
  const [status, setStatus] = useState<string>(animal?.status ?? AnimalStatus.UNHOSTED);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('animalName')?.toString().trim();
    const species = formData.get('animalSpecies')?.toString().trim();
    const birthDate = formData.get('animalBirthDate')?.toString().trim();
    const statusFromForm = formData.get('animalStatus')?.toString();
    const adopterFullName = formData.get('adopterFullName')?.toString().trim();

    if (!name || !species || !birthDate || (statusFromForm === 'ADOPTED' && !adopterFullName)) {
      showToast({
        ok: false,
        status: 'error',
        message: 'Des champs obligatoires sont incomplets.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = animal ? await updateAnimal(animal.id, formData) : await registerAnimal(formData);

      showToast(res);

      if (res.ok) {
        router.replace(animal ? `/animals/${animal.id}` : '/animals');
      }
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: 'Une erreur est survenue.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="tabs">
        <div className={clsx(form === 'health' ? 'active' : '')} onClick={() => setForm('health')}>
          Santé
        </div>
        <div className={clsx(form === 'adopt' ? 'active' : '')} onClick={() => setForm('adopt')}>
          Adoption
        </div>
      </div>
      <p className="notice">(Les champs marqués d'un * sont requis.)</p>
      <form onSubmit={handleSubmit} style={{ minHeight: '50vh', width: '85vw' }}>
        <div hidden={form !== 'health'}>
          <div className="form-tab">
            <div className="name-species-color">
              <input
                type="text"
                name="animalName"
                placeholder="Nom *"
                defaultValue={animal?.name}
              />
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
            <div className="labeled-checkbox">
              <p>Sexe * :</p>
              <select name="animalSex" defaultValue={animal?.sex}>
                <option value={Sex.M}>Mâle</option>
                <option value={Sex.F}>Femelle</option>
              </select>
              <p>Stérilisé(e) ?</p>
              <input type="checkbox" name="animalIsNeutered" defaultChecked={animal?.isNeutered} />
            </div>

            <input
              type="text"
              name="findLocation"
              placeholder="Lieu de découverte"
              defaultValue={animal?.findLocation ?? ''}
            />
            <div className="labeled-date">
              <p>Né(e) le * :</p>
              <input
                type="date"
                name="animalBirthDate"
                defaultValue={animal?.birthDate.toISOString().slice(0, 10)}
              />
            </div>
            <div className="labeled-date">
              <p>Dernier vaccin le :</p>
              <input
                type="date"
                name="animalLastVax"
                defaultValue={animal?.lastVax?.toISOString().slice(0, 10)}
              />
            </div>
            <label className="labeled-checkbox" htmlFor="animalPrimeVax">
              Primo-vaccination ?
              <input
                type="checkbox"
                name="animalPrimeVax"
                id="animalPrimeVax"
                defaultChecked={animal?.isPrimoVax}
              />
            </label>
            <div className="labeled-date">
              <p>Dernier déparasitage le :</p>
              <input
                type="date"
                name="animalLastDeworm"
                defaultValue={animal?.lastDeworm?.toISOString().slice(0, 10)}
              />
            </div>
            <label className="labeled-checkbox" htmlFor="animalFirstDeworm">
              Premier déparasitage ?
              <input
                type="checkbox"
                name="animalFirstDeworm"
                id="animalFirstDeworm"
                defaultChecked={animal?.isFirstDeworm}
              />
            </label>
            <p>Informations complémentaires :</p>
            <textarea
              name="animalInformation"
              defaultValue={animal?.information ?? ''}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
            <button
              type="submit"
              className="little-button"
              aria-busy={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
        <div hidden={form !== 'adopt'}>
          <div className="form-tab">
            <div className="labeled-select">
              <p>Statut de l'animal * :</p>
              <select
                name="animalStatus"
                defaultValue={animal?.status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value={AnimalStatus.UNHOSTED}>En attente</option>
                <option value={AnimalStatus.FOSTERED}>En famille d'accueil</option>
                <option value={AnimalStatus.ADOPTED}>Adopté</option>
              </select>
            </div>
            <div className={`labeled-select ` + clsx(status === 'FOSTERED' ? '' : 'disabled')}>
              <p>Famille{status === 'FOSTERED' ? ' *' : ''} :</p>
              <select name="animalFamily" defaultValue={animal?.familyId ?? ''}>
                {families?.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.contactFullName}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="adopterFullName"
              placeholder={"Nom et prénom de l'adoptant" + (status === 'ADOPTED' ? ' *' : '')}
              defaultValue={animal?.adoption?.adopterFullName}
            />
            <div className="adopter-address-info">
              <input
                type="text"
                name="adopterAddress"
                placeholder="N° et rue"
                defaultValue={animal?.adoption?.adopterAddress as string}
              />
              <div className="adopter-city">
                <input
                  type="text"
                  name="adopterZip"
                  placeholder="Code postal"
                  defaultValue={animal?.adoption?.adopterZip as string}
                />
                <input
                  type="text"
                  name="adopterCity"
                  placeholder="Ville"
                  defaultValue={animal?.adoption?.adopterCity as string}
                />
              </div>
              <div className="adopter-contact">
                <input
                  type="text"
                  name="adopterEmail"
                  placeholder="E-mail"
                  defaultValue={animal?.adoption?.adopterEmail as string}
                />
                <input
                  type="text"
                  name="adopterPhoneNumber"
                  placeholder="Téléphone"
                  defaultValue={animal?.adoption?.adopterPhoneNumber as string}
                />
              </div>
            </div>

            <label className="labeled-checkbox" htmlFor="homeVisitDone">
              Visite à domicile faite ?
              <input
                type="checkbox"
                name="homeVisitDone"
                id="homeVisitDone"
                defaultChecked={animal?.adoption?.homeVisitDone}
              />
            </label>
            <div className="labeled-date">
              <p>Certif. engagement signé le :</p>
              <input
                type="date"
                name="knowledgeCertSignedAt"
                defaultValue={animal?.adoption?.knowledgeCertSignedAt?.toISOString().slice(0, 10)}
              />
            </div>
            <div className="labeled-date">
              <p>Stérilisation prévue le :</p>
              <input
                type="date"
                name="neuteringPlannedAt"
                defaultValue={animal?.adoption?.neuteringPlannedAt?.toISOString().slice(0, 10)}
              />
            </div>
            <div className="labeled-date">
              <p>Contrat d'adoption signé le :</p>
              <input
                type="date"
                name="adoptionContractSignedAt"
                defaultValue={animal?.adoption?.adoptionContractSignedAt
                  ?.toISOString()
                  .slice(0, 10)}
              />
            </div>
            <label className="labeled-checkbox" htmlFor="adoptionFeePaid">
              Frais d'adoption payés ?
              <input
                type="checkbox"
                name="adoptionFeePaid"
                id="adoptionFeePaid"
                defaultChecked={animal?.adoption?.adoptionFeePaid}
              />
            </label>
            <div className="labeled-date">
              <p>Cession légale faite le :</p>
              <input
                type="date"
                name="legalTransferAt"
                defaultValue={animal?.adoption?.legalTransferAt?.toISOString().slice(0, 10)}
              />
            </div>

            <button
              type="submit"
              className="little-button"
              aria-busy={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
