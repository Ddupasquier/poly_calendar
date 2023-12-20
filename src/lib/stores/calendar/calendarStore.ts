// Svelte stores and helper imports
import {
    writable,
    derived,
    get
} from 'svelte/store';
import type {
    Writable,
    Readable
} from 'svelte/store';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    endOfDay,
    addMonths,
    subWeeks,
    parseISO,
    format,
    isSameDay,
    getMonth,
    getYear
} from 'date-fns';
import type {
    GoogleCalendarEventModel,
    EventTypesModel
} from '$lib/models';
import {
    EventTypesEnum,
    ViewTypesEnum
} from '$lib/enums';
import { fetchGoogleCalendarEvents } from '$lib/services';
import { browser } from '$app/environment';

// ============================================================
// Helper functions
// ============================================================

/**
 * Converts event dates to JavaScript Date objects.
 * Prefers `dateTime` over `date` if both are provided.
 * @param {Object} event - An event object with dateTime and/or date properties.
 * @returns {Date} - A JavaScript Date object for the event time.
 * @throws {Error} - If both dateTime and date are missing.
 */
const getEventDateTime = (event: { dateTime?: string; date?: string }): Date => {
    if (event.dateTime) {
        return new Date(event.dateTime);
    } else if (event.date) {
        return new Date(event.date);
    }
    throw new Error('Both dateTime and date are missing from the event');
};

/** 
 * Checks if an event has valid start and end times/dates.
 * @param {Object} event - An event object with dateTime and/or date properties.
 * @returns {boolean} - True if the event has valid start and end times/dates, false otherwise.
*/
const isEventValid = (event: GoogleCalendarEventModel): boolean => {
    if (!event.start) {
        throw new Error('Event start time is missing');
    }

    if (!event.end) {
        throw new Error('Event end time is missing');
    }

    return !!(
        (event.start && (event.start.dateTime || event.start.date)) &&
        (event.end && (event.end.dateTime || event.end.date))
    );
};

/**
 * Sorts events by start time.
 * @param {Object[]} events - An array of event objects.
 * @returns {Object[]} - The sorted array of event objects.
 */
const sortEventsByStartTime = (events: GoogleCalendarEventModel[]): GoogleCalendarEventModel[] => {
    if (!events.length) return events;

    return events.sort((a, b) => getEventDateTime(a.start).getTime() - getEventDateTime(b.start).getTime());
};

/** 
 * Updates a value in localStorage.
 * @param {string} key - The key to update in localStorage.
 * @param {any} value - The value to store in localStorage.
 * @returns {void}
*/
const updateLocalStorage = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

// ============================================================
// Store Initialization with Local Storage Integration
// ============================================================

export const isCurrentViewLoading: Writable<boolean> = writable(false);

/**
 * Attempts to retrieve the 'currentView' from localStorage.
 * Defaults to 'Month' view if not in browser or no value is stored.
 * @returns {ViewTypesEnum} - The current view type.
 */
const initialCurrentView = (): ViewTypesEnum => {
    isCurrentViewLoading.set(true);

    if (browser) {
        const storedView = localStorage.getItem('currentView');
        return storedView ? JSON.parse(storedView) : ViewTypesEnum.Month;
    }

    isCurrentViewLoading.set(false);
    return ViewTypesEnum.Month;
};

// ============================================================
// Svelte Writable Stores
// ============================================================

/**
 * Writable stores that can be updated from anywhere in the app.
 * They are used to store the current view, filter type, calendar events, and other values.
 */
export const selectedDate: Writable<string> = writable(format(new Date(), 'yyyy-MM-dd'));
export const selectedWeekStart: Writable<Date> = writable(startOfWeek(new Date(), { weekStartsOn: 0 }));
export const selectedMonth: Writable<number> = writable(getMonth(new Date()) + 1);
export const selectedYear: Writable<number> = writable(getYear(new Date()));
export const currentView: Writable<ViewTypesEnum> = writable<ViewTypesEnum>(initialCurrentView());
export const filterType: Writable<EventTypesModel> = writable<EventTypesModel>(EventTypesEnum.All);
export const calendarEvents: Writable<GoogleCalendarEventModel[]> = writable([]);
export const numberOfRecordsShown: Writable<number> = writable(15);
export const isLoadingEvents: Writable<boolean> = writable(false);

// ============================================================
// Svelte Derived Stores
// ============================================================

/**
 * Derived stores that compute values based on the writable stores.
 * They help in filtering events based on different criteria like dates and event types.
 */
export const filteredEvents: Readable<GoogleCalendarEventModel[]> = derived(
    [calendarEvents, filterType],
    ([$calendarEvents, $filterType]) => $filterType === EventTypesEnum.All ? $calendarEvents : $calendarEvents.filter(event => event.eventType === $filterType)
);

