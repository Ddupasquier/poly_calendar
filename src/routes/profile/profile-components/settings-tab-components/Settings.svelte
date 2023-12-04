<script lang="ts">
    import { settingsStructure } from "./settings-sections-and-info";

    import type { UserSettingsModel } from "$lib/models";
    import SettingsSection from "./SettingsSection.svelte";
    import SettingsInfoItem from "./SettingsInfoItem.svelte";
    import { Common } from "$lib/components";
    import { colors } from "$lib/constants";

    export let settingsData: UserSettingsModel | undefined;

    const getValue = (item: {
        column: keyof UserSettingsModel;
    }): string | number | boolean | undefined => {
        if (!settingsData) return false;
        return settingsData[item.column];
    };
</script>

<div class="settings-container">
    {#if settingsData}
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
        <Common.Loader size={"small"} color={colors["--color-theme-2-D1"]} />
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
