'use client';

import { Link, useRouter } from '@/i18n/routing';
import { Animal, Calendar, Family, Member, Organization } from '@/lib/types';
import { MemberRole } from '@prisma/client';
import clsx from 'clsx';
import {
  ArrowBigDown,
  ArrowBigUp,
  Grid2x2,
  List,
  MailOpen,
  Phone,
  SquareArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { AnimalDisplayCards } from '../animals/AnimalDisplayCards';
import { AnimalDisplayList } from '../animals/AnimalDisplayList';
import EventsCalendar from '../calendars/EventsCalendar';
import { ShareButton } from '../tools/ShareButton';

export const FamilyDetails = ({
  user,
  org,
  family,
  animals,
  calendar,
}: {
  user: Member;
  org: Organization;
  family: Family;
  animals: Animal[];
  calendar: Calendar | null;
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [sortMode, setSortMode] = useState<string | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'list' | 'cards' | null>(null);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  const isMemberOfFamily = family.members.some((member) => member.id === user.id);
  const canEditFamily =
    org.userRole === MemberRole.SUPERADMIN ||
    org.userRole === MemberRole.ADMIN ||
    isMemberOfFamily ||
    user.id === family.createdByMemberId;
  const canDeleteFamily = org.userRole === MemberRole.SUPERADMIN;
  const events = calendar?.events ?? [];

  const sortedAnimals = useMemo(() => {
    const direction = sortDesc ? -1 : 1;

    if (sortMode === 'name') {
      return animals.sort(
        (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) * direction,
      );
    }

    return animals.sort((a, b) => {
      if (!a.birthDate && !b.birthDate) return 0;
      if (!a.birthDate) return 1;
      if (!b.birthDate) return -1;

      return (b.birthDate.getTime() - a.birthDate.getTime()) * direction;
    });
  }, [animals, sortMode, displayMode, sortDesc]);

  useEffect(() => {
    const display = localStorage.getItem('preferredDisplayMode');
    const sort = localStorage.getItem('preferredSortMode');
    const sortDesc = localStorage.getItem('preferredSortDesc');

    if (display === 'list' || display === 'cards') {
      setDisplayMode(display);
    } else {
      setDisplayMode('list');
    }

    if (sort === 'name' || sort === 'age') {
      setSortMode(sort);
    } else {
      setSortMode('name');
    }

    setSortDesc(sortDesc === 'true');

    setPreferencesLoaded(true);
  }, []);

  const handleChangeDisplay = (mode: 'list' | 'cards') => {
    setDisplayMode(mode);
    localStorage.setItem('preferredDisplayMode', mode);
  };

  const handleChangeSort = (mode: string) => {
    setSortMode(mode);
    localStorage.setItem('preferredSortMode', mode);
  };

  const handleChangeSortOrder = () => {
    setSortDesc((prev) => {
      const next = !prev;
      localStorage.setItem('preferredSortDesc', String(next));
      return next;
    });
  };

  const handleSelectEvent = (eventId: number) => {
    router.push(`/families/${family.id}/edit-event/${eventId}`);
  };

  const handleCreateEvent = (date: string) => {
    router.push(`/families/${family.id}/add-event?date=${date}`);
  };

  if (!displayMode) return null;

  return (
    <>
      <div className="share-and-links-box">
        <ShareButton />
        <div>
          <button
            onClick={() => router.push(`/families/${family.id}/delete`)}
            className={'little-button' + clsx(!canDeleteFamily && ' disabled')}
          >
            {t('families.deleteTitle')}
          </button>
          <button
            onClick={() => router.push(`/families/${family.id}/edit`)}
            className={'little-button' + clsx(!canEditFamily && ' disabled')}
          >
            {t('families.editInfoTitle')}
          </button>
        </div>
      </div>

      <div className="family-page">
        <h3>{family.contactFullName}</h3>

        <div className="contact-display">
          {canEditFamily && (
            <address>
              <p>{family.address}</p>
              <p>
                {family.zip} {family.city}
              </p>
            </address>
          )}
          {canEditFamily && family.email && (
            <div className="contact-item">
              <MailOpen size={18} />
              <span>:</span>
              <a className="link" href={`mailto:${family.email}`}>
                {family.email}
              </a>
            </div>
          )}
          {canEditFamily && family.phoneNumber && (
            <div className="contact-item">
              <Phone size={18} />
              <span>:</span>
              <a className="link" href={`tel:${family.phoneNumber}`}>
                {family.phoneNumber}
              </a>
            </div>
          )}
        </div>

        <div className="text-with-link">
          <p>{isMemberOfFamily ? t('families.familyMember') : t('families.notFamilyMember')}</p>
          {canEditFamily && (
            <Link className="little-button" href={`/families/${family.id}/add-members`}>
              {t('families.manageMembers')}
            </Link>
          )}
        </div>
        {family.members.length === 0 ? (
          <p>{t('families.noMembers')}</p>
        ) : (
          <div className="family-members-list">
            <h4>{t('families.membersListTitle')}</h4>
            <ul>
              {family.members.map((member) => (
                <li key={member.id}>
                  <span>
                    {member.firstName} {member.lastName}
                  </span>
                  <Link className="action link" href={`/members/${member.id}`}>
                    <SquareArrowRight size={26} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {family.hasChildren && <p>{t('families.hasChildren')}</p>}

        {animals && animals.length > 0 && (
          <div>
            <h4>{t('families.animalsInCareLabel', { count: animals.length })}</h4>

            <div className="display-mode">
              <div className="sort">
                <p>{t('animals.sortLabel')}</p>
                <select onChange={(e) => handleChangeSort(e.target.value)}>
                  <option value="name">{t('animals.name')}</option>
                  <option value="age">{t('animals.age')}</option>
                </select>
                <button className="link" onClick={() => handleChangeSortOrder()}>
                  {sortDesc ? <ArrowBigDown size={26} /> : <ArrowBigUp size={26} />}
                </button>
              </div>
              <div className="display-mode-buttons">
                <button
                  className="display-button"
                  style={displayMode === 'cards' ? { opacity: 0.5 } : {}}
                  onClick={() => handleChangeDisplay('list')}
                >
                  <List size={26} />
                </button>
                <button
                  className="display-button"
                  style={displayMode === 'list' ? { opacity: 0.5 } : {}}
                  onClick={() => handleChangeDisplay('cards')}
                >
                  <Grid2x2 size={26} />
                </button>
              </div>
            </div>
            {displayMode === 'list' ? (
              <AnimalDisplayList animals={animals} />
            ) : (
              <AnimalDisplayCards animals={animals} />
            )}
          </div>
        )}

        <h4>{t('calendars.family.title')}</h4>
        {(!calendar || calendar?.events.length === 0) && (
          <div className="text-with-link">
            <p>{t('calendars.family.noCalendar')}</p>

            {canEditFamily && family.members.length > 0 && (
              <Link className="little-button" href={`/families/${family.id}/add-event`}>
                {t('calendars.family.addEvent')}
              </Link>
            )}
          </div>
        )}
        {events.length > 0 && (
          <EventsCalendar
            events={events}
            onSelectEvent={handleSelectEvent}
            onCreateEvent={handleCreateEvent}
          />
        )}

        {family.otherAnimals && (
          <>
            <h4>{t('families.otherAnimalsLabel')}</h4>
            <p className="family-animals">{family.otherAnimals}</p>
          </>
        )}
        {family.notes && (
          <>
            <h4>{t('families.notesLabel')}</h4>
            <p className="family-animals">{family.notes}</p>
          </>
        )}
      </div>
    </>
  );
};
