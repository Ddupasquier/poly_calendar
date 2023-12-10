<script lang="ts">
  import {
    filterType,
    setCurrentView,
    setFilterType,
    // numberOfRecordsShown,
    // setNumberOfRecordsShown,
  } from "$lib/stores";
  import { ViewTypesEnum, EventTypesEnum } from "$lib/enums";
  import { Button } from "mysvelte-ui";
  import { goto } from "$app/navigation";

  const viewTypes = Object.values(ViewTypesEnum);
  const eventTypes = Object.values(EventTypesEnum);

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
</script>

<div class="calendar-header">
  <div class="filters">
    <div class="filter-item">
      <label for="filter-type">Event Types:</label>
      <select
        bind:value={$filterType}
        on:change={() => setFilterType($filterType)}
      >
        {#each eventTypes as eventType (eventType)}
          <option value={eventType}>{capitalizeFirstLetter(eventType)}</option>
        {/each}
      </select>
    </div>

    <!-- <div class="filter-item">
      <label for="number-of-records">Number:</label>
      <select
        bind:value={$numberOfRecordsShown}
        on:change={() => setNumberOfRecordsShown($numberOfRecordsShown)}
      >
        <option value={15}>15</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={75}>75</option>
      </select>
    </div> -->
  </div>

  <div class="set-view-types">
    {#each viewTypes as viewType (viewType)}
      <Button
        background="var(--color-theme-2)"
        on:click={() => {
          setCurrentView(viewType);
          goto(`/calendar?view=${viewType}`);
        }}
      >
        {capitalizeFirstLetter(viewType)}
      </Button>
    {/each}
  </div>
</div>

<style lang="scss">
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem;
    background-color: var(--color-bg-2);
    border-radius: var(--primary-border-radius) var(--primary-border-radius) 0 0;
    border-bottom: 1px solid hsl(0, 0%, 20%);
    box-sizing: border-box;

    select {
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #dcdcdc;
      background-color: white;

      &:focus {
        outline: none;
        border-color: #a0a0a0;
      }
    }
  }

  .filters {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    .filter-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.15rem;
      font-size: x-small;
    }
  }

  .set-view-types {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
