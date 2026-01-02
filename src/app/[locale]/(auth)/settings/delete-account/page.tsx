import { DeniedPage } from '@/components/main/DeniedPage';
import { DeleteAccount } from '@/components/settings/DeleteAccount';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const RegisterAnimalPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return <DeleteAccount />;
};

export default RegisterAnimalPage;
