<script lang="ts">
    import { Common } from "$lib/components";
    import { authUser } from "$lib/stores";
    import { updateSingleUserProfileField } from "$lib/services";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import {
        faCheck,
        faEdit,
        faTimes,
    } from "@fortawesome/free-solid-svg-icons";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
    import type { AuthUser } from "@supabase/supabase-js";
    import type { UserProfileModel } from "$lib/models";

    export let icon: IconDefinition;
    export let label: string;
    export let column: keyof UserProfileModel | keyof AuthUser | string;
    export let value: string | undefined;
    export let additional: string | undefined = "";
    export let color: string;
    export let type: "text" | "date" | "tel" | undefined = "text";
    export let editable: boolean = false;

    let isEditing = false;
    let editedValue: string | undefined = value;

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
