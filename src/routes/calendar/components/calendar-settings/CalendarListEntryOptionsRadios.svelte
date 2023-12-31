<script lang="ts">
    import {
        googleCalendarListEntryOptions,
        googleCalendarListEntryOptionsSelected,
    } from "$lib/stores";
    import { Common } from "$lib/components";

    export let groupId: string;

    const updateSelected = (newSelected: CalendarListEntryRadioOption[]): void => {
        googleCalendarListEntryOptionsSelected.set(newSelected);
    };
</script>

<Common.RadioGroupDefault
    {groupId}
    options={$googleCalendarListEntryOptions}
    selected={$googleCalendarListEntryOptionsSelected}
    on:selectionChange={(event) => updateSelected(event.detail)}
/>
