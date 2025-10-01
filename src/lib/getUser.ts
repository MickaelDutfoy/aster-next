import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Member, Organization } from "./types";

export const getUser = async (): Promise<Member | null> => {
    const session = await auth();
    if (!session?.user?.email) return null;

    try {
        // fetch member info
        const res = await prisma.members.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                member_organization: true,
            },
        });

        if (!res) return null;

        // fetch member's organizations
        const memberOrgs: Organization[] = await prisma.organizations.findMany({
            where: { id: { in: res.member_organization?.map(mo => mo.organization_id) } },
            select: { id: true, name: true, animals: true },
        })

        // add member role and status for each organization
        const organizations = memberOrgs.map(org => ({
            ...org,
            role: res.member_organization?.find(mo => mo.organization_id === org.id)?.role ?? undefined,
            status: res.member_organization?.find(mo => mo.organization_id === org.id)?.status ?? undefined
        })) ?? [];

        const member: Member = {
            id: res.id,
            firstName: res.first_name,
            lastName: res.last_name,
            email: res.email,
            organizations: organizations,
        }

        console.log(member)
        return member;
    } catch (error) {
        console.log("Erreur")
        return null;
    }
}
