<script lang="ts">
    import { onMount } from "svelte";

    export let background: string = "white";
    export let color: string = "black";
    export let placeholder: string = "Enter email";
    export let value: string = "";
    export let disabled: boolean = false;

    let style: string;

    onMount(() => {
        style = `--background: ${background}; --color: ${color};`;
    });

    $: if (background && color) {
        style = `--background: ${background}; --color: ${color};`;
    }
</script>

<div class="input line" {style}>
    <input type="email" {placeholder} bind:value {disabled} />
</div>

<style lang="scss">
    .input {
        position: relative;
        width: 100%;
        background: var(--background, white);
    }

    input {
        box-sizing: border-box;
        padding: 0.5rem 1rem;
        border-radius: 50rem;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        transition: all 0.1s ease-in-out;
        outline: none;
        background: var(--background, white);
        color: var(--color, black);
        width: 100%;
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
