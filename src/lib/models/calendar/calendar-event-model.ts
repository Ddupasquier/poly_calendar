// Define a base interface for common properties
export interface BaseEventModel {
    id: string;
    summary: string;
    created: string; // Google uses string for dates
    updated: string;
    description?: string;
    location?: string;
    start: EventDateTime;
    end: EventDateTime;
    eventType?: EventTypesModel;
}

// Specific to Google Calendar Event
export interface GoogleCalendarEventModel extends BaseEventModel {
    kind: string;
    etag: string;
    status: string;
    htmlLink: string;
    colorId?: string;
    creator: EventCreator;
    organizer: EventOrganizer;
    attendees?: Attendee[];
    // ... other properties specific to Google Calendar Event
}

export interface EventDateTime {
    date?: string;
    dateTime?: string;
    timeZone?: string;
}

// Define detailed properties for creators and organizers
export interface EventCreator {
    id?: string;
    email: string;
    displayName: string;
    self: boolean;
}

export interface EventOrganizer {
    id?: string;
    email: string;
    displayName: string;
    self: boolean;
}

// Define the Attendee structure
export interface Attendee {
    id?: string;
    email: string;
    displayName?: string;
    organizer?: boolean;
    self?: boolean;
    resource?: boolean;
    optional?: boolean;
    responseStatus?: "accepted" | "declined" | "tentative" | "needsAction";
    comment?: string;
    additionalGuests?: number;
}

// Define EventTypesModel based on your application's requirements
export type EventTypesModel = 'meeting' | 'appointment' | 'birthday' | 'date' | 'default';
