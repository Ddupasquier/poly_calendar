<script lang="ts">
    import type { GoogleCalendarEventModel } from "$lib/models";
    import { eventContainers } from "$lib/stores";
    import { eventDayIndicator, getEventColor } from "$lib/utils";

    export let day: Date;
    export let activeEvent: GoogleCalendarEventModel | null;
    export let setActiveEvent: (event: GoogleCalendarEventModel | null) => void;
    export let event: GoogleCalendarEventModel;

    $: eventBg = getEventColor(event);

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
    style={eventBg}
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
    <span class="event-summary">{event?.summary}</span>
    <span class="event-day-indicator">
        {eventDayIndicator(event, day)}
    </span>
</div>

<style lang="scss">
    .event {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem;
        background-color: var(--primary, var(--color-theme-2-L3));
        border: 1px solid var(--primary, var(--color-theme-2-L2));
        border-radius: 4px;
        box-shadow: inset 0 2px 4px hsl(0, 0%, 0%, 0.051);
        transition:
            background-color 0.2s ease-in-out,
            z-index 0.2s ease-in-out,
            transform 0.2s ease-in-out;
        cursor: pointer;
        position: relative;
        word-wrap: break-word;
        z-index: 1;

        &:first-child {
            margin-top: 0;
        }

        &:hover {
            background-color: var(--secondary, var(--color-theme-2-L4));
            z-index: 2;
        }

        &.active {
            background-color: var(--secondary, var(--color-theme-2-L4));
            transform: scale(1.1);
            z-index: 2;
        }

        .event-summary {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: break-spaces;
            vertical-align: top;
            max-width: 100%;
        }

        .event-day-indicator {
            width: 100%;
            text-align: right;
            font-size: 0.6rem;
        }

        @media (max-width: 600px) {
            .event-summary {
                font-size: clamp(0.75rem, 1vw, 1rem);
            }
        }
    }
</style>
