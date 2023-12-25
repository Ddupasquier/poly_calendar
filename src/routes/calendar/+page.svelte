<script lang="ts">
    import { Calendar } from ".";

    export let data: CalendarPageData;
    $: console.log(data?.props?.events)
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
