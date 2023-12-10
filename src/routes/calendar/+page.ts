// src/routes/calendar/+page.ts or src/routes/calendar/+page.server.ts
import type { Load } from '@sveltejs/kit';
import { setCalendarEvents } from '$lib/stores';


// TEMPORARY
import { calendarEvents as events } from './seeds';

export const load: Load = async ({ fetch }) => {
    // Replace this URL with the endpoint you're using to fetch calendar events
    // const eventsUrl = 'https://api.yourdomain.com/events';

    // // Fetch the initial calendar data from an API
    // const response = await fetch(eventsUrl);
    // const events = await response.json();

    if (events) {
        // Set the calendar events in the store
        setCalendarEvents(events);
    }
    // Return the events as props
    // return {
    //     events
    // }

};
