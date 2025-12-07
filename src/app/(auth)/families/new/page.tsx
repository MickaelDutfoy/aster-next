import { RegisterFamily } from '@/components/families/RegisterFamily';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const RegisterFamilyPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  return <RegisterFamily user={user} />;
};

export default RegisterFamilyPage;
