<script lang="ts">
    import { Event } from "../..";
    import type { CalendarEventModel } from "$lib/models";
    import { eventContainers } from "$lib/stores";

    export let getEventsForDay: (day: Date) => CalendarEventModel[] = () => [];
    export let day: Date;
    export let activeEvent: CalendarEventModel | null;
    export let setActiveEvent: (event: CalendarEventModel | null) => void;
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
