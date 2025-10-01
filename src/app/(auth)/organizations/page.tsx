import { getUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma"
import { Member } from "@/lib/types";
import "@/styles/organizations.scss"
import { revalidateTag } from "next/cache";

const Organizations = async () => {
    const user: Member | null = await getUser();
    if (!user) return;

    const registerOrg = async (formdata: FormData) => {
        'use server'

        const org = {
            name: formdata.get('orgName')?.toString(),
        }

        if (!org.name) {
            console.log("an organization must have a name")
            return;
        }

        try {
            const res = await prisma.organizations.create({
                data: { name: org.name }
            })

            await prisma.member_organization.create({
                data: { member_id: user?.id, organization_id: res.id }
            })

            revalidateTag('user');
        } catch (error) {
            console.log("process failed")
        }
    }

    const joinOrg = async (formdata: FormData) => {
        'use server'

        const org = {
            name: formdata.get('orgName')?.toString(),
        }

        try {
            
        } catch (error) {
            
        }
    }

    return <>
        <div className="org-wrapper">
            <h3>Enregistrer une nouvelle association ?</h3>
            <form action={registerOrg}>
                <input type="text" name="orgName" placeholder="Nom de l'association" />
                <button className="little-button">Enregistrer</button>
            </form>
        </div>
        <div className="org-wrapper">
            <h3>Rechercher une association existante ?</h3>
            <form action={joinOrg}>
                <input type="text" name="orgName" placeholder="Nom de l'association" />
                <button className="little-button">Rejoindre</button>
            </form>
        </div>
    </>
}

export default Organizations;