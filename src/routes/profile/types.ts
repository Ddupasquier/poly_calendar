import type { UserProfileModel } from '$lib/models/profile/user-profile-model';
import type { UserSettingsModel } from '$lib/models/profile/user-settings-model';

interface ComponentProps {
    profileData?: UserProfileModel;
    settingsData?: UserSettingsModel;
};

export type { ComponentProps };