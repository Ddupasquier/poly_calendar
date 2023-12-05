import type { CalendarEvent } from './types';

export const calendarEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Team Meeting',
        startDate: new Date(2023, 11, 5, 9, 0), // Year, Month, Day, Hour, Minute
        endDate: new Date(2023, 11, 5, 10, 0),
        type: 'meeting'
    },
    {
        id: '2',
        title: 'Doctor Appointment',
        startDate: new Date(2023, 11, 6, 15, 30),
        endDate: new Date(2023, 11, 6, 16, 0),
        type: 'appointment'
    },
    {
        id: '3',
        title: 'Jane\'s Birthday',
        startDate: new Date(2023, 11, 8),
        endDate: new Date(2023, 11, 8),
        type: 'birthday'
    },
    // Add more events as needed
];
