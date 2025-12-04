import { FamilyDetails } from '@/components/families/FamilyDetails';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
const FamilyDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const user: Member | null = await getUser();
  if (!user) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <h3 className="denied-page">Une erreur est survenue.</h3>;

  if (user.organizations.every((org) => org.id !== family.orgId)) {
    return (
      <h3 className="denied-page">
        Vous n'avez pas les permissions pour accéder à cette ressource.
      </h3>
    );
  }

  return <FamilyDetails family={family} />;
};

export default FamilyDetail;
