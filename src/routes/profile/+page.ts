import type { PageLoad } from './$types';
import { getUserProfile, getUserSettings } from '$lib/services';

export const load: PageLoad = async () => {
    try {
        const promises = [getUserProfile(), getUserSettings()];
        const [userProfile, userSettings] = await Promise.all(promises);

        return { userProfile, userSettings };
    } catch (error) {
        console.error('Error loading user data:', error);
        return { userProfile: null, userSettings: null };
    }
};
