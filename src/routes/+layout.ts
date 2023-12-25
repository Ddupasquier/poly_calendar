import { fetchCurrentUser } from '$lib/services';
import type { PageLoad } from './$types';

export const load: PageLoad = async (): Promise<AppLayoutData> => {
    const currentUser = await fetchCurrentUser();

    if (currentUser) {
        return {
            status: 200,
            message: 'You are logged in',
            error: false,
            props: {
                currentUser,
            },
        }
    } else {
        return {
            status: 302,
            redirect: '/login',
            message: 'You must be logged in to view this page',
            error: true,
            props: {
                currentUser
            }
        }
    }
};
