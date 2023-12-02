import { supabase } from "../supabase";
import { clearAuthUserAndSession, saveAuthUserAndSession } from "$lib/stores/userStore";
import { setHelperText } from "$lib/stores/reactiveTextStore";
import { startCountdownWithMessage } from "$lib/utils/utils";

const signIn = async (email: string, password: string): Promise<void> => {
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

const signUp = async (email: string, password: string): Promise<void> => {
    try {
        const result = await supabase.auth.signUp({ email, password });
        handleSignUpResult(result);
    } catch (error) {
        handleError(error);
    }
};

const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error);
    } else {
        clearAuthUserAndSession();
    }
};

const handleAuthResult = (result: any): void => {
    const { data, error } = result;

    if (error) {
        handleError(error);
    } else if (data && !data.user) {
        setHelperText(false, "An email has been sent to you for verification!");
    } else if (data && data.user) {
        saveAuthUserAndSession(data.user, data.session);
    }
};

const handleSignUpResult = (result: any): void => {
    if (result.data.user) {
        alert("Please check your email for a confirmation link.");
    } else {
        alert("Something went wrong. Please try again.");
    }
};

const handleError = (error: any): void => {
    console.error("Error:", error);
    const rateLimitMatch = error.message.match(/after (\d+) seconds/);
    if (rateLimitMatch) {
        startCountdownWithMessage(parseInt(rateLimitMatch[1], 10), "Please try again in {timer} seconds.");
    } else {
        setHelperText(true, error.message);
    }
};

export const authenticationService = {
    signIn,
    signUp,
    logout,
};
