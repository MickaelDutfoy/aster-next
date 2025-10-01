import { Member, Organization } from "@/lib/types";
import { getUser } from "@/lib/getUser";
import { getOrg } from "@/lib/getOrg";
import Link from "next/link";

const Dashboard = async () => {
  const user: Member | null = await getUser(); // get user info in server component
  if (!user) return;

  const org: Organization | null = await getOrg(user);

  return <>
    <p>Bienvenue, {user.firstName} !</p>
    {org && <p>Asso sélectionnée : {org.name}.</p>}
    {user.organizations.length === 0 && <p className="notice">Vous devez d'abord ajouter une association ou en rejoindre une.</p>}
    <p className="notice">Un problème ? Une suggestion ? <Link className="link" href="mailto:m.dutfoy@gmail.com">Envoyez-moi un message</Link> !</p>
  </>
}

export default Dashboard;