import { DeniedPage } from '@/components/layout/DeniedPage';
import { Header } from '@/components/layout/Header';
import { NavBarBottom } from '@/components/layout/NavBarBottom';
import { NavBarTop } from '@/components/layout/NavBarTop';
import { OrgSelector } from '@/components/organizations/OrgSelector';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import '@/styles/dashboard.scss';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const org: Organization | null = await getSelectedOrg(user);

  return (
    <div className="dashboard">
      <NavBarTop user={user} />
      <Header />
      <OrgSelector user={user} org={org} />
      <main>{children}</main>
      <NavBarBottom />
    </div>
  );
};

export default Layout;
