<script lang="ts">
    import { onMount } from "svelte";
    import HideShowPassword from "./hideShowPassword.svelte";

    export let background: string = "#fff";
    export let color: string = "#000";
    export let placeholder: string = "Enter email";
    export let value: string = "";
    export let disabled: boolean = false;

    let showPassword: boolean = false;
    let style: string;

    onMount(() => {
        style = `--background: ${background}; --color: ${color};`;
    });

    $: if (background && color) {
        style = `--background: ${background}; --color: ${color};`;
    }
</script>

<div class="input line" {style}>
    {#if showPassword}
        <input type="text" {placeholder} bind:value {disabled} />
    {:else}
        <input type="password" {placeholder} bind:value {disabled} />
    {/if}
    <button
        type="button"
        on:click={() => (showPassword = !showPassword)}
        class="show-password"
    >
        <HideShowPassword {showPassword} />
    </button>
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

    .show-password {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.1s ease-in-out;

        &:focus {
            outline: none;
        }
    }
</style>
