<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";
    import { fly } from "svelte/transition";
    import { toastMessages } from "$lib/stores";
    // import type { SvelteComponent } from "svelte";

    export let id: number;
    export let message: string;
    export let options: ToastAlertOptions;

    const dispatcher = createEventDispatcher();
    const { duration, closable, style, openTilClosed } = options;

    let isOpen = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    $: if (!openTilClosed) {
        timeoutId = setTimeout(() => {
            isOpen = false;
            dispatcher("close");
        }, duration);
    }

    onDestroy(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });

    const close = () => {
        toastMessages.update((toasts) =>
            toasts.filter((toast) => toast.id !== id),
        );
    };
</script>

{#if isOpen}
    <div
        class="toast"
        {style}
        in:fly={{ x: 300, duration: 300 }}
        out:fly={{ y: -300, duration: 300 }}
    >
        <!-- {#if component}
            <svelte:component this={component} />
        {:else}
            {message}
        {/if} -->
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
    }
</style>
