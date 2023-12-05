<script lang="ts">
    import Calendar from "./components/Calendar.svelte";
    import { onMount } from "svelte";
    import { calendarEvents } from "$lib/stores";
    import { EventTypesEnum } from "$lib/enums";
    import type { EventTypesModel } from "$lib/models";

    export let data;

    // Assuming data is the correct type here
    const { events } = data;

    // Adjust the function's return type to match EventTypesModel
    function mapEventType(eventType: string): EventTypesModel {
        switch (eventType) {
            case "meeting":
                // Make sure that EventTypesEnum.Meeting is assignable to EventTypesModel
                return EventTypesEnum.Meeting;
            case "appointment":
                // Make sure that EventTypesEnum.Appointment is assignable to EventTypesModel
                return EventTypesEnum.Appointment;
            case "birthday":
                // Make sure that EventTypesEnum.Birthday is assignable to EventTypesModel
                return EventTypesEnum.Birthday;
            default:
                // Make sure that EventTypesEnum.All is assignable to EventTypesModel
                return EventTypesEnum.All;
        }
    }

    // Usage in onMount
    onMount(() => {
        const mappedEvents = events.map((event) => ({
            ...event,
            type: mapEventType(event.type),
        }));
        calendarEvents.set(mappedEvents);
    });
</script>

<Calendar />
