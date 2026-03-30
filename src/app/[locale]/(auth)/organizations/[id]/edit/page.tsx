import { DeniedPage } from '@/components/main/DeniedPage';
import { OrgForm } from '@/components/organizations/OrgForm';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const EditOrgPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.id !== Number(id)) return <DeniedPage cause="refused" />;

  return (
    <div className="full-page-form">
      <OrgForm org={org} />
    </div>
  );
};

export default EditOrgPage;
