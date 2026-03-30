import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { DeleteTransaction } from '@/components/transactions/DeleteTransaction';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { getTransactionsById } from '@/lib/transactions/getTransactionById';
import { Member, Organization, Transaction } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

export default async function DeleteAnimalRouteModal({
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

  return (
    <RouteModal expectedPath={`/transactions/delete/${transaction.id}`}>
      <DeleteTransaction id={id} />
    </RouteModal>
  );
}
