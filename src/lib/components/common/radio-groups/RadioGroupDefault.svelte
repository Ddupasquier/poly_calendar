<script lang="ts">
    import { Radio } from "mysvelte-ui";
    import { createEventDispatcher } from "svelte";

    export let groupId: string;
    export let options: CalendarListEntryRadioOption[] = [];

    // * Selected is to always be a store where we keep the selected state, which simultaneously handles setting selected state to localStorage
    export let selected: string[];

    const dispatch = createEventDispatcher();

    const handleUpdateSelected = (e: { detail: string[] }) => {
        dispatch("selectionChange", e.detail);
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
