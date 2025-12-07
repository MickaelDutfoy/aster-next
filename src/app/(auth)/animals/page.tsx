import { AnimalsList } from '@/components/animals/AnimalList';
import { getAnimalsByOrg } from '@/lib/animals/getAnimalsByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Animal, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import Link from 'next/link';

const AnimalsPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  if (org.userStatus === 'PENDING') {
    return (
      <h3 className="denied-page">
        Vous ne pouvez pas voir les animaux de cette association car votre adhésion n'a pas encore
        été approuvée.
      </h3>
    );
  }

  const animals: Animal[] = await getAnimalsByOrg(org.id);

  return (
    <>
      <div className="links-box">
        <Link href={'/animals/new'} className="little-button">
          Ajouter un animal
        </Link>
      </div>
      <AnimalsList org={org} animals={animals} />
    </>
  );
};

export default AnimalsPage;
