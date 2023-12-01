import { Profile, Settings } from './profile-components';

const navigationButtons = [
    {
        label: 'Profile',
        path: '/profile?tab=profile',
        component: Profile
    },
    {
        label: 'Settings',
        path: '/profile?tab=settings',
        component: Settings
    },
];

export { navigationButtons }