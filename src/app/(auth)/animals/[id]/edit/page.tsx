import { UpdateAnimal } from '@/components/animals/UpdateAnimal';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Animal, Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const UpdateAnimalPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  if (org.userStatus === 'PENDING') {
    return (
      <h3 className="denied-page">
        Vous n'avez pas les autorisations pour accéder à cette ressource.
      </h3>
    );
  }

  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const families: Family[] = await getFamiliesByOrg(org.id);

  return <UpdateAnimal animal={animal} families={families} />;
};

export default UpdateAnimalPage;
