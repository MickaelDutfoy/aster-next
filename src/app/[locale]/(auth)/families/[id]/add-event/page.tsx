import { ManageFamilyCalendar } from '@/components/calendars/ManageFamilyCalendar';
import { DeniedPage } from '@/components/main/DeniedPage';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

const AddEventToFamilyCalendarPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) => {
  const { id } = await params;
  const { date } = await searchParams;

  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <DeniedPage cause="error" />;

  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  const canAssignMembers: boolean =
    org.userRole === MemberRole.ADMIN || org.userRole === MemberRole.SUPERADMIN ? true : false;

  return (
    <div className="full-page-form">
      <ManageFamilyCalendar
        date={date}
        user={user}
        family={family}
        canAssignMembers={canAssignMembers}
      />
    </div>
  );
};

export default AddEventToFamilyCalendarPage;
