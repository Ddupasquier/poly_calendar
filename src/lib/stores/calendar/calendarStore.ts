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

// Interfaces
interface CombinedDateObject {
    selectedDate: string;
    selectedWeekStart: Date;
    selectedMonth: number;
    selectedYear: number;
}

// ============================================================
// Helper functions
// ============================================================

/**
 * Gets the start date/time of an event.
 * @param {Object} event - An event object with dateTime and/or date properties.
 * @returns {Date} - The start date/time of the event.
 * @throws {Error} - If both dateTime and date are missing from the event.
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
 * Checks if an event object has a valid start and end time.
 * @param {Object} event - An event object.
 * @returns {boolean} - True if the event has a valid start and end time.
 * @throws {Error} - If the event has no start or end time.
*/
const isEventValid = (event: GoogleCalendarEventModel): boolean => {
    if (!event.start || !event.end) throw new Error('Event start or end time is missing');
    return !!(event.start && (event.start.dateTime || event.start.date) && event.end && (event.end.dateTime || event.end.date));
};

/**
 * Sorts events by start time.
 * @param {Object[]} events - An array of event objects.
 * @returns {Object[]} - The sorted array of event objects.
*/
const sortEventsByStartTime = (events: GoogleCalendarEventModel[]): GoogleCalendarEventModel[] => {
    return events.length ? events.sort((a, b) => getEventDateTime(a.start).getTime() - getEventDateTime(b.start).getTime()) : events;
};

/**
 * Updates a value in local storage.
 * @param {string} key - The key to update.
 * @param {any} value - The value to update.
*/
const updateLocalStorage = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

// ============================================================
// Store Initialization with Local Storage Integration
// ============================================================

/**
 * Attempts to retrieve the 'currentView' from localStorage.
 * Defaults to ViewTypesEnum.Month if not in browser or no value is stored.
 * @returns {ViewTypesEnum} - The current view.
*/
export const isCurrentViewLoading: Writable<boolean> = writable(false);
const initialCurrentView = (): ViewTypesEnum => {
    isCurrentViewLoading.set(true);

    if (browser) {
        const storedView = localStorage.getItem('currentView');
        return storedView ? JSON.parse(storedView) : ViewTypesEnum.Month;
    }

    isCurrentViewLoading.set(false);
    return ViewTypesEnum.Month;
};

/**
 * Attempts to retrieve the 'combinedDateObject' from localStorage.
 * Defaults to today's date if not in browser or no value is stored.
 * @returns {CombinedDateObject} - The combined date object.
*/
const initialCombinedDateObject = (): CombinedDateObject => {
    if (browser) {
        const storedObject = localStorage.getItem('combinedDateObject');
        if (storedObject) {
            const parsedObject = JSON.parse(storedObject);
            return {
                selectedDate: parseISO(parsedObject.selectedDate).toISOString().slice(0, 10),
                selectedWeekStart: parseISO(parsedObject.selectedWeekStart),
                selectedMonth: getMonth(parseISO(parsedObject.selectedDate)) + 1,
                selectedYear: getYear(parseISO(parsedObject.selectedDate))
            };
        }
    }

    const today = new Date();
    return {
        selectedDate: format(today, 'yyyy-MM-dd'),
        selectedWeekStart: startOfWeek(today, { weekStartsOn: 0 }),
        selectedMonth: getMonth(today) + 1,
        selectedYear: getYear(today)
    };
};

// ============================================================
// Svelte Writable Stores
// ============================================================

/**
 * Writable stores that can be updated from anywhere in the app.
 * They are used to store the current view, filter type, calendar events, and other values.
*/
export const combinedDateObject: Writable<CombinedDateObject> = writable(initialCombinedDateObject());
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

