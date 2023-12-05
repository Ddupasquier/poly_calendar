import { supabase } from "$lib/supabase";
import { addToast, clearAuthUserAndSession, saveAuthUserAndSession, setHelperText } from "$lib/stores";
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

// Unified user session handling
const handleUserSession = async (user: User, session: Session): Promise<void> => {
    saveAuthUserAndSession(user, session);

    await upsertUserProfile(user).catch((error) => {
        handleError(error);
    });

    if (user.app_metadata?.confirmation_sent_at) {
        setHelperText(false, "A confirmation email has been sent. Please check your inbox.");
    } else {
        // Determine the provider used for logging in
        const provider = user.app_metadata?.provider;
        if (provider) {
            addToast(`Logged in successfully with ${provider}`, { duration: 5000, closable: true });
        } else {
            addToast("Logged in successfully", { duration: 5000, closable: true });
        }
    }
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
        await processAuthResult(result);
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
