import { addToast } from '$lib/stores';

export const fetchGoogleCalendarEvents = async (timeMin: string | undefined, timeMax: string | undefined) => {
    try {
        if (typeof window === 'undefined') {
            throw new Error('fetchGoogleCalendarEvents must be called from the browser');
        }

        const providerToken = localStorage.getItem('google_provider_token');

        const eventsEndpoint = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}`;

        if (providerToken) {
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
        }
    } catch (error) {
        const message = (error as Error).message || 'An unknown error occurred';
        console.error('Error in fetchGoogleCalendarEvents:', message);
        addToast(`Error: ${message}`, { duration: 5000, closable: true });

        throw error;
    }
};

