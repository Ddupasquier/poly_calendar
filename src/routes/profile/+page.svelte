<script lang="ts">
    // Svelte-specific imports: Framework imports for lifecycle and reactivity.
    import { onMount } from "svelte";

    // Supabase imports: Authentication and database connections for user management and data retrieval.

    // UI components: Custom Svelte components and UI elements from design system libraries.
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
    import { Button, Loader } from "mysvelte-ui";

    import AuthLoginSignup from "$lib/components/auth/AuthLoginSignup.svelte";
    import Profile from "./profile-components/profile-tab-components/Profile.svelte";
    import Settings from "./profile-components/settings-tab-components/Settings.svelte";

    // Services: Business logic, API calls, and other service-related interactions.
    import { authenticationService } from "$lib/services/auth/authentication-service";
    const { logout } = authenticationService;

    import { userProfileManagementService } from "$lib/services/profile/profile-services/user-profile-management-service";
    const { getUserProfile } = userProfileManagementService;

    import { userSettingsManagementService } from "$lib/services/profile/settings-services/user-settings-management-service";
    const { getUserSettings } = userSettingsManagementService;

    // Models: Type definitions and interfaces for structured data representation.
    import type { UserProfileModel } from "$lib/models/profile/user-profile-model";
    import type { UserSettingsModel } from "$lib/models/profile/user-settings-model";
    import type { ComponentProps } from "./types";

    // Utilities and constants: Reusable code snippets and app-wide constants for color schemes, etc.
    import { colors } from "$lib/palette";
    import { navigationButtons } from "./constants";

    // Store: Svelte stores and reactive variables for state management (placeholder for future additions).
    import {
        checkLocalStorageForVerificationStatus,
        authUser as storedAuthUser,
    } from "$lib/stores/userStore";

    // Helpers: Utility functions for common tasks like formatting dates or numbers (placeholder for future additions).
    import { inRotateScale } from "$lib/transitions/in-rotate-scale";

    // Global styles: Centralized styling sheets that define universal CSS rules for the app (placeholder for future additions).

    let isLoading: boolean = true;
    let profileData: UserProfileModel | null;
    let settingsData: UserSettingsModel | null;
    let componentProps: ComponentProps = {};

    let selectedOption = "login";

    const buttonStyles: string = `
    background: ${colors["--color-theme-1"]};
    color: ${colors["--color-text-white"]};
    width: 100%;
    `;

    $: authUserPresent = $storedAuthUser && !isObjectEmpty($storedAuthUser);

    onMount(async () => {
        if ($storedAuthUser) {
            selectedOption = "profile";
            profileData = await getUserProfile($storedAuthUser);
            settingsData = await getUserSettings($storedAuthUser);
        }

        if (profileData) {
            componentProps.profileData = profileData;
        }

        if (settingsData) {
            componentProps.settingsData = settingsData;
        }

        isLoading = false;
    });

    const isObjectEmpty = (obj: object): boolean => {
        return Object.keys(obj).length === 0;
    };
</script>

{#if !authUserPresent}
    {#if isLoading}
        <div class="loader">
            <Loader.Elips color={colors["--color-theme-2-D1"]} speed={"fast"} />
        </div>
    {:else}
        <AuthLoginSignup />
    {/if}
{:else}
    <div class="container">
        <div class="profile-table">
            <div class="options">
                {#each navigationButtons as button}
                    <a href={button.path}>
                        <Button
                            on:click={() =>
                                (selectedOption = button.label.toLowerCase())}
                            style={buttonStyles}
                        >
                            {button.label}
                        </Button>
                    </a>
                {/each}
                <Button
                    on:click={logout}
                    background={colors["--color-theme-2-D1"]}
                    style="width: 100%;"
                >
                    Logout
                </Button>
            </div>
            <div class="content">
                {#each navigationButtons as button}
                    {#if selectedOption === button.label.toLowerCase()}
                        {#if button.label.toLowerCase() === "profile"}
                            <Profile profileData={componentProps.profileData} />
                        {:else if button.label.toLowerCase() === "settings"}
                            <Settings
                                settingsData={componentProps.settingsData}
                            />
                        {/if}
                    {/if}
                {/each}
            </div>
        </div>
        {#if checkLocalStorageForVerificationStatus() && isLoading === false}
            <div
                class="verified"
                title="Verified"
                in:inRotateScale={{ duration: 500 }}
            >
                <FontAwesomeIcon
                    icon={faHeartCircleCheck}
                    style="color: var(--color-theme-1-D1);"
                />
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
    .profile-table {
        display: grid;
        grid-template-columns: minmax(auto, 200px) 1fr;
        gap: 20px;
        width: 100%;
    }

    .options {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .verified {
        position: absolute;
        top: 30px;
        right: 22px;
        font-size: 2rem;
        background: var(--color-bg-2);
        border: 3px solid var(--color-theme-1);
        border-radius: 50rem;
        padding: 8px;
        // transition: transform 0.2s ease-in-out;

        // &:hover {
        //     transform: scale(1.05) rotate(5deg);
        // }
    }

    @media (max-width: 768px) {
        .profile-table {
            grid-template-columns: 1fr;
        }

        .content {
            margin-top: 20px;
        }
    }
</style>
