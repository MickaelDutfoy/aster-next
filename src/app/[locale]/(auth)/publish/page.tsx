import { DeniedPage } from '@/components/main/DeniedPage';
import { PublicPageActions } from '@/components/publish/PublicPageActions';
import { PublicPageContentEditor } from '@/components/publish/PublicPageContentEditor';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

const Publish = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userRole !== MemberRole.SUPERADMIN && org.userRole !== MemberRole.ADMIN) {
    return <DeniedPage cause="publish" />;
  }

  return (
    <>
      <PublicPageActions />
      <PublicPageContentEditor />
    </>
  );
};

export default Publish;
