import { calendarListEndpoint, fetchAndValidateSession, fetchGoogleCalendarList } from '$lib/services';
import { googleCalendarListEntryOptions } from '$lib/stores';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }): Promise<CalendarPageData> => {
    const sessionData = await fetchAndValidateSession();

    if (!sessionData) {
        return {
            status: 302,
            redirect: '/login',
            message: 'You must be logged in to view this page',
            error: true,
            props: {}
        };
    }

    const { provider_token } = sessionData;

    const calendarListResponse = await fetch(calendarListEndpoint, {
        headers: { 'Authorization': `Bearer ${provider_token}` }
    });

    const calendarListEntriesData = await fetchGoogleCalendarList(provider_token, calendarListResponse);

    if (calendarListEntriesData.length > 0) {
        googleCalendarListEntryOptions.set(
            calendarListEntriesData.map((entry) => ({
                id: entry.id,
                summary: entry.summary
            }))
        );
    }

    return {
        status: 200,
        message: 'No issue. Please proceed.',
        error: false,
        props: {
            session: sessionData,
            calendars: calendarListEntriesData
        },
    };
};
