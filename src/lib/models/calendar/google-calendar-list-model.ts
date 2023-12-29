export interface GoogleCalendarListEntry {
    kind: "calendar#calendarListEntry";
    etag: string;
    id: string;
    summary: string;
    description: string;
    location: string;
    timeZone: string;
    summaryOverride: string;
    colorId: string;
    backgroundColor: string;
    foregroundColor: string;
    hidden: boolean;
    selected: boolean;
    accessRole: string;
    defaultReminders: GoogleCalendarListEntryReminder[];
    notificationSettings: GoogleCalendarListEntryNotificationSettings;
    primary: boolean;
    deleted: boolean;
    conferenceProperties: GoogleCalendarListEntryConferenceProperties;
}

export interface GoogleCalendarListEntryReminder {
    method: string;
    minutes: number; // Assuming 'integer' should be represented as number in TypeScript
}

export interface GoogleCalendarListEntryNotificationSettings {
    notifications: Notification[];
}

export interface GoogleCalendarListEntryNotification {
    type: string;
    method: string;
}

export interface GoogleCalendarListEntryConferenceProperties {
    allowedConferenceSolutionTypes: string[];
}
