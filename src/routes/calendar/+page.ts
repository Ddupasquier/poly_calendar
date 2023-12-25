import type { PageLoad } from './$types';
import { fetchEvents } from '$lib/stores';

export const load: PageLoad = async () => {
    const events = await fetchEvents();

    return {
        props: {
            events
        }
    };
};


