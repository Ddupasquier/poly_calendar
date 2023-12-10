<script lang="ts">
  import {
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    compareAsc,
    endOfDay,
    isBefore,
    isValid,
    isWithinInterval,
  } from "date-fns";
  import type { CalendarEvent } from "../types";
  import { EventsContainer } from "..";

  export let events: CalendarEvent[] = [];

  let activeEvent: CalendarEvent | null = null;

  const setActiveEvent = (event: CalendarEvent | null) => {
    activeEvent = event;
  };

  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start, end });

  const eventFallsOnDay = (event: CalendarEvent, day: Date): boolean => {
    if (!isValid(event.startDate) || !isValid(event.endDate)) {
      return false;
    }

    if (isBefore(event.endDate, event.startDate)) {
      return false;
    }

    const endOfCurrentDay = endOfDay(day);
    const adjustedEndDate = endOfDay(event.endDate);

    return isWithinInterval(endOfCurrentDay, {
      start: event.startDate,
      end: adjustedEndDate,
    });
  };

  $: getEventsForDay = (day: Date) => {
    const eventsForDay = events.filter((event) => eventFallsOnDay(event, day));
    eventsForDay.sort((a, b) => compareAsc(a.startDate, b.startDate));
    return eventsForDay;
  };
</script>

<div class="week-view">
  {#each weekDays as day, index}
    <div class="day">
      <h3>
        {format(day, "EEEE")},
        <br />{format(day, "MMM d")}
      </h3>
      <EventsContainer
        {getEventsForDay}
        {day}
        {activeEvent}
        {setActiveEvent}
        {index}
      />
    </div>
  {/each}
</div>

<style lang="scss">
  .week-view {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background-color: hsl(0, 0%, 97%);
    border-radius: var(--primary-border-radius);
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 600px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 400px) {
      grid-template-columns: 1fr;
    }

    .day {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: var(--primary-border-radius);
      min-height: 3rem;

      h3 {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin: 0;
        width: 100%;
        background-color: var(--color-theme-1-L1);
        color: #333;
        text-align: center;
        border-radius: 4px 4px 0 0;
        padding: 0.25rem 0.5rem;
        box-sizing: border-box;
        user-select: none;
        font-size: 0.85rem;
        min-height: 2.5rem;

        @media (max-width: 600px) {
          font-size: 0.75rem;
        }
      }
    }
  }
</style>
