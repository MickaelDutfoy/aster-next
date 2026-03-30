import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { getTransactionsById } from '@/lib/transactions/getTransactionById';
import { getTransactionCategoriesOfOrg } from '@/lib/transactions/getTransactionCategoriesOfOrg';
import { Member, Organization, Transaction, TransactionCategory } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

export default async function EditTransactionModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userRole !== MemberRole.SUPERADMIN && org.userRole !== MemberRole.ADMIN) {
    return <DeniedPage cause="refused" />;
  }

  const transaction: Transaction | null = await getTransactionsById(Number(id));
  if (!transaction) return <DeniedPage cause="error" />;

  const categories: TransactionCategory[] = await getTransactionCategoriesOfOrg(org.id);

  return (
    <RouteModal expectedPath={`/transactions/edit/${id}`}>
      <TransactionForm categories={categories} transaction={transaction} />
    </RouteModal>
  );
}
