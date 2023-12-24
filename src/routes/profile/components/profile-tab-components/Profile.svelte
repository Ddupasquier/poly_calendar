<script lang="ts">
    import type { AuthUser } from "@supabase/supabase-js";

    import { Common } from "$lib/components";
    import { ProfileSection, ProfileInfoItem, profileStructure } from "../..";

    import type { UserProfileModel } from "$lib/models";
    import {
        authUser,
        checkLocalStorageForVerificationStatus,
    } from "$lib/stores";

    import { checkDate, formatDate } from "$lib/utils";

    export let profileData: UserProfileModel | null;

    const getValue = (item: {
        column: keyof UserProfileModel | keyof AuthUser | string;
        type?: string;
        label?: string;
    }): string | number | boolean | undefined => {
        if (profileData && item.column in profileData) {
            const profileValue =
                profileData[item.column as keyof UserProfileModel];
            if (item.type === "date") {
                const dateString = profileValue as string;
                return checkDate(dateString) ? formatDate(dateString) : "";
            } else if (
                typeof profileValue === "string" ||
                typeof profileValue === "number" ||
                typeof profileValue === "boolean"
            ) {
                return profileValue;
            }
        }

        if ($authUser && item.column in $authUser) {
            const authUserValue = $authUser[item.column as keyof AuthUser];

            if (item.type === "date") {
                const dateString = authUserValue as string;
                return checkDate(dateString) ? formatDate(dateString) : "";
            } else if (item.label === "Account Status") {
                return `${
                    checkLocalStorageForVerificationStatus()
                        ? "Secure"
                        : "Not Secure"
                }`;
            } else if (
                typeof authUserValue === "string" ||
                typeof authUserValue === "number" ||
                typeof authUserValue === "boolean"
            ) {
                return authUserValue;
            }
        }

        return undefined;
    };

    const getAdditional = (item: {
        column: keyof UserProfileModel | keyof AuthUser | string;
    }): string | undefined => {
        if (item.column === "email") {
            return `${
                checkLocalStorageForVerificationStatus()
                    ? "(Verified)"
                    : "(Unverified)"
            }`;
        } else {
            return undefined;
        }
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
                        value={String(getValue(item))}
                        additional={getAdditional(item)}
                        icon={item.icon}
                        color={item.color}
                        type={item.type}
                        editable={item.editable}
                    />
                {/each}
            </ProfileSection>
        {/each}
    {:else}
        <div class="loader">
            <Common.Loader size="medium" color="var(--color-theme-2)" />
        </div>
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
