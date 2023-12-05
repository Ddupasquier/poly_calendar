<script lang="ts">
    import { transitionDuration } from "$lib/stores";
    import { createEventDispatcher, onDestroy } from "svelte";
    import { fly } from "svelte/transition";

    export let id: number;
    export let message: string;
    export let options: ToastAlertOptions;
    let { closable, style, openTilClosed } = options;
    let isOpen = true;
    let localMessage = message;

    const dispatcher = createEventDispatcher();

    const close = () => {
        if (isOpen) {
            isOpen = false;
        }
    };

    const handleOutroEnd = () => {
        dispatcher("remove", { id });
        localMessage = "";
    };

    onDestroy(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    $: {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
        }

        if (!openTilClosed && isOpen) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(close, options.duration ?? 3000);
        }

        if (message !== localMessage && message !== undefined) {
            localMessage = message;
        }
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
        {localMessage}
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
