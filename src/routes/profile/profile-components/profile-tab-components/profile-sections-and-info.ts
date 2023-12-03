import {
    faBirthdayCake,
    faInfoCircle,
    faLanguage,
    faMailBulk,
    faPhone,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { colors } from "$lib/palette";
import type {
    IconDefinition
} from "@fortawesome/fontawesome-svg-core";
import type { UserProfileModel } from "$lib/models/profile/user-profile-model";
import type { AuthUser } from "@supabase/supabase-js";
import {authUser} from "$lib/stores/userStore";

type ProfileOrAuthUserKey = keyof UserProfileModel | keyof AuthUser;

interface InfoSection {
    label: string;
    column: ProfileOrAuthUserKey;
    icon?: IconDefinition;
    color: string;
    editable: boolean;
    additional?: string;
    type: "text" | "date" | "tel";
}

interface ProfileSection {
    sectionTitle: string;
    infoSections: InfoSection[];
}

interface ProfileStructure extends Array<ProfileSection> { }

/*

<!-- <ProfileSection header="Account Information">
        <ProfileInfoItem
            label="Username"
            column="username"
            value={profileData?.username}
            icon={faUser}
            color={colors["--color-theme-2-D1"]}
            type="text"
        />
        <ProfileInfoItem
            label="First"
            column="first_name"
            value={profileData?.first_name}
            icon={faUser}
            color={colors["--color-theme-2-D1"]}
            type="text"
        />
        <ProfileInfoItem
            label="Last"
            column="last_name"
            value={profileData?.last_name}
            icon={faUser}
            color={colors["--color-theme-2-D1"]}
            type="text"
        />
        <ProfileInfoItem
            label="Email"
            column="email"
            value={profileData?.email}
            additional={$authUser?.email_confirmed_at
                ? " (Confirmed)"
                : " (Unconfirmed)"}
            icon={faMailBulk}
            color={colors["--color-theme-2-D1"]}
            type="text"
        />
        <ProfileInfoItem
            label="Phone"
            column="phone"
            value={profileData?.phone}
            icon={faPhone}
            color={colors["--color-theme-2-D1"]}
            type="tel"
        />
    </ProfileSection>

    <ProfileSection header="Personal Details">
        <ProfileInfoItem
            label="Language"
            column="language"
            value={profileData?.language}
            icon={faGlobe}
            color={colors["--color-theme-2-D1"]}
            type="text"
        />
        <ProfileInfoItem
            label="Birthday"
            column="birthday"
            value={formatDate(profileData?.birthday)}
            icon={faBirthdayCake}
            color={colors["--color-theme-2-D1"]}
            type="date"
        />
        <ProfileInfoItem
            label="About"
            column="about"
            value={profileData?.about}
            icon={faInfo}
            color={colors["--color-theme-2-D1"]}
            type="text"
        />
    </ProfileSection>

    <ProfileSection header="Membership Details">
        <ProfileInfoItem
            label="Member Since"
            value={formatDate($authUser?.created_at)}
            icon={faCalendar}
            color={colors["--color-theme-2-D1"]}
        />
        <ProfileInfoItem
            label="Last Login"
            value={formatDate($authUser?.last_sign_in_at)}
            icon={faPowerOff}
            color={colors["--color-theme-2-D1"]}
        />
    </ProfileSection>

    <ProfileSection header="Security">
        <ProfileInfoItem
            label="Account Status"
            value={$authUser?.confirmed_at ? "Secure" : "Action Required"}
            icon={faLock}
            color={colors["--color-theme-2-D1"]}
        />
    </ProfileSection> -->

*/

const profileStructure: ProfileStructure = [
    {
        sectionTitle: "Personal Information",
        infoSections: [
            {
                label: "Username",
                column: "username",
                icon: faUser,
                color: colors["--color-theme-2-D1"],
                editable: true,
                type: "text"
            },
            {
                label: "Email",
                column: "email",
                icon: faMailBulk,
                color: colors["--color-theme-2-D1"],
                additional: "getConfirmedStatus(authUser)",
                editable: true,
                type: "text"
            },
            {
                label: "Phone",
                column: "phone",
                icon: faPhone,
                color: colors["--color-theme-2-D1"],
                editable: true,
                type: "tel"
            },
            {
                label: "Language",
                column: "language",
                icon: faLanguage,
                color: colors["--color-theme-2-D1"],
                editable: true,
                type: "text"
            },
            {
                label: "Birthday",
                column: "birthday",
                icon: faBirthdayCake,
                color: colors["--color-theme-2-D1"],
                editable: true,
                type: "date"
            },
            {
                label: "About",
                column: "about",
                icon: faInfoCircle,
                color: colors["--color-theme-2-D1"],
                editable: true,
                type: "text"
            }
        ]
    },
    {
        sectionTitle: "Membership Details",
        infoSections: [
            {
                label: "Member Since",
                column: "created_at",
                // icon: faCalendar,
                color: colors["--color-theme-2-D1"],
                editable: false,
                type: "date"
            },
            {
                label: "Last Login",
                column: "last_login_at",
                // icon: faPowerOff,
                color: colors["--color-theme-2-D1"],
                editable: false,
                type: "date"
            }
        ]
    },
    {
        sectionTitle: "Security",
        infoSections: [
            {
                label: "Account Status",
                column: "confirmed_at" as keyof AuthUser,
                // icon: faLock,
                color: colors["--color-theme-2-D1"],
                editable: false,
                type: "text"
            }
        ]
    },
    {
        sectionTitle: "Social Media",
        infoSections: [
            {
                label: "Facebook",
                column: "facebook_url",
                // icon: faFacebook,
                color: colors["--color-theme-2-D1"],
                editable: true,
                type: "text"
            },
            {
                label: "Twitter",
                column: "twitter_url",
                // icon: faTwitter,
                color: colors["--color-theme-2-D1"],
                editable: true,
                type: "text"
            },
            {
                label: "Instagram",
                column: "instagram_url",
                // icon: faInstagram,
                color: colors["--color-theme-2-D1"],
                editable: true,
                type: "text"
            },
            {
                label: "LinkedIn",
                column: "linkedin_url",
                // icon: faLinkedin,
                color: colors["--color-theme-2-D1"],
                editable: true,
                type: "text"
            }
        ]
    }
];

export { profileStructure };
export type { ProfileStructure, InfoSection };