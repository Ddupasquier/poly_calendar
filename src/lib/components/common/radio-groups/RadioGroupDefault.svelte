<script lang="ts">
    import { Radio } from "mysvelte-ui";
    import { createEventDispatcher } from "svelte";

    export let groupId: string;
    export let options: CalendarListEntryRadioOption[] = [];
    export let selected: CalendarListEntryRadioOption[];

    $: console.log(
        "RadioGroupDefault.svelte selected",
        selected,
    )

    const dispatch = createEventDispatcher();

    const handleUpdateSelected = (e: {
        detail: CalendarListEntryRadioOption[];
    }) => {
        dispatch("selectionChange", e.detail);
    };
</script>

<Radio
    {groupId}
    {options}
    {selected}
    size="small"
    use="many"
    checkbox
    on:updateSelected={handleUpdateSelected}
/>
