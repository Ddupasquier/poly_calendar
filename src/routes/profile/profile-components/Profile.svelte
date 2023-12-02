<script lang="ts">
    import type { ProfileUser } from "$lib/models/profile/profile-user";

    import { authUser } from "$lib/stores/userStore";
    import { shortDate } from "$lib/utils/utils";
    import { colors } from "$lib/palette";
    import ProfileSection from "./profile-tab-components/ProfileSection.svelte";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import {
        faCalendar,
        faLock,
        faMailBulk,
        faPowerOff,
        faPhone,
        faUser,
        faGlobe,
        faBirthdayCake,
        faInfo,
    } from "@fortawesome/free-solid-svg-icons";
    import ProfileInfoItem from "./profile-tab-components/ProfileInfoItem.svelte";

    export let profileData: ProfileUser | undefined = undefined;
</script>

<div class="profile-container">
    <ProfileSection header="Account Information">
        <ProfileInfoItem
            label="Username"
            value={profileData?.username}
            icon={faUser}
            color={colors["--color-theme-2-D1"]}
        />
        <ProfileInfoItem
            label="Email"
            value={$authUser?.email}
            additional={$authUser?.email_confirmed_at
                ? " (Confirmed)"
                : " (Unconfirmed)"}
            icon={faMailBulk}
            color={colors["--color-theme-2-D1"]}
        />
        <ProfileInfoItem
            label="Phone"
            value={profileData?.phone}
            icon={faPhone}
            color={colors["--color-theme-2-D1"]}
        />
    </ProfileSection>

    <ProfileSection header="Personal Details">
        <ProfileInfoItem
            label="Language"
            value={profileData?.language}
            icon={faGlobe}
            color={colors["--color-theme-2-D1"]}
        />
        <ProfileInfoItem
            label="Birthday"
            value={shortDate(profileData?.birthday)}
            icon={faBirthdayCake}
            color={colors["--color-theme-2-D1"]}
        />
        <ProfileInfoItem
            label="About"
            value={profileData?.about}
            icon={faInfo}
            color={colors["--color-theme-2-D1"]}
        />
    </ProfileSection>

    <ProfileSection header="Membership Details">
        <ProfileInfoItem
            label="Member Since"
            value={shortDate($authUser?.created_at)}
            icon={faCalendar}
            color={colors["--color-theme-2-D1"]}
        />
        <ProfileInfoItem
            label="Last Login"
            value={shortDate($authUser?.last_sign_in_at)}
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
    </ProfileSection>
</div>

<style lang="scss">
    .profile-container {
        position: relative;
        background: var(--color-bg-2);
        padding: 20px;
        border-radius: var(--primary-border-radius);
    }

    .profile-container::after {
        content: "";
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        z-index: -1;
        background: linear-gradient(
            to bottom,
            var(--color-theme-1),
            rgba(0, 123, 255, 0)
        );
        border-radius: inherit;
        pointer-events: none;
    }

    .profile-section {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;

        &:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
    }

    .profile-header {
        font-size: 24px;
        color: var(--color-text-dark);
        margin-bottom: 10px;
    }

    .profile-info {
        font-size: 16px;
        color: var(--color-text-light);
        line-height: 1.5;
    }

    .profile-info strong {
        color: var(--color-text-light);
    }
</style>
