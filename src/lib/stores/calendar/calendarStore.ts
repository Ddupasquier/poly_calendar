import { EventTypesEnum, ViewTypesEnum } from '$lib/enums';
import type { EventTypesModel, ViewTypesModel } from '$lib/models';
import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { CalendarEvent } from './types';

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

// Store for the calendar events (initially empty) with explicit type annotation
export const calendarEvents: Writable<CalendarEvent[]> = writable<CalendarEvent[]>([]);

export const setCalendarEvents = (events: CalendarEvent[]): void => {
    calendarEvents.set(events);
}

// Derived store to filter events based on the selected filter type
// The return type of the derived store is explicitly stated for clarity
export const filteredEvents: Readable<CalendarEvent[]> = derived(
    [calendarEvents, filterType],
    ([$calendarEvents, $filterType]): CalendarEvent[] => {
        if ($filterType === EventTypesEnum.All) {
            return $calendarEvents;
        } else {
            return $calendarEvents.filter(event => event.type === $filterType);
        }
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
        default:
            return EventTypesEnum.All;
    }
}