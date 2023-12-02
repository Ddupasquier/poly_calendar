import { Profile, Settings } from './profile-components';

const navigationButtons = [
    {
        label: 'Profile',
        path: '/profile?tab=profile',
        component: Profile,
        requiresProfileData: true
    },
    {
        label: 'Settings',
        path: '/profile?tab=settings',
        component: Settings,
        requiresProfileData: true
    },
];

export { navigationButtons }