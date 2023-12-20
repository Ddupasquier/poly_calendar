<script lang="ts">
    import { WeekEvent } from "../..";
    import type { GoogleCalendarEventModel } from "$lib/models";
    import { eventContainers } from "$lib/stores";

    export let getEventsForDay: (
        day: Date,
    ) => GoogleCalendarEventModel[] = () => [];
    export let day: Date;
    export let activeEvent: GoogleCalendarEventModel | null;
    export let setActiveEvent: (event: GoogleCalendarEventModel | null) => void;
    export let index: number;

    let eventsForTheDay = getEventsForDay(day);
</script>

<div class="events-container" bind:this={$eventContainers[index]}>
    {#each eventsForTheDay as event}
        <WeekEvent {event} {day} {activeEvent} {setActiveEvent} />
    {/each}
</div>

<style lang="scss">
    .events-container {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 0.75rem;
        position: relative;
        gap: 0.5rem;
    }
</style>
