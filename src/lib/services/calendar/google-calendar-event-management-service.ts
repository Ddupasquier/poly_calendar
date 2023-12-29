import type { GoogleCalendarEventModel, GoogleCalendarListEntry } from '$lib/models';
import { addToast, googleCalendarListEntryOptions } from '$lib/stores';
import { SupportedProvidersEnum } from '$lib/enums';
import { supabase } from '$lib/supabase';
import { logout } from '..';
import type { RequestInfo } from 'undici-types';


/**
 * Asynchronously fetches events from the user's Google Calendar within a specified date range.
 * @returns {Promise<GoogleCalendarEventModel[] | undefined>} A promise that resolves to an array of Google Calendar event objects if successful, or undefined if any error occurs.
 * @throws {Error} - Throws an error if the function is called outside a browser context, or if the user's session is invalid, or if the fetch request to the Google Calendar API fails.
*/
const fetchAndValidateSession = async (): Promise<{ session: any } | undefined> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        console.error('Error fetching session:', error);
        return undefined;
    }

    return data;
}

/**
 * Validates that the user has Google as a provider.
 * @param {any} session - The user's session data.
 * @returns {boolean} True if the user has Google as a provider, false otherwise.
*/
const validateGoogleProvider = (session: any): boolean => {
    const userProviders = session.user.app_metadata.providers;
    return userProviders.includes(SupportedProvidersEnum.Google);
}

/**
 * Maps Google Calendar objects to an array of summary strings.
 * @param {GoogleCalendarListEntry[]} calendarEntries - An array of Google Calendar objects.
 * @returns {string[]} An array of summary strings.
*/
const mapGoogleCalendarEntriesToSummaryStrings = async (calendarEntries: GoogleCalendarListEntry[]): Promise<string[]> => {
    return calendarEntries.map(calendar => calendar.summary);
}

/**
 * Fetches the user's Google Calendar list.
 * @param {string} providerToken - The user's Google provider token.
 * @returns {Promise<any[]>} A promise that resolves to an array of Google Calendar objects.
*/
const fetchGoogleCalendarList = async (providerToken: string): Promise<GoogleCalendarListEntry[]> => {
    const calendarListEndpoint = 'https://www.googleapis.com/calendar/v3/users/me/calendarList?showDeleted=true&showHidden=true';
    const calendarListResponse = await fetch(calendarListEndpoint, {
        headers: { 'Authorization': `Bearer ${providerToken}` }
    });

    if (!calendarListResponse.ok) {
        const errorData = await calendarListResponse.json();
        throw new Error(`Error fetching Google Calendar list: ${errorData.error}`);
    }

    const calendarListData = await calendarListResponse.json();
    if (!calendarListData.items) {
        throw new Error('No calendar items found.');
    }

    googleCalendarListEntryOptions.set(await mapGoogleCalendarEntriesToSummaryStrings(calendarListData.items));
    return calendarListData.items;
}

