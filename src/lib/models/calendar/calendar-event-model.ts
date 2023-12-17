// Base interface for common event properties
export interface BaseEventModel {
    id: string;
    summary: string;
    created: Date;
    updated: Date;
    description?: string;
    location?: string;
    start: {
        date?: Date;
        dateTime?: Date;
        timeZone?: string;
    };
    end: {
        date?: Date;
        dateTime?: Date;
        timeZone?: string;
    };
}

// Interface for Google Calendar events
export interface GoogleCalendarEventModel extends BaseEventModel {
    kind: string;
    etag: string;
    status: string;
    htmlLink: string;
    colorId?: string;
    creator: {
        id?: string;
        email: string;
        displayName: string;
        self: boolean;
    };
    organizer: {
        id?: string;
        email: string;
        displayName: string;
        self: boolean;
    };
    endTimeUnspecified?: boolean;
    recurrence?: string[];
    recurringEventId?: string;
    originalStartTime?: {
        date?: Date;
        dateTime?: Date;
        timeZone?: string;
    };
    transparency?: string;
    visibility?: string;
    iCalUID: string;
    sequence: number;
    attendees?: Array<{
        id?: string;
        email: string;
        displayName?: string;
        organizer?: boolean;
        self?: boolean;
        resource?: boolean;
        optional?: boolean;
        responseStatus?: string;
        comment?: string;
        additionalGuests?: number;
    }>;
    // ... Add any other specific properties of GoogleCalendarEventModel ...
}

// Interface for your application's calendar events
export interface CalendarEventModel extends BaseEventModel {
    type: EventTypesModel;
    isAllDay?: boolean;
    isRecurring?: boolean;
    recurrence?: string;
    attendees?: Attendee[];
    // ... Add any other specific properties of CalendarEventModel ...
}

// EventTypesModel as per your application's requirements
export type EventTypesModel = "all" | "meeting" | "appointment" | "birthday" | "date" | "default";

// Attendee as per your application's requirements
export interface Attendee {
    name: string;
    email: string;
    rsvp: boolean;
    rsvpDate: Date;
    rsvpResponse: string;
}
