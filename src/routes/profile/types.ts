import type { UserProfileModel } from '$lib/models';
import type { UserSettingsModel } from '$lib/models';

interface ComponentProps {
    profileData?: UserProfileModel;
    settingsData?: UserSettingsModel;
};

export type { ComponentProps };