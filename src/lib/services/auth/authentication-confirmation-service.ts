import { supabase } from "$lib/supabase";
import { saveAuthUserAndSession } from "$lib/stores/userStore";
import { setHelperText } from "$lib/stores/reactiveTextStore";
import { userProfileManagementService } from "$lib/services/profile/profile-services/user-profile-management-service";

const { upsertUserProfile } = userProfileManagementService;

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
    }
};

const confirmSignUp = async (token: string) => {
    if (!token) {
        setHelperText(true, "No token provided for confirmation.");
    }

    try {
        const data = await verifySignUpToken(token);
        processSignUpConfirmation(data);
        upsertUserProfile(data.user)

    } catch (err) {
        setHelperText(true, "Error confirming sign up. Please try again.");
        console.error("Error confirming sign up:", err);
    }
};

export const authenticationConfirmationService = {
    confirmSignUp,
};