import { AnimalDetails } from '@/components/animals/AnimalDetails';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Animal, Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const AnimalDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <DeniedPage cause="error" />;

  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (animal.orgId !== user.selectedOrgId) {
    return <DeniedPage cause="refused" />;
  }

  const family: Family | null = await getFamilyById(animal.familyId);

  return <AnimalDetails user={user} org={org} animal={animal} family={family} />;
};

export default AnimalDetail;
