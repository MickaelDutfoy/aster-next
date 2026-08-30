'use client';

import { createFamilyEvent } from '@/actions/calendars/createFamilyEvent';
import { deleteFamilyEvent } from '@/actions/calendars/deleteFamilyEvent';
import { updateFamilyEvent } from '@/actions/calendars/updateFamilyEvent';
import { useRouter } from '@/i18n/routing';
import { Event, Family, Member } from '@/lib/types';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Temporal } from 'temporal-polyfill';
import { showToast } from '../tools/ToastProvider';

export const ManageFamilyCalendar = ({
  event,
  date,
  user,
  family,
  canAssignMembers,
}: {
  event?: Event;
  date?: string;
  user: Member;
  family: Family;
  canAssignMembers: boolean;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const creationDate = date ?? new Date().toISOString().slice(0, 10);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [eventTimeZone, setEventTimeZone] = useState('');

  useEffect(() => {
    setEventTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const padTimePart = (value: number) => String(value).padStart(2, '0');

  const getFormDateTime = (date: Date, timeZone: string) => {
    const zonedDateTime = Temporal.Instant.from(date.toISOString()).toZonedDateTimeISO(timeZone);

    return {
      date: zonedDateTime.toPlainDate().toString(),
      time: `${padTimePart(zonedDateTime.hour)}:${padTimePart(zonedDateTime.minute)}`,
    };
  };

  const startValues =
    event && eventTimeZone ? getFormDateTime(event.startsAt, eventTimeZone) : null;

  const endValues = event && eventTimeZone ? getFormDateTime(event.endsAt, eventTimeZone) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsLoading(true);

    try {
      const res = event
        ? await updateFamilyEvent(event.id, formData)
        : await createFamilyEvent(family.id, formData);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      if (res.ok) router.back();
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

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      if (!event) {
        showToast({
          ok: false,
          status: 'error',
          message: t('toasts.errorGeneric'),
        });
        return;
      }

      const res = await deleteFamilyEvent(event.id);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      if (res.ok) router.back();
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!eventTimeZone) return null;

  return (
    <>
      <form className="families-member-manage" onSubmit={handleSubmit}>
        {!event ? (
          <h3>{t('calendars.family.addEvent')}</h3>
        ) : (
          <h3>{t('calendars.family.editEvent')}</h3>
        )}
        <div className="labeled-checkbox">
          <p>{t('organizations.pickAMember')}</p>
          <select
            name="memberId"
            className={clsx(!canAssignMembers && 'disabled')}
            defaultValue={user.id}
          >
            {family.members
              .sort((a, b) =>
                a.firstName.localeCompare(b.firstName, undefined, {
                  sensitivity: 'base',
                }),
              )
              .map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >{`${member.firstName} ${member.lastName}`}</option>
              ))}
          </select>
        </div>

        <div className="event-date-time-layout">
          <div className="date-time event-start">
            <p>{t('calendars.family.eventStart')}</p>
            <input
              type="date"
              name="eventStartDate"
              defaultValue={startValues?.date ?? creationDate}
            />
            <input type="time" name="eventStartTime" defaultValue={startValues?.time} />
          </div>
          <div className="date-time event-end">
            <p>{t('calendars.family.eventEnd')}</p>
            <input type="date" name="eventEndDate" defaultValue={endValues?.date ?? creationDate} />
            <input type="time" name="eventEndTime" defaultValue={endValues?.time} />
          </div>
        </div>

        <div className="labeled-text">
          <p>{t('calendars.family.remarks')}</p>
          <input type="text" name="eventNotes" />
        </div>
        <input type="hidden" name="eventTimeZone" value={eventTimeZone} />
        <div className="yes-no">
          <button
            type="submit"
            className="little-button"
            aria-busy={isLoading || isDeleting}
            disabled={isLoading || isDeleting}
          >
            {isLoading ? t('common.loading') : t('common.confirm')}
          </button>
          <button
            type="button"
            className="little-button"
            onClick={() => router.back()}
            aria-busy={isLoading || isDeleting}
            disabled={isLoading || isDeleting}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
      {event && (
        <div className="family-event-delete">
          <div className="text-with-link">
            <p>{t('calendars.family.deletePrompt')}</p>
            <button
              className="little-button"
              onClick={handleDelete}
              aria-busy={isLoading || isDeleting}
              disabled={isLoading || isDeleting}
            >
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </button>
          </div>
          <p className="notice">{t('common.actionWarning')}</p>
        </div>
      )}
    </>
  );
};
