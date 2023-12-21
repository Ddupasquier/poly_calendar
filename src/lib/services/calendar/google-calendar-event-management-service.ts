import { addToast } from '$lib/stores';

export const fetchGoogleCalendarEvents = async (timeMin: string | undefined, timeMax: string | undefined) => {

    try {
        if (typeof window === 'undefined') {
            throw new Error('fetchGoogleCalendarEvents must be called from the browser');
        }

        const storedProviderTokenAndRefreshData = localStorage.getItem('auth_provider_refresh_token_and_timeouts');

        if (!storedProviderTokenAndRefreshData) {
            throw new Error('No stored provider token and refresh data found.');
        }

        const parsedStoredProviderTokenAndRefreshData = JSON.parse(storedProviderTokenAndRefreshData);

        const currentTime = Math.floor(Date.now() / 1000);

        const {
            google_provider_token,
            google_provider_refresh_token,
            google_provider_expires_at,
            google_provider_expires_in
        } = parsedStoredProviderTokenAndRefreshData;

        const timeToExpirationMs = (google_provider_expires_at * 1000) - (currentTime * 1000);

        const minutes = Math.floor(timeToExpirationMs / (1000 * 60));
        const seconds = Math.floor((timeToExpirationMs % (1000 * 60)) / 1000);

        console.log(`Token is valid, and it expires in ${minutes} minutes and ${seconds} seconds`);

        const eventsEndpoint = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}`;

        if (storedProviderTokenAndRefreshData) {
            const response = await fetch(eventsEndpoint, {
                headers: {
                    'Authorization': `Bearer ${google_provider_token}`
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