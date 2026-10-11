import { DeniedPage } from '@/components/main/DeniedPage';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { getAnimalsByOrg } from '@/lib/animals/getAnimalsByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { getTransactionById } from '@/lib/transactions/getTransactionById';
import { getTransactionCategoriesOfOrg } from '@/lib/transactions/getTransactionCategoriesOfOrg';
import { Member, Organization, Transaction } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userRole !== MemberRole.SUPERADMIN && org.userRole !== MemberRole.ADMIN) {
    return <DeniedPage cause="treasury" />;
  }

  const transaction: Transaction | null = await getTransactionById(Number(id), org.id);
  if (!transaction) return <DeniedPage cause="error" />;

  const [categories, animals] = await Promise.all([
    getTransactionCategoriesOfOrg(org.id),
    getAnimalsByOrg(org.id),
  ]);

  return (
    <div className="full-page-form">
      <TransactionForm categories={categories} transaction={transaction} animals={animals} />
    </div>
  );
}
