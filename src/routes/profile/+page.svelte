<script lang="ts">
    // Svelte-specific imports: Framework imports for lifecycle and reactivity.
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    // Supabase imports: Authentication and database connections for user management and data retrieval.
    import type { AuthUser } from "@supabase/supabase-js";
    import { supabase } from "$lib/supabase";
    import { authUser as storedAuthUser } from "$lib/stores/userStore";

    // UI components: Custom Svelte components and UI elements from design system libraries.
    import AuthLoginSignup from "$lib/components/auth/AuthLoginSignup.svelte";
    import { Button, Loader } from "mysvelte-ui";

    // Services: Business logic, API calls, and other service-related interactions.
    import { authenticationService } from "$lib/services/authentication-service";

    // Models: Type definitions and interfaces for structured data representation.
    import type { ProfileUser } from "$lib/models/profile/profile-user";

    // Utilities and constants: Reusable code snippets and app-wide constants for color schemes, etc.
    import { colors } from "$lib/palette";
    import { navigationButtons } from "./constants";

    // Store: Svelte stores and reactive variables for state management (placeholder for future additions).

    // Helpers: Utility functions for common tasks like formatting dates or numbers (placeholder for future additions).

    // Global styles: Centralized styling sheets that define universal CSS rules for the app (placeholder for future additions).

    type ComponentProps = {
        profileData?: ProfileUser;
    };

    let isLoading: boolean = true;
    let authUserPresent: boolean;
    let authUser: AuthUser | null;
    let profileData: ProfileUser | null;
    let componentProps: ComponentProps = {};

    const { logout } = authenticationService;

    let selectedOption = "login";
    const buttonStyles = `
    background: ${colors["--color-theme-1"]};
    color: ${colors["--color-text-white"]};
    width: 100%;
    `;

    onMount(async () => {
        const $authUser = get(storedAuthUser);
        authUser = $authUser;
        authUserPresent = !!$authUser;

        if (authUser) {
            selectedOption = "profile";
            profileData = await getUserProfile(authUser);
        }

        if (profileData) {
            componentProps.profileData = profileData;
        }

        isLoading = false;
    });

    const getUserProfile = async (
        authUserData: AuthUser,
    ): Promise<ProfileUser | null> => {
        if (!authUserData) return null;

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("user_uuid", authUserData.id)
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return null;
        }

        return data;
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
                        <svelte:component
                            this={button.component}
                            {...button.requiresProfileData
                                ? componentProps
                                : {}}
                        />
                    {/if}
                {/each}
            </div>
        </div>
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

    @media (max-width: 768px) {
        .profile-table {
            grid-template-columns: 1fr;
        }

        .content {
            margin-top: 20px;
        }
    }
</style>
