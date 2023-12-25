import { addToast } from '$lib/stores';
import { updateSingleUserSettingsField } from '$lib/services';

/**
 * Initiates the process to integrate the user's Google Calendar with the application.
 * It sets a local storage item to indicate the integration context, updates the user's settings to enable
 * Google Calendar integration, and shows a toast message upon success.
 * 
 * @returns {Promise<void>} A promise that resolves when the integration process is complete.
 * @throws {Error} Throws an error if the update to the user settings fails.
 */
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

/**
 * Disables the Google Calendar integration for the user.
 * It updates the user's settings to indicate that Google Calendar integration is turned off
 * and shows a toast message to inform the user.
 * 
 * @returns {Promise<void>} A promise that resolves when the disintegration process is complete.
 * @throws {Error} Throws an error if the update to the user settings fails.
 */
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

/**
 * Handles errors that occur during the Google Calendar integration process.
 * It logs the error to the console, extracts the error message if available, and shows a toast message.
 * 
 * @param {any} error - The error object thrown during the Google Calendar integration process.
 */
const handleError = (error: any): void => {
    let message = 'An error occurred during Google Calendar integration.';
    if (error instanceof Error) {
        message = error.message;
    }
    addToast(message, { duration: 5000, closable: true });
};
