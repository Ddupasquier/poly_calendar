<script lang="ts">
    import { onMount } from "svelte";

    import { Calendar } from ".";
    import {
        mapEventTypes,
        setCalendarEvents,
    } from "$lib/stores/calendar/calendarStore";

    export let data;
    const { events } = data;

    onMount(() => {
        const mappedEvents = events.map((event) => ({
            ...event,
            type: mapEventTypes(event.type),
        }));
        setCalendarEvents(mappedEvents);
    });
</script>

<div class="calendar-container">
    <Calendar />
</div>

<style lang="scss">
    .calendar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
</style>
