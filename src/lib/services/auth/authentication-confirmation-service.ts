import { supabase } from "$lib/supabase";
import { saveAuthUserAndSession } from "$lib/stores/userStore";
import { setHelperText } from "$lib/stores/reactiveTextStore";
import { upsertUserProfile } from "$lib/services";

const verifySignUpToken = async (token: string) => {
    if (!token) {
        throw new Error("No access token provided.");
    }

    try {
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
        });

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error("No data returned from Supabase.");
        }

        return data;
    } catch (err) {
        throw err;
    }
};

const processSignUpConfirmation = (data: any) => {
    if (!data.user) {
        throw new Error("No user returned from Supabase.");
    } else {
        if (data.user && data.session) {
            saveAuthUserAndSession(data.user, data.session);
        }
    }
};

export const confirmSignUp = async (token: string) => {
    if (!token) {
        setHelperText(true, "No token provided for confirmation.");
        return { success: false, message: "No token provided for confirmation." };
    }

    try {
        const data = await verifySignUpToken(token);
        processSignUpConfirmation(data);

        await upsertUserProfile(data.user);
        return { success: true, message: "Sign up confirmed." };
    } catch (err) {
        setHelperText(true, "Error confirming sign up. Please try again.");
        return { success: false, message: "Error confirming sign up. Please try again." };
    }
};
