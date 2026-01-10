import { UpdateAnimal } from '@/components/animals/UpdateAnimal';
import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Animal, FamilyWithoutDetails, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberStatus } from '@prisma/client';

export default async function UpdateAnimalRouteModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userStatus === MemberStatus.PENDING) return <DeniedPage cause="refused" />;

  const animal: Animal | null = await getAnimalById(Number(id));
  if (!animal) return <DeniedPage cause="error" />;

  const families: FamilyWithoutDetails[] = await getFamiliesByOrg(org.id);

  return (
    <RouteModal expectedPath={`/animals/${animal.id}/edit`}>
      <UpdateAnimal user={user} animal={animal} families={families} />
    </RouteModal>
  );
}

