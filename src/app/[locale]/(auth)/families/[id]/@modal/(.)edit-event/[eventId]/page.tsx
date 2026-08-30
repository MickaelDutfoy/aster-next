import { ManageFamilyCalendar } from '@/components/calendars/ManageFamilyCalendar';
import { DeniedPage } from '@/components/main/DeniedPage';
import { RouteModal } from '@/components/tools/RouteModal';
import { getEventById } from '@/lib/calendars/getEventById';
import { getFamilyById } from '@/lib/families/getFamilyById';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Event, Family, Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';

export default async function ManageFamilyCalendarRouteModal({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>;
}) {
  const { id, eventId } = await params;

  const family: Family | null = await getFamilyById(Number(id));
  if (!family) return <DeniedPage cause="error" />;

  const event: Event | null = await getEventById(Number(eventId));
  if (!event) return <DeniedPage cause="error" />;

  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);
  if (!org) return <DeniedPage cause="error" />;

  const canAssignMembers: boolean =
    org.userRole === MemberRole.ADMIN || org.userRole === MemberRole.SUPERADMIN ? true : false;

  return (
    <RouteModal expectedPath={`/families/${family.id}/edit-event/${eventId}`}>
      <ManageFamilyCalendar
        event={event}
        user={user}
        family={family}
        canAssignMembers={canAssignMembers}
      />
    </RouteModal>
  );
}
