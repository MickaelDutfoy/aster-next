'use client';

import { Animal, Organization } from '@/lib/types';
import { displayDate } from '@/lib/utils/displayDate';
import { getAge } from '@/lib/utils/getAge';
import { AnimalStatus } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

export const AnimalDetails = ({
  animal,
  animalOrg,
}: {
  animal: Animal;
  animalOrg: Organization | undefined;
}) => {
  const [hiddenHealth, setHiddenHealth] = useState<boolean>(
    animal.status === AnimalStatus.ADOPTED ? true : false,
  );
  const [hiddenAdoption, setHiddenAdoption] = useState<boolean>(
    animal.status === AnimalStatus.ADOPTED ? false : true,
  );

  const statusMap = {
    UNHOSTED: 'En attente',
    FOSTERED: "En famille d'accueil",
    ADOPTED: `Adopté${animal.sex === 'M' ? '' : 'e'}`,
  };

  const hasHealthInfo = !!animal.lastVax || !!animal.lastDeworm || !!animal.information;

  return (
    <>
      <div className="links-box">
        <Link href={`/animals/${animal.id}/delete`} className="little-button">
          Supprimer l'animal
        </Link>
        <Link href={`/animals/${animal.id}/edit`} className="little-button">
          Éditer l'animal
        </Link>
      </div>
      <div className="animal-page">
        <h3>
          {animal.name} - {animalOrg?.name}
        </h3>
        <p className="fixed-p">
          {animal.species} {animal.sex === 'M' ? 'mâle' : 'femelle'} {animal.color?.toLowerCase()}{' '}
          de {getAge(animal.birthDate, true)}
          {animal.isNeutered ? `, stérilisé${animal.sex === 'M' ? '' : 'e'}.` : '.'}
        </p>
        <h4 className="collapse-expand" onClick={() => setHiddenHealth(!hiddenHealth)}>
          Afficher les informations de santé {hiddenHealth ? '▸' : '▾'}
        </h4>
        {!hiddenHealth && hasHealthInfo && (
          <div className="animal-details">
            {animal.lastVax && (
              <div className="animal-details-section">
                <h4>Dernier vaccin le :</h4>
                <p>
                  {displayDate(animal.lastVax)}
                  {animal.isPrimoVax ? ' (primo)' : ''}, il y a {getAge(animal.lastVax, true)}.
                </p>
              </div>
            )}
            {animal.lastDeworm && (
              <div className="animal-details-section">
                <h4>Dernier déparasitage le :</h4>
                <p>
                  {displayDate(animal.lastDeworm)}
                  {animal.isFirstDeworm ? ' (premier)' : ''}, il y a{' '}
                  {getAge(animal.lastDeworm, true)}.
                </p>
              </div>
            )}
            {animal.information && (
              <div className="animal-details-section">
                <h4>Informations complémentaires :</h4>
                <p>{animal.information}</p>
              </div>
            )}
          </div>
        )}
        <p className="fixed-p">Situation actuelle : {statusMap[animal.status]}.</p>
        <h4 className="collapse-expand" onClick={() => setHiddenAdoption(!hiddenAdoption)}>
          Afficher les informations d'adoption {hiddenAdoption ? '▸' : '▾'}
        </h4>
        {!hiddenAdoption && (
          <div className="animal-details">
            {animal.adoption?.adopterFullName && (
              <div className="animal-details-section">
                <h4>Adoptant :</h4>
                <p>{animal.adoption.adopterFullName}</p>
                <p>{animal.adoption.adopterAddress}</p>
                <p>
                  {animal.adoption.adopterZip} {animal.adoption.adopterCity}
                </p>
                <p>{animal.adoption.adopterEmail}</p>
                <p>{animal.adoption.adopterPhoneNumber}</p>
              </div>
            )}
            <div className="animal-details-section">
              <h4>À propos de l'adoption :</h4>
              {animal.adoption?.homeVisitDone && <p>Une visite à domicile a été faite.</p>}
              {animal.adoption?.knowledgeCertSignedAt && (
                <p>
                  Contrat d'engagement et de connaissance signé le :{' '}
                  {displayDate(animal.adoption.knowledgeCertSignedAt)}
                </p>
              )}
              {animal.adoption?.neuteringPlannedAt && (
                <p>Stérilisation prévue le : {displayDate(animal.adoption.neuteringPlannedAt)}</p>
              )}
              {animal.adoption?.adoptionContractSignedAt && (
                <p>
                  Contrat d'adoption signé le :{' '}
                  {displayDate(animal.adoption.adoptionContractSignedAt)}
                </p>
              )}
              {animal.adoption?.adoptionFeePaid ? (
                <p>Les frais d'adoption ont été payés.</p>
              ) : (
                <p>Les frais d'adoption n'ont pas été payés.</p>
              )}
              {animal.adoption?.legalTransferAt && (
                <p>Cession légale effectuée le : {displayDate(animal.adoption.legalTransferAt)}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
