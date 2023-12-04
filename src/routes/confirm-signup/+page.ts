import type { PageLoad } from './$types';
import { authenticationConfirmationService } from "$lib/services/auth/authentication-confirmation-service";
import { setHelperText } from '$lib/stores/reactiveTextStore';

const { confirmSignUp } = authenticationConfirmationService;

export const load: PageLoad = async ({ url }) => {
    const token = url.searchParams.get('token');

    if (!token) {
        setHelperText(true, "No token provided for confirmation.");
        throw new Error("No token provided.");
    }

    try {
        const confirmationResult = await confirmSignUp(token);

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
