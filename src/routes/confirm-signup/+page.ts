import type { PageLoad } from './$types';
import { confirmSignUp } from "$lib/services";

export const load: PageLoad = async ({ url }) => {
    const token = url.searchParams.get('token');
    if (!token) {
        return {
            status: 400,
            error: new Error('No token provided.'),
        };
    }

    try {
        const confirmationResult = await confirmSignUp(token);
        return { token, confirmationResult };
    } catch (error) {
        return {
            status: 500,
            error: new Error('Error during confirmation.'),
        };
    }
};

