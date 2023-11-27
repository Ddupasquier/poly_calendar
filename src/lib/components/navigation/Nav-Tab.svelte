<script lang="ts">
    export let tabName: string;
    export let tabPath: string;
    export let currentTab: string;

    $: thisTabActive = tabPath === currentTab;
</script>

<div aria-current={thisTabActive ? "page" : undefined} class="tab">
    <div class="folder-tab" />
    <a href={tabPath}>
        {tabName}
    </a>
</div>

<style lang="scss">
    a {
        z-index: 1;
        position: relative;
        color: white;
        font-weight: bold;
        text-decoration: none;

        &:hover {
            text-decoration: none;
        }
    }

    .tab {
        position: relative;
        padding: .7rem 2rem .2rem .6rem;
        height: 100%;
        width: 5rem;
    }

    .folder-tab {
        z-index: 0;
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: bottom left;
        transform: scale(0.85);
        border-radius: 5px 5px 0 0;
        box-shadow: -5px 0 5px -2px rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        background-color: var(--color-theme-2-1);
        transition: all 0.2s ease-in-out;
    }

    .tab[aria-current="page"] .folder-tab {
        transform: scale(1);
        box-shadow: none;
        background-color: var(--color-theme-2-2);
    }

    @media (max-width: 480px) {
        .tab {
            margin-right: 0;
            margin-bottom: -5px;
            padding: 0.25rem 1rem;
            .folder-tab {
                border-radius: 0 5px 5px 0;
            }
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
</style>
