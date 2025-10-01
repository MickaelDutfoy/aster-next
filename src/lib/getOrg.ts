import { cookies } from "next/headers";
import { Member, Organization } from "./types";

export const getOrg = async (user: Member): Promise<Organization | null> => {
    const cookieStore = await cookies();
    const orgIdCookie = Number(cookieStore.get("orgId")?.value);
    const org: Organization | null = user?.organizations.find(o => o.id === orgIdCookie) ?? null;

    return org;
}