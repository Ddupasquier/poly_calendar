import { addToast } from '$lib/stores';
import { updateSingleUserSettingsField } from '$lib/services';


export const integrateGoogleCalendar = async (): Promise<void> => {
    try {
        localStorage.setItem('auth_context', 'google_calendar_integration');

        addToast('Google Calendar integrated successfully.', { duration: 5000, closable: true });

        await updateSingleUserSettingsField({
            field: 'google_calendar_integration',
            value: true
        });

        localStorage.setItem('auth_context', '');
    } catch (error) {
        console.error('Error in integrating Google Calendar:', error);
        localStorage.setItem('auth_context', '');
        handleError(error);
    }
};

export const disableGoogleCalendarIntegration = async (): Promise<void> => {
    try {
        await updateSingleUserSettingsField({
            field: 'google_calendar_integration',
            value: false
        });
        addToast('Google Calendar integration disabled successfully.', { duration: 5000, closable: true });
    } catch (error) {
        handleError(error);
    }
};

const handleError = (error: any): void => {
    let message = 'An error occurred during Google Calendar integration.';
    if (error instanceof Error) {
        message = error.message;
    }
    addToast(message, { duration: 5000, closable: true });
};
