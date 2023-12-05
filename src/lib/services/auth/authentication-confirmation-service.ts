import { supabase } from "$lib/supabase";
import { saveAuthUserAndSession, setHelperText } from "$lib/stores";
import { upsertUserProfile } from "$lib/services";
import type { Session, User } from "@supabase/supabase-js";

interface VerificationData {
    user: User | null;
    session: Session | null;
}

const verifySignUpToken = async (token: string): Promise<VerificationData> => {
    console.time("verifySignUpToken"); // Start timing
    if (!token) {
        console.error("verifySignUpToken: No access token provided.");
        throw new Error("No access token provided.");
    }

    try {
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
        });

        console.log("verifySignUpToken: Data returned from Supabase:", data);

        if (error) {
            console.error("verifySignUpToken: Error returned from Supabase:", error);
            throw error;
        }

        if (!data) {
            console.error("verifySignUpToken: No data returned from Supabase.");
            throw new Error("No data returned from Supabase.");
        }

        console.timeEnd("verifySignUpToken"); // End timing
        return {
            user: data.user ?? null,
            session: data.session ?? null,
        };
    } catch (err) {
        console.error("verifySignUpToken: Exception thrown:", err);
        console.timeEnd("verifySignUpToken"); // End timing on error
        throw err;
    }
};

const processSignUpConfirmation = (data: VerificationData) => {
    console.log("processSignUpConfirmation: Processing signup confirmation");
    if (!data.user) {
        throw new Error("No user returned from Supabase.");
    } else {
        if (data.user && data.session) {
            saveAuthUserAndSession(data.user, data.session);
            console.log("processSignUpConfirmation: User and session saved");
        }
    }
};

const checkUserStatus = async (email: string | undefined): Promise<{ isVerified: boolean; user: { email_confirmed_at: string | null } | null }> => {
    console.time("checkUserStatus"); // Start timing
    console.log("checkUserStatus: Checking user status for email:", email);

    try {
        const { data: user, error } = await supabase
            .from('public.users') // Replace with your actual table name
            .select('email_confirmed_at') // Selecting only the email_confirmed_at field
            .eq('email', email)
            .single();

        console.timeEnd("checkUserStatus"); // End timing

        if (error) {
            console.error("checkUserStatus: Error returned from Supabase:", error);
            throw error;
        }

        return {
            isVerified: !!user?.email_confirmed_at, // The !! converts a truthy or falsy value to a boolean
            user,
        };
    } catch (error) {
        console.error("checkUserStatus: Exception thrown:", error);
        console.timeEnd("checkUserStatus"); // End timing on error
        throw error;
    }
};

export const confirmSignUp = async (token: string): Promise<{ success: boolean; message: string }> => {
    console.time("confirmSignUp"); // Start timing
    let verificationData: VerificationData | undefined;

    try {
        verificationData = await verifySignUpToken(token);
        console.log("confirmSignUp: Verification data retrieved:", verificationData);

        if (!verificationData || !verificationData.user || !verificationData.session) {
            console.error("confirmSignUp: Verification succeeded but no user or session data returned.");
            setHelperText(true, "Verification succeeded but no user or session data returned.");
            throw new Error("Verification succeeded but no user or session data returned.");
        }

        processSignUpConfirmation(verificationData); // Call the function to process the confirmation

        await upsertUserProfile(verificationData.user);
        setHelperText(false, "Sign up confirmed.");
        console.timeEnd("confirmSignUp"); // End timing
        return { success: true, message: "Sign up confirmed." };
    } catch (err) {
        console.error("confirmSignUp: Error during sign up confirmation:", err);

        // Check if verificationData has a user to check the status.
        if (verificationData?.user) {
            const userStatus = await checkUserStatus(verificationData.user.email);
            if (userStatus.isVerified) {
                setHelperText(false, "Sign up confirmed, but an error occurred. Please try logging in.");
                console.timeEnd("confirmSignUp"); // End timing
                return { success: true, message: "Sign up confirmed, but an error occurred. Please try logging in." };
            }
        }

        setHelperText(true, (err as Error).message || "Error verifying the signup token. Please try again.");
        console.timeEnd("confirmSignUp"); // End timing on error
        return { success: false, message: (err as Error).message || "Error verifying the signup token. Please try again." };
    }
};
