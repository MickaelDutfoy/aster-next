import { DeniedPage } from '@/components/DeniedPage';
import { Modal } from '@/components/Modal';
import { UpdateAnimal } from '@/components/animals/UpdateAnimal';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Animal, Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function UpdateAnimalModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userStatus === 'PENDING') return <DeniedPage cause="refused" />;

  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <DeniedPage cause="error" />;

  const families: Family[] = await getFamiliesByOrg(org.id);

  return (
    <Modal expectedPath={`/animals/${animal.id}/edit`}>
      <UpdateAnimal user={user} animal={animal} families={families} />
    </Modal>
  );
}
