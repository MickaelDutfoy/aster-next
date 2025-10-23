'use client';
import { joinOrg } from '@/actions/organizations/joinOrg';
import { getMatchingOrgs } from '@/lib/organizations/getMatchingOrgs';
import { Organization } from '@/lib/types';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const SearchOrg = () => {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(false);
  const [pickedOrg, setPickedOrg] = useState<number>(0);
  const [matchingOrgs, setMatchingOrgs] = useState<Organization[]>([]);
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

  const fillSearchField = (orgName: string) => {
    suppressFetch.current = true;
    setQuery(orgName);
    setMatchingOrgs([]);
  };

  const handleJoinOrg = async (pickedOrg: number) => {
    const res = await joinOrg(pickedOrg);
    showToast(res);
    if (res.ok) setQuery('');
  };

  return (
    <>
      <h3>Rechercher une association existante ?</h3>
      <form action={() => handleJoinOrg(pickedOrg)}>
        <input
          type="text"
          name="orgNameSearch"
          placeholder="Nom de l'association"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPicked(false);
            setPickedOrg(0);
          }}
        />
        <button
          className={`little-button ${clsx(!picked && 'disabled-button')}`}
          disabled={!picked}
        >
          Rejoindre
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
