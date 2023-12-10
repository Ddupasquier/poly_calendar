import { EventTypesEnum, ViewTypesEnum } from '$lib/enums';
import type { EventTypesModel, ViewTypesModel } from '$lib/models';
import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { CalendarEventModel } from '$lib/models';
import { format } from 'date-fns';

// Use the enum for the initial value to ensure type safety
export const currentView: Writable<ViewTypesModel> = writable<ViewTypesModel>(ViewTypesEnum.Month);

// Update function with parameter type from enum
export const setCurrentView = (view: ViewTypesModel): void => {
    currentView.set(view);
};

// Use the enum for the initial value to ensure type safety
export const filterType: Writable<EventTypesModel> = writable<EventTypesModel>(EventTypesEnum.All);

// Update function with parameter type from enum
export const setFilterType = (type: EventTypesModel): void => {
    filterType.set(type);
};

// Store for the number of records to show (initially 25) with explicit type annotation
export const numberOfRecordsShown: Writable<number> = writable<number>(15);

export const setNumberOfRecordsShown = (numRecords: number): void => {
    numberOfRecordsShown.set(numRecords);
}

// Store for the calendar events (initially empty) with explicit type annotation
export const calendarEvents: Writable<CalendarEventModel[]> = writable<CalendarEventModel[]>([]);

export const setCalendarEvents = (events: CalendarEventModel[]): void => {
    calendarEvents.set(events);
}

// Derived store to filter events based on the selected filter type
// The return type of the derived store is explicitly stated for clarity
export const filteredEvents: Readable<CalendarEventModel[]> = derived(
    [calendarEvents, filterType],
    ([$calendarEvents, $filterType]): CalendarEventModel[] => {
        let events = $calendarEvents;

        if ($filterType !== EventTypesEnum.All) {
            events = events.filter(event => event.type === $filterType);
        }

        // Sort the events by startDate
        events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        return events;
    }
);

export const selectedDate: Writable<string> = writable<string>(format(new Date(), 'yyyy-MM-dd')); // default to today's local date

export const setSelectedDate = (date: string): void => {
    selectedDate.set(date);
}

export const allFilteredEventsOccuringOnTheSelectedDate: Readable<CalendarEventModel[]> = derived(
    [filteredEvents, selectedDate],
    ([$filteredEvents, $selectedDate]): CalendarEventModel[] => {
        return $filteredEvents.filter(event => {
            // Assuming startDate is a string in ISO format, we compare only the date part
            const eventDate = new Date(event.startDate).toISOString().split('T')[0];
            return eventDate === $selectedDate;
        });
    }
);

export const mapEventTypes = (eventType: string): EventTypesEnum => {
    switch (eventType) {
        case "meeting":
            return EventTypesEnum.Meeting;
        case "appointment":
            return EventTypesEnum.Appointment;
        case "birthday":
            return EventTypesEnum.Birthday;
        case "date":
            return EventTypesEnum.Date;
        default:
            return EventTypesEnum.All;
    }
}