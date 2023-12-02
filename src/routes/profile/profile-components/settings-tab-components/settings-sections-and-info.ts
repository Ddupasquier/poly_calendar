import {
    faCalendar,
    faMailBulk,
    faUser,
    faPhotoFilm,
    faPersonThroughWindow,
    faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";
import { colors } from "$lib/palette";
import type {
    IconDefinition
} from "@fortawesome/fontawesome-svg-core";
import type { UserSettingsModel } from "$lib/models/profile/user-settings-model";

export interface InfoSection {
    label: string;
    column: keyof UserSettingsModel;
    icon: IconDefinition;
    color: string;
    editable: boolean;
}

interface SettingsSection {
    sectionTitle: string;
    infoSections: InfoSection[];
}

interface SettingsStructure extends Array<SettingsSection> { }

const settingsStructure: SettingsStructure = [
    {
        sectionTitle: "Privacy Settings",
        infoSections: [
            {
                label: "Album Privacy",
                column: "album_privacy_enabled",
                icon: faPhotoFilm,
                color: colors["--color-theme-2-D1"],
                editable: true
            },
            {
                label: "Profile Visibility",
                column: "profile_visibility_public",
                icon: faUser,
                color: colors["--color-theme-2-D1"],
                editable: true
            },
            {
                label: "Calendar Privacy",
                column: "calendar_privacy_enabled",
                icon: faCalendar,
                color: colors["--color-theme-2-D1"],
                editable: true
            },
            {
                label: "Email Notifications",
                column: "email_notifications_enabled",
                icon: faMailBulk,
                color: colors["--color-theme-2-D1"],
                editable: true
            },
            {
                label: "Push Notifications",
                column: "push_notifications_enabled",
                icon: faPersonThroughWindow,
                color: colors["--color-theme-2-D1"],
                editable: true
            }
        ]
    },
    {
        sectionTitle: "Customization Settings",
        infoSections: [
            {
                label: "Theme",
                column: "theme_dark_mode_enabled",
                icon: faPaintBrush,
                color: colors["--color-theme-2-D1"],
                editable: true
            }
        ]
    }
]


export { settingsStructure };
export type { SettingsStructure };