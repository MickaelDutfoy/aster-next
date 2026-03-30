import { DeniedPage } from '@/components/main/DeniedPage';
import { OrgForm } from '@/components/organizations/OrgForm';
import { RouteModal } from '@/components/tools/RouteModal';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const CreateOrgModal = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return (
    <RouteModal expectedPath="/organizations/new">
      <OrgForm />
    </RouteModal>
  );
};

export default CreateOrgModal;
