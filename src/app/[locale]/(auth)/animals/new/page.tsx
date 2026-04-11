import { AnimalForm } from '@/components/animals/AnimalForm';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { FamilyWithoutDetails, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const RegisterAnimalPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  const families: FamilyWithoutDetails[] = await getFamiliesByOrg(org.id);

  return (
    <div className="full-page-form">
      <AnimalForm user={user} families={families} />
    </div>
  );
};

export default RegisterAnimalPage;
