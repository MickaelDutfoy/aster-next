import { registerOrg } from '@/actions/registerOrg';
import { OrgList } from '@/components/OrgList';
import { SearchOrg } from '@/components/SearchOrg';
import { getUser } from '@/lib/getUser';
import { Member } from '@/lib/types';
import '@/styles/organizations.scss';

const Organizations = async () => {
  const user: Member | null = await getUser();
  if (!user) return;

  // repenser la mise en forme ici
  return (
    <>
      <div className="org-wrapper">
        <h3>Enregistrer une nouvelle association ?</h3>
        <form action={registerOrg}>
          <input type="text" name="orgName" placeholder="Nom de l'association" />
          <button className="little-button">Enregistrer</button>
        </form>
      </div>
      <div className="org-wrapper">
        <SearchOrg />
      </div>
      <div className="pending-list">
        <OrgList />
      </div>
    </>
  );
};

export default Organizations;
