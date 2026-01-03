import { DeniedPage } from '@/components/main/DeniedPage';
import { DeleteOrg } from '@/components/organizations/DeleteOrg';
import { Modal } from '@/components/tools/Modal';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const transferAdminPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.id !== Number(id)) return <DeniedPage cause="refused" />;

  return (
    <Modal expectedPath={`/organizations/${id}/delete`}>
      <DeleteOrg org={org} />
    </Modal>
  );
};

export default transferAdminPage;
