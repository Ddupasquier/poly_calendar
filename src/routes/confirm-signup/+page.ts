import type { PageLoad } from './$types';
import { authenticationConfirmationService } from "$lib/services/auth/authentication-confirmation-service";
import { setHelperText } from '$lib/stores/reactiveTextStore';
import { startCountdownWithMessage } from '$lib/utils/utils';

const { confirmSignUp } = authenticationConfirmationService;

export const load: PageLoad = async ({ url }) => {
    const token = url.searchParams.get('token');

    if (!token) {
        setHelperText(true, "No token provided for confirmation.");
        throw new Error("No token provided.");
    }

    try {
        const confirmationResult = await confirmSignUp(token);

        if (confirmationResult !== undefined) {
            setHelperText(false, `${startCountdownWithMessage(5, "Sign up confirmed successfully. You will be redirected in {timer} seconds...")}`);
            
            setTimeout(() => {
                window.location.href = "/profile?tab=profile";
            }, 5000);
        }

        return {
            token,
            confirmationResult
        };

    } catch (error) {
        setHelperText(true, "Error confirming sign up. Please try again.");

        return {
            token,
            error: "Error in confirmation."
        };
    }
};
