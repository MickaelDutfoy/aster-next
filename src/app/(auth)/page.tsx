import { getUser } from '@/lib/getUser';
import { Member } from '@/lib/types';
import Link from 'next/link';

const Dashboard = async () => {
  const user: Member | null = await getUser();
  if (!user) return;

  return (
    <>
      <p>Bienvenue, {user.firstName} !</p>
      {user.organizations.length === 0 && (
        <p className="notice">Vous devez d'abord ajouter une association ou en rejoindre une.</p>
      )}
      <p className="notice">
        Un problème ? Une suggestion ?{' '}
        <Link className="link" href="mailto:m.dutfoy@gmail.com">
          Envoyez-moi un message
        </Link>{' '}
        !
      </p>
    </>
  );
};

export default Dashboard;
