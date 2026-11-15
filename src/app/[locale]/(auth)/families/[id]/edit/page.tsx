import { FamilyForm } from '@/components/families/FamilyForm';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { isRelatedToFamily } from '@/lib/permissions/isRelatedToFamily';
import { Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const UpdateFamilyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <DeniedPage cause="error" />;

  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (family.orgId !== org.id) return <DeniedPage cause="refused" />;

  const guard = await isRelatedToFamily(family.id);
  if (!guard.validation.ok) return <DeniedPage cause="refused" />;

  return (
    <div className="full-page-form">
      <FamilyForm user={user} family={family} />
    </div>
  );
};

export default UpdateFamilyPage;
