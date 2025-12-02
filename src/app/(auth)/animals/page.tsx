import { AnimalsList } from '@/components/animals/AnimalList';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const AnimalsPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  if (org.userStatus === 'PENDING')
    return (
      <h3 className="denied-page">
        Vous ne pouvez pas voir les animaux de cette association car votre adhésion n'a pas encore
        été approuvée.
      </h3>
    );

  return <AnimalsList org={org} />;
};

export default AnimalsPage;
