<script lang="ts">
    import { Common } from "$lib/components";
    import {
        SettingsSection,
        SettingsInfoItem,
        settingsStructure,
    } from "../..";
    import type { UserSettingsModel } from "$lib/models";

    export let userSettings: UserSettingsModel;

    const getValue = (item: {
        column: keyof UserSettingsModel;
    }): string | number | boolean | null => {
        if (!userSettings) return false;
        return userSettings[item.column];
    };
</script>

<div class="settings-container">
    {#if userSettings}
        {#each settingsStructure as section}
            <SettingsSection header={section.sectionTitle}>
                {#each section.infoSections as item}
                    <SettingsInfoItem
                        label={item.label}
                        column={item.column}
                        value={getValue(item)}
                        icon={item.icon}
                        color={item.color}
                        editable={item.editable}
                    />
                {/each}
            </SettingsSection>
        {/each}
    {:else}
        <Common.Loader size="medium" color="var(--color-theme-2)" />
    {/if}
</div>

<style lang="scss">
    .settings-container {
        position: relative;
        background: var(--color-bg-2);
        padding: 20px;
        border-radius: var(--primary-border-radius);
    }

    .settings-container::after {
        content: "";
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        z-index: -1;
        background: linear-gradient(
            to bottom,
            var(--color-theme-1),
            rgba(0, 0, 0, 0)
        );
        border-radius: inherit;
        pointer-events: none;
    }
</style>
