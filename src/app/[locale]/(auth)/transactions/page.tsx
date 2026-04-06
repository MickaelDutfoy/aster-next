import { DeniedPage } from '@/components/main/DeniedPage';
import { TransactionsActions } from '@/components/transactions/TransactionsActions';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { getTransactionCategoriesOfOrg } from '@/lib/transactions/getTransactionCategoriesOfOrg';
import { getTransactionsOfOrg } from '@/lib/transactions/getTransactionsOfOrg';
import { Member, Organization, Transaction, TransactionCategory } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

const Transactions = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  if (org.userRole !== MemberRole.SUPERADMIN && org.userRole !== MemberRole.ADMIN) {
    return <DeniedPage cause="treasury" />;
  }

  const transactions: Transaction[] = await getTransactionsOfOrg(org.id);
  const categories: TransactionCategory[] = await getTransactionCategoriesOfOrg(org.id);

  return (
    <div>
      <TransactionsActions />
      <TransactionsList
        transactions={transactions}
        categories={categories}
        displayCurrency={org.defaultCurrency}
      />
    </div>
  );
};

export default Transactions;
