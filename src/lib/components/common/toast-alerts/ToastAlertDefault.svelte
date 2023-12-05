<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";
    import { fly } from "svelte/transition";

    export let id: number;
    console.log(`ToastAlertDefault created: ${id}`);
    export let message: string;
    export let options: ToastAlertOptions;
    let { duration, closable, style, openTilClosed } = options;

    const dispatcher = createEventDispatcher();

    const close = () => {
        isOpen = false;
        dispatcher("close", { id });
    };

    let isOpen = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    $: {
        ({ duration, closable, style, openTilClosed } = options);

        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
        }

        if (!openTilClosed) {
            timeoutId = setTimeout(() => {
                isOpen = false;
                dispatcher('close', { id });
            }, duration);
        }
    }

    onDestroy(() => {
        console.log(`Destroying toast: ${id}`);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });
</script>

{#if isOpen}
    <div
        class="toast"
        {style}
        in:fly={{ x: 300, duration: 500 }}
        out:fly={{ y: -300, duration: 500 }}
        on:outroend={() => {
            console.log(`Transition ended for toast: ${id}`);
            close();
        }}
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
