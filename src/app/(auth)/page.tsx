import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import Link from 'next/link';

const Dashboard = async () => {
  const user: Member | null = await getUser();
  if (!user) return;

  return (
    // contenu à repenser
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
