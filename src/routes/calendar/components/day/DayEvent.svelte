<script lang="ts">
    import type { CalendarEventModel } from "$lib/models";
    import { Button } from "mysvelte-ui";

    export let event: CalendarEventModel;
    let showAttendees = false;
</script>

<div class="event">
    <div class="event-header">
        {#if event.title}
            <h2>{event.title}</h2>
        {/if}
        {#if event.startDate && event.endDate}
            <p>
                <strong>Time:</strong>
                {event.startDate.toLocaleTimeString()} -
                {event.endDate.toLocaleTimeString()}
            </p>
        {/if}
        {#if event.location}
            <p><strong>Location:</strong> {event.location}</p>
        {/if}
        {#if event.description}
            <p>{event.description}</p>
        {/if}
    </div>
    {#if event.attendees && event.attendees.length > 0}
        <Button
            on:click={() => (showAttendees = !showAttendees)}
            background="var(--color-theme-2)"
            size="xsmall"
            style="margin: 0.25rem; font-size: 0.75rem;"
        >
            {showAttendees ? "Hide" : "Show"} Attendees
        </Button>
        {#if showAttendees}
            <div class="attendees-list">
                <ul>
                    {#each event.attendees as attendee}
                        {#if attendee}
                            <li class="attendee-pill">
                                {attendee.name}
                                {#if attendee.rsvp}
                                    <span class="rsvp">
                                        RSVP: {attendee.rsvpResponse} on {attendee.rsvpDate.toLocaleDateString()}
                                    </span>
                                {/if}
                            </li>
                        {/if}
                    {/each}
                </ul>
            </div>
        {/if}
    {/if}
</div>

<style lang="scss">
    .event {
        padding: 0.5rem;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: inset 10px 0 0 -10px var(--color-theme-2-L3);
        transition: box-shadow 1s ease-in;
        cursor: pointer;

        &:hover {
            box-shadow: inset 15px 0 0 -10px var(--color-theme-2-L3);
        }

        .attendees-list {
            padding: 0.5rem;
            margin-top: 0.25rem;

            ul {
                list-style-type: none;
                padding: 0;
                margin: 0;
            }

            .attendee-pill {
                background: #fff;
                border-radius: 4px;
                display: block;
                padding: 0.25rem 0.75rem;
                margin-bottom: 0.25rem;
                box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease;
                font-size: 0.75rem;

                &:hover {
                    background-color: #e6e6e6;
                }

                .rsvp {
                    font-style: italic;
                    margin-left: 0.5rem;
                }
            }
        }

        h2 {
            font-size: 0.85rem;
            color: #333;
            margin: 0 0 0.5rem 0;
            user-select: none;

            @media (max-width: 600px) {
                font-size: 0.75rem;
            }
        }

        p {
            font-size: 0.75rem;
            color: #666;
            margin: 0;
            user-select: none;

            @media (max-width: 600px) {
                font-size: 0.7rem;
            }
        }
    }
</style>
