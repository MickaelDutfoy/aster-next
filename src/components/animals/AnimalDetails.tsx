'use client';

import { Link } from '@/i18n/routing';
import { Animal, Family } from '@/lib/types';
import { displayDate } from '@/lib/utils/displayDate';
import { getAge } from '@/lib/utils/getAge';
import { AnimalStatus } from '@prisma/client';
import { useState } from 'react';

export const AnimalDetails = ({ animal, family }: { animal: Animal; family: Family | null }) => {
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
      <div>
        <h3>{animal.name}</h3>
        <p className="fixed-p">
          {animal.species} {animal.sex === 'M' ? 'mâle' : 'femelle'} {animal.color?.toLowerCase()}{' '}
          de {getAge(animal.birthDate, true)}
          {animal.isNeutered ? `, stérilisé${animal.sex === 'M' ? '' : 'e'}.` : '.'}
        </p>
        {animal.findLocation && (
          <p className="fixed-p">Lieu de découverte : {animal.findLocation}.</p>
        )}
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
                {animal.vaxHistory.length > 0 && (
                  <div className="health-historic">
                    <p>Historique des vaccins :</p>
                    <ul>
                      {animal.vaxHistory.map((date) => (
                        <li key={Number(date)}>
                          {displayDate(date)}, il y a {getAge(date, true)}.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                {animal.dewormHistory.length > 0 && (
                  <div className="health-historic">
                    <p>Historique des déparasitages :</p>
                    <ul style={{ paddingLeft: 40 }}>
                      {animal.dewormHistory.map((date) => (
                        <li key={Number(date)}>
                          {displayDate(date)}, il y a {getAge(date, true)}.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
        {family && (
          <p className="fixed-p">
            Famille d'accueil :{' '}
            <Link className="link" href={`/families/${family.id}`}>
              {family.contactFullName}
            </Link>
          </p>
        )}
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
