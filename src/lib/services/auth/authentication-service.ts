import { addToast, emptyEventsOnLogout, setHelperText } from "$lib/stores";
import { supabase } from "$lib/supabase";
import { handleError } from "$lib/utils";
import type { Provider, Session, User } from "@supabase/supabase-js";

// Interfaces
interface SignupConfirmationReturnData {
    confirmed: boolean;
    error: AuthError;
    data?: VerificationData;
}

interface PasswordSigninReturnData {
    email?: string | null;
    redirect?: string;
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

// ============================================================
// Helper functions
// ============================================================

/**
 * Displays a welcome message to the user after successful sign-in, with a context-specific message.
 * @param {User} user - The authenticated user's information.
 */
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

// ============================================================
// Authentication methoda
// ============================================================

/**
 * Initiates the sign-in process with an OAuth provider and sets appropriate scopes for access.
 * @param {Provider} provider - The OAuth provider to authenticate with (e.g., 'google').
 * @param {string} redirectTo - The URL where the user should be redirected after authentication.
 * @returns {Promise<void>} - A promise that resolves when the OAuth login process is complete.
 * @throws {Error} If the OAuth login process fails or the provider is not supported.
 */
const handleOAuthLogin = async (provider: Provider, redirectTo: string): Promise<void> => {
    if (!provider) {
        throw new Error('No OAuth provider provided.');
    };
    
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

/**
 * Retrieves the current user from the authentication session.
 * @returns {Promise<User | null>} A promise resolving to the current user or null if not authenticated.
 */
const fetchCurrentUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user || null;
}

/**
 * Authenticates a user using their email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<PasswordSigninReturnData | undefined>} A promise resolving to the sign-in data or undefined if sign-in fails.
 * @throws {Error} If sign-in fails due to invalid credentials or other reasons.
 */
const signInWithPassword = async (email: string, password: string): Promise<PasswordSigninReturnData | undefined> => {
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

/**
 * Registers a new user with an email and password.
 * @param {string} email - The new user's email address.
 * @param {string} password - The new user's password.
 * @returns {Promise<void>} A promise that resolves when the registration process is complete.
 * @throws {Error} If registration fails due to issues such as email already in use.
 */
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

/**
 * Logs the current user out of the application.
 * @returns {Promise<void>} A promise that resolves when the logout process is complete.
 * @throws {Error} If logout fails, typically due to network issues or server errors.
 */
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

/**
 * Sets up a listener to handle authentication state changes, such as when a user signs in or out.
 */
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

/**
 * Verifies a sign-up token, typically used in email confirmation flows.
 * @param {string} token - The token to verify the user's email address.
 * @returns {Promise<VerificationData>} A promise resolving to the user and session data if the token is valid.
 * @throws {Error} If the token is invalid or verification fails.
 */
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

/**
 * Confirms a user's sign-up process, often after they have verified their email through a token.
 * @param {string} token - The token used for confirming the user's signup.
 * @returns {Promise<SignupConfirmationReturnData>} A promise resolving to the result of the signup confirmation.
 * @throws {Error} If confirmation fails, such as when the token is invalid or expired.
 */
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