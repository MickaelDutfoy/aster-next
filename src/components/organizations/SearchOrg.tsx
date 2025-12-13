'use client';
import { joinOrg } from '@/actions/organizations/joinOrg';
import { getMatchingOrgs } from '@/lib/organizations/getMatchingOrgs';
import { Organization } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const SearchOrg = () => {
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(false);
  const [pickedOrg, setPickedOrg] = useState<number>(0);
  const [matchingOrgs, setMatchingOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const suppressFetch = useRef(false);

  useEffect(() => {
    if (suppressFetch.current) {
      suppressFetch.current = false;
      return;
    }

    const req = setTimeout(async () => {
      if (query.trim().length < 3) {
        setMatchingOrgs([]);
        return;
      }

      const orgs = await getMatchingOrgs(query.trim());
      setMatchingOrgs(orgs);
    }, 250);

    return () => clearTimeout(req);
  }, [query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pickedOrg) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.mustPickOrg'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await joinOrg(pickedOrg);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
    } catch (err) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillSearchField = (orgName: string) => {
    suppressFetch.current = true;
    setQuery(orgName);
    setMatchingOrgs([]);
  };

  return (
    <>
      <h3>{t('organizations.searchExistingTitle')}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="orgNameSearch"
          placeholder={t('organizations.orgNamePlaceholder')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPicked(false);
            setPickedOrg(0);
          }}
        />
        <button
          type="submit"
          className="little-button"
          aria-busy={!picked || isLoading}
          disabled={!picked || isLoading}
        >
          {isLoading ? t('organizations.joinLoading') : t('organizations.joinSubmit')}
        </button>
      </form>
      <div className="org-results">
        <ul>
          {matchingOrgs?.map((org) => (
            <li
              key={org.id}
              onClick={() => {
                fillSearchField(org.name);
                setPicked(true);
                setPickedOrg(org.id);
              }}
            >
              {org.name} {org.superAdmin && <span>({org.superAdmin})</span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
