import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Session, AuthUser } from "@supabase/supabase-js";

// Function to check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

export const authUser: Writable<AuthUser | null> = writable(null);
export const authSession: Writable<Session | null> = writable(null);

if (isBrowser) {
    // Rehydrate only if in the browser
    const storedUser = localStorage.getItem('authUser');
    const storedSession = localStorage.getItem('authSession');

    if (storedUser) {
        authUser.set(JSON.parse(storedUser));
    }

    if (storedSession) {
        authSession.set(JSON.parse(storedSession));
    }
}

export const saveAuthUserAndSession = (user: AuthUser, session: Session) => {
    if (isBrowser) {
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.setItem('authSession', JSON.stringify(session));
    }
    authUser.set(user);
    authSession.set(session);
};

export const clearAuthUserAndSession = () => {
    if (isBrowser) {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authSession');
    }
    authUser.set(null);
    authSession.set(null);
};

authUser.subscribe(value => {
    if (isBrowser) {
        console.log("authUser store changed:", value);
    }
});

authSession.subscribe(value => {
    if (isBrowser) {
        console.log("authSession store changed:", value);
    }
});
