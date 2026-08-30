'use client';

import { Event } from '@/lib/types';
import { createViewMonthAgenda, createViewMonthGrid } from '@schedule-x/calendar';
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react';
import '@schedule-x/theme-default/dist/index.css';
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { Temporal } from 'temporal-polyfill';
import 'temporal-polyfill/global';
import { useTheme } from '../tools/ThemeProvider';

const scheduleLocales: Record<string, string> = {
  fr: 'fr-FR',
  nb: 'nb-NO',
  en: 'en-GB',
};

const EventsCalendar = ({
  events,
  onSelectEvent,
  onCreateEvent,
}: {
  events: Event[];
  onSelectEvent: (eventId: number) => void;
  onCreateEvent: (date: string) => void;
}) => {
  const { isDark } = useTheme();
  const t = useTranslations();
  const locale = useLocale();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [eventsService] = useState(() => createEventsServicePlugin());
  const [calendarControls] = useState(() => createCalendarControlsPlugin());
  const [displayedDate, setDisplayedDate] = useState(() => Temporal.Now.plainDateISO(timeZone));

  const scheduleEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description ?? undefined,

        people: event.participants.map((participant) =>
          [participant.firstName, participant.lastName].filter(Boolean).join(' '),
        ),

        start: Temporal.Instant.fromEpochMilliseconds(event.startsAt.getTime()).toZonedDateTimeISO(
          timeZone,
        ),

        end: Temporal.Instant.fromEpochMilliseconds(event.endsAt.getTime()).toZonedDateTimeISO(
          timeZone,
        ),
      })),
    [events, timeZone],
  );

  const calendarApp = useNextCalendarApp({
    locale: scheduleLocales[locale] ?? 'en-GB',
    timezone: timeZone,
    isDark,

    views: [createViewMonthGrid(), createViewMonthAgenda()],

    events: scheduleEvents,
    plugins: [eventsService, calendarControls],
    callbacks: {
      onEventClick(calendarEvent) {
        onSelectEvent(Number(calendarEvent.id));
      },

      onSelectedDateUpdate(date) {
        setDisplayedDate(date);
      },
    },
  });

  useEffect(() => {
    calendarApp?.setTheme(isDark ? 'dark' : 'light');
  }, [calendarApp, isDark]);

  useEffect(() => {
    eventsService.set(scheduleEvents);
  }, [eventsService, scheduleEvents]);

  const changeMonth = (offset: number) => {
    const newDate = displayedDate.with({ day: 1 }).add({ months: offset });

    calendarControls.setDate(newDate);
    setDisplayedDate(newDate);
  };

  return (
    <div className="event-calendar">
      <div className="event-calendar-navigation">
        <button className="arrow link" type="button" onClick={() => changeMonth(-1)}>
          <CircleArrowLeft size={26} />
        </button>

        <p>
          {displayedDate.toLocaleString(scheduleLocales[locale] ?? 'en-GB', {
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <button className="arrow link" type="button" onClick={() => changeMonth(1)}>
          <CircleArrowRight size={26} />
        </button>
      </div>

      <ScheduleXCalendar calendarApp={calendarApp} />
      <div className="event-calendar-navigation">
        <button className="little-button" onClick={() => onCreateEvent(displayedDate.toString())}>
          {t('calendars.family.addEvent')}
        </button>
      </div>
    </div>
  );
};

export default EventsCalendar;
