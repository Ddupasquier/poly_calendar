import type { GoogleCalendarEventModel } from '$lib/models';
import { addToast } from '$lib/stores';
import { SupportedProvidersEnum } from '$lib/enums';
import { supabase } from '$lib/supabase';
import { logout } from '..';

/**
 * Fetches events from the user's Google Calendar.
 * Requires the user to be authenticated and have a valid session with Google as a provider.
 * The function must be called from a browser environment since it uses the 'fetch' API.
 * 
 * @param {string} [timeMin] - The start time for the event range in ISO format.
 * @param {string} [timeMax] - The end time for the event range in ISO format.
 * @returns {Promise<GoogleCalendarEventModel[] | undefined>} A promise that resolves to an array of Google Calendar event objects.
 * @throws {Error} Throws an error if called outside a browser context, the user's session is invalid, 
 *                 the fetch request fails, or the user does not have Google as a provider.
 */
export const fetchGoogleCalendarEvents = async (timeMin: string | undefined, timeMax: string | undefined): Promise<GoogleCalendarEventModel[] | undefined> => {
    const { data, error } = await supabase.auth.getSession();

    if (!error && data.session) {
        const { session } = data;
        const userProviders = session.user.app_metadata.providers;

        if (session && userProviders.includes(SupportedProvidersEnum.Google)) {
            try {
                if (typeof window === 'undefined') {
                    throw new Error('fetchGoogleCalendarEvents must be called from the browser');
                }

                const currentTime = Math.floor(Date.now() / 1000);

                const {
                    provider_token,
                    refresh_token,
                    expires_at,
                    expires_in
                } = session;

                // if (expires_at) {
                //     const timeToExpirationMs = (expires_at * 1000) - (currentTime * 1000);

                //     const minutes = Math.floor(timeToExpirationMs / (1000 * 60));
                //     const seconds = Math.floor((timeToExpirationMs % (1000 * 60)) / 1000);

                //     console.log(`Token is valid, and it expires in ${minutes} minutes and ${seconds} seconds`);
                // }

                const eventsEndpoint = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}`;

                if (session) {
                    const response = await fetch(eventsEndpoint, {
                        headers: {
                            'Authorization': `Bearer ${provider_token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Error fetching Google Calendar events: ${response.statusText}`);
                    }

                    const eventsData = await response.json();
                    return eventsData.items;
                }
            } catch (error) {
                const message = error || 'An unknown error occurred';
                console.error('Error in fetchGoogleCalendarEvents:', message);
                addToast(`Error: ${message}`, { openTilClosed: true, closable: true });
                logout();

                throw error;
            }
        }
    }
};