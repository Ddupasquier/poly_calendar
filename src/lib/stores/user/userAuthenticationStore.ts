import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Session, User } from "@supabase/supabase-js";
import { checkDate } from '$lib/utils';

const isBrowser = typeof window !== 'undefined';

export const authUser: Writable<User> = writable({} as User);
export const authSession: Writable<Session> = writable({} as Session);
export const currentUserPresent: Writable<boolean> = writable(false);
export const currentUserPresentAndVerified: Writable<boolean> = writable(false);

authUser.subscribe(value => {
    value && value.id ? currentUserPresent.set(true) : currentUserPresent.set(false);
    value && value.email_confirmed_at ? currentUserPresentAndVerified.set(true) : currentUserPresentAndVerified.set(false);
});

if (isBrowser) {
    // Rehydrate only if in the browser
    const storedUser = localStorage.getItem('authUser');
    const storedSession = localStorage.getItem('authSession');

    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
            authUser.set(parsedUser);
        }
    }

    if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        if (parsedSession && typeof parsedSession === 'object') {
            authSession.set(parsedSession);
        }
    }
}

// export const saveAuthUserAndSession = (user: User, session: Session) => {
//     if (!user || !session) throw new Error("User and session must be provided.");

//     let formattedUser = { ...user };

//     if (formattedUser.confirmed_at) {
//         formattedUser.confirmed_at = checkDate(formattedUser.confirmed_at);
//     }
//     if (formattedUser.last_sign_in_at) {
//         formattedUser.last_sign_in_at = checkDate(formattedUser.last_sign_in_at);
//     }

//     if (isBrowser) {
//         localStorage.setItem('authUser', JSON.stringify(formattedUser));
//         localStorage.setItem('authSession', JSON.stringify(session));

//         if (user.app_metadata.provider === 'google') {
//             const storedProviderTokenAndRefreshData = {
//                 google_provider_token: session.provider_token,
//                 google_provider_refresh_token: session.refresh_token,
//                 google_provider_expires_at: session.expires_at,
//                 google_provider_expires_in: session.expires_in
//             }

//             localStorage.setItem('auth_provider_refresh_token_and_timeouts', JSON.stringify(storedProviderTokenAndRefreshData));
//         }
//     }

//     authUser.set(formattedUser);
//     authSession.set(session);
// };

export const clearAuthUserAndSession = () => {
    if (isBrowser) {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authSession');
        localStorage.removeItem('google_provider_token');
    }
    authUser.set({} as User);
    authSession.set({} as Session);
};

// authUser.subscribe(value => {
//     if (isBrowser && value) { // Check if value exists
//         console.log("authUser store changed:", value);
//     }
// });

// authSession.subscribe(value => {
//     if (isBrowser && value) { // Check if value exists
//         console.log("authSession store changed:", value);
//     }
// });
