<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabase"; // Ensure you have the Supabase client imported
    import AuthLoginSignup from "$lib/components/auth/AuthLoginSignup.svelte";
    import { Button } from "mysvelte-ui";
    import { colors } from "$lib/palette";
    import { navigationButtons } from "./constants";
    import type { ProfileUser } from "$lib/models/profile/profile-user";
    import { authUser as storedAuthUser } from "$lib/stores/userStore";
    import { authenticationService } from "$lib/services/authentication-service";
    import type { AuthUser } from "@supabase/supabase-js";
    import { get } from "svelte/store";

    let authUserPresent: boolean;
    let authUser: AuthUser | null;
    let profileData: ProfileUser | null;

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
            console.log(profileData);
        }
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
    <AuthLoginSignup />
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
                        <svelte:component this={button.component} />
                    {/if}
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
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
