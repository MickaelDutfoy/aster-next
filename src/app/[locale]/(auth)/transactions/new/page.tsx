import { DeniedPage } from '@/components/main/DeniedPage';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { getAnimalsByOrg } from '@/lib/animals/getAnimalsByOrg';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { getTransactionCategoriesOfOrg } from '@/lib/transactions/getTransactionCategoriesOfOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

const AddTransactionPage = async () => {
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
    <div className="full-page-form">
      <TransactionForm categories={categories} animals={animals} />
    </div>
  );
};

export default AddTransactionPage;
