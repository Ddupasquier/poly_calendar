<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { fetchGoogleCalendarEvents } from "$lib/services";
    import {
        selectedMonth,
        selectedYear,
        setCalendarEvents,
    } from "$lib/stores";
    import { Calendar } from ".";

    const loadEvents = async () => {
        if (!browser) return;

        try {
            const eventsFromGoogle = await fetchGoogleCalendarEvents();

            if (eventsFromGoogle) {
                const validEvents = eventsFromGoogle.filter((event: any) => {
                    const hasStartDateTime =
                        event.start &&
                        (event.start.dateTime || event.start.date);
                    const hasEndDateTime =
                        event.end && (event.end.dateTime || event.end.date);
                    return hasStartDateTime && hasEndDateTime;
                });

                setCalendarEvents(validEvents);
            }
        } catch (error) {
            console.error("Error when fetching Google Calendar events:", error);
        }
    };

    onMount(() => {
        if (browser) {
            loadEvents();
        }
    });

    $: if (browser && $selectedMonth && $selectedYear) {
        loadEvents();
    }
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
