<script lang="ts">
    import { supabase } from "$lib/supabase";

    import { onMount } from "svelte";

    import { authUser, authSession } from "$lib/stores/userStore";

    import Auth from "$lib/components/auth/Auth.svelte";
    import { Button } from "mysvelte-ui";
    import { colors } from "$lib/palette";
    import { navigationButtons } from "./constants";

    onMount(() => {
        if (!authUser) {
            const urlParams = new URLSearchParams(window.location.search);
            const login = urlParams.get("login");

            if (login) {
                selectedOption = "login";
            }
        }
    });

    let selectedOption = "profile";

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error);
        } else {
            authUser.set(null);
            authSession.set(null);
        }
    };

    const buttonStyles = `
        background: ${colors["--color-theme-1"]};
        color: ${colors["--color-text-white"]};
        width: 100%;
    `;
</script>

{#if !$authUser}
    <Auth />
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
