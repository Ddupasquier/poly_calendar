<script lang="ts">
    import type { UserProfileModel } from "$lib/models/profile/user-profile-model";
    import { profileStructure } from "./profile-sections-and-info";
    import { dateTimeUtils } from "$lib/utils/date-time-utils";
    const { formatDate } = dateTimeUtils;
    import ProfileSection from "./ProfileSection.svelte";
    import ProfileInfoItem from "./ProfileInfoItem.svelte";
    import type { AuthUser } from "@supabase/supabase-js";
    import { authUser } from "$lib/stores/userStore";

    export let profileData: UserProfileModel | undefined = undefined;

    $: console.log("profileData", profileData);
    $: console.log("authUser", $authUser);

    const getProfileModelValue = (item: {
        column: keyof UserProfileModel;
    }): string | number | boolean | undefined => {
        if (!profileData) return false;
        return profileData[item.column];
    };

    const getAuthUserValue = (item: {
        column: keyof AuthUser;
    }): string | number | boolean | undefined => {
        if (!$authUser) return false;
        return $authUser[item.column];
    };

    const getValue = (item: {
        column: keyof UserProfileModel | keyof AuthUser;
    }): string | number | boolean | undefined => {
        if (profileData) {
            return getProfileModelValue(item);
        } else if ($authUser) {
            return getAuthUserValue(item);
        } else {
            return undefined;
        }
    };

    const getAdditional = (item: {
        column: keyof UserProfileModel | keyof AuthUser;
    }): string | undefined => {
        if (item.column === "confirmed_at") {
            return getConfirmedStatus(getValue(item) as boolean);
        } else if (item.column === "created_at") {
            return formatDate(getValue(item) as string);
        } else {
            return undefined;
        }
    };

    const getConfirmedStatus = (confirmed: boolean): string => {
        return confirmed ? "Confirmed" : "Unconfirmed";
    };
</script>



<div class="profile-container">
    {#if profileData}
        {#each profileStructure as section}
            <ProfileSection header={section.sectionTitle}>
                {#each section.infoSections as item}
                    <ProfileInfoItem
                        label={item.label}
                        column={item.column}
                        value={getValue(item)}
                        additional={getAdditional(item)}
                        icon={item.icon}
                        color={item.color}
                        type={item.type}
                    />
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
