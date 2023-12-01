import { supabase } from "../supabase";
import { saveAuthUserAndSession } from "$lib/stores/userStore";
import { goto } from "$app/navigation";
import { helperTextStore as helperText } from "$lib/stores/reactiveTextStore";

const verifySignUpToken = async (token: string) => {
    if (!token) {
        throw new Error("No access token provided.");
    }

    const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
    });

    if (error) throw error;
    if (!data) throw new Error("No data returned from Supabase.");

    return data;
};

const processSignUpConfirmation = (data: any) => {
    if (!data.user) {
        throw new Error("No user returned from Supabase.");
    } else {
        if (data.user && data.session) {
            saveAuthUserAndSession(data.user, data.session);
        }

        goto("/profile");
    }
};

const handleSignUpError = (error: Error) => {
    helperText.set({ error: true, text: error.message });
};

const confirmSignUp = async (token: string | undefined) => {
    if (!token) {
        handleSignUpError(new Error("No token provided."));
        return;
    }

    try {
        const data = await verifySignUpToken(token);
        processSignUpConfirmation(data);
    } catch (err) {
        handleSignUpError(err as Error);
    }
};

export const authenticationConfirmationService = {
    confirmSignUp,
};