import { supabase } from "$lib/supabase";
import { clearAuthUserAndSession, saveAuthUserAndSession, setHelperText } from "$lib/stores";
import { commonUtils } from "$lib/utils";
import { upsertUserProfile } from "$lib/services";
import type { Provider } from "@supabase/supabase-js";

export const signIn = async (email: string, password: string): Promise<void> => {
    try {
        const result = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        handleAuthResult(result);
    } catch (error) {
        handleError(error);
    }
};

export const handleOAuthLogin = async (provider: Provider): Promise<void> => {
    if (!provider) {
        return;
    }
    try {
        const result = await supabase.auth.signInWithOAuth({ provider });

        if (result.error) {
            handleError(result.error);
        } else {
            handleAuthResult(result);
        }
    } catch (error) {
        handleError(error);
    }
};

export const signUp = async (email: string, password: string): Promise<void> => {
    try {
        const result = await supabase.auth.signUp({ email, password });
        handleSignUpResult(result);
    } catch (error) {
        handleError(error);
    }
};

export const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error);
    } else {
        clearAuthUserAndSession();
    }
};

export const initializeAuthListener = (): void => {
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
            if (!session?.user) return;
            saveAuthUserAndSession(session.user, session);
            upsertUserProfile(session.user).catch(console.error);
        } else if (event === "SIGNED_OUT") {
            clearAuthUserAndSession();
        }
    });
};

const handleAuthResult = async (result: any): Promise<void> => {
    const { user, session, error } = result;

    if (error) {
        setHelperText(true, error.message);
        return;
    } else if (user) {
        saveAuthUserAndSession(user, session);
    } else {
        setHelperText(false, "An email has been sent to you for verification!");
    }
};

const handleError = (error: any): void => {
    const rateLimitMatch = error.message.match(/after (\d+) seconds/);
    if (rateLimitMatch) {
        commonUtils.startCountdownWithMessage(parseInt(rateLimitMatch[1], 10), "Please try again in {timer} seconds.");
    } else {
        setHelperText(true, error.message);
    }
};


const handleSignUpResult = (result: any): void => {
    if (result.data.user) {
        alert("Please check your email for a confirmation link.");
    } else {
        alert("Something went wrong. Please try again.");
    }
};
