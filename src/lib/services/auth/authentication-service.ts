import { supabase } from "$lib/supabase";
import {
    addToast,
    clearAuthUserAndSession,
    saveAuthUserAndSession,
    setHelperText,
} from "$lib/stores";
import { upsertUserProfile } from "$lib/services";
import type { Provider, Session, User } from "@supabase/supabase-js";

const processAuthResult = async (result: any): Promise<void> => {
    const { user, error, session } = result;

    if (error) {
        handleError(error);
        return;
    }

    if (user) {
        await handleUserSession(user, session);
    }
};

const handleUserSession = async (user: User, session: Session): Promise<void> => {
    saveAuthUserAndSession(user, session);

    await upsertUserProfile(user).catch((error) => {
        handleError(error);
    });

    welcomeMessage(user);
};

const welcomeMessage = (user: User): void => {
    const currentContext = localStorage.getItem('auth_context');

    const provider = user.app_metadata?.provider;
    const username = user.user_metadata?.full_name || user.user_metadata?.username;
    const isNewUser = user.created_at === user.last_sign_in_at;
    let message = `Welcome back, ${username || user.email}!`;

    if (currentContext === 'google_calendar_integration') {
        message = `Google Calendar integrated successfully for ${username || user.email}!`;
        localStorage.removeItem('auth_context');
    } else if (isNewUser && provider === 'google') {
        message = `First time ${provider} sign in as ${username || user.email}`;
    }

    addToast(message, { duration: 5000, closable: true });
};

const handleError = (error: any): void => {
    const rateLimitMatch = error.message.match(/after (\d+) seconds/);
    if (rateLimitMatch) {
        setHelperText(true, `Please try again in ${rateLimitMatch[1]} seconds.`);
    } else {
        setHelperText(true, error.message || "An unknown error occurred.");
    }
};

export const signIn = async (email: string, password: string): Promise<void> => {
    try {
        const result = await supabase.auth.signInWithPassword({ email, password });
        await processAuthResult(result);
    } catch (error) {
        handleError(error);
    }
};

export const handleOAuthLogin = async (provider: Provider): Promise<void> => {
    if (!provider) return;
    try {
        const options = {
            // redirectTo: `${window.location.origin}/profile?tab=profile`,
            scopes: '',
        };

        if (provider === 'google') {
            options.scopes = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';
        }

        const result = await supabase.auth.signInWithOAuth({
            provider,
            options,
        });
        await processAuthResult(result);
    } catch (error) {
        handleError(error);
    }
};

export const checkAndRefreshSession = async () => {
    // try {
    //     let { data: session, error: getSessionError } = await supabase.auth.getSession();

    //     if (getSessionError || !session) {
    //         let { data: refreshedSession, error: refreshSessionError } = await supabase.auth.refreshSession();
    //         if (refreshSessionError) {
    //             console.error('Error refreshing session:', refreshSessionError.message);
    //             addToast(refreshSessionError.message, { duration: 5000, closable: true });
    //             clearAuthUserAndSession();
    //             return null;
    //         }
    //         session = refreshedSession;
    //     }

    //     // If the session exists and has a user object, proceed to save it.
    //     if (session && 'user' in session) {
    //         saveAuthUserAndSession(session.user, session);
    //         return session;
    //     } else {
    //         throw new Error('Failed to retrieve or refresh session.');
    //     }
    // } catch (error) {
    //     console.error('Unexpected error when handling session:', error);
    //     addToast(error.message || 'Unexpected error when handling session', { duration: 5000, closable: true });
    //     clearAuthUserAndSession();
    //     return null;
    // }
};

export const checkCurrentUser = async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return true;
    } else {
        return false;
    }
}

export const signUp = async (email: string, password: string): Promise<void> => {
    try {
        const result = await supabase.auth.signUp({ email, password });
        const { error, data } = result;
        if (data.user && !error) {
            setHelperText(false, "A confirmation email has been sent. Please check your inbox.");
        } else {
            handleError(error);
        }
    } catch (error) {
        handleError(error);
    }
};

export const logout = async (): Promise<void> => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            handleError(error);
        } else {
            clearAuthUserAndSession();
            addToast("Logged out successfully", { duration: 5000, closable: true });
        }
    } catch (error) {
        handleError(error);
    }
};

export const initializeAuthListener = (): void => {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
            await handleUserSession(session.user, session);
        } else if (event === "SIGNED_OUT") {
            clearAuthUserAndSession();
            setHelperText(true, "You have been signed out.");
        }
    });
};
