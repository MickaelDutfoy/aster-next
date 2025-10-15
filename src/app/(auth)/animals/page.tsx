import { getAge } from '@/lib/getAge';
import { getSelectedOrg } from '@/lib/getSelectedOrg';
import { getUser } from '@/lib/getUser';
import { Member, Organization } from '@/lib/types';
import Link from 'next/link';

const Animals = async () => {
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  if (org.status === 'pending')
    return (
      <h3 className="denied-page">
        Vous n'avez pas les permissions pour accéder à cette ressource.
      </h3>
    );

  return (
    <>
      <div className="links-box">
        <Link href={'/animals/new'} className="little-button">
          Ajouter un animal
        </Link>
      </div>
      {org.animals && (
        <div className="animal-list">
          <h3>Animaux enregistrés pour {org.name} :</h3>
          {org.animals.length === 0 && <p style={{ padding: '10px' }}>Aucun animal enregistré.</p>}
          {org.animals.length > 0 && (
            <ul>
              {org.animals
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                .map((animal) => (
                  <li key={animal.id}>
                    <Link className="link" href={`/animals/${animal.id}`}>
                      {animal.name} — {animal.species} {animal.sex} — {getAge(animal.birthDate)}
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Animals;
