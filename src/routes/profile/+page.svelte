<script lang="ts">
    import { beforeUpdate, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
    import { Button } from "mysvelte-ui";
    import { Profile, Settings } from ".";
    import { Common, Auth } from "$lib/components";
    import { logout, checkCurrentUser } from "$lib/services";
    import { navigationButtons, colors } from "$lib/constants";
    import { checkLocalStorageForVerificationStatus } from "$lib/stores";
    import { inRotateScale } from "$lib/transitions/in-rotate-scale";
    import type { UserProfileModel, UserSettingsModel } from "$lib/models";

    interface ProfilePageData {
        userProfile: UserProfileModel | null;
        userSettings: UserSettingsModel | null;
    }

    export let data: ProfilePageData;

    $: userProfile = data.userProfile || null;
    $: userSettings = data.userSettings || null;

    let userPresent: boolean = false;
    let isLoading: boolean = true;
    let selectedOption = "login";

    $: if (!userProfile) {
        isLoading = true;
    }

    const buttonStyles: string = `
        background: ${colors["--color-theme-1"]};
        color: ${colors["--color-text-white"]};
        width: 100%;
    `;

    beforeUpdate(() => {
        goto(`/profile`);
    });

    onMount(async () => {
        if (userProfile) {
            selectedOption = "profile";
        }

        userPresent = await checkCurrentUser();

        isLoading = false;
    });
</script>

{#if !userPresent}
    {#if isLoading}
        <div class="loader-container">
            <Common.Loader size="large" color="var(--color-theme-2)" />
        </div>
    {:else}
        <div class="container">
            <Auth.AuthLoginSignup />
        </div>
    {/if}
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
                        on:click={logout}
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
                                <Profile profileData={userProfile} />
                            {:else if button.label.toLowerCase() === "settings"}
                                <Settings settingsData={userSettings} />
                            {/if}
                        {/if}
                    {/each}
                </div>
            {/if}
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
