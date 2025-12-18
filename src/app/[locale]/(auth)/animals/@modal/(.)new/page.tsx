import { RegisterAnimal } from '@/components/animals/RegisterAnimal';
import { Modal } from '@/components/app/Modal';
import { DeniedPage } from '@/components/layout/DeniedPage';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function AddAnimalModal() {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  const families: Family[] = await getFamiliesByOrg(org.id);

  return (
    <Modal expectedPath="/animals/new">
      <RegisterAnimal user={user} families={families} />
    </Modal>
  );
}
