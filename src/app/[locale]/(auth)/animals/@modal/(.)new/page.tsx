import { Modal } from '@/components/Modal';
import { RegisterAnimal } from '@/components/animals/RegisterAnimal';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function AddAnimalModal() {
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const families: Family[] = await getFamiliesByOrg(org.id);

  return (
    <Modal expectedPath="/animals/new">
      <RegisterAnimal families={families} />
    </Modal>
  );
}
