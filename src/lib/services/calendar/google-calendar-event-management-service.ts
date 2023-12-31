import type { GoogleCalendarEventModel, GoogleCalendarListEntryModel } from '$lib/models';
import { addToast, googleCalendarListEntryOptions, googleCalendarListEntryOptionsSelected } from '$lib/stores';
import { SupportedProvidersEnum } from '$lib/enums';
import { supabase } from '$lib/supabase';
import { logout } from '..';
import type { Session } from '@supabase/supabase-js';
import { get } from 'svelte/store';

export const calendarListEndpoint = 'https://www.googleapis.com/calendar/v3/users/me/calendarList?showDeleted=false&showHidden=true';

export const calendarEventsMinMaxEndpoint = (
    calendarId: string | number | boolean,
    timeMin: string,
    timeMax: string
) => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}`;

export const fetchAndValidateSession = async (): Promise<Session | undefined> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        console.error('Error fetching session:', error);
        return undefined;
    }

    return data.session;
}

const validateGoogleProvider = (session: Session): boolean => {
    const userProviders = session.user?.app_metadata.providers as string[];
    return userProviders?.includes(SupportedProvidersEnum.Google);
}


// TODO: Refactor this to not fetch from within THIS method
export const fetchGoogleCalendarList = async (
    providerToken: string | null | undefined,
    calendarListResponse?: Response
): Promise<GoogleCalendarListEntryModel[]> => {
    if (!calendarListResponse) {
        const response = await fetch(calendarListEndpoint, {
            headers: { 'Authorization': `Bearer ${providerToken}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error fetching Google Calendar list: ${errorData.error}`);
        }

        const calendarListData = await response.json();
        if (!calendarListData.items) {
            throw new Error('No calendar items found.');
        }

        return calendarListData.items;
    } else {
        const calendarListData = await calendarListResponse.json();
        if (!calendarListData.items) {
            throw new Error('No calendar items found.');
        }

        return calendarListData.items;
    }
}

const fetchSpecificEventsForGoogleCalendar = async (
    calendarId: string,
    providerToken: string,
    timeMin: string,
    timeMax: string
): Promise<GoogleCalendarEventModel[]> => {
    const response = await fetch(calendarEventsMinMaxEndpoint(calendarId, timeMin, timeMax), {
        headers: { 'Authorization': `Bearer ${providerToken}` }
    });

    if (!response.ok) {
        throw new Error(`Error fetching events for calendar ${calendarId}: ${response.statusText}`);
    }

    const eventsData = await response.json();
    return eventsData.items || [];
}

export const fetchEachEventsForGoogleCalendar = async (
    timeMin: string,
    timeMax: string
): Promise<GoogleCalendarEventModel[] | undefined> => {
    if (typeof window === 'undefined') {
        throw new Error('fetchEachEventsForGoogleCalendar must be called from the browser');
    }

    const sessionData = await fetchAndValidateSession();
    if (!sessionData) {
        console.error('No session data found');
        return undefined;
    }

    if (!validateGoogleProvider(sessionData)) {
        console.error('Google is not a provider for the current user');
        return undefined;
    }

    const { provider_token } = sessionData;

    if (provider_token) {
        let calendarItems = await fetchGoogleCalendarList(provider_token);

        const selectedCalendars = get(googleCalendarListEntryOptionsSelected);
        if (selectedCalendars.length > 0) {
            calendarItems = calendarItems.filter(calendar => selectedCalendars.includes(calendar.summary));
        }

        const eventsResults = await Promise.all(calendarItems.map(calendar =>
            fetchSpecificEventsForGoogleCalendar(calendar.id, provider_token, timeMin, timeMax)
        ));

        return eventsResults.flat();
    }
};