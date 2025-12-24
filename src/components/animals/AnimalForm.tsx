'use client';

import { registerAnimal } from '@/actions/animals/registerAnimal';
import { updateAnimal } from '@/actions/animals/updateAnimal';
import { useRouter } from '@/i18n/routing';
import { Animal, Family, Member } from '@/lib/types';
import { AnimalStatus, Sex } from '@prisma/client';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { showToast } from '../app/ToastProvider';

export const AnimalForm = ({
  user,
  animal,
  families,
}: {
  user: Member;
  animal?: Animal;
  families: Family[];
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [form, setForm] = useState<'health' | 'adopt'>('health');
  const [status, setStatus] = useState<string>(animal?.status ?? AnimalStatus.UNHOSTED);
  const [familyId, setFamilyId] = useState<number | undefined>(animal?.familyId ?? undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (animal) return;
    let defaultFamily = families.find((family) => family.memberId === user.id);
    if (defaultFamily) {
      setStatus(AnimalStatus.FOSTERED);
      setFamilyId(defaultFamily.id);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const animalForm = {
      name: formData.get('animalName')?.toString().trim(),
      species: formData.get('animalSpecies')?.toString().trim(),
      birthDate: formData.get('animalBirthDate')?.toString().trim(),
      statusFromForm: formData.get('animalStatus')?.toString(),
      animalFamily: Number(formData.get('animalFamily')),
      adopterFullName: formData.get('adopterFullName')?.toString().trim(),
    };

    if (
      !animalForm.name ||
      !animalForm.species ||
      !animalForm.birthDate ||
      (animalForm.statusFromForm === AnimalStatus.ADOPTED && !animalForm.adopterFullName) ||
      (animalForm.statusFromForm === AnimalStatus.FOSTERED && !animalForm.animalFamily)
    ) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.requiredFieldsMissing'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = animal ? await updateAnimal(animal.id, formData) : await registerAnimal(formData);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      if (res.ok) {
        router.replace(animal ? `/animals/${animal.id}` : '/animals');
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
      <div className="tabs">
        <div className={clsx(form === 'health' ? 'active' : '')} onClick={() => setForm('health')}>
          {t('animals.tabs.health')}
        </div>
        <div className={clsx(form === 'adopt' ? 'active' : '')} onClick={() => setForm('adopt')}>
          {t('animals.tabs.adoption')}
        </div>
      </div>
      <p className="notice">{t('common.requiredFieldsNotice')}</p>
      <form onSubmit={handleSubmit}>
        <div hidden={form !== 'health'}>
          <div className="form-tab">
            <div className="name-species-color">
              <input
                type="text"
                name="animalName"
                placeholder={t('animals.fields.namePlaceholder')}
                defaultValue={animal?.name}
              />
              <input
                type="text"
                name="animalSpecies"
                placeholder={t('animals.fields.speciesPlaceholder')}
                defaultValue={animal?.species}
              />
              <input
                type="text"
                name="animalColor"
                placeholder={t('animals.fields.colorPlaceholder')}
                defaultValue={animal?.color ?? ''}
              />
            </div>
            <div className="labeled-checkbox">
              <p>{t('animals.fields.sexLabel')}</p>
              <select name="animalSex" defaultValue={animal?.sex}>
                <option value={Sex.M}>{t('animals.sex.M')}</option>
                <option value={Sex.F}>{t('animals.sex.F')}</option>
              </select>
              <p>{t('animals.fields.neuteredQuestion')}</p>
              <input type="checkbox" name="animalIsNeutered" defaultChecked={animal?.isNeutered} />
            </div>

            <input
              type="text"
              name="findLocation"
              placeholder={t('animals.fields.findLocationPlaceholder')}
              defaultValue={animal?.findLocation ?? ''}
            />
            <div className="labeled-date">
              <p>{t('animals.fields.birthDateLabel')}</p>
              <input
                type="date"
                name="animalBirthDate"
                defaultValue={animal?.birthDate.toISOString().slice(0, 10)}
              />
            </div>
            <div className="labeled-date">
              <p>{t('animals.lastVaxLabel')}</p>
              <input
                type="date"
                name="animalLastVax"
                defaultValue={animal?.lastVax?.toISOString().slice(0, 10)}
              />
            </div>
            <label className="labeled-checkbox" htmlFor="animalPrimeVax">
              {t('animals.fields.primeVaxQuestion')}
              <input
                type="checkbox"
                name="animalPrimeVax"
                id="animalPrimeVax"
                defaultChecked={animal?.isPrimoVax}
              />
            </label>
            <div className="labeled-date">
              <p>{t('animals.lastDewormLabel')}</p>
              <input
                type="date"
                name="animalLastDeworm"
                defaultValue={animal?.lastDeworm?.toISOString().slice(0, 10)}
              />
            </div>
            <label className="labeled-checkbox" htmlFor="animalFirstDeworm">
              {t('animals.fields.firstDewormQuestion')}
              <input
                type="checkbox"
                name="animalFirstDeworm"
                id="animalFirstDeworm"
                defaultChecked={animal?.isFirstDeworm}
              />
            </label>
            <div className="labeled-select">
              <p>{t('animals.fields.statusLabel')}</p>
              <select
                name="animalStatus"
                value={status}
                onChange={(e) => {
                  const next = e.target.value as AnimalStatus;
                  setStatus(next);
                  if (next !== AnimalStatus.FOSTERED) setFamilyId(undefined);
                }}
              >
                <option value={AnimalStatus.UNHOSTED}>{t('animals.status.UNHOSTED')}</option>
                <option value={AnimalStatus.FOSTERED}>{t('animals.status.FOSTERED')}</option>
                <option value={AnimalStatus.ADOPTED}>{t('animals.status.ADOPTED')}</option>
              </select>
            </div>
            <div className={`labeled-select ` + clsx(status === 'FOSTERED' ? '' : 'disabled')}>
              <p>
                {t('animals.fields.familyLabel')}
                {status === 'FOSTERED' ? ' *' : ''} :
              </p>
              <select
                name="animalFamily"
                value={familyId}
                onChange={(e) =>
                  setFamilyId(e.target.value === '' ? undefined : Number(e.target.value))
                }
                disabled={status !== AnimalStatus.FOSTERED}
              >
                {families?.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.contactFullName}
                  </option>
                ))}
              </select>
            </div>
            <p>{t('animals.additionalInfoLabel')}</p>
            <textarea
              name="animalInformation"
              defaultValue={animal?.information ?? ''}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
          </div>
        </div>
        <div hidden={form !== 'adopt'}>
          <div className="form-tab">
            <input
              type="text"
              name="adopterFullName"
              placeholder={
                t('animals.fields.adopterFullNamePlaceholder') + (status === 'ADOPTED' ? ' *' : '')
              }
              defaultValue={animal?.adoption?.adopterFullName}
            />
            <div className="adopter-address-info">
              <input
                type="text"
                name="adopterAddress"
                placeholder={t('animals.fields.addressPlaceholder')}
                defaultValue={animal?.adoption?.adopterAddress as string}
              />
              <div className="adopter-city">
                <input
                  type="text"
                  name="adopterZip"
                  placeholder={t('animals.fields.zipPlaceholder')}
                  defaultValue={animal?.adoption?.adopterZip as string}
                />
                <input
                  type="text"
                  name="adopterCity"
                  placeholder={t('animals.fields.cityPlaceholder')}
                  defaultValue={animal?.adoption?.adopterCity as string}
                />
              </div>
              <div className="adopter-contact">
                <input
                  type="text"
                  name="adopterEmail"
                  placeholder={t('auth.emailPlaceholder')}
                  defaultValue={animal?.adoption?.adopterEmail as string}
                />
                <input
                  type="text"
                  name="adopterPhoneNumber"
                  placeholder={t('auth.register.phonePlaceholder')}
                  defaultValue={animal?.adoption?.adopterPhoneNumber as string}
                />
              </div>
            </div>

            <label className="labeled-checkbox" htmlFor="homeVisitDone">
              {t('animals.fields.homeVisitQuestion')}
              <input
                type="checkbox"
                name="homeVisitDone"
                id="homeVisitDone"
                defaultChecked={animal?.adoption?.homeVisitDone}
              />
            </label>
            <div className="labeled-date">
              <p>{t('animals.neuteringPlannedLabel')}</p>
              <input
                type="date"
                name="neuteringPlannedAt"
                defaultValue={animal?.adoption?.neuteringPlannedAt?.toISOString().slice(0, 10)}
              />
            </div>
            <div className="labeled-date">
              <p>{t('animals.contractSignedLabel')}</p>
              <input
                type="date"
                name="adoptionContractSignedAt"
                defaultValue={animal?.adoption?.adoptionContractSignedAt
                  ?.toISOString()
                  .slice(0, 10)}
              />
            </div>
            <label className="labeled-checkbox" htmlFor="adoptionFeePaid">
              {t('animals.fields.feesPaidQuestion')}
              <input
                type="checkbox"
                name="adoptionFeePaid"
                id="adoptionFeePaid"
                defaultChecked={animal?.adoption?.adoptionFeePaid}
              />
            </label>
            <div className="labeled-date">
              <p>{t('animals.legalTransferLabel')}</p>
              <input
                type="date"
                name="legalTransferAt"
                defaultValue={animal?.adoption?.legalTransferAt?.toISOString().slice(0, 10)}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
          {isLoading ? t('common.loading') : t('common.submit')}
        </button>
      </form>
    </>
  );
};
