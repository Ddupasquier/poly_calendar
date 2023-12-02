<script lang="ts">
    // Svelte-specific imports: Framework imports for lifecycle and reactivity.

    // Supabase imports: Authentication and database connections for user management and data retrieval.

    // UI components: Custom Svelte components and UI elements from design system libraries.
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
    import DateInput from "$lib/components/inputs/DateInput.svelte";
    import TeleInput from "$lib/components/inputs/TeleInput.svelte";
    import TextInput from "$lib/components/inputs/TextInput.svelte";
    import {
        faCheck,
        faEdit,
        faTimes,
    } from "@fortawesome/free-solid-svg-icons";

    // Services: Business logic, API calls, and other service-related interactions.
    import { userProfileManagementService } from "$lib/services/profile/user-profile-management-service";

    // Models: Type definitions and interfaces for structured data representation.

    // Utilities and constants: Reusable code snippets and app-wide constants for color schemes, etc.
    import { editableFields } from "./editable-profile-fields";

    // Store: Svelte stores and reactive variables for state management (placeholder for future additions).
    import { authUser } from "$lib/stores/userStore";

    // Helpers: Utility functions for common tasks like formatting dates or numbers (placeholder for future additions).

    // Global styles: Centralized styling sheets that define universal CSS rules for the app (placeholder for future additions).

    export let icon: IconDefinition;
    export let label: string;
    export let column: string | null = null;
    export let value: string | undefined;
    export let additional: string | undefined = "";
    export let color: string;
    export let type: "text" | "date" | "tel" = "text";

    const { updateSingleUserProfileField } = userProfileManagementService;

    let editable: boolean = false;
    let isEditing = false;
    let editedValue: string | undefined = value;

    $: if (
        column !== null &&
        editableFields.find((field) => field === column?.toLowerCase())
    ) {
        editable = true;
    }

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
                    <TextInput bind:value={editedValue} />
                    <button on:click={stopEditing} class="cancel">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <button type="submit" class="confirm">
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </div>
            {:else}
                {value || "N/A"}
                {additional}
                {#if editable}
                    <button on:click={startEditing} class="edit">
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                {/if}
            {/if}
        {:else if type === "date"}
            {#if isEditing}
                <div class="input-wrapper">
                    <DateInput bind:value={editedValue} />
                    <button on:click={stopEditing} class="cancel">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <button type="submit" class="confirm">
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </div>
            {:else}
                {value || "N/A"}
                {additional}
                {#if editable}
                    <button on:click={startEditing} class="edit">
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                {/if}
            {/if}
        {:else if type === "tel"}
            {#if isEditing}
                <div class="input-wrapper">
                    <TeleInput bind:value={editedValue} />
                    <button on:click={stopEditing} class="cancel">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <button type="submit" class="confirm">
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </div>
            {:else}
                {value || "N/A"}
                {additional}
                {#if editable}
                    <button on:click={startEditing} class="edit">
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                {/if}
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

    button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-theme-2-D1);
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
</style>
