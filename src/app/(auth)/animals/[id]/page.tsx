import { displayDate } from '@/lib/displayDate';
import { getAge } from '@/lib/getAge';
import { getAnimalById } from '@/lib/getAnimalById';
import { getSelectedOrg } from '@/lib/getSelectedOrg';
import { getUser } from '@/lib/getUser';
import { Animal, Member, Organization } from '@/lib/types';
import Link from 'next/link';

const AnimalDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  if (user.organizations.every((org) => org.id !== animal.organizationId))
    return (
      <h3 className="denied-page">
        Vous n'avez pas les permissions pour accéder à cette ressource.
      </h3>
    );

  const animalOrg: Organization | undefined = user.organizations.find(
    (o) => o.id === animal.organizationId,
  );

  return (
    <>
      <div className="links-box">
        <Link href={`/animals/${id}/delete`} className="little-button">
          Supprimer l'animal
        </Link>
        <Link href={`/animals/${id}/edit`} className="little-button">
          Éditer l'animal
        </Link>
      </div>
      <div className="animal-details">
        <h3>
          {animal.name} - {animalOrg?.name}
        </h3>
        <p>
          {animal.species} {animal.sex === 'M' ? 'mâle' : 'femelle'} {animal.color?.toLowerCase()}{' '}
          de {getAge(animal.birthDate)}
          {animal.isNeutered ? `, stérilisé${animal.sex === 'M' ? '' : 'e'}.` : '.'}
        </p>
        {animal.lastVax && (
          <div className="animal-details-section">
            <h4>Dernier vaccin le :</h4>
            <p>
              {displayDate(animal.lastVax)}
              {animal.isPrimoVax ? ' (primo)' : ''}, il y a {getAge(animal.lastVax)}.
            </p>
          </div>
        )}
        {animal.lastDeworm && (
          <div className="animal-details-section">
            <h4>Dernier déparasitage le :</h4>
            <p>
              {displayDate(animal.lastDeworm)}
              {animal.isFirstDeworm ? ' (premier)' : ''}, il y a {getAge(animal.lastDeworm)}.
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
    </>
  );
};

export default AnimalDetail;
