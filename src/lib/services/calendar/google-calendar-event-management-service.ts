import type { GoogleCalendarEventModel } from '$lib/models';
import { addToast } from '$lib/stores';
import { SupportedProvidersEnum } from '$lib/enums';
import { supabase } from '$lib/supabase';
import { logout } from '..';
import type { RequestInfo } from 'undici-types';

// Helper function to get the provider token and check if it's valid
const getProviderToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        throw new Error('Unable to retrieve user session');
    }
    const { provider_token } = data.session;
    if (!provider_token) {
        throw new Error('Provider token is missing');
    }
    return provider_token;
};

// Helper function to handle API requests
const makeApiRequest = async (endpoint: RequestInfo, options: RequestInit | undefined) => {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error.message}`);
    }
    return response.json();
};

// Helper function to handle API errors and user notifications
const handleError = (error: Error) => {
    console.error('API Error:', error);
    addToast(`Error: ${error.message}`, { openTilClosed: true, closable: true });
    // Uncomment the next line if you want to logout the user on every error
    // logout();
    throw error; // Rethrow the error if you want to handle it further up the call stack
};

export const listCalendars = async (): Promise<any> => {
    try {
        const provider_token = await getProviderToken();
        const endpoint = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
        const options = {
            headers: { 'Authorization': `Bearer ${provider_token}` }
        };
        return await makeApiRequest(endpoint, options);
    } catch (error) {
        if (error instanceof Error) {
            handleError(error);
        }
    }
};

export const insertCalendar = async (calendar: any): Promise<any> => {
    const provider_token = await getProviderToken();
    const endpoint = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${provider_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(calendar)
    };
    return await makeApiRequest(endpoint, options);
}

export const deleteCalendar = async (calendarId: string): Promise<any> => {
    const provider_token = await getProviderToken();
    const endpoint = `https://www.googleapis.com/calendar/v3/users/me/calendarList/${encodeURIComponent(calendarId)}`;
    const options = {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${provider_token}` }
    };
    return await makeApiRequest(endpoint, options);
}

export const fetchEventsFromCalendar = async (calendarId: string, timeMin?: string, timeMax?: string): Promise<GoogleCalendarEventModel[] | undefined> => {
    try {
        const provider_token = await getProviderToken();
        let endpoint = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
        let queryParams = new URLSearchParams();
        if (timeMin) queryParams.append('timeMin', timeMin);
        if (timeMax) queryParams.append('timeMax', timeMax);
        endpoint += `?${queryParams}`;
        const options = {
            headers: { 'Authorization': `Bearer ${provider_token}` }
        };
        return await makeApiRequest(endpoint, options);
    } catch (error) {
        if (error instanceof Error) {
            handleError(error);
        }
    }
};

/**
 * Asynchronously fetches events from the user's Google Calendar within a specified date range.
 * 
 * This function requires the user to be authenticated with a valid session token from Google,
 * as it makes requests to the Google Calendar API which requires authorization.
 * 
 * It should only be invoked in a browser context where the 'fetch' API is available.
 * 
 * The function fetches all calendar entries from the user's Google Calendar list,
 * including deleted and hidden entries, and then fetches events for each of those calendars
 * within the provided date range specified by 'timeMin' and 'timeMax'.
 * 
 * It handles errors such as invalid session, lack of provider, and failed fetch requests
 * by returning 'undefined'. Successful requests will return an array of Google Calendar
 * event models containing event details.
 * 
 * @param {string | undefined} timeMin - The start time for the event range in ISO 8601 format.
 * @param {string | undefined} timeMax - The end time for the event range in ISO 8601 format.
 * @returns {Promise<GoogleCalendarEventModel[] | undefined>} A promise that resolves to an array of Google Calendar event objects if successful, or undefined if any error occurs.
 * @throws {Error} - Throws an error if the function is called outside a browser context, or if the user's session is invalid, or if the fetch request to the Google Calendar API fails.
 */
export const fetchGoogleCalendarEvents = async (
    timeMin: string | undefined,
    timeMax: string | undefined
): Promise<GoogleCalendarEventModel[] | undefined> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        console.error('Error fetching session:', error);
        return undefined;
    }

    const { session } = data;
    const userProviders = session.user.app_metadata.providers;

    if (!userProviders.includes(SupportedProvidersEnum.Google)) {
        console.error('Google is not a provider for the current user');
        return undefined;
    }

    try {
        if (typeof window === 'undefined') {
            throw new Error('fetchGoogleCalendarEvents must be called from the browser');
        }

        const { provider_token } = session;

        const calendarListEndpoint = 'https://www.googleapis.com/calendar/v3/users/me/calendarList?showDeleted=true&showHidden=true';
        const calendarListResponse = await fetch(calendarListEndpoint, {
            headers: { 'Authorization': `Bearer ${provider_token}` }
        });

        if (!calendarListResponse.ok) {
            const errorData = await calendarListResponse.json();
            throw new Error(`Error fetching Google Calendar list: ${errorData.error}`);
        }

        const calendarListData = await calendarListResponse.json();
        if (!calendarListData.items) {
            throw new Error('No calendar items found.');
        }

        const eventPromises = calendarListData.items.map((calendar: { id: string | number | boolean; }) =>
            fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events?timeMin=${timeMin}&timeMax=${timeMax}`, {
                headers: { 'Authorization': `Bearer ${provider_token}` }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error fetching events for calendar ${calendar.id}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(data => data.items || [])
                .catch(error => {
                    console.error(`Failed to fetch events for calendar ${calendar.id}:`, error);
                    return [];
                })
        );

        const eventsResults = await Promise.all(eventPromises);
        const allEvents = ([] as GoogleCalendarEventModel[]).concat(...eventsResults);

        return allEvents;
    } catch (error) {
        console.error('Error in fetchGoogleCalendarEvents:', error);
        return undefined;
    }
};