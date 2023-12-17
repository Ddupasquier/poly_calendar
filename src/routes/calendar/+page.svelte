<script lang="ts">
    import { onMount } from "svelte";
    import { fetchGoogleCalendarEvents } from "$lib/services";
    import { Calendar } from ".";

    let exteriorEvents = [];
    $: console.log(exteriorEvents);

    onMount(() => {
        fetchGoogleCalendarEvents().then((events) => {
            exteriorEvents = events;
        });
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
