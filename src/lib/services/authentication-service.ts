import { supabase } from "../supabase";
import { saveAuthUserAndSession } from "$lib/stores/userStore";
import { helperTextStore } from "$lib/stores/reactiveTextStore";

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

const handleAuthResult = (result: any): void => {
    const { data, error } = result;

    if (error) {
        handleError(error);
    } else if (data && !data.user) {
        helperTextStore.set({
            error: false,
            text: "An email has been sent to you for verification!",
        });
    } else if (data && data.user) {
        saveAuthUserAndSession(data.user, data.session);
    }
};

const handleSignUpResult = (result: any): void => {
    console.log("Result:", result);
    // Handle sign-up specific flows or alerts here
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
        startCountdown(parseInt(rateLimitMatch[1], 10));
    } else {
        helperTextStore.set({ error: true, text: error.message });
    }
};


let countdown: string | number | NodeJS.Timeout | null | undefined;
let remainingSeconds = 0;

const startCountdown = (seconds: number): void => {
    remainingSeconds = seconds;
    countdown = setInterval(() => {
        if (remainingSeconds > 0) {
            helperTextStore.set({
                error: true,
                text: `Please wait for ${remainingSeconds} seconds.`,
            });
            remainingSeconds--;
        } else {
            stopCountdown();
        }
    }, 1000);
};

const stopCountdown = (): void => {
    clearInterval(countdown as NodeJS.Timeout);
    countdown = null;
    helperTextStore.set({ error: false, text: null });
};

export const authenticationService = {
    signIn,
    signUp
};
