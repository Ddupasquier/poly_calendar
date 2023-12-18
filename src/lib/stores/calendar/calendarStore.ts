import { EventTypesEnum, ViewTypesEnum } from '$lib/enums';
import type { EventTypesModel } from '$lib/models';
import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { GoogleCalendarEventModel } from '$lib/models';
import { endOfWeek, format, getMonth, getYear, isWithinInterval, startOfWeek } from 'date-fns';
import { browser } from '$app/environment';

const updateLocalStorage = (view: string) => {
    localStorage.setItem('currentView', view);
};

export const currentView: Writable<ViewTypesEnum> = writable<ViewTypesEnum>(
    ViewTypesEnum.Month
);

if (browser) {
    const storedView = localStorage.getItem('currentView');
    if (storedView) {
        currentView.set(storedView as ViewTypesEnum);
    }

    currentView.subscribe((value) => {
        updateLocalStorage(value);
    });
}

export const setCurrentView = (view: ViewTypesEnum): void => {
    currentView.set(view);
};

export const filterType: Writable<EventTypesModel> = writable<EventTypesModel>(EventTypesEnum.All);
export const setFilterType = (type: EventTypesModel): void => {
    filterType.set(type);
};

export const calendarEvents: Writable<GoogleCalendarEventModel[]> = writable<GoogleCalendarEventModel[]>([]);
export const setCalendarEvents = (events: GoogleCalendarEventModel[]): void => {
    calendarEvents.set(events);
}

export const filteredEvents: Readable<GoogleCalendarEventModel[]> = derived(
    [calendarEvents, filterType],
    ([$calendarEvents, $filterType]): GoogleCalendarEventModel[] => {
        let events = $calendarEvents;

        if ($filterType !== EventTypesEnum.All) {
            events = events.filter(event => event.eventType === $filterType);
        }

        events.sort((a, b) => {
            const aStartTime = a.start.dateTime ? new Date(a.start.dateTime).getTime() : (a.start.date ? new Date(a.start.date).getTime() : 0);
            const bStartTime = b.start.dateTime ? new Date(b.start.dateTime).getTime() : (b.start.date ? new Date(b.start.date).getTime() : 0);
            return aStartTime - bStartTime;
        });

        return events;
    }
);

export const numberOfRecordsShown: Writable<number> = writable<number>(15);
export const setNumberOfRecordsShown = (numRecords: number): void => {
    numberOfRecordsShown.set(numRecords);
}

export const limitedEvents: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, numberOfRecordsShown],
    ([$filteredEvents, $numberOfRecordsShown]) => {
        return $filteredEvents.slice(0, $numberOfRecordsShown);
    }
);

export const selectedDate: Writable<string> = writable<string>(format(new Date(), 'yyyy-MM-dd'));
export const setSelectedDate = (date: string): void => {
    selectedDate.set(date);
}

export const allFilteredEventsOccuringOnTheSelectedDate: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, selectedDate],
    ([$filteredEvents, $selectedDate]): GoogleCalendarEventModel[] => {
        return $filteredEvents.filter(event => {
            const eventDate = event.start.dateTime
            return eventDate === $selectedDate;
        });
    }
);

export const selectedWeekStart: Writable<Date> = writable(startOfWeek(new Date(), { weekStartsOn: 0 }));
export const setSelectedWeekStart = (date: Date): void => {
    selectedWeekStart.set(startOfWeek(date, { weekStartsOn: 0 }));
};

export const allFilteredEventsOccurringInSelectedWeek: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, selectedWeekStart],
    ([$filteredEvents, $selectedWeekStart]): GoogleCalendarEventModel[] => {
        const weekStart = $selectedWeekStart;
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

        return $filteredEvents.filter(event => {
            if (!event.start.dateTime || !event.end.dateTime) {
                console.log(`Skipping event due to no start.dateTime: ${event.summary}`);
                return false;
            }

            const startDate = new Date(event.start.dateTime);
            const endDate = new Date(event.end.dateTime)
            const startsBeforeWeekStarts = startDate <= weekStart && endDate >= weekStart;
            const endsAfterWeekEnds = startDate <= weekEnd && endDate >= weekEnd;
            const isWithinTheWeek = startDate >= weekStart && endDate <= weekEnd;

            return startsBeforeWeekStarts || endsAfterWeekEnds || isWithinTheWeek;
        });
    }
);

export const selectedMonth: Writable<number> = writable(getMonth(new Date()) + 1);
export const setSelectedMonth = (month: number): void => {
    selectedMonth.set(month);
};

export const selectedYear: Writable<number> = writable(getYear(new Date()));
export const setSelectedYear = (year: number): void => {
    selectedYear.set(year);
};

export const allFilteredEventsOccurringInSelectedMonthYear: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, selectedMonth, selectedYear],
    ([$filteredEvents, $selectedMonth, $selectedYear]) => {

        const filteredEventsForSelectedMonthYear = $filteredEvents.filter(event => {
            if (!event.start.dateTime) {
                console.log(`Skipping event due to no start.dateTime: ${event.summary}`);
                return false;
            }

            const eventDate = new Date(event.start.dateTime);
            const eventYear = eventDate.getFullYear();
            const eventMonth = eventDate.getMonth() + 1;
            const matches = eventYear === $selectedYear && eventMonth === $selectedMonth;

            return matches;
        });

        return filteredEventsForSelectedMonthYear;
    }
);
