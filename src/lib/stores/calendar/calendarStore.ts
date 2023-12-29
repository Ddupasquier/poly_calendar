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
    getYear,
    startOfDay
} from 'date-fns';
import type {
    GoogleCalendarEventModel,
    EventTypesModel
} from '$lib/models';
import {
    EventTypesEnum,
    SupportedProvidersEnum,
    ViewTypesEnum
} from '$lib/enums';
import {
    fetchEventsFromCalendar,
    fetchGoogleCalendarEvents
} from '$lib/services';
import { browser } from '$app/environment';

// Interfaces
interface CombinedDateObject {
    selectedDate: string;
    selectedWeekStart: Date;
    selectedMonth: number;
    selectedYear: number;
}

/**
 * Gets the date time of an event.
 * @param {Object} event - An event object.
 * @returns {Date} - The date time of the event.
 * @throws {Error} - If the event has no start or end time.
*/
const getEventDateTime = (event: { dateTime?: string; date?: string }): Date => {
    try {
        if (event.dateTime) {
            return new Date(event.dateTime);
        } else if (event.date) {
            return startOfDay(parseISO(event.date));
        }
        throw new Error('Both dateTime and date are missing from the event');
    } catch (error) {
        console.error("Error in getEventDateTime:", error);
        throw error;
    }
};

/**
 * Checks if an event object has a valid start and end time.
 * @param {Object} event - An event object.
 * @returns {boolean} - True if the event has a valid start and end time.
 * @throws {Error} - If the event has no start or end time.
*/
const isEventValid = (event: GoogleCalendarEventModel): boolean => {
    try {
        if (!event.start || !event.end) throw new Error('Event start or end time is missing');
        return !!(event.start && (event.start.dateTime || event.start.date) && event.end && (event.end.dateTime || event.end.date));
    } catch (error) {
        console.error("Error in isEventValid:", error);
        throw error;
    }
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

/**
 * Maps the default event type to the Google event type.
 * @param {EventTypesModel} eventType - The event type to map.
 * @returns {EventTypesModel} - The mapped event type.
*/
const mapDefaultToGoogle = (eventType: EventTypesModel): EventTypesModel => {
    return eventType === EventTypesEnum.Default ? 'google' : eventType;
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
    let storedObject = null;

    if (browser) {
        const storedValue = localStorage.getItem('combinedDateObject');
        if (storedValue) {
            storedObject = JSON.parse(storedValue);
            storedObject.selectedWeekStart = parseISO(storedObject.selectedWeekStart);
            storedObject.selectedDate = parseISO(storedObject.selectedDate).toISOString().slice(0, 10);
        }
    }

    const today = new Date();

    return {
        selectedDate: storedObject?.selectedDate ?? format(today, 'yyyy-MM-dd'),
        selectedWeekStart: storedObject?.selectedWeekStart ?? startOfWeek(today, { weekStartsOn: 0 }),
        selectedMonth: storedObject ? storedObject.selectedMonth : getMonth(today) + 1,
        selectedYear: storedObject ? storedObject.selectedYear : getYear(today)
    };
};

// ============================================================
// Svelte Writable Stores
// ============================================================
/**
 * Writable stores that can be updated from anywhere in the app.
 * They are used to store the current view, filter type, calendar events, and other values.
*/

export const currentUserProviders: Writable<string[]> = writable([]);
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
    ([$calendarEvents, $filterType]) => {
        if ($filterType === EventTypesEnum.All) {
            return $calendarEvents;
        }

        const mappedFilterType = mapDefaultToGoogle($filterType);
        return $calendarEvents.filter(event => mapDefaultToGoogle(event.eventType as EventTypesModel) === mappedFilterType);
    }
);

export const limitedEvents: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, numberOfRecordsShown],
    ([$filteredEvents, $numberOfRecordsShown]) => $filteredEvents.slice(0, $numberOfRecordsShown)
);

export const allFilteredEventsOccurringOnTheSelectedDate = derived(
    [filteredEvents, combinedDateObject],
    ([$filteredEvents, $combinedDateObject]) => {
        const selectedDateLocal = new Date($combinedDateObject.selectedDate + 'T00:00:00');
        const selectedDateObject = startOfDay(selectedDateLocal);
        const filtered = $filteredEvents.filter(event => {
            const startDateTime = getEventDateTime(event.start);
            const endDateTime = getEventDateTime(event.end);

            return isSameDay(startDateTime, selectedDateObject) || isSameDay(endDateTime, selectedDateObject);
        });

        return filtered;
    }
);

