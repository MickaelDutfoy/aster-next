import { FamiliesList } from '@/components/families/FamiliesList';
import { getFamiliesByOrg } from '@/lib/families/getFamiliesByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import Link from 'next/link';

const FamiliesPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  if (org.userStatus === 'PENDING') {
    return (
      <h3 className="denied-page">
        Vous n'avez pas les autorisations pour accéder à cette ressource.
      </h3>
    );
  }

  const families: Family[] | null = await getFamiliesByOrg(org.id);

  return (
    <>
      <div className="links-box">
        <Link href={'/families/new'} className="little-button">
          Ajouter une famille
        </Link>
      </div>
      <FamiliesList org={org} families={families} />
    </>
  );
};

export default FamiliesPage;
