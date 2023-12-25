<script lang="ts">
    import { navigationButtons } from "$lib/constants";
    import { Common, Auth } from "$lib/components";
    import { logout } from "$lib/services";
    import { Button } from "mysvelte-ui";
    import { Profile, Settings } from ".";
    import type { UserProfileModel, UserSettingsModel } from "$lib/models";
    import type { AuthUser } from "@supabase/supabase-js";
    import { userEmailVerified } from "$lib/utils";
    import { inRotateScale } from "$lib/transitions/in-rotate-scale";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
    import { goto } from "$app/navigation";

    type ProfilePageData = {
        status: number;
        error: string | null;
        props: {
            currentUser: AuthUser;
        } | null;
        userProfile: UserProfileModel | null;
        userSettings: UserSettingsModel | null;
    };

    export let data: ProfilePageData;
    const { status, error, props, userProfile, userSettings } = data;

    $: currentUser = props?.currentUser;
    $: isLoading = !currentUser || !userProfile || !userSettings;
    $: verified = currentUser ? userEmailVerified(currentUser) : false;

    let selectedOption = "profile";

    const buttonStyles: string = `
        background: var(--color-theme-1);
        color: var(--color-text-white);
        width: 100%;
    `;
</script>

{#if !currentUser || isLoading}
    <div class="loader-container">
        <Common.Loader size="large" color="var(--color-theme-2)" />
    </div>
{:else}
    <div class="container">
        <div class="profile-table">
            {#if userProfile && userSettings}
                <div class="options">
                    {#each navigationButtons as button}
                        <a href={button.path}>
                            <Button
                                on:click={() =>
                                    (selectedOption =
                                        button.label.toLowerCase())}
                                style={buttonStyles}
                            >
                                {button.label}
                            </Button>
                        </a>
                    {/each}
                    <Button
                        on:click={() => {
                            logout();
                            goto("/login");
                        }}
                        background={"var(--color-theme-2-D1)"}
                        style="width: 100%;"
                    >
                        Logout
                    </Button>
                </div>
                <div class="content">
                    {#each navigationButtons as button}
                        {#if selectedOption === button.label.toLowerCase()}
                            {#if button.label.toLowerCase() === "profile"}
                                <Profile {userProfile} {currentUser} />
                            {:else if button.label.toLowerCase() === "settings"}
                                <Settings {userSettings} />
                            {/if}
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
        {#if verified && isLoading === false}
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
    }

    .loader-container {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
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
