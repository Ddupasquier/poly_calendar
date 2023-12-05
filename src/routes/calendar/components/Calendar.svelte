<script lang="ts">
    import { AgendaView, DayView, MonthView, WeekView } from "..";
    import {
        filterType,
        filteredEvents,
        setFilterType,
        currentView,
    } from "$lib/stores";
</script>

<!-- Filter controls -->
<select bind:value={$filterType} on:change={() => setFilterType($filterType)}>
    <option value="all">All Types</option>
    <option value="meeting">Meetings</option>
    <option value="appointment">Appointments</option>
    <option value="birthday">Birthdays</option>
    <!-- Add other event types here -->
</select>

<!-- Views -->
<div class="calendar">
    {#if $currentView === "day"}
        <DayView events={$filteredEvents} />
    {:else if $currentView === "week"}
        <WeekView events={$filteredEvents} />
    {:else if $currentView === "month"}
        <MonthView events={$filteredEvents} />
    {:else if $currentView === "agenda"}
        <AgendaView events={$filteredEvents} />
    {/if}
</div>