/**
 * Fetches events for a Google Calendar within a specified date range.
 * @param {string} calendarId - The ID of the calendar to fetch events for.
 * @param {string} providerToken - The user's Google provider token.
 * @param {string} timeMin - The start time for the event range in ISO 8601 format.
 * @param {string} timeMax - The end time for the event range in ISO 8601 format.
 * @returns {Promise<GoogleCalendarEventModel[]>} A promise that resolves to an array of Google Calendar event objects.
*/
const fetchEventsForGoogleCalendar = async (
    calendarId: string,
    providerToken: string,
    timeMin: string,
    timeMax: string
): Promise<GoogleCalendarEventModel[]> => {
    const eventsResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}`, {
        headers: { 'Authorization': `Bearer ${providerToken}` }
    });

    if (!eventsResponse.ok) {
        throw new Error(`Error fetching events for calendar ${calendarId}: ${eventsResponse.statusText}`);
    }

    const eventsData = await eventsResponse.json();
    return eventsData.items || [];
}

/**
 * Asynchronously fetches events from the user's Google Calendar within a specified date range.
 * @params {string} timeMin - The start time for the event range in ISO 8601 format.
 * @params {string} timeMax - The end time for the event range in ISO 8601 format.
 * @returns {Promise<GoogleCalendarEventModel[] | undefined>} A promise that resolves to an array of Google Calendar event objects if successful, or undefined if any error occurs.
 * @throws {Error} - Throws an error if the function is called outside a browser context, or if the user's session is invalid, or if the fetch request to the Google Calendar API fails.
 * @throws {Error} - Throws an error if the user does not have Google as a provider.
*/
export const fetchGoogleCalendarEvents = async (
    timeMin: string,
    timeMax: string
): Promise<GoogleCalendarEventModel[] | undefined> => {
    try {
        if (typeof window === 'undefined') {
            throw new Error('fetchGoogleCalendarEvents must be called from the browser');
        }

        const sessionData = await fetchAndValidateSession();
        if (!sessionData) return undefined;

        const { session } = sessionData;
        if (!validateGoogleProvider(session)) {
            console.error('Google is not a provider for the current user');
            return undefined;
        }

        const { provider_token } = session;
        const calendarItems = await fetchGoogleCalendarList(provider_token);

        const eventsResults = await Promise.all(calendarItems.map(calendar =>
            fetchEventsForGoogleCalendar(calendar.id, provider_token, timeMin, timeMax)
        ));

        const allEvents = eventsResults.flat();
        return allEvents;
    } catch (error) {
        console.error('Error in fetchGoogleCalendarEvents:', error);
        logout();
        return undefined;
    }
};

// // Helper function to get the provider token and check if it's valid
// const getProviderToken = async () => {
//     const { data, error } = await supabase.auth.getSession();
//     if (error || !data.session) {
//         throw new Error('Unable to retrieve user session');
//     }
//     const { provider_token } = data.session;
//     if (!provider_token) {
//         throw new Error('Provider token is missing');
//     }
//     return provider_token;
// };

// // Helper function to handle API requests
// const makeApiRequest = async (endpoint: RequestInfo, options: RequestInit | undefined) => {
//     const response = await fetch(endpoint, options);
//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`API Error: ${errorData.error.message}`);
//     }
//     return response.json();
// };

// // Helper function to handle API errors and user notifications
// const handleError = (error: Error) => {
//     console.error('API Error:', error);
//     addToast(`Error: ${error.message}`, { openTilClosed: true, closable: true });
//     // Uncomment the next line if you want to logout the user on every error
//     // logout();
//     throw error; // Rethrow the error if you want to handle it further up the call stack
// };

// export const listCalendars = async (): Promise<any> => {
//     try {
//         const provider_token = await getProviderToken();
//         const endpoint = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
//         const options = {
//             headers: { 'Authorization': `Bearer ${provider_token}` }
//         };
//         return await makeApiRequest(endpoint, options);
//     } catch (error) {
//         if (error instanceof Error) {
//             handleError(error);
//         }
//     }
// };

// export const insertCalendar = async (calendar: any): Promise<any> => {
//     const provider_token = await getProviderToken();
//     const endpoint = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
//     const options = {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${provider_token}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(calendar)
//     };
//     return await makeApiRequest(endpoint, options);
// }

// export const deleteCalendar = async (calendarId: string): Promise<any> => {
//     const provider_token = await getProviderToken();
//     const endpoint = `https://www.googleapis.com/calendar/v3/users/me/calendarList/${encodeURIComponent(calendarId)}`;
//     const options = {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${provider_token}` }
//     };
//     return await makeApiRequest(endpoint, options);
// }

// export const fetchEventsFromCalendar = async (calendarId: string, timeMin?: string, timeMax?: string): Promise<GoogleCalendarEventModel[] | undefined> => {
//     try {
//         const provider_token = await getProviderToken();
//         let endpoint = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
//         let queryParams = new URLSearchParams();
//         if (timeMin) queryParams.append('timeMin', timeMin);
//         if (timeMax) queryParams.append('timeMax', timeMax);
//         endpoint += `?${queryParams}`;
//         const options = {
//             headers: { 'Authorization': `Bearer ${provider_token}` }
//         };
//         return await makeApiRequest(endpoint, options);
//     } catch (error) {
//         if (error instanceof Error) {
//             handleError(error);
//         }
//     }
// };