<script lang="ts">
    // Svelte-specific imports: Framework imports for lifecycle and reactivity.

    // Supabase imports: Authentication and database connections for user management and data retrieval.

    // UI components: Custom Svelte components and UI elements from design system libraries.
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { Common } from "$lib/components";
    import {
        faCheck,
        faEdit,
        faTimes,
    } from "@fortawesome/free-solid-svg-icons";

    // Services: Business logic, API calls, and other service-related interactions.
    import { updateSingleUserProfileField } from "$lib/services";

    // Models: Type definitions and interfaces for structured data representation.
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    // Utilities and constants: Reusable code snippets and app-wide constants for color schemes, etc.

    // Store: Svelte stores and reactive variables for state management (placeholder for future additions).
    import { authUser } from "$lib/stores/userStore";

    // Helpers: Utility functions for common tasks like formatting dates or numbers (placeholder for future additions).

    // Global styles: Centralized styling sheets that define universal CSS rules for the app (placeholder for future additions).

    export let icon: IconDefinition;
    export let label: string;
    export let column: string | null = null;
    export let value: string | number | boolean | undefined;
    export let additional: string | undefined = "";
    export let color: string;
    export let type: "text" | "date" | "tel" | undefined = "text";
    export let editable: boolean = false;

    let isEditing = false;
    let editedValue: string | number | boolean | undefined = value;

    $: {
        if (value) {
            editedValue = value;
        }
    }

    const startEditing = () => {
        isEditing = true;
    };

    const stopEditing = () => {
        isEditing = false;
    };

    const submitEdit = async () => {
        if (!editedValue) {
            return;
        }

        const formObject = {
            field: column ?? "",
            value: editedValue,
        };

        updateSingleUserProfileField($authUser, formObject).then(() => {
            value = editedValue;
        });

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

    <form on:submit={submitEdit}>
        {#if type === "text"}
            {#if isEditing}
                <div class="input-wrapper">
                    <Common.TextInput bind:value={editedValue} />
                    <button on:click={stopEditing} class="cancel">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <button type="submit" class="confirm">
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </div>
            {:else}
                <div class="data-wrap">
                    {value || "N/A"}
                    {additional}
                    {#if editable}
                        <button on:click={startEditing} class="edit">
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    {/if}
                </div>
            {/if}
        {:else if type === "date"}
            {#if isEditing}
                <div class="input-wrapper">
                    <Common.DateInput bind:value={editedValue} />
                    <button on:click={stopEditing} class="cancel">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <button type="submit" class="confirm">
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </div>
            {:else}
                <div class="data-wrap">
                    {value || "N/A"}
                    {additional}
                    {#if editable}
                        <button on:click={startEditing} class="edit">
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    {/if}
                </div>
            {/if}
        {:else if type === "tel"}
            {#if isEditing}
                <div class="input-wrapper">
                    <Common.TeleInput bind:value={editedValue} />
                    <button on:click={stopEditing} class="cancel">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <button type="submit" class="confirm">
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </div>
            {:else}
                <div class="data-wrap">
                    {value || "N/A"}
                    {additional}
                    {#if editable}
                        <button on:click={startEditing} class="edit">
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    {/if}
                </div>
            {/if}
        {/if}
    </form>
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

    .input-wrapper {
        display: flex;
        align-items: center;
        margin-right: 8px;
    }

    .data-wrap {
        display: flex;
        align-items: center;
        margin-right: 8px;

        &:hover .edit {
            color: var(--color-theme-2-L1);
        }
    }

    .edit {
        color: var(--color-bg-2);
        transition: all 0.1s ease-in-out;

        &:hover {
            color: var(--color-theme-2-L1);
        }
    }

    .cancel {
        color: var(--color-theme-2-L1);
        transition: all 0.1s ease-in-out;

        &:hover {
            color: var(--color-theme-2);
        }
    }

    .confirm {
        color: var(--color-theme-2-L1);
        transition: all 0.1s ease-in-out;

        &:hover {
            color: var(--color-theme-2);
        }
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-theme-2-D1);
    }
</style>
