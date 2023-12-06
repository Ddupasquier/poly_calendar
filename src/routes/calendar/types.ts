export interface Attendee {
    name: string;
    email: string;
    rsvp: boolean;
    rsvpDate: Date;
    rsvpResponse: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    type: string;
    description?: string;
    location?: string;
    isAllDay?: boolean;
    isRecurring?: boolean;
    recurrence?: string;
    attendees?: Attendee[];
}