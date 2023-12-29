export interface GoogleCalendarEventModel {
    kind: string;
    etag: string;
    id: string;
    status: string;
    htmlLink: string;
    created: string; // datetime
    updated: string; // datetime
    summary: string;
    description: string;
    location: string;
    colorId: string;
    creator: GoogleCalendarPerson;
    organizer: GoogleCalendarPerson;
    start: GoogleCalendarEventDateTime;
    end: GoogleCalendarEventDateTime;
    endTimeUnspecified?: boolean;
    recurrence?: string[];
    recurringEventId?: string;
    originalStartTime?: GoogleCalendarEventDateTime;
    transparency?: string;
    visibility?: string;
    iCalUID: string;
    sequence: number; // integer
    attendees?: GoogleCalendarAttendee[];
    attendeesOmitted?: boolean;
    extendedProperties?: GoogleCalendarExtendedProperties;
    hangoutLink?: string;
    conferenceData?: GoogleCalendarConferenceData;
    gadget?: GoogleCalendarGadget;
    anyoneCanAddSelf?: boolean;
    guestsCanInviteOthers?: boolean;
    guestsCanModify?: boolean;
    guestsCanSeeOtherGuests?: boolean;
    privateCopy?: boolean;
    locked?: boolean;
    reminders: GoogleCalendarReminders;
    source?: GoogleCalendarSource;
    workingLocationProperties?: GoogleCalendarWorkingLocationProperties;
    outOfOfficeProperties?: GoogleCalendarOutOfOfficeProperties;
    focusTimeProperties?: GoogleCalendarFocusTimeProperties;
    attachments?: GoogleCalendarAttachment[];
    eventType: string;
}

export interface GoogleCalendarPerson {
    id: string;
    email: string;
    displayName: string;
    self: boolean;
}

export interface GoogleCalendarEventDateTime {
    date?: string; // date
    dateTime?: string; // datetime
    timeZone?: string;
}

export interface GoogleCalendarAttendee {
    id: string;
    email: string;
    displayName: string;
    organizer?: boolean;
    self?: boolean;
    resource?: boolean;
    optional?: boolean;
    responseStatus?: string;
    comment?: string;
    additionalGuests?: number; // integer
}

export interface GoogleCalendarExtendedProperties {
    private?: Record<string, string>;
    shared?: Record<string, string>;
}

export interface GoogleCalendarConferenceData {
    createRequest?: {
        requestId: string;
        conferenceSolutionKey: {
            type: string;
        };
        status: {
            statusCode: string;
        };
    };
    entryPoints?: GoogleCalendarEntryPoint[];
    conferenceSolution?: {
        key: {
            type: string;
        };
        name: string;
        iconUri: string;
    };
    conferenceId?: string;
    signature?: string;
    notes?: string;
}

export interface GoogleCalendarEntryPoint {
    entryPointType: string;
    uri: string;
    label?: string;
    pin?: string;
    accessCode?: string;
    meetingCode?: string;
    passcode?: string;
    password?: string;
}

export interface GoogleCalendarGadget {
    type: string;
    title: string;
    link: string;
    iconLink: string;
    width: number; // integer
    height: number; // integer
    display: string;
    preferences?: Record<string, string>;
}

export interface GoogleCalendarReminders {
    useDefault: boolean;
    overrides?: GoogleCalendarReminderOverride[];
}

export interface GoogleCalendarReminderOverride {
    method: string;
    minutes: number; // integer
}

export interface GoogleCalendarSource {
    url: string;
    title: string;
}

export interface GoogleCalendarWorkingLocationProperties {
    type: string;
    homeOffice?: any; // The type for this property should be specified more clearly
    customLocation?: {
        label: string;
    };
    officeLocation?: {
        buildingId: string;
        floorId: string;
        floorSectionId: string;
        deskId: string;
        label: string;
    };
}

export interface GoogleCalendarOutOfOfficeProperties {
    autoDeclineMode: string;
    declineMessage: string;
}

export interface GoogleCalendarFocusTimeProperties {
    autoDeclineMode: string;
    declineMessage: string;
    chatStatus: string;
}

export interface GoogleCalendarAttachment {
    fileUrl: string;
    title: string;
    mimeType: string;
    iconLink: string;
    fileId: string;
}