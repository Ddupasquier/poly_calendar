<script lang="ts">
    import { Event } from "../..";
    import type { CalendarEvent } from "../../types";
    import { eventContainers } from "$lib/stores";

    export let getEventsForDay: (day: Date) => CalendarEvent[] = () => [];
    export let day: Date;
    export let activeEvent: CalendarEvent | null;
    export let setActiveEvent: (event: CalendarEvent | null) => void;
    export let index: number;
</script>

<div class="events-container" bind:this={$eventContainers[index]}>
    {#each getEventsForDay(day) as event}
        <Event {event} {day} {activeEvent} {setActiveEvent} />
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
