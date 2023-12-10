<script lang="ts">
    import {
        differenceInCalendarDays,
        endOfDay,
        isValid,
        isWithinInterval,
        startOfDay,
    } from "date-fns";
    import type { CalendarEventModel } from "$lib/models";
    import { eventContainers } from "$lib/stores";

    export let day: Date;
    export let activeEvent: CalendarEventModel | null;
    export let setActiveEvent: (event: CalendarEventModel | null) => void;
    export let event: CalendarEventModel;

    const eventDayIndicator = (
        event: CalendarEventModel,
        day: Date,
    ): string => {
        if (!isValid(event.startDate) || !isValid(event.endDate)) {
            return "";
        }

        const startOfEvent = startOfDay(event.startDate);
        const endOfEvent = endOfDay(event.endDate);
        const currentDay = startOfDay(day);

        if (
            isWithinInterval(currentDay, {
                start: startOfEvent,
                end: endOfEvent,
            })
        ) {
            let dayIndex =
                differenceInCalendarDays(currentDay, startOfEvent) + 1;
            const duration =
                differenceInCalendarDays(endOfEvent, startOfEvent) + 1;

            if (duration === 1) {
                return "";
            }

            return `${dayIndex} / ${duration}`;
        }

        return "";
    };

    const scrollToEvent = (eventId: string, clickedContainer: HTMLElement) => {
        $eventContainers.forEach((container) => {
            if (container && container !== clickedContainer) {
                const eventEl = container.querySelector(
                    `[data-event-id="${eventId}"]`,
                );

                const htmlEventEl = eventEl as HTMLElement;
                if (eventEl) {
                    container.scrollTo({
                        top: htmlEventEl.offsetTop - 10,
                        behavior: "smooth",
                    });
                }
            }
        });
    };
</script>

<div
    class="event"
    data-event-id={event.id}
    on:click={(e) => scrollToEvent(event.id, e.currentTarget)}
    on:keydown={(e) => {
        if (e.key === "Enter") {
            scrollToEvent(event.id, e.currentTarget);
        }
    }}
    on:mouseover={() => setActiveEvent(event)}
    on:focus={() => setActiveEvent(event)}
    on:mouseleave={() => setActiveEvent(null)}
    on:blur={() => setActiveEvent(null)}
    role="button"
    tabindex="0"
    class:active={event === activeEvent}
>
    <h2>{event.title}</h2>
    <span class="event-day-indicator">
        {eventDayIndicator(event, day)}
    </span>
    <!-- {format(event.startDate, "MM/dd/yyyy")} - {format(event.endDate, "MM/dd/yyyy")} -->
</div>

<style lang="scss">
    .event {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem;
        background-color: var(--color-theme-2-L3);
        border: 1px solid var(--color-theme-2-L2);
        border-radius: 4px;
        box-shadow: inset 0 2px 4px hsl(0, 0%, 0%, 0.051);
        transition:
            background-color 0.2s ease-in-out,
            z-index 0.2s ease-in-out,
            transform 0.2s ease-in-out;
        cursor: pointer;
        position: relative;
        z-index: 1;

        &:first-child {
            margin-top: 0;
        }

        &:hover {
            background-color: var(--color-theme-2-L1);
            z-index: 2;
        }

        &.active {
            background-color: var(--color-theme-2-L1);
            transform: scale(1.1);
            z-index: 2;
        }

        h2 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
            margin: 0;
        }

        .event-day-indicator {
            width: 100%;
            text-align: right;
            font-size: 0.75rem;
        }

        @media (max-width: 600px) {
            h2 {
                font-size: 0.75rem;
            }
        }
    }
</style>
