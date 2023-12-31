<script lang="ts">
    import { Radio } from "mysvelte-ui";
    import { createEventDispatcher } from "svelte";

    export let groupId: string;
    export let options: CalendarListEntryRadioOption[] = [];
    export let selected: string[];

    const dispatch = createEventDispatcher();

    const handleUpdateSelected = (e: { detail: string[] }) => {
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
