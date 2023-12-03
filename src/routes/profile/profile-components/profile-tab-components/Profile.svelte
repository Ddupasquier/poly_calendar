<script lang="ts">
    import type { UserProfileModel } from "$lib/models/profile/user-profile-model";
    import { profileStructure } from "./profile-sections-and-info";
    import { dateTimeUtils } from "$lib/utils/date-time-utils";
    const { formatDate } = dateTimeUtils;
    import ProfileSection from "./ProfileSection.svelte";
    import ProfileInfoItem from "./ProfileInfoItem.svelte";

    export let profileData: UserProfileModel | undefined = undefined;
</script>

<div class="profile-container">
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

    {#if profileData}
        {#each profileStructure as section}
            <ProfileSection header={section.sectionTitle}>
                {#each section.infoSections as item}
                    {#if item.type === "date"}
                        <ProfileInfoItem
                            label={item.label}
                            column={item.column}
                            value={formatDate(profileData[item.column])}
                            additional={item?.additional}
                            icon={item.icon}
                            color={item.color}
                            type={item.type}
                        />
                    {:else if item.type === "tel"}
                        <ProfileInfoItem
                            label={item.label}
                            column={item.column}
                            value={profileData[item.column]}
                            additional={item?.additional}
                            icon={item.icon}
                            color={item.color}
                            type={item.type}
                        />
                    {:else if item.type === "text"}
                        <ProfileInfoItem
                            label={item.label}
                            column={item.column}
                            value={profileData[item.column]}
                            additional={item?.additional}
                            icon={item.icon}
                            color={item.color}
                            type={item.type}
                        />
                    {:else if item.type === "email"}
                        <ProfileInfoItem
                            label={item.label}
                            column={item.column}
                            value={profileData[item.column]}
                            additional={item?.additional}
                            icon={item.icon}
                            color={item.color}
                            type={item.type}
                        />
                    {:else}
                        <ProfileInfoItem
                            label={item.label}
                            column={item.column}
                            value={profileData[item.column]}
                            additional={item?.additional}
                            icon={item.icon}
                            color={item.color}
                            type={item.type}
                        />
                    {/if}
                {/each}
            </ProfileSection>
        {/each}
    {:else}
        <div>Loading profile...</div>
    {/if}
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
            rgba(0, 0, 0, 0)
        );
        border-radius: inherit;
        pointer-events: none;
    }
</style>
