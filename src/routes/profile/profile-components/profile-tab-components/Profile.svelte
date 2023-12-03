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

    const getValue = (item: {
        column: keyof UserProfileModel | keyof AuthUser;
        type?: string;
    }): string | number | boolean | undefined => {
        // Check if the property is part of UserProfileModel and profileData is available
        if (
            profileData &&
            item.column in profileData &&
            typeof item.column === "string"
        ) {
            const profileValue =
                profileData[item.column as keyof UserProfileModel];
            if (
                typeof profileValue === "string" ||
                typeof profileValue === "number" ||
                typeof profileValue === "boolean"
            ) {
                return profileValue;
            }
            if (profileValue instanceof Date) {
                return formatDate(profileValue);
            }
        }

        // Check if the property is part of AuthUser and $authUser is available
        if (
            $authUser &&
            item.column in $authUser &&
            typeof item.column === "string"
        ) {
            const authUserValue = $authUser[item.column as keyof AuthUser];
            if (
                typeof authUserValue === "string" ||
                typeof authUserValue === "number" ||
                typeof authUserValue === "boolean"
            ) {
                return authUserValue;
            }
            if (authUserValue instanceof Date) {
                return formatDate(authUserValue);
            }
        }

        return undefined;
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
                        value={getValue({ ...item, type: item.type })}
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
