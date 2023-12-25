import { fetchCurrentUser } from '$lib/services';
import { setCurrentUserProviders } from '$lib/stores';
import { supabase } from '$lib/supabase';
import type { PageLoad } from './$types';

export const load: PageLoad = async (): Promise<AppLayoutData> => {
    const currentUser = await fetchCurrentUser();
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (!sessionError && sessionData?.session?.user?.app_metadata?.providers) {
        const providers = sessionData.session.user.app_metadata.providers;

        setCurrentUserProviders(providers);
    }

    if (currentUser) {
        return {
            status: 200,
            message: 'You are logged in',
            error: false,
            props: {
                currentUser
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
