'use client'

import { Member, Organization } from "@/lib/types";
import { useUser } from "./UserProvider"
import { useOrg } from "./OrgProvider";
import { useRouter } from "next/navigation";

export const OrgSelector = () => {
    const user: Member | null = useUser();

    if (!user || !user.organizations.length) return;

    const router = useRouter();
    const org: Organization | null = useOrg();

    return <>
        {user.organizations.length > 0 && <><div className="orga-select">
            <h4>Vos associations :</h4>
            <select
                value={org?.id ?? ""}
                onChange={(e) => {
                    document.cookie = `orgId=${e.target.value}; Path=/; SameSite=Lax; Max-Age=${60*60*24*365}; Secure`;
                    router.refresh();
                  }}>
                {user.organizations.map((org, index) => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
        </div>
            <hr />
        </>}
    </>
}