import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { OrgProvider } from '@/components/organizations/OrgProvider';
import { OrgSelector } from '@/components/organizations/OrgSelector';
import { UserProvider } from '@/components/providers/UserProvider';
import { getSelectedOrg } from '@/lib/organizations/getSelectedOrg';
import { Member, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import '@/styles/dashboard.scss';

const Layout = async ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  const user: Member | null = await getUser();
  if (!user) return null;

  const org: Organization | null = await getSelectedOrg(user);

  return (
    <div className="dashboard">
      <UserProvider value={user}>
        <OrgProvider value={org}>
          <NavBar />
          <Header />
          <OrgSelector />
          {children}
          {modal}
        </OrgProvider>
      </UserProvider>
    </div>
  );
};

export default Layout;
