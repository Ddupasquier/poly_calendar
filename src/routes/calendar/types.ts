export interface CalendarEvent {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    type: string; // e.g., 'meeting', 'holiday', 'birthday', etc.
}