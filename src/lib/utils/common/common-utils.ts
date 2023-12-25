import { addToast, setHelperText } from "$lib/stores";
import type { AuthUser } from "@supabase/supabase-js";

type ErrorForHandleFunction = {
    error: any;
    helperText?: string;
    toastText?: string;
}

const handleError = ({ error, helperText, toastText }: ErrorForHandleFunction): void => {
    const defaultErrorMessage = "An unknown error occurred.";
    const errorMessage = error.message || defaultErrorMessage;
    const rateLimitMatch = errorMessage.match(/after (\d+) seconds/);
    const rateLimitMessage = rateLimitMatch ? `Please try again in ${rateLimitMatch[1]} seconds.` : errorMessage;

    const displayMessage = (message: string, isToast: boolean) => {
        if (isToast) {
            addToast(toastText || message, { duration: 5000, closable: true });
        } else {
            setHelperText({
                error: true,
                message: helperText || message
            });
        }
    };

    if (toastText || rateLimitMatch) {
        displayMessage(rateLimitMessage, true);
    }

    if (helperText || rateLimitMatch) {
        displayMessage(rateLimitMessage, false);
    }

    if (!toastText && !helperText && !rateLimitMatch) {
        throw new Error(errorMessage);
    }
};

const startCountdownWithMessage = (seconds: number, messageTemplate: string): void => {
    let countdown: NodeJS.Timeout | null = null;
    let remainingSeconds = seconds;

    countdown = setInterval(() => {
        if (remainingSeconds > 0) {
            const message = messageTemplate.replace('{timer}', remainingSeconds.toString());
            setHelperText({
                error: true,
                message,
            });
            remainingSeconds--;
        } else {
            stopCountdown(countdown);
        }
    }, 1000);
};

const stopCountdown = (countdown: string | number | NodeJS.Timeout | null | undefined): void => {
    clearInterval(countdown as NodeJS.Timeout);
    countdown = null;
    setHelperText({
        error: false,
        message: '',
    })
};

const getConfirmedStatus = (user: AuthUser): string => {
    return user.email_confirmed_at ? ' (Confirmed)' : ' (Unconfirmed)';
};

const isObjectEmpty = (obj: object): boolean => {
    return Object.keys(obj).length === 0;
};

const uppercaseFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export {
    startCountdownWithMessage,
    stopCountdown,
    getConfirmedStatus,
    isObjectEmpty,
    uppercaseFirstLetter,
    handleError,
};
