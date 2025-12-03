import { Family } from '@/lib/types';

export const FamilyForm = ({
  family,
  action,
  isLoading,
}: {
  family?: Family;
  action: (formdata: FormData) => void;
  isLoading: boolean;
}) => {
  return (
    <>
      <p className="notice">(Les champs marqués d'un * sont requis.)</p>
      <form action={action}>
        <div className="form-tab">
          <input
            type="text"
            name="contactFullName"
            placeholder="Nom de la famille *"
            defaultValue=""
          />
          <div className="family-address-info">
            <input type="text" name="address" placeholder="N° et rue *" defaultValue="" />
            <div className="family-city">
              <input type="text" name="zip" placeholder="Code postal *" defaultValue="" />
              <input type="text" name="city" placeholder="Ville *" defaultValue="" />
            </div>
            <div className="family-contact">
              <input type="text" name="email" placeholder="E-mail" defaultValue="" />
              <input type="text" name="phoneNumber" placeholder="Téléphone" defaultValue="" />
            </div>
          </div>
          <label className="labeled-checkbox" htmlFor="hasChildren">
            Y a t-il des enfants ?
            <input type="checkbox" name="hasChildren" id="hasChildren" defaultChecked={false} />
          </label>
          <p>Y a t-il d'autres animaux (précisez lesquels) ?</p>
          <textarea
            name="otherAnimals"
            defaultValue=""
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          <button
            className="little-button"
            aria-busy={isLoading}
            disabled={isLoading}
            //   onClick={(e) => handleSubmit(e)}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </>
  );
};
