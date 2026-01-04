'use client';

import { registerFamily } from '@/actions/families/registerFamily';
import { updateFamily } from '@/actions/families/updateFamily';
import { useRouter } from '@/i18n/routing';
import { Family, Member } from '@/lib/types';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const FamilyForm = ({
  user,
  family,
  orgFamilies,
}: {
  user: Member;
  family?: Family;
  orgFamilies?: Family[];
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [familyName, setFamilyName] = useState<string>(family?.contactFullName ?? '');
  const [familyEmail, setFamilyEmail] = useState<string>(family?.email ?? '');
  const [familyPhoneNumber, setFamilyPhoneNumber] = useState<string>(family?.phoneNumber ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const isAlreadyFamily = orgFamilies?.some((family) => family.memberId === user.id);

  const fillWithMemberInfo = (checked: boolean) => {
    if (checked) {
      setFamilyName(`${user.firstName} ${user.lastName}`);
      setFamilyEmail(user.email);
      setFamilyPhoneNumber(user.phoneNumber);
    } else {
      setFamilyName('');
      setFamilyEmail('');
      setFamilyPhoneNumber('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const isMember = formData.has('isMember');
    const contactFullName = formData.get('contactFullName')?.toString().trim();
    const address = formData.get('address')?.toString().trim();
    const zip = formData.get('zip')?.toString().trim();
    const city = formData.get('city')?.toString().trim();

    if (!contactFullName || !address || !zip || !city) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.requiredFieldsMissing'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = family
        ? await updateFamily(family.id, formData, isMember)
        : await registerFamily(formData, isMember);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      if (res.ok) {
        router.replace(family ? `/families/${family.id}` : '/families');
      }
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="notice">{t('common.requiredFieldsNotice')}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-tab">
          <div className={'labeled-checkbox ' + clsx(isAlreadyFamily ? 'disabled' : '')}>
            <p>{t('families.prefillMeLabel')}</p>
            <input
              type="checkbox"
              name="isMember"
              id="isMember"
              defaultChecked={family?.memberId === user.id}
              onChange={(e) => fillWithMemberInfo(e.target.checked)}
            />
          </div>
          {isAlreadyFamily ? (
            <p className="notice">{t('families.alreadyFosterInOrg')}</p>
          ) : (
            <p className="notice">{t('families.familyBindNotice')}</p>
          )}
          <input
            type="text"
            name="contactFullName"
            placeholder={t('families.fields.contactFullNamePlaceholder')}
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
          <div className="family-address-info">
            <input
              type="text"
              name="address"
              placeholder={t('families.fields.addressPlaceholderRequired')}
              defaultValue={family?.address}
            />

            <div className="family-city">
              <input
                type="text"
                name="zip"
                placeholder={t('families.fields.zipPlaceholderRequired')}
                defaultValue={family?.zip}
              />
              <input
                type="text"
                name="city"
                placeholder={t('families.fields.cityPlaceholderRequired')}
                defaultValue={family?.city}
              />
            </div>
            <div className="family-contact">
              <input
                type="text"
                name="email"
                placeholder={t('auth.emailPlaceholder')}
                value={familyEmail}
                onChange={(e) => setFamilyEmail(e.target.value)}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder={t('auth.register.phonePlaceholder')}
                value={familyPhoneNumber}
                onChange={(e) => setFamilyPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <label className="labeled-checkbox" htmlFor="hasChildren">
            {t('families.questions.hasChildren')}
            <input
              type="checkbox"
              name="hasChildren"
              id="hasChildren"
              defaultChecked={family?.hasChildren}
            />
          </label>
          <p>{t('families.questions.otherAnimals')}</p>
          <textarea
            name="otherAnimals"
            defaultValue={family?.otherAnimals as string}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
        </div>
        <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
          {isLoading ? t('common.loading') : t('common.submit')}
        </button>
      </form>
    </>
  );
};
