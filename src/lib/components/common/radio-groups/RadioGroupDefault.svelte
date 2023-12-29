<script lang="ts">
    import { onMount } from 'svelte';
    import {
        googleCalendarListEntryOptionsToShow,
        googleCalendarListEntryOptions,
    } from "$lib/stores/calendar/calendar-settings-store";
    import { Radio } from "mysvelte-ui";

    export let groupId: string;
    let options: string[] = [];
    let selected: string[] = [];

    // Function to update both the store and local storage
    const updateSelection = (newSelected: string[]) => {
        googleCalendarListEntryOptionsToShow.set(newSelected);
        localStorage.setItem(
            "googleCalendarListEntryOptionsToShow",
            JSON.stringify(newSelected),
        );
    };

    // Load initial selection from local storage or use a default value
    onMount(() => {
        const storedOptionsToShow = localStorage.getItem("googleCalendarListEntryOptionsToShow");
        if (storedOptionsToShow) {
            selected = JSON.parse(storedOptionsToShow);
            // Directly set the value of the store without causing a reactivity loop
            googleCalendarListEntryOptionsToShow.set(selected);
        }
    });

    // Reactively update options when the store value changes
    $: if ($googleCalendarListEntryOptions) {
        options = $googleCalendarListEntryOptions;
    }

    // Listen for changes in the store for googleCalendarListEntryOptionsToShow
    $: if ($googleCalendarListEntryOptionsToShow !== selected) {
        selected = $googleCalendarListEntryOptionsToShow;
    }

    const handleUpdateSelected = (e: { detail: string[] }) => {
        selected = e.detail;
        updateSelection(selected);
    };
</script>

<Radio
    {groupId}
    {options}
    {selected}
    size="small"
    use="many"
    on:updateSelected={handleUpdateSelected}
/>
