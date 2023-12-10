import type { EventTypesModel } from '$lib/models';

export interface Attendee {
    name: string;
    email: string;
    rsvp: boolean;
    rsvpDate: Date;
    rsvpResponse: string;
}

export interface CalendarEventModel {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    type: EventTypesModel;
    description?: string;
    location?: string;
    isAllDay?: boolean;
    isRecurring?: boolean;
    recurrence?: string;
    attendees?: Attendee[];
}