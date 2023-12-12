import { supabase } from '$lib/supabase';
import { addToast } from '$lib/stores';
import { updateSingleUserSettingsField, getUserSettings } from '$lib/services';
import type { User } from '@supabase/supabase-js';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const integrateGoogleCalendar = async (): Promise<void> => {
    try {
        const authUserDataString = localStorage.getItem('authUser');
        if (!authUserDataString) {
            throw new Error('Authentication data not found.');
        }
        const authUserData: User = JSON.parse(authUserDataString);

        const options = {
            scopes: 'https://www.googleapis.com/auth/calendar'
        };

        localStorage.setItem('auth_context', 'google_calendar_integration');
        const result = await supabase.auth.signInWithOAuth({ provider: 'google', ...options });

        if (!result.error) {
            addToast('Google Calendar integrated successfully.', { duration: 5000, closable: true });

            const updateResult = await updateSingleUserSettingsField(authUserData, {
                field: 'google_calendar_integration',
                value: true
            });

            if (!updateResult) {
                throw new Error('Failed to update settings for Google Calendar integration.');
            }

            await delay(1000);

            const refreshedSettings = await getUserSettings(authUserData);

            if (!refreshedSettings?.google_calendar_integration) {
                throw new Error('Google Calendar integration setting not updated.');
            }
        } else {
            throw result.error;
        }
    } catch (error) {
        handleError(error);
    } finally {
        localStorage.removeItem('auth_context');
    }
};

const handleError = (error: any): void => {
    let message = 'An error occurred during Google Calendar integration.';
    if (error instanceof Error) {
        message = error.message;
    }
    addToast(message, { duration: 5000, closable: true });
};
