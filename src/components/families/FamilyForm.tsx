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
            defaultValue={family?.contactFullName}
          />
          <div className="family-address-info">
            <input
              type="text"
              name="address"
              placeholder="N° et rue *"
              defaultValue={family?.address}
            />
            <div className="family-city">
              <input
                type="text"
                name="zip"
                placeholder="Code postal *"
                defaultValue={family?.zip}
              />
              <input type="text" name="city" placeholder="Ville *" defaultValue={family?.city} />
            </div>
            <div className="family-contact">
              <input
                type="text"
                name="email"
                placeholder="E-mail"
                defaultValue={family?.email as string}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Téléphone"
                defaultValue={family?.phoneNumber as string}
              />
            </div>
          </div>
          <label className="labeled-checkbox" htmlFor="hasChildren">
            Y a t-il des enfants ?
            <input
              type="checkbox"
              name="hasChildren"
              id="hasChildren"
              defaultChecked={family?.hasChildren}
            />
          </label>
          <p>Y a t-il d'autres animaux (précisez lesquels) ?</p>
          <textarea
            name="otherAnimals"
            defaultValue={family?.otherAnimals as string}
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
