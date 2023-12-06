<script lang="ts">
    import { CalendarHeader, CalendarBody } from "..";
</script>

<div class="calendar">
    <CalendarHeader />
    <CalendarBody />
</div>

<style lang="scss">
  .calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-bg-2);
    border-radius: var(--primary-border-radius);
    margin: 20px;
    max-width: 1000px;
  }
</style>
