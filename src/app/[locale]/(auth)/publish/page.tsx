import { DeniedPage } from '@/components/main/DeniedPage';
import { PublicPageActions } from '@/components/publish/PublicPageActions';
import { PublicPageContentEditor } from '@/components/publish/PublicPageContentEditor';
import { getAnimalsInCare } from '@/lib/animals/getAnimalsInCare';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { getPublicPageByOrgId } from '@/lib/publish/getPublicPageByOrgId';
import { AnimalWithoutDetails, Member, Organization, OrganizationPublicPage } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

const Publish = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userStatus === 'PENDING') return <DeniedPage cause="refused" />;

  const publicPage: OrganizationPublicPage | null = await getPublicPageByOrgId(org.id);
  const animalsInCare: AnimalWithoutDetails[] = await getAnimalsInCare(user, org);

  return (
    <>
      <PublicPageActions
        canManagePage={org.userRole === MemberRole.SUPERADMIN || org.userRole === MemberRole.ADMIN}
      />
      <PublicPageContentEditor
        canManagePage={org.userRole === MemberRole.SUPERADMIN || org.userRole === MemberRole.ADMIN}
        publicPage={publicPage}
        animals={animalsInCare}
      />
    </>
  );
};

export default Publish;