export const allFilteredEventsOccurringInSelectedWeek: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, combinedDateObject],
    ([$filteredEvents, $combinedDateObject]) => {
        const weekStart = $combinedDateObject.selectedWeekStart;
        const weekEnd = endOfWeek(weekStart);
        const filtered = $filteredEvents.filter(event => {
            const startDate = getEventDateTime(event.start);
            const endDate = getEventDateTime(event.end);
            return (startDate >= weekStart && startDate <= weekEnd) || (endDate >= weekStart && endDate <= weekEnd);
        });

        return filtered;
    }
);

export const allFilteredEventsOccurringInSelectedMonthYear: Readable<GoogleCalendarEventModel[]> = derived(
    [filteredEvents, combinedDateObject],
    ([$filteredEvents, $combinedDateObject]) => {
        const filtered = $filteredEvents.filter(event => {
            const eventStartDate = getEventDateTime(event.start);
            return eventStartDate.getFullYear() === $combinedDateObject.selectedYear && eventStartDate.getMonth() + 1 === $combinedDateObject.selectedMonth;
        });

        return filtered;
    }
);

// ============================================================
// Event Fetching Logic
// ============================================================

/**
 * Fetches events from Google Calendar and updates the calendarEvents store.
 * @throws {Error} - If the fetch fails.
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
                const selectedDay = new Date(combined.selectedDate + 'T00:00:00');
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

        if (Array.isArray(eventsFromGoogle)) {
            const validEvents = eventsFromGoogle.filter(isEventValid);

            const uniqueSummaries = new Set();

            const uniqueEvents = validEvents.filter(event => {
                const isDuplicate = uniqueSummaries.has(event.summary);
                uniqueSummaries.add(event.summary);
                return !isDuplicate;
            });

            const sortedEvents = sortEventsByStartTime(uniqueEvents);
            calendarEvents.set(sortedEvents);
        } else {
            calendarEvents.set([]);
        }

    } catch (error) {
        console.error("Error fetching Google Calendar events:", error);
    } finally {
        isLoadingEvents.set(false);
    }
};

/**
 * A derived store that triggers the fetchEvents function when its dependencies change.
 * This ensures that the calendarEvents store is updated whenever the view or date changes.
*/
const triggerFetchEvents = derived(
    [currentView, combinedDateObject],
    () => {
        if (browser) {
            fetchEvents();
        }
    }
);

/**
 * A subscription to the triggerFetchEvents store.
 * This ensures that the derived store runs when the app is loaded.
*/
setTimeout(() => {
    triggerFetchEvents.subscribe(() => {
        // This is intentionally left blank. The subscription is just to ensure the derived store runs.
    });
}, 0);

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

export const setCurrentUserProviders = (providers: string[]): void => {
    const supportedProviders = providers.filter(provider =>
        Object.values(SupportedProvidersEnum).includes(provider as SupportedProvidersEnum)
    );

    currentUserProviders.set(supportedProviders);
};

export const setSelectedDate = (date: string): void => combinedDateObject.update(obj => ({ ...obj, selectedDate: date }));

export const setSelectedWeekStart = (weekStart: Date): void => combinedDateObject.update(obj => ({ ...obj, selectedWeekStart: weekStart }));

export const setSelectedMonth = (month: number): void => combinedDateObject.update(obj => ({ ...obj, selectedMonth: month }));

export const setSelectedYear = (year: number): void => combinedDateObject.update(obj => ({ ...obj, selectedYear: year }));

export const setAllDatePartsToCurrent = (): void => {
    const today = new Date();
    combinedDateObject.set({
        selectedDate: format(today, 'yyyy-MM-dd'),
        selectedWeekStart: startOfWeek(today, { weekStartsOn: 0 }),
        selectedMonth: getMonth(today) + 1,
        selectedYear: getYear(today)
    });
};

export const emptyEventsOnLogout = (): void => {
    setCalendarEvents([]);
}