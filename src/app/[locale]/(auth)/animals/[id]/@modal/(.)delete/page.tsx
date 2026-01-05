import { DeleteAnimal } from '@/components/animals/DeleteAnimal';
import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Animal, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

export default async function DeleteAnimalRouteModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userStatus === 'PENDING') return <DeniedPage cause="refused" />;

  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <DeniedPage cause="error" />;

  return (
    <RouteModal expectedPath={`/animals/${animal.id}/delete`}>
      <DeleteAnimal id={id} />
    </RouteModal>
  );
}
