'use client';

import { registerAnimal } from '@/actions/animals/registerAnimal';
import { updateAnimal } from '@/actions/animals/updateAnimal';
import { useRouter } from '@/i18n/routing';
import {
  Animal,
  AnimalHealthActType,
  AnimalHealthDraft,
  FamilyWithoutDetails,
  Member,
} from '@/lib/types';
import { displayDate } from '@/lib/utils/displayDate';
import { AnimalStatus, Sex } from '@prisma/client';
import { clsx } from 'clsx';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const AnimalForm = ({
  user,
  animal,
  families,
}: {
  user: Member;
  animal?: Animal;
  families: FamilyWithoutDetails[];
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [form, setForm] = useState<'general' | 'health' | 'adopt'>('general');
  const [isNeutered, setIsNeutered] = useState<boolean>(animal?.isNeutered ?? false);
  const [status, setStatus] = useState<string>(animal?.status ?? AnimalStatus.UNHOSTED);
  const [familyId, setFamilyId] = useState<number | undefined>(animal?.familyId ?? undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [healthActsDraft, setHealthActsDraft] = useState<AnimalHealthDraft[]>(() => {
    const acts = animal?.healthActs ?? [];
    return acts
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map((act) => ({
        type: act.type as AnimalHealthActType,
        date: act.date.toISOString().slice(0, 10),
        isFirst: act.isFirst,
      }));
  });

  const [newAct, setNewAct] = useState<AnimalHealthDraft>({
    type: 'VACCINATION',
    date: '',
    isFirst: false,
  });

  const commonSpecies = t.raw('animals.commonSpecies') as string[];

  const initialSelectedSpecies = (() => {
    if (animal?.species) {
      return commonSpecies.includes(animal.species) ? animal.species : 'other';
    }

    return commonSpecies[0];
  })();

  const [selectedSpecies, setSelectedSpecies] = useState<string>(initialSelectedSpecies);

  useEffect(() => {
    if (animal) return;
    let defaultFamily = families.find((family) => family.memberId === user.id);
    if (defaultFamily) {
      setStatus(AnimalStatus.FOSTERED);
      setFamilyId(defaultFamily.id);
    }
  }, []);

  const addHealthAct = () => {
    if (!newAct.date) return;

    setHealthActsDraft((prev) => {
      const next = [...prev, newAct];

      next.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      return next;
    });

    setNewAct((prev) => ({ ...prev, dateISO: '', isFirst: false }));
  };

  const removeHealthActAt = (index: number) => {
    setHealthActsDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const selectedSpeciesFromForm = formData.get('animalSpeciesSelector')?.toString();

    const otherSpeciesFromForm = formData.get('animalSpecies')?.toString().trim();

    const speciesToSave =
      selectedSpeciesFromForm === 'other'
        ? otherSpeciesFromForm || undefined
        : selectedSpeciesFromForm;

    const animalForm = {
      name: formData.get('animalName')?.toString().trim(),
      species: speciesToSave,
      birthDate: formData.get('animalBirthDate')?.toString().trim(),
      statusFromForm: formData.get('animalStatus')?.toString(),
      animalFamily: Number(formData.get('animalFamily')),
      adopterFullName: formData.get('adopterFullName')?.toString().trim(),
    };

    if (
      !animalForm.name ||
      !animalForm.species ||
      !animalForm.birthDate ||
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
        <div className={clsx(form === 'general' && 'active')} onClick={() => setForm('general')}>
          {t('animals.tabs.general')}
        </div>
        <div className={clsx(form === 'health' && 'active')} onClick={() => setForm('health')}>
          {t('animals.tabs.health')}
        </div>
        <div className={clsx(form === 'adopt' && 'active')} onClick={() => setForm('adopt')}>
          {t('animals.tabs.adoption')}
        </div>
      </div>
      <p className="notice" style={{ paddingTop: '5px' }}>
        {t('common.requiredFieldsNotice')}
      </p>
      <form onSubmit={handleSubmit}>
        <div hidden={form !== 'general'}>
          <div className="form-tab">
            <div className="species">
              <p>{t('animals.fields.speciesPlaceholder')}</p>
              <select
                name="animalSpeciesSelector"
                value={selectedSpecies}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSpecies(value);
                  if (value !== 'other') {
                    const input = document.querySelector(
                      'input[name="animalSpecies"]',
                    ) as HTMLInputElement | null;
                    if (input) input.value = '';
                  }
                }}
              >
                {t.raw('animals.commonSpecies').map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}

                <option value="other">{t('animals.otherSpecies')}</option>
              </select>
              <input
                type="text"
                name="animalSpecies"
                disabled={selectedSpecies !== 'other'}
                className={clsx(selectedSpecies !== 'other' && 'disabled')}
                placeholder={t('animals.setSpecies') + (selectedSpecies === 'other' ? ' *' : '')}
                defaultValue={selectedSpecies === 'other' ? animal?.species : ''}
              />
            </div>

            <div className="name-color">
              <input
                type="text"
                name="animalName"
                placeholder={t('animals.fields.namePlaceholder')}
                defaultValue={animal?.name}
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
              <input
                type="checkbox"
                name="animalIsNeutered"
                checked={isNeutered}
                onChange={(e) => setIsNeutered(e.target.checked)}
              />
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
                {status === 'FOSTERED' && ' *'} :
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
        <div hidden={form !== 'health'}>
          <div className="health-tab">
            <p>{t('animals.healthActsTitle')}</p>

            {/* LISTE des soins */}
            {healthActsDraft.length === 0 ? (
              <p className="no-health-data">{t('animals.healthActsNone')}</p>
            ) : (
              <ul className="acts-list">
                {healthActsDraft.map((act, index) => (
                  <li key={`${act.type}-${act.date}-${index}`}>
                    <span>{t(`animals.healthActTypes.${act.type}`)}</span>

                    <span>
                      <span>{displayDate(new Date(act.date))}</span>{' '}
                      {act.isFirst && (
                        <span style={{ opacity: 0.85 }}>({t('animals.healthActFirstShort')})</span>
                      )}
                    </span>

                    <button
                      className="action link"
                      type="button"
                      onClick={() => removeHealthActAt(index)}
                      aria-label={t('animals.removeHealthAct')}
                    >
                      <Trash2 style={{ transform: 'translateY(2px)' }} size={26} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* AJOUT inline */}
            <p>{t('animals.addHealthAct')}</p>
            <div className="add-act">
              <select
                value={newAct.type}
                onChange={(e) =>
                  setNewAct((prev) => ({ ...prev, type: e.target.value as AnimalHealthActType }))
                }
              >
                <option value="VACCINATION">{t('animals.healthActTypes.VACCINATION')}</option>
                <option value="DEWORM">{t('animals.healthActTypes.DEWORM')}</option>
                <option value="ANTIFLEA">{t('animals.healthActTypes.ANTIFLEA')}</option>
              </select>

              <label>
                {t('animals.healthActFirstPrompt')}
                <input
                  type="checkbox"
                  style={{ marginLeft: 10 }}
                  checked={newAct.isFirst}
                  onChange={(e) => setNewAct((prev) => ({ ...prev, isFirst: e.target.checked }))}
                />
              </label>

              <input
                type="date"
                value={newAct.date}
                onChange={(e) => setNewAct((prev) => ({ ...prev, date: e.target.value }))}
              />
              <button
                className="little-button"
                type="button"
                onClick={addHealthAct}
                disabled={!newAct.date}
                style={{ margin: 0, cursor: newAct.date ? 'pointer' : 'not-allowed' }}
              >
                {t('common.add')}
              </button>
            </div>

            {healthActsDraft.map(
              // hidden input for FormData + server actions
              (act, index) => (
                <div key={`hidden-${index}`} style={{ display: 'none' }}>
                  <input name="healthType[]" value={act.type} readOnly />
                  <input name="healthDate[]" value={act.date} readOnly />
                  <input name="healthIsFirst[]" value={act.isFirst ? '1' : '0'} readOnly />
                </div>
              ),
            )}

            <p>{t('animals.healthNotes')}</p>
            <textarea
              name="healthInformation"
              defaultValue={animal?.healthInformation ?? ''}
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
              placeholder={t('animals.fields.adopterFullNamePlaceholder')}
              defaultValue={animal?.adoption?.adopterFullName as string}
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
            <div className={'labeled-date' + clsx(isNeutered ? ' disabled' : '')}>
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
            <p>{t('animals.adoptionNotes')}</p>
            <textarea
              name="adoptInformation"
              defaultValue={animal?.adoption?.information ?? ''}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
          </div>
        </div>
        <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
          {isLoading ? t('common.loading') : t('common.submit')}
        </button>
      </form>
    </>
  );
};
