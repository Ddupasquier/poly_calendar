<script lang="ts">
    import { AgendaView, DayView, MonthView, WeekView } from "..";
    import { currentView, isCurrentViewLoading } from "$lib/stores";
</script>

<div class="calendar-body">
    {#if $isCurrentViewLoading}
        {#if $currentView === "day"}
            <DayView />
        {:else if $currentView === "week"}
            <WeekView />
        {:else if $currentView === "month"}
            <MonthView />
        {:else if $currentView === "agenda"}
            <AgendaView />
        {/if}
    {/if}
</div>

<style lang="scss">
    .calendar-body {
        padding: 1rem;
    }
</style>
