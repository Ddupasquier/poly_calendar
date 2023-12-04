<script lang="ts">
    // Svelte-specific imports: Framework imports for lifecycle and reactivity.

    // Supabase imports: Authentication and database connections for user management and data retrieval.
    import type { AuthUser } from "@supabase/supabase-js";

    // UI components: Custom Svelte components and UI elements from design system libraries.
    import { Common } from "$lib/components";
    import ProfileSection from "./ProfileSection.svelte";
    import ProfileInfoItem from "./ProfileInfoItem.svelte";

    // Services: Business logic, API calls, and other service-related interactions.

    // Models: Type definitions and interfaces for structured data representation.
    import type { UserProfileModel } from "$lib/models";
    import { profileStructure } from "./profile-sections-and-info";

    // Utilities and constants: Reusable code snippets and app-wide constants for color schemes, etc.

    // Store: Svelte stores and reactive variables for state management (placeholder for future additions).
    import {
        authUser,
        checkLocalStorageForVerificationStatus,
    } from "$lib/stores/userStore";

    // Helpers: Utility functions for common tasks like formatting dates or numbers (placeholder for future additions).
    import { dateTimeUtils } from "$lib/utils/date-time-utils";
    import { colors } from "$lib/constants/palette";
    const { formatDate, checkDate } = dateTimeUtils;

    // Global styles: Centralized styling sheets that define universal CSS rules for the app (placeholder for future additions).

    export let profileData: UserProfileModel | undefined = undefined;

    const getValue = (item: {
        column: keyof UserProfileModel | keyof AuthUser;
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
        column: keyof UserProfileModel | keyof AuthUser;
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
                        value={getValue(item)}
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
        <Common.Loader size={"small"} color={colors["--color-theme-2-D1"]} />
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
