import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { EditCategories } from '@/components/transactions/EditCategories';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { getTransactionCategoriesOfOrg } from '@/lib/transactions/getTransactionCategoriesOfOrg';
import { Member, Organization, TransactionCategory } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

export default async function EditCategoriesModal() {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userRole !== MemberRole.SUPERADMIN && org.userRole !== MemberRole.ADMIN) {
    return <DeniedPage cause="treasury" />;
  }

  const categories: TransactionCategory[] = await getTransactionCategoriesOfOrg(org.id, true);

  return (
    <RouteModal expectedPath="/transactions/edit-categories">
      <EditCategories categories={categories} />
    </RouteModal>
  );
}
