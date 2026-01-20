import { DeniedPage } from '@/components/main/DeniedPage';
import { Header } from '@/components/main/Header';
import { NavBarBottom } from '@/components/main/NavBarBottom';
import { NavBarTop } from '@/components/main/NavBarTop';
import { OrgSelector } from '@/components/organizations/OrgSelector';
import { getUnreadNotificationsCount } from '@/lib/notifications/getUserUnreadNotifications';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUserWithOrgs } from '@/lib/user/getUserWithOrgs';
import '@/styles/dashboard.scss';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user: Member | null = await getUserWithOrgs();
  if (!user) return <DeniedPage cause="error" />;

  const notifications: number = await getUnreadNotificationsCount(user.id);

  const org: Organization | null = await getSelectedOrg(user);

  return (
    <div className="dashboard">
      <NavBarTop user={user} notifications={notifications} />
      <Header />
      <OrgSelector user={user} org={org} />
      <main>{children}</main>
      <NavBarBottom />
    </div>
  );
};

export default Layout;
