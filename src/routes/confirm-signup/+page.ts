import type { PageLoad } from './$types';
import { confirmSignup, upsertUserProfile } from "$lib/services";
import { setHelperText } from '$lib/stores';

export const load: PageLoad = async ({ url }): Promise<ConfirmSignupPageData> => {
    const token = url.searchParams.get('token');

    if (!token) {
        return {
            status: 400,
            error: true,
            message: 'No token provided.',
            props: {},
        };
    }

    const { data, confirmed, error: confirmedSignupError } = await confirmSignup(token);

    if (confirmed && data?.user) {
        await upsertUserProfile(data.user);
    }

    if (confirmedSignupError.isError) {
        setHelperText({
            error: true,
            message: confirmedSignupError.message,
        });

        return {
            status: 500,
            error: true,
            message: confirmedSignupError.message,
            props: {},
        };
    } else if (confirmed) {
        return {
            status: 200,
            error: false,
            message: 'Your signup has been confirmed. You can now login!',
            redirect: '/login',
            props: {},
        };
    }

    return {
        status: 500,
        error: true,
        message: 'Error confirming signup.',
        props: {},
    };
};

