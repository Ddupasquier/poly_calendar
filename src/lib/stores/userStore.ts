import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Session, User } from "@supabase/supabase-js"; // Ensure you have the correct type for User
import { dateTimeUtils } from '$lib/utils/date-time-utils';

const { checkDate } = dateTimeUtils;

// Function to check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Assuming AuthUser is a subset of User, you might need to adjust depending on your actual types
export const authUser: Writable<User> = writable({} as User);
export const authSession: Writable<Session> = writable({} as Session);

if (isBrowser) {
    // Rehydrate only if in the browser
    const storedUser = localStorage.getItem('authUser');
    const storedSession = localStorage.getItem('authSession');

    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') { // Check if the parsed object is valid
            authUser.set(parsedUser);
        }
    }

    if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        if (parsedSession && typeof parsedSession === 'object') { // Check if the parsed object is valid
            authSession.set(parsedSession);
        }
    }
}

export const saveAuthUserAndSession = (user: User, session: Session) => {
    if (!user || !session) throw new Error("User and session must be provided.");

    let formattedUser = { ...user };

    if (formattedUser.confirmed_at) {
        formattedUser.confirmed_at = checkDate(formattedUser.confirmed_at);
    }
    if (formattedUser.last_sign_in_at) {
        formattedUser.last_sign_in_at = checkDate(formattedUser.last_sign_in_at);
    }

    if (isBrowser) {
        localStorage.setItem('authUser', JSON.stringify(formattedUser));
        localStorage.setItem('authSession', JSON.stringify(session));
    }

    authUser.set(formattedUser);
    authSession.set(session);
};

export const clearAuthUserAndSession = () => {
    if (isBrowser) {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authSession');
    }
    authUser.set({} as User); // Default empty user object instead of null
    authSession.set({} as Session); // Default empty session object instead of null
};

authUser.subscribe(value => {
    if (isBrowser && value) { // Check if value exists
        console.log("authUser store changed:", value);
    }
});

authSession.subscribe(value => {
    if (isBrowser && value) { // Check if value exists
        console.log("authSession store changed:", value);
    }
});

export const checkLocalStorageForVerificationStatus = (): boolean => {
    if (isBrowser) {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user && user.email_confirmed_at) { // Check if user exists and email confirmed at is set
                return true;
            }
        }
    }

    return false;
};
