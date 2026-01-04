import { RegisterAnimal } from '@/components/animals/RegisterAnimal';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getFamiliesByOrgId } from '@/lib/families/getFamiliesByOrgId';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const RegisterAnimalPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  const families: Family[] = await getFamiliesByOrgId(org.id);

  return <RegisterAnimal user={user} families={families} />;
};

export default RegisterAnimalPage;
