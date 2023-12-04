<script lang="ts">
    import { authUser } from "$lib/stores";

    export let tabName: string;
    export let tabPath: string;
    export let currentTab: string;

    $: thisTabActive = tabPath === currentTab;
</script>

<div aria-current={thisTabActive ? "page" : undefined} class="tab" role="tab">
    <div class="folder-tab" />
    <a href={tabPath}>
        {#if tabName === "Profile" && $authUser}
            {tabName}
        {:else if tabName === "Profile" && !$authUser}
            Login
        {:else}
            {tabName}
        {/if}
    </a>
</div>

<style lang="scss">
    a {
        position: relative;
        color: white;
        font-weight: bold;
        text-decoration: none;
    }

    .tab {
        position: relative;
        padding: 0.7rem 2rem 0.2rem 0.6rem;
        width: 5rem;
    }

    .folder-tab {
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: bottom left;
        transform: scale(0.85);
        border-radius: 5px 5px 0 0;
        box-shadow: -5px 0 5px -2px rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        background-color: var(--color-theme-2);
        transition: all 0.2s ease-in-out;
    }

    .tab[aria-current="page"] .folder-tab {
        transform: scale(1);
        box-shadow: none;
        background-color: var(--color-theme-2-D1);
    }

    @media (max-width: 870px) {
        .tab {
            margin-right: 0;
            margin-bottom: -5px;
            padding: 0.5rem 2rem;

            .folder-tab {
                border-radius: 0;
                box-shadow: 0 0 0 0;
                transform-origin: center right;
            }

            &:first-child .folder-tab {
                border-radius: 5px 0 0 0;
            }

            &:last-child .folder-tab {
                border-radius: 0 0 0 5px;
            }

            a {
                z-index: 2;
            }
        }

        .tab[aria-current="page"] .folder-tab {
            transform: scale(1);
            border-radius: 5px 0 0 5px;
            box-shadow: none;
            background-color: var(--color-theme-2-D1);
            z-index: 1;
        }
    }
</style>
