<script lang="ts">
    import { SVG } from "$lib/components";
    import { Modal, Button } from "mysvelte-ui";
    import { CalendarListEntryOptionsRadios } from "../..";

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
        <CalendarListEntryOptionsRadios
            groupId="fetched-calendar-view-settings"
        />
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