export const limitedEvents: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, numberOfRecordsShown],
    ([$filteredEvents, $numberOfRecordsShown]) => $filteredEvents.slice(0, $numberOfRecordsShown)
);

export const allFilteredEventsOccurringOnTheSelectedDate: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, selectedDate],
    ([$filteredEvents, $selectedDate]) => {
        const selectedDateObject = parseISO($selectedDate);
        return $filteredEvents.filter(event => {
            const startDateTime = getEventDateTime(event.start);
            const endDateTime = getEventDateTime(event.end);
            return isSameDay(startDateTime, selectedDateObject) || isSameDay(endDateTime, selectedDateObject);
        });
    }
);

export const allFilteredEventsOccurringInSelectedWeek: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, selectedWeekStart],
    ([$filteredEvents, $selectedWeekStart]) => {
        const weekStart = $selectedWeekStart;
        const weekEnd = endOfWeek(weekStart);
        return $filteredEvents.filter(event => {
            const startDate = getEventDateTime(event.start);
            const endDate = getEventDateTime(event.end);
            return (startDate >= weekStart && startDate <= weekEnd) || (endDate >= weekStart && endDate <= weekEnd);
        });
    }
);

export const allFilteredEventsOccurringInSelectedMonthYear: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, selectedMonth, selectedYear],
    ([$filteredEvents, $selectedMonth, $selectedYear]) => {
        return $filteredEvents.filter(event => {
            const eventStartDate = getEventDateTime(event.start);
            return eventStartDate.getFullYear() === $selectedYear && eventStartDate.getMonth() + 1 === $selectedMonth;
        });
    }
);

// ============================================================
// Event Fetching Logic
// ============================================================

/**
 * Fetches events from Google Calendar based on the current view.
 * It uses the currentView store to decide the time range for fetching events.
 */
export const fetchEvents = async (): Promise<void> => {
    isLoadingEvents.set(true);
    let timeMin, timeMax;

    switch (get(currentView)) {
        case ViewTypesEnum.Month:
            timeMin = startOfMonth(new Date(get(selectedYear), get(selectedMonth) - 1)).toISOString();
            timeMax = endOfMonth(new Date(get(selectedYear), get(selectedMonth) - 1)).toISOString();
            break;
        case ViewTypesEnum.Week:
            const weekStart = get(selectedWeekStart);
            const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
            timeMin = weekStart.toISOString();
            timeMax = weekEnd.toISOString();
            break;
        case ViewTypesEnum.Day:
            const selectedDay = parseISO(get(selectedDate));
            timeMin = selectedDay.toISOString();
            timeMax = endOfDay(selectedDay).toISOString();
            break;
        case ViewTypesEnum.Agenda:
            const now = new Date();
            const oneWeekAgo = subWeeks(now, 1);
            const threeMonthsLater = addMonths(now, 3);
            timeMin = oneWeekAgo.toISOString();
            timeMax = threeMonthsLater.toISOString();
            break;
    }

    try {
        const eventsFromGoogle = await fetchGoogleCalendarEvents(timeMin, timeMax) ?? [];
        const validEvents = eventsFromGoogle.filter(isEventValid);
        setCalendarEvents(sortEventsByStartTime(validEvents));
    } catch (error) {
        console.error("Error when fetching Google Calendar events:", error);
    } finally {
        isLoadingEvents.set(false);
    }
};

const triggerFetchEvents = derived(
    [currentView, selectedMonth, selectedYear, selectedWeekStart, selectedDate],
    () => {
        if (browser) {
            fetchEvents();
        }
    }
);

triggerFetchEvents.subscribe(() => {
    // This is intentionally left blank. The subscription is just to ensure the derived store runs.
});

// ============================================================
// Local Storage Persistence and Setters
// ============================================================

/**
 * Subscribes to the currentView store and persists its value in local storage.
 * This ensures the user's view preference is saved across sessions.
 */
currentView.subscribe(value => {
    if (browser) {
        updateLocalStorage('currentView', value);
    }
});

// Setters for updating the stores
export const setCurrentView = (view: ViewTypesEnum): void => currentView.set(view);
export const setFilterType = (type: EventTypesModel): void => filterType.set(type);
export const setCalendarEvents = (events: GoogleCalendarEventModel[]): void => calendarEvents.set(sortEventsByStartTime(events));
export const setNumberOfRecordsShown = (numRecords: number): void => numberOfRecordsShown.set(numRecords);
export const setSelectedDate = (date: string): void => selectedDate.set(date);
export const setSelectedWeekStart = (date: Date): void => selectedWeekStart.set(startOfWeek(date, { weekStartsOn: 0 }));
export const setSelectedMonth = (month: number): void => selectedMonth.set(month);
export const setSelectedYear = (year: number): void => selectedYear.set(year);