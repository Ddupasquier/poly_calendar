import { Profile, Settings } from '../../../routes/profile';

const navigationButtons = [
    {
        label: 'Profile',
        path: '/profile?tab=profile',
        component: (Profile ? Profile : null),
        requiresProfileData: true
    },
    {
        label: 'Settings',
        path: '/profile?tab=settings',
        component: (Settings ? Settings : null),
        requiresProfileData: true
    },
];

export { navigationButtons }