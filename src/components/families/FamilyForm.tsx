import { registerFamily } from '@/actions/families/registerFamily';
import { updateFamily } from '@/actions/families/updateFamily';
import { useRouter } from '@/i18n/routing';
import { Family, Member } from '@/lib/types';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const FamilyForm = ({ user, family }: { user: Member; family?: Family }) => {
  const router = useRouter();

  const [familyName, setFamilyName] = useState<string>(family?.contactFullName ?? '');
  const [familyEmail, setFamilyEmail] = useState<string>(family?.email ?? '');
  const [familyPhoneNumber, setFamilyPhoneNumber] = useState<string>(family?.phoneNumber ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const fillWithMemberInfo = () => {
    setFamilyName(user.firstName + ' ' + user.lastName);
    setFamilyEmail(user.email);
    setFamilyPhoneNumber(user.phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const contactFullName = formData.get('contactFullName')?.toString().trim();
    const address = formData.get('address')?.toString().trim();
    const zip = formData.get('zip')?.toString().trim();
    const city = formData.get('city')?.toString().trim();

    if (!contactFullName || !address || !zip || !city) {
      showToast({
        ok: false,
        status: 'error',
        message: 'Des champs obligatoires sont incomplets.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = family ? await updateFamily(family.id, formData) : await registerFamily(formData);

      showToast(res);

      if (res.ok) {
        router.replace(family ? `/families/${family.id}` : '/families');
      }
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: 'Une erreur est survenue.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="notice">(Les champs marqués d'un * sont requis.)</p>
      <form onSubmit={handleSubmit}>
        <div className="form-tab">
          <div className="prefill-form">
            <p>C'est moi :</p>{' '}
            <span className="little-button" onClick={fillWithMemberInfo}>
              Utiliser mes infos
            </span>
          </div>
          <input
            type="text"
            name="contactFullName"
            placeholder="Nom de la famille *"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
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
                value={familyEmail}
                onChange={(e) => setFamilyEmail(e.target.value)}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Téléphone"
                value={familyPhoneNumber}
                onChange={(e) => setFamilyPhoneNumber(e.target.value)}
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
            type="submit"
            className="little-button"
            aria-busy={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </>
  );
};
