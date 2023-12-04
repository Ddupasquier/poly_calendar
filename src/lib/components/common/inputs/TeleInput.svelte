<script lang="ts">
    import { onMount } from "svelte";

    export let background: string = "white";
    export let color: string = "black";
    export let value: string = "";
    export let disabled: boolean = false;

    let style: string;

    // Regular expression pattern to match (xxx) xxx-xxxx format
    const phonePattern = "\\(\\d{3}\\) \\d{3}-\\d{4}";

    onMount(() => {
        style = `--background: ${background}; --color: ${color};`;
    });

    $: if (background && color) {
        style = `--background: ${background}; --color: ${color};`;
    }
</script>

<div class="input line" {style}>
    <input
        type="tel"
        placeholder="(XXX) XXX-XXXX"
        bind:value
        {disabled}
        pattern={phonePattern}
        title="Phone number must be in the format: (XXX) XXX-XXXX"
    />
</div>

<style lang="scss">
    .input {
        position: relative;
        width: 100%;
        background: var(--background, white);
    }

    input {
        box-sizing: border-box;
        padding: 0rem 1rem;
        border-radius: 50rem;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        transition: all 0.1s ease-in-out;
        outline: none;
        background: var(--background, white);
        color: var(--color, black);
        width: 100%;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    .line input {
        border-radius: 0;
        border-bottom: 3px solid rgba(131, 131, 131, 0.5);

        &:focus {
            border-bottom-color: currentColor;
            outline: none;
        }
    }
</style>
