<script lang="ts">
    import { AgendaView, DayView, MonthView, WeekView } from "..";
    import { filteredEvents, currentView } from "$lib/stores";
</script>

<div class="calendar-body">
    {#if $currentView === "day"}
        <DayView />
    {:else if $currentView === "week"}
        <WeekView />
    {:else if $currentView === "month"}
        <MonthView />
    {:else if $currentView === "agenda"}
        <AgendaView />
    {/if}
</div>

<style lang="scss">
    .calendar-body {
        padding: 1rem;
        // Add any additional styles that affect the overall layout of the calendar body
    }
</style>