export const allFilteredEventsOccurringOnTheSelectedDate = derived(
    [filteredEvents, combinedDateObject],
    ([$filteredEvents, $combinedDateObject]) => {
        const selectedDateObject = new Date($combinedDateObject.selectedDate);
        return $filteredEvents.filter(event => {
            const startDateTime = getEventDateTime(event.start);
            const endDateTime = getEventDateTime(event.end);
            return isSameDay(startDateTime, selectedDateObject) || isSameDay(endDateTime, selectedDateObject);
        });
    }
);

export const allFilteredEventsOccurringInSelectedWeek: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, combinedDateObject],
    ([$filteredEvents, $combinedDateObject]) => {
        const weekStart = $combinedDateObject.selectedWeekStart;
        const weekEnd = endOfWeek(weekStart);
        return $filteredEvents.filter(event => {
            const startDate = getEventDateTime(event.start);
            const endDate = getEventDateTime(event.end);
            return (startDate >= weekStart && startDate <= weekEnd) || (endDate >= weekStart && endDate <= weekEnd);
        });
    }
);

export const allFilteredEventsOccurringInSelectedMonthYear: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, combinedDateObject],
    ([$filteredEvents, $combinedDateObject]) => {
        return $filteredEvents.filter(event => {
            const eventStartDate = getEventDateTime(event.start);
            return eventStartDate.getFullYear() === $combinedDateObject.selectedYear && eventStartDate.getMonth() + 1 === $combinedDateObject.selectedMonth;
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
    try {
        isLoadingEvents.set(true);
        let timeMin, timeMax;
        const combined = get(combinedDateObject);

        switch (get(currentView)) {
            case ViewTypesEnum.Month:
                timeMin = startOfMonth(new Date(combined.selectedYear, combined.selectedMonth - 1)).toISOString();
                timeMax = endOfMonth(new Date(combined.selectedYear, combined.selectedMonth - 1)).toISOString();
                break;
            case ViewTypesEnum.Week:
                const weekStart = new Date(combined.selectedWeekStart);
                const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
                timeMin = weekStart.toISOString();
                timeMax = weekEnd.toISOString();
                break;
            case ViewTypesEnum.Day:
                const selectedDay = new Date(combined.selectedDate);
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

        const eventsFromGoogle = await fetchGoogleCalendarEvents(timeMin, timeMax);
        calendarEvents.set(sortEventsByStartTime(eventsFromGoogle.filter(isEventValid)));
    } catch (error) {
        console.error("Error fetching Google Calendar events:", error);
    } finally {
        isLoadingEvents.set(false);
    }
};

const triggerFetchEvents = derived(
    [currentView, combinedDateObject],
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

/**
 * Subscribes to the combinedDateObject store and persists its value in local storage.
 * This ensures the user's date preference is saved across sessions.
 */
combinedDateObject.subscribe(value => {
    if (browser) {
        updateLocalStorage('combinedDateObject', value);
    }
});

// Setters for updating the stores
export const setCurrentView = (view: ViewTypesEnum): void => currentView.set(view);
export const setFilterType = (type: EventTypesModel): void => filterType.set(type);
export const setCalendarEvents = (events: GoogleCalendarEventModel[]): void => calendarEvents.set(sortEventsByStartTime(events));
export const setNumberOfRecordsShown = (numRecords: number): void => numberOfRecordsShown.set(numRecords);
export const setCombinedDate = (date: string, weekStart: Date, month: number, year: number): void => combinedDateObject.set({ selectedDate: date, selectedWeekStart: weekStart, selectedMonth: month, selectedYear: year });
export const setSelectedDate = (date: string): void => combinedDateObject.update(obj => ({ ...obj, selectedDate: date }));
export const setSelectedWeekStart = (weekStart: Date): void => combinedDateObject.update(obj => ({ ...obj, selectedWeekStart: weekStart }));
export const setSelectedMonth = (month: number): void => combinedDateObject.update(obj => ({ ...obj, selectedMonth: month }));
export const setSelectedYear = (year: number): void => combinedDateObject.update(obj => ({ ...obj, selectedYear: year }));
