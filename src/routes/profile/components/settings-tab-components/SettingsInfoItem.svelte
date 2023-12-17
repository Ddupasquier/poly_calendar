<script lang="ts">
    import { Toggle } from "mysvelte-ui";

    import {
        integrateGoogleCalendar,
        disableGoogleCalendarIntegration,
        updateSingleUserSettingsField,
        getSingleUserSettingField,
    } from "$lib/services";
    import { authUser } from "$lib/stores";

    import { faCheck } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
    import { Google } from "$lib/components";
    import type { UserSettingsModel } from "$lib/models";

    export let icon: IconDefinition | string;
    export let label: string;
    export let column: string | null = null;
    export let value: boolean;
    export let color: string;
    export let editable: boolean;

    let isUpdating = false;
    let previousValue = value;

    $: if (value !== previousValue) {
        submitEdit();
        previousValue = value;
    }

    const isKeyOfUserSettingsModel = (
        key: string,
    ): key is keyof UserSettingsModel => {
        return (key as keyof UserSettingsModel) !== undefined;
    };

    const submitEdit = async () => {
        if (typeof value === "boolean" || value === undefined) {
            if (!column || !isKeyOfUserSettingsModel(column)) {
                console.error(
                    `Invalid column: ${column} is not a key of UserSettingsModel.`,
                );
                return;
            }

            try {
                isUpdating = true;
                await updateSingleUserSettingsField({
                    field: column as keyof UserSettingsModel,
                    value,
                });
            } catch (error) {
                console.error("Error updating user settings:", error);
            } finally {
                isUpdating = false;
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

    const handleIntegrationClick = async () => {
        const isIntegrated = await getSingleUserSettingField(
            $authUser,
            "google_calendar_integration",
        );

        console.log("Integration setting retrieved:", isIntegrated);

        if (isIntegrated) {
            if (
                confirm(
                    "Your Google integration is already enabled. Do you want to disable Google Calendar integration?",
                )
            ) {
                await disableGoogleCalendarIntegration();
                value = false;
            }
        } else {
            await integrateGoogleCalendar();
        }
    };
</script>

<div class="settings-info">
    {#if typeof icon === "string"}
        {#if icon === "GOOGLE"}
            <button
                class="google-integration"
                title={`Google Calendar ${
                    value ? "integrated" : "not integrated"
                }`}
                on:click={handleIntegrationClick}
            >
                <Google />
                {#if value === true}
                    <div class="checkmark">
                        <FontAwesomeIcon
                            icon={faCheck}
                            style={"color: green; font-size: 1.5rem"}
                        />
                    </div>
                {/if}
            </button>
        {/if}
    {:else}
        <div class="icon-container">
            <FontAwesomeIcon {icon} style={`color: ${color}`} />
        </div>
        {#if typeof value === "boolean"}
            <Toggle
                id={label}
                bind:isChecked={value}
                disable={!editable || isUpdating}
                color={"var(--color-theme-1)"}
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

    .google-integration {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border-radius: 50rem;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        transition: transform 0.1s ease-in-out;

        .checkmark {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 50rem;
            background: rgba(255, 255, 255, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &:hover {
            transform: rotate(10deg) scale(1.05);
        }

        &:active {
            transform: scale(0.95);
        }
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
