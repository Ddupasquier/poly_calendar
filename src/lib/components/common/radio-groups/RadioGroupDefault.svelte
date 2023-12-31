<script lang="ts">
    import { Radio } from "mysvelte-ui";
    import { createEventDispatcher } from "svelte";

    export let groupId: string;
    export let options: CalendarListEntryRadioOption[] = [];
    export let selected: CalendarListEntryRadioOption[];

    const dispatch = createEventDispatcher();

    const handleUpdateSelected = (e: { detail: string[] }) => {
        console.log("handleUpdateSelected", e.detail);
        dispatch("selectionChange", e.detail);
    };
</script>

<Radio
    {groupId}
    options={options.map((option) => option.label)}
    {selected}
    size="small"
    use="many"
    checkbox
    on:updateSelected={handleUpdateSelected}
/>
