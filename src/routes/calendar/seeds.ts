import { addDays } from "date-fns";
import type { CalendarEvent } from './types';

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

// get random date between two dates
const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// get a random end date that is 1-2 days after the start date, or up to a week for about 30% of them
const getRandomEndDate = (startDate: Date, chanceOfLongEvent: number) => {
    // 70% chance for 1-2 days event, 30% chance for up to a week
    if (Math.random() < chanceOfLongEvent) {
        // Longer event, up to a week
        return addDays(startDate, getRandomInt(7));
    } else {
        // Shorter event, 1-2 days
        return addDays(startDate, getRandomInt(2) + 1);
    }
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
        'Date Night',
        'Vacation',
        'Conference',
        'Dentist Appointment',
        'Interview',
        'Haircut',
        'Gym',
        'Workout',
        'Lunch',
        'Dinner',
        'Breakfast',
        'Brunch',
        'Meeting',
        'Appointment',
        'Birthday',
        'Date',
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
        const startDate = getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
        seedData.push({
            id: (i + 1).toString(),
            title: titles[getRandomInt(titles.length)],
            description: descriptions[getRandomInt(descriptions.length)],
            location: locations[getRandomInt(locations.length)],
            type: types[getRandomInt(types.length)],
            isAllDay: false,
            isRecurring: false,
            recurrence: recurrence[getRandomInt(recurrence.length)],
            startDate: startDate,
            endDate: getRandomEndDate(startDate, 0.3),
            attendees: attendees.slice(0, getRandomInt(attendees.length + 1)), // up to both attendees can attend
        });
    }

    const decemberNinth = new Date(2023, 11, 9); // December 9th, 2023
    console.log(decemberNinth)
    seedData.push({
        id: (numRecords + 1).toString(),
        title: "Special December Ninth Event",
        description: "This event occurs only on December 9th.",
        location: "Special Location",
        type: "special-event",
        isAllDay: true,
        isRecurring: false,
        recurrence: "",
        startDate: decemberNinth,
        endDate: decemberNinth
    });

    return seedData;
}

export const calendarEvents: CalendarEvent[] = generateSeedData(600);