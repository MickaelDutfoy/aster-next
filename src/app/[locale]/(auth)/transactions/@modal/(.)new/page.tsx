import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { getAnimalsByOrg } from '@/lib/animals/getAnimalsByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { getTransactionCategoriesOfOrg } from '@/lib/transactions/getTransactionCategoriesOfOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

export default async function AddTransactionModal() {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userRole !== MemberRole.SUPERADMIN && org.userRole !== MemberRole.ADMIN) {
    return <DeniedPage cause="treasury" />;
  }

  const [categories, animals] = await Promise.all([
    getTransactionCategoriesOfOrg(org.id),
    getAnimalsByOrg(org.id),
  ]);

  return (
    <RouteModal expectedPath="/transactions/new">
      <TransactionForm categories={categories} animals={animals} />
    </RouteModal>
  );
}
