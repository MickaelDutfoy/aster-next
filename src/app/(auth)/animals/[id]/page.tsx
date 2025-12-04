import { AnimalDetails } from '@/components/animals/AnimalDetails';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Animal, Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const AnimalDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  if (user.organizations.every((org) => org.id !== animal.orgId)) {
    return (
      <h3 className="denied-page">
        Vous n'avez pas les permissions pour accéder à cette ressource.
      </h3>
    );
  }

  const family: Family | null = await getFamilyById(animal.familyId);

  return <AnimalDetails animal={animal} family={family} />;
};

export default AnimalDetail;
