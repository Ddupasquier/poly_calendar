<script lang="ts">
    import { supabase } from "$lib/supabase";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    export let icon: IconDefinition;
    export let label: string;
    export let value: string | undefined;
    export let additional: string | undefined = "";
    export let color: string;

    let isEditing = false;
    let editedValue = value;

    const startEditing = () => {
        isEditing = true;
    };

    const submitEdit = async () => {
        // Update the user information in Supabase here using the `editedValue`
        // You should implement the Supabase update logic based on your data structure.
        // For simplicity, we assume you have a function `updateUserInfo` to handle the update.
        // const success = await updateUserInfo(label, editedValue);

        // If the update was successful, disable editing mode
        // if (success) {
        //     isEditing = false;
        // }

        // For simplicity, we'll just simulate a successful update
        isEditing = false;
    };

    const handleKeyPress = (event: { key: string }): void => {
        if (event.key === "Enter") {
            submitEdit();
        }
    };
</script>

<div class="profile-info">
    <div class="icon-container">
        <FontAwesomeIcon {icon} style={`color: ${color}`} />
    </div>
    <strong>{label}:</strong>

    {#if isEditing}
        <input type="text" bind:value={editedValue} />
        <button on:click={submitEdit}>Submit</button>
    {:else}
        {value || "N/A"}
        {additional}
        <button on:click={startEditing}>Edit</button>
    {/if}
</div>

<svelte:window on:keydown={handleKeyPress} />

<style lang="scss">
    .profile-info {
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 1.5;

        strong {
            color: var(--color-text-light);
            margin-right: 4px;
        }
    }

    .icon-container {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        background: transparent;
    }

    /* Add styling for the input and submit button when editing */
    input {
        width: 100%;
        padding: 4px;
        margin-right: 8px;
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-theme-2-D1);
    }
</style>
