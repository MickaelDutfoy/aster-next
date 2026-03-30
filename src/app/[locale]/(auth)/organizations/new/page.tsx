import { DeniedPage } from '@/components/main/DeniedPage';
import { OrgForm } from '@/components/organizations/OrgForm';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const CreateOrgPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return (
    <div className="full-page-form">
      <OrgForm />
    </div>
  );
};

export default CreateOrgPage;
