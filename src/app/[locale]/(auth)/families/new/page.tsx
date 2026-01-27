import { RegisterFamily } from '@/components/families/RegisterFamily';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const RegisterFamilyPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userStatus === 'PENDING') return <DeniedPage cause="refused" />;

  return (
    <div className="full-page-form">
      <RegisterFamily user={user} />
    </div>
  );
};

export default RegisterFamilyPage;
