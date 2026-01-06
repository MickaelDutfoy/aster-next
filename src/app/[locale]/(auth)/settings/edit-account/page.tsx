import { DeniedPage } from '@/components/main/DeniedPage';
import { EditAccount } from '@/components/settings/EditAccount';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const RegisterAnimalPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return (
    <div className="full-page-form">
      <EditAccount user={user} />
    </div>
  );
};

export default RegisterAnimalPage;
