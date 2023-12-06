import type { CalendarEvent } from './types';

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

// get random date between two dates
const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const generateSeedData = (numRecords: number): CalendarEvent[] => {
    const attendees = [
        {
            name: 'John Doe',
            email: 'john_doe@gmail.com',
            rsvp: true,
            rsvpDate: new Date(2023, 11, 4, 9, 0),
            rsvpResponse: 'Accepted',
        },
        {
            name: 'Jane Doe',
            email: 'jane_doe@gmail.com',
            rsvp: true,
            rsvpDate: new Date(2023, 11, 4, 9, 0),
            rsvpResponse: 'Accepted',
        }
    ];

    const titles = [
        'Team Meeting',
        'Doctor Appointment',
        "Jane's Birthday",
    ];

    const descriptions = [
        'This is a description of the meeting.',
        'This is a description of the appointment.',
        'This is a description of the birthday.',
    ];

    const locations = [
        'Zoom',
        "Your mom's house",
        'The office',
        'The park',
        'The beach',
        'The mountains',
    ];

    const types = [
        'meeting',
        'appointment',
        'birthday',
        'date'
    ];

    const recurrence = [
        'daily',
        'weekly',
        'monthly',
        'yearly',
    ];

    const seedData: CalendarEvent[] = [];
    for (let i = 0; i < numRecords; i++) {
        seedData.push({
            id: (i + 1).toString(),
            title: titles[getRandomInt(titles.length)],
            description: descriptions[getRandomInt(descriptions.length)],
            location: locations[getRandomInt(locations.length)],
            type: types[getRandomInt(types.length)],
            isAllDay: false,
            isRecurring: false,
            recurrence: recurrence[getRandomInt(recurrence.length)],
            startDate: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
            endDate: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
            attendees: attendees.slice(0, getRandomInt(attendees.length + 1)), // up to both attendees can attend
        });
    }
    return seedData;
};

export const calendarEvents: CalendarEvent[] = generateSeedData(600);