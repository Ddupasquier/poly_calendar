import {
    faUser,
    faMailBulk,
    faPhone,
    faGlobe,
    faBirthdayCake,
    faInfo,
    faCalendar,
    faPowerOff,
    faLock,
} from "@fortawesome/free-solid-svg-icons";
import { constants } from "$lib/constants";
const { colors } = constants;
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ProfileInfoItem {
    label: string;
    column: string;
    value?: string;
    icon: IconDefinition;
    color: string;
    type?: "text" | "tel" | "date";
    additional?: string;
    editable?: boolean;
}

interface ProfileSection {
    sectionTitle: string;
    infoSections: ProfileInfoItem[];
}

interface ProfileStructure extends Array<ProfileSection> { }

const profileStructure: ProfileStructure = [
    {
        sectionTitle: "Account Information",
        infoSections: [
            {
                label: "Username",
                column: "username",
                icon: faUser,
                color: colors["--color-theme-2-D1"],
                type: "text",
                editable: true
            },
            {
                label: "First",
                column: "first_name",
                icon: faUser,
                color: colors["--color-theme-2-D1"],
                type: "text",
                editable: true
            },
            {
                label: "Last",
                column: "last_name",
                icon: faUser,
                color: colors["--color-theme-2-D1"],
                type: "text",
                editable: true
            },
            {
                label: "Email",
                column: "email",
                icon: faMailBulk,
                color: colors["--color-theme-2-D1"],
                type: "text",
                editable: true
            },
            {
                label: "Phone",
                column: "phone",
                icon: faPhone,
                color: colors["--color-theme-2-D1"],
                type: "tel",
                editable: true
            }
        ]
    },
    {
        sectionTitle: "Personal Details",
        infoSections: [
            {
                label: "Language",
                column: "language",
                icon: faGlobe,
                color: colors["--color-theme-2-D1"],
                type: "text",
                editable: true
            },
            {
                label: "Birthday",
                column: "birthday",
                icon: faBirthdayCake,
                color: colors["--color-theme-2-D1"],
                type: "date",
                editable: true
            },
            {
                label: "About",
                column: "about",
                icon: faInfo,
                color: colors["--color-theme-2-D1"],
                type: "text",
                editable: true
            }
        ]
    },
    {
        sectionTitle: "Membership Details",
        infoSections: [
            {
                label: "Member Since",
                column: "created_at",
                icon: faCalendar,
                color: colors["--color-theme-2-D1"]
            },
            {
                label: "Last Login",
                column: "last_sign_in_at",
                icon: faPowerOff,
                color: colors["--color-theme-2-D1"]
            }
        ]
    },
    {
        sectionTitle: "Security",
        infoSections: [
            {
                label: "Account Status",
                column: "confirmed_at",
                icon: faLock,
                color: colors["--color-theme-2-D1"]
            }
        ]
    }
];

export { profileStructure };
export type { ProfileStructure };
