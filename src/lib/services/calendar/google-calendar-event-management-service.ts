import { addToast, selectedMonth, selectedYear } from '$lib/stores';
import { get } from 'svelte/store';
import { endOfMonth, startOfMonth } from 'date-fns';

export const fetchGoogleCalendarEvents = async () => {
    const year = get(selectedYear);
    const month = get(selectedMonth);

    try {
        if (typeof window === 'undefined') {
            throw new Error('fetchGoogleCalendarEvents must be called from the browser');
        }

        const providerToken = localStorage.getItem('google_provider_token');
        if (!providerToken) {
            throw new Error('Access token not found in localStorage');
        }

        const timeMin = startOfMonth(new Date(year, month - 1)).toISOString();
        const timeMax = endOfMonth(new Date(year, month - 1)).toISOString();

        const eventsEndpoint = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}`;

        const response = await fetch(eventsEndpoint, {
            headers: {
                'Authorization': `Bearer ${providerToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching Google Calendar events: ${response.statusText}`);
        }

        const eventsData = await response.json();
        return eventsData.items;
    } catch (error) {
        const message = (error as Error).message || 'An unknown error occurred';
        console.error('Error in fetchGoogleCalendarEvents:', message);
        addToast(`Error: ${message}`, { duration: 5000, closable: true });

        throw error;
    }
};

