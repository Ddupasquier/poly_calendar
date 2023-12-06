import type { EventTypesModel } from '$lib/models';

export interface CalendarEvent {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    type: EventTypesModel;
}