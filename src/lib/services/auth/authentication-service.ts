import { addToast, emptyEventsOnLogout, setHelperText } from "$lib/stores";
import { supabase } from "$lib/supabase";
import { handleError, instanceOfError } from "$lib/utils";
import type { AuthUser, Provider, Session, User } from "@supabase/supabase-js";
import { set } from "date-fns";


interface SignupConfirmationReturnData {
    confirmed: boolean;
    error: AuthError;
    data?: VerificationData;
}

interface AuthError {
    isError: boolean;
    message?: string;
    status?: string;
}

interface VerificationData {
    user: User | null;
    session?: Session | null;
}
// import {
//     addToast,
//     clearAuthUserAndSession,
//     currentUserPresent,
//     saveAuthUserAndSession,
//     setHelperText,
// } from "$lib/stores";
// import { upsertUserProfile } from "$lib/services";
// import type { Provider, Session, User } from "@supabase/supabase-js";

// const processAuthResult = async (result: any): Promise<void> => {
//     const { user, error, session } = result;

//     if (error) {
//         handleError(error);
//         return;
//     }

//     if (user) {
//         await handleUserSession(user, session);
//     }
// };

// const handleUserSession = async (user: User, session: Session): Promise<void> => {
//     saveAuthUserAndSession(user, session);

//     await upsertUserProfile(user).catch((error) => {
//         handleError(error);
//     });

//     welcomeMessage(user);
// };

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

const handleOAuthLogin = async (provider: Provider, redirectTo: string) => {
    if (!provider) return;
    try {
        const options = {
            redirectTo: `${window.location.origin}/profile?tab=profile`,
            scopes: '',
        };

        if (provider === 'google') {
            options.scopes = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';
        }

        const result = await supabase.auth.signInWithOAuth({
            provider,
            options,
        })

    } catch (error) {
        handleError({
            error,
            helperText: "Error logging in with OAuth. Please try again."
        });
    }
};

const fetchCurrentUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user || null;
}

const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (data.user && !error) {
        return {
            email: data?.user?.email,
            redirect: "/profile"
        }
    } else {
        handleError({
            error,
            helperText: error?.message || "An error occurred while signing in. Please try again."
        });
    }
}

const signup = async (email: string, password: string): Promise<void> => {
    try {
        const result = await supabase.auth.signUp({ email, password });
        const { error, data } = result;
        if (data.user && !error) {
            setHelperText({
                error: false,
                message: "A confirmation email has been sent. Please check your inbox."
            });
        } else {
            handleError({
                error,
                helperText: error?.message || "An error occurred while signing up. Please try again."
            });
        }
    } catch (error) {
        handleError({
            error,
            helperText: "An error occurred while signing up. Please try again."
        });
    }
};

const logout = async (): Promise<void> => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            handleError({
                error,
                helperText: error?.message || "Error logging out. Please try again."
            })
        } else {
            emptyEventsOnLogout();
            addToast("Logged out successfully", { duration: 5000, closable: true });
        }
    } catch (error) {
        handleError({
            error,
            helperText: "Error logging out. Please try again."
        })
    }
};

const initializeAuthListener = (): void => {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
            // await handleUserSession(session.user, session);
        } else if (event === "SIGNED_OUT") {
            // clearAuthUserAndSession();
            // setHelperText(true, "You have been signed out.");
        }
    });
};

const verifyOTPSignUpToken = async (token: string): Promise<VerificationData> => {
    if (!token) {
        handleError({
            error: new Error("No access token provided."),
            helperText: "verifySignUpToken: No access token provided.",
        });
    }

    const { data } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
    });

    return {
        user: data.user ?? null,
        session: data.session ?? null,
    };
};

const confirmSignup = async (token: string): Promise<SignupConfirmationReturnData> => {
    try {
        const verificationData = await verifyOTPSignUpToken(token);
        return {
            confirmed: true,
            error: {
                isError: false
            },
            data: {
                user: verificationData.user
            }
        };
    } catch (error) {
        return {
            confirmed: false,
            error: {
                isError: true,
                message: (error as Error).message || "Error verifying the signup token. Please try again.",
                status: (error as Error).message || "Error verifying the signup token. Please try again.",
            },
        };
    }
};

export {
    signInWithPassword,
    signup,
    logout,
    confirmSignup,
    fetchCurrentUser,
    initializeAuthListener,
    handleOAuthLogin
}