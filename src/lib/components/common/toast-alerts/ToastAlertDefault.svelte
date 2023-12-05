<script lang="ts">
    import { transitionDuration } from "$lib/stores";
    import { createEventDispatcher, onDestroy } from "svelte";
    import { fly } from "svelte/transition";

    export let id: number;
    export let message: string;
    export let options: ToastAlertOptions;

    let { closable, style, openTilClosed, duration } = options;

    const dispatcher = createEventDispatcher();

    const close = () => {
        dispatcher("remove", { id });
    };

    if (!openTilClosed) {
        const autoCloseTimeout = setTimeout(() => {
            close();
        }, duration || 3000);

        onDestroy(() => {
            clearTimeout(autoCloseTimeout);
        });
    }
</script>

<div
    class="toast"
    {style}
    in:fly={{ x: 300, duration: transitionDuration }}
    out:fly={{ y: -300, duration: transitionDuration }}
>
    {#if closable}
        <button on:click={close} class="close">&times;</button>
    {/if}
    {message}
</div>

<style lang="scss">
    .toast {
        position: relative;
        padding: 1rem 2.7rem 1rem 1rem;
        border-radius: var(--primary-border-radius) 0 0
            var(--primary-border-radius);
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

        .close {
            position: relative;
            top: -1rem;
            left: -0.7rem;
            padding: 0.5rem;
            color: #000;
            background: none;
            border: none;
            font-weight: bold;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.2s ease-in-out;

            &:hover {
                transform: scale(1.1) rotate(22.5deg);
            }
        }
    }
</style>
