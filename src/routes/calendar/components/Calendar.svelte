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
    background-color: var(--color-bg-2);
    border-radius: var(--primary-border-radius);
    margin: 2rem auto;
    width: 100%;
  }
</style>
