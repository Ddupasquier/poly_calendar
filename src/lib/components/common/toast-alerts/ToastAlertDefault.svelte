<script lang="ts">
    import { transitionDuration } from "$lib/stores";
    import { createEventDispatcher, onDestroy } from "svelte";
    import { fly } from "svelte/transition";

    export let id: number;
    export let message: string;
    export let options: ToastAlertOptions;
    let { closable, style, openTilClosed, duration } = options;
    let isOpen = true;

    const dispatcher = createEventDispatcher();

    const close = () => {
        isOpen = false;
    };

    const handleOutroEnd = () => {
        dispatcher("remove", { id });
    };

    if (!openTilClosed) {
        const autoCloseTimeout = setTimeout(() => {
            isOpen = false;
        }, duration || 3000);

        onDestroy(() => {
            clearTimeout(autoCloseTimeout);
        });
    }
</script>

{#if isOpen}
    <div
        class="toast"
        {style}
        in:fly={{ x: 300, duration: transitionDuration }}
        out:fly={{ y: -300, duration: transitionDuration }}
        on:outroend={handleOutroEnd}
    >
        {message}
        {#if closable}
            <button on:click={close}>Close</button>
        {/if}
    </div>
{/if}

<style lang="scss">
    .toast {
        position: relative;
        padding: 10px;
        border-radius: var(--primary-border-radius) 0 0
            var(--primary-border-radius);
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin: 10px 0;
    }
</style>
