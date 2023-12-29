<script lang="ts">
    import { googleCalendarListEntryOptions } from "$lib/stores";
    import { Common, SVG } from "$lib/components";
    import { Modal, Button } from "mysvelte-ui";

    let open: boolean = false;

    const title = "Settings";
</script>

<Modal {title} {open} size="medium">
    <Button
        on:click={() => (open = !open)}
        background="var(--color-theme-1)"
        size="small"
        style="display: flex;"
        slot="trigger"
    >
        <SVG.Settings />
    </Button>

    <div class="calendar-settings-filter-content" slot="content">
        {#if $googleCalendarListEntryOptions && $googleCalendarListEntryOptions.length > 0}
            <Common.RadioGroupDefault
                groupId="fetched-calendar-view-settings"
            />
        {/if}
    </div>

    <div class="calendar-settings-filter-footer" slot="footer"></div>
</Modal>

<style lang="scss">
    .calendar-settings-filter-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 0 1rem;
    }

    .calendar-settings-filter-footer {
        display: flex;
        justify-content: flex-end;
    }
</style>
