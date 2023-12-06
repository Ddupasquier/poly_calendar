<script lang="ts">
  import { filterType, setCurrentView, setFilterType } from "$lib/stores";
  import { ViewTypesEnum, EventTypesEnum } from "$lib/enums";
  import { Button } from "mysvelte-ui";

  const viewTypes = Object.values(ViewTypesEnum);
  const eventTypes = Object.values(EventTypesEnum);

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
</script>

<div class="calendar-header">
  <div class="filter-event-types">
    <select bind:value={$filterType} on:change={() => setFilterType($filterType)}>
      {#each eventTypes as eventType (eventType)}
        <option value={eventType}>{capitalizeFirstLetter(eventType)}</option>
      {/each}
    </select>
  </div>

  <div class="set-view-types">
    {#each viewTypes as viewType (viewType)}
      <Button
        background="var(--color-theme-2)"
        on:click={() => setCurrentView(viewType)}
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
    border-bottom: 1px solid hsl(0, 0, 80%);
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

  .filter-event-types {
    display: flex;
    align-items: center;
  }

  .set-view-types {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
