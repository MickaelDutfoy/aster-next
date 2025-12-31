import { RegisterFamily } from '@/components/families/RegisterFamily';
import { DeniedPage } from '@/components/main/DeniedPage';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const RegisterFamilyPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return <RegisterFamily user={user} />;
};

export default RegisterFamilyPage;
