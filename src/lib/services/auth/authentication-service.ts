import { supabase } from "$lib/supabase";
import {
    addToast,
    clearAuthUserAndSession,
    saveAuthUserAndSession,
    setHelperText,
} from "$lib/stores";
import { upsertUserProfile } from "$lib/services";
import type { Provider, Session, User } from "@supabase/supabase-js";

// Common function to handle sign-in, sign-up, and OAuth login results
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

// Common function to handle user session
const handleUserSession = async (user: User, session: Session): Promise<void> => {
    saveAuthUserAndSession(user, session);

    await upsertUserProfile(user).catch((error) => {
        handleError(error);
    });

    welcomeMessage(user);
};

const welcomeMessage = (user: User): void => {
    // Retrieve the context from localStorage
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

// Error handling function
const handleError = (error: any): void => {
    const rateLimitMatch = error.message.match(/after (\d+) seconds/);
    if (rateLimitMatch) {
        setHelperText(true, `Please try again in ${rateLimitMatch[1]} seconds.`);
    } else {
        setHelperText(true, error.message || "An unknown error occurred.");
    }
};

// Authentication actions
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
        const result = await supabase.auth.signInWithOAuth({ provider });
        await processAuthResult(result);
    } catch (error) {
        handleError(error);
    }
};

export const signUp = async (email: string, password: string): Promise<void> => {
    try {
        const result = await supabase.auth.signUp({ email, password });
        const { error, data } = result;
        // After signing up, inform the user to check their email.
        if (data.user && !error) {
            setHelperText(false, "A confirmation email has been sent. Please check your inbox.");
        } else {
            // Handle any errors that may occur during sign up
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

// Initialization of auth state listener
export const initializeAuthListener = (): void => {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
            await handleUserSession(session.user, session);
        } else if (event === "SIGNED_OUT") {
            clearAuthUserAndSession();
            setHelperText(true, "You have been signed out.");
        }
        // Handle other auth state changes as needed
    });
};
