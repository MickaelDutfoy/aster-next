import { NewPassword } from '@/components/auth/NewPassword';
import '@/styles/login-register.scss';

const NewPasswordPage = async ({ searchParams }: { searchParams: Promise<{ token: string }> }) => {
  const { token } = await searchParams;

  return <NewPassword token={token} />;
};

export default NewPasswordPage;
