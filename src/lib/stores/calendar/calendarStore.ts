import { EventTypesEnum, ViewTypesEnum } from '$lib/enums';
import type { EventTypesModel } from '$lib/models';
import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { CalendarEventModel } from '$lib/models';
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

export const calendarEvents: Writable<CalendarEventModel[]> = writable<CalendarEventModel[]>([]);
export const setCalendarEvents = (events: CalendarEventModel[]): void => {
    calendarEvents.set(events);
}

export const filteredEvents: Readable<CalendarEventModel[]> = derived(
    [calendarEvents, filterType],
    ([$calendarEvents, $filterType]): CalendarEventModel[] => {
        let events = $calendarEvents;

        if ($filterType !== EventTypesEnum.All) {
            events = events.filter(event => event.type === $filterType);
        }

        events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        return events;
    }
);

export const numberOfRecordsShown: Writable<number> = writable<number>(15);
export const setNumberOfRecordsShown = (numRecords: number): void => {
    numberOfRecordsShown.set(numRecords);
}

export const limitedEvents: Readable<CalendarEventModel[]> = derived(
    [filteredEvents, numberOfRecordsShown],
    ([$filteredEvents, $numberOfRecordsShown]) => {
        return $filteredEvents.slice(0, $numberOfRecordsShown);
    }
);

export const selectedDate: Writable<string> = writable<string>(format(new Date(), 'yyyy-MM-dd'));
export const setSelectedDate = (date: string): void => {
    selectedDate.set(date);
}

export const allFilteredEventsOccuringOnTheSelectedDate: Readable<CalendarEventModel[]> = derived(
    [filteredEvents, selectedDate],
    ([$filteredEvents, $selectedDate]): CalendarEventModel[] => {
        return $filteredEvents.filter(event => {
            const eventDate = new Date(event.startDate).toISOString().split('T')[0];
            return eventDate === $selectedDate;
        });
    }
);

export const selectedWeekStart: Writable<Date> = writable(new Date());
export const setSelectedWeekStart = (date: Date): void => {
    selectedWeekStart.set(startOfWeek(date, { weekStartsOn: 0 }));
};

export const allFilteredEventsOccurringInSelectedWeek: Readable<CalendarEventModel[]> = derived(
    [filteredEvents, selectedWeekStart],
    ([$filteredEvents, $selectedWeekStart]): CalendarEventModel[] => {
        const weekStart = $selectedWeekStart;
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

        return $filteredEvents.filter(event => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            return isWithinInterval(startDate, { start: weekStart, end: weekEnd }) ||
                isWithinInterval(endDate, { start: weekStart, end: weekEnd });
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

export const allFilteredEventsOccurringInSelectedMonthYear: Readable<CalendarEventModel[]> = derived(
    [filteredEvents, selectedMonth, selectedYear],
    ([$filteredEvents, $selectedMonth, $selectedYear]) => {
        return $filteredEvents.filter(event => {
            return getYear(event.startDate) === $selectedYear && (getMonth(event.startDate) + 1) === $selectedMonth;
        });
    }
);