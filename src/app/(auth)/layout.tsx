import "@/styles/dashboard.scss"
import { getUser } from "@/lib/getUser";
import { Member, Organization } from "@/lib/types";
import { UserProvider } from "@/components/UserProvider";
import { OrgProvider } from "@/components/OrgProvider";
import { Header } from "@/components/Header";
import { NavBar } from "@/components/NavBar";
import { OrgSelector } from "@/components/OrgSelector";
import { getOrg } from "@/lib/getOrg";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const user: Member | null = await getUser();
    if (!user) return null;

    const org : Organization | null = await getOrg(user);

    return <div className="dashboard">
        <UserProvider value={user}>
            <OrgProvider value={org}>
                <NavBar />
                <Header />
                <OrgSelector />
                {children}
            </OrgProvider>
        </UserProvider>
    </div>
}

export default Layout;