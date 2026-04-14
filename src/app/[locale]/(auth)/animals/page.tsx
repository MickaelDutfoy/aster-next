import { AnimalsList } from '@/components/animals/AnimalList';
import { AnimalsPageActions } from '@/components/animals/AnimalsPageActions';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getAnimalsByOrg } from '@/lib/animals/getAnimalsByOrg';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { AnimalWithoutDetails, FamilyWithoutDetails, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const AnimalsPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userStatus === 'PENDING') return <DeniedPage cause="refused" />;

  const animals: AnimalWithoutDetails[] = await getAnimalsByOrg(org.id);

  const families: FamilyWithoutDetails[] = await getFamiliesByOrg(org.id);

  return (
    <>
      <AnimalsPageActions />
      <AnimalsList org={org} animals={animals} families={families} />
    </>
  );
};

export default AnimalsPage;
