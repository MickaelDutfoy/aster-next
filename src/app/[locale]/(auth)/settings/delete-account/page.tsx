import { auth } from '@/auth';
import { DeniedPage } from '@/components/main/DeniedPage';
import { DeleteAccount } from '@/components/settings/DeleteAccount';

const DeleteAccountPage = async () => {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return <DeniedPage cause="error" />;

  return (
    <div className="full-page-form">
      <DeleteAccount />
    </div>
  );
};

export default DeleteAccountPage;
