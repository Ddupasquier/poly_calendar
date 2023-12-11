<script lang="ts">
    import { Toggle } from "mysvelte-ui";

    import { updateSingleUserSettingsField } from "$lib/services";
    import { authUser } from "$lib/stores";
    import { colors } from "$lib/constants";

    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
    import { Google } from "$lib/components";

    export let icon: IconDefinition | string;
    export let label: string;
    export let column: string | null = null;
    export let value: number | string | boolean | undefined;
    export let color: string;
    export let editable: boolean;

    let isUpdating = false;
    let previousValue = value;

    $: if (value !== previousValue) {
        submitEdit();
        previousValue = value;
    }

    const submitEdit = async () => {
        if (typeof value === "boolean" || value === undefined) {
            try {
                isUpdating = true;
                await updateSingleUserSettingsField($authUser, {
                    field: column ?? "",
                    value,
                });
                isUpdating = false;
            } catch (error) {
                console.error("Error updating user settings:", error);
            }
        } else {
            console.error(
                "Value type mismatch: Expected boolean or undefined, got",
                typeof value,
            );
        }
    };

    const replacePlaceholderWithValue = (
        input: string,
        placeholders: string[],
        valueIfTrue: string[],
        valueIfFalse: string[],
        condition: boolean,
    ): string => {
        return placeholders.reduce((text, placeholder, index) => {
            const replacementValue = condition
                ? valueIfTrue[index]
                : valueIfFalse[index];
            const regex = new RegExp(placeholder, "g");
            return text.replace(regex, replacementValue);
        }, input);
    };
</script>

<div class="settings-info">
    {#if typeof icon === "string"}
        {#if icon === "GOOGLE"}
            <Google />
        {/if}
    {:else}
        <div class="icon-container">
            <FontAwesomeIcon {icon} style={`color: ${color}`} />
        </div>
    {/if}
    {#if typeof value === "boolean"}
        <Toggle
            id={label}
            bind:isChecked={value}
            disable={!editable || isUpdating}
            color={colors["--color-theme-1"]}
        />
        <strong>
            :
            {replacePlaceholderWithValue(
                label,
                [
                    "##PUBLIC##",
                    "##NOTIFICATION##",
                    "##THEME##",
                    "##INTEGRATION##",
                ],
                ["Public", "Enabled", "Dark", "Enbled"],
                ["Private", "Disabled", "Light", "Disabled"],
                value,
            )}
        </strong>
    {/if}
</div>

<style lang="scss">
    .settings-info {
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 1.5;

        strong {
            color: var(--color-text-light);
            margin-left: 5px;
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

    // .cancel {
    //     color: var(--color-theme-2-L1);
    //     transition: all 0.1s ease-in-out;

    //     &:hover {
    //         color: var(--color-theme-2);
    //     }
    // }

    // .confirm {
    //     color: var(--color-theme-2-L1);
    //     transition: all 0.1s ease-in-out;

    //     &:hover {
    //         color: var(--color-theme-2);
    //     }
    // }
</style>
