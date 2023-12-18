<script lang="ts">
    import type { GoogleCalendarEventModel } from "$lib/models";
    import { AttendeeActionTypesEnum } from "$lib/enums";
    import { format, parseISO } from "date-fns";
    import { Button } from "mysvelte-ui";
    import { uppercaseFirstLetter } from "$lib/utils";

    export let event: GoogleCalendarEventModel;
    let showAttendees = false;
    let currentUserAttendeeResponseStatus: string | undefined = "";

    $: startTime = event.start.dateTime
        ? format(parseISO(event.start.dateTime), "h:mm a")
        : "";
    $: endTime = event.end.dateTime
        ? format(parseISO(event.end.dateTime), "h:mm a")
        : "";

    const getUserEmailFromLocalStorage = () => {
        const user = localStorage.getItem("authUser");
        if (user) {
            const { email } = JSON.parse(user);
            return email;
        }
        return "";
    };

    $: eventStyle = "";

    $: {
        if (event.attendees && event.attendees.length > 0) {
            const currentUserEmail = getUserEmailFromLocalStorage();
            const currentUserAttendee = event.attendees.find(
                (attendee) => attendee.email === currentUserEmail,
            );

            if (currentUserAttendee)
                currentUserAttendeeResponseStatus =
                    currentUserAttendee.responseStatus;

            if (currentUserAttendee) {
                switch (currentUserAttendee.responseStatus) {
                    case AttendeeActionTypesEnum.Accepted:
                        eventStyle = `background-color: ${"var(--color-bg-2)"};`;
                        break;
                    case AttendeeActionTypesEnum.Declined:
                        eventStyle = `
                            background-color: ${"var(--color-bg-0-L3)"}; 
                            box-shadow: inset 15px 0 0 -10px ${"var(--color-theme-1)"};
                        `;
                        break;
                    case AttendeeActionTypesEnum.Tentative:
                        eventStyle = `background-color: ${"var(--color-bg-0-L3)"};`;
                        break;
                    case AttendeeActionTypesEnum.NeedsAction:
                        eventStyle = `background-color: ${"var(--color-bg-0-L3)"};`;
                        break;
                    default:
                        eventStyle = "";
                        break;
                }
            }
        }
    }
</script>

<div class="event" style={eventStyle}>
    <div class="event-header">
        <div>
            {#if event.summary}
                <h2>{event.summary}</h2>
            {/if}
        </div>
        <div class="event-header-right">
            {#if event.htmlLink}
                <a href={event.htmlLink} target="_blank" rel="noopener">
                    View on Google Calendar
                </a>
            {/if}
            {#if currentUserAttendeeResponseStatus}
                <div class="action-type">
                    Status: {uppercaseFirstLetter(
                        currentUserAttendeeResponseStatus,
                    )}
                </div>
            {/if}
        </div>
    </div>
    {#if event.start.dateTime && event.end.dateTime}
        <p>
            <strong>Time:</strong>
            {startTime} - {endTime}
        </p>
    {/if}
    {#if event.location}
        <p><strong>Location:</strong> {event.location}</p>
    {/if}
    {#if event.description}
        <p>{event.description}</p>
    {/if}
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
                                {attendee.email}
                                {#if attendee}
                                    <span class="rsvp">
                                        RSVP: {attendee.responseStatus}
                                    </span>
                                {/if}
                            </li>
                        {/if}
                    {/each}
                </ul>
            </div>
        {/if}
    {/if}

    <div class="hideable-data">
        <p>
            <strong>Organizer:</strong>
            {event.organizer.email}
        </p>
        <p>
            <strong>Created:</strong>
            {format(parseISO(event.created), "MMM d, yyyy h:mm a")}
        </p>
        <p>
            <strong>Updated:</strong>
            {format(parseISO(event.updated), "MMM d, yyyy h:mm a")}
        </p>
        <p>
            <strong>Event ID:</strong>
            {event.id}
        </p>
    </div>
</div>

<style lang="scss">
    .event {
        padding: 0.5rem;
        background-color: var(--background);
        border-radius: 4px;
        box-shadow: inset 10px 0 0 -10px var(--color-theme-2-L3);
        transition: box-shadow 1s ease-in;
        cursor: pointer;

        &:hover {
            box-shadow: inset 15px 0 0 -10px var(--color-theme-2-L3);
        }

        .event-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            @media (max-width: 600px) {
                flex-direction: column;
                align-items: flex-start;
            }

            h2 {
                font-size: 1rem;
                color: #333;
                margin: 0;
                user-select: none;

                @media (max-width: 600px) {
                    font-size: 0.75rem;
                }
            }

            a {
                font-size: 0.75rem;
                color: var(--color-theme-2);
                text-decoration: none;
                user-select: none;

                &:hover {
                    text-decoration: underline;
                }

                @media (max-width: 600px) {
                    font-size: 0.7rem;
                }
            }

            .event-header-right {
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
                flex-direction: column;

                @media (max-width: 600px) {
                    margin-top: 0.5rem;
                }

                .action-type {
                    font-size: 0.75rem;
                    color: #333;
                    margin: 0;
                    margin-left: 0.5rem;
                    user-select: none;

                    @media (max-width: 600px) {
                        font-size: 0.7rem;
                    }
                }
            }
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
                display: flex;
                justify-content: space-between;
                padding: 0.25rem 0.75rem;
                margin-bottom: 0.25rem;
                box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease;
                font-size: 0.75rem;

                &:hover {
                    background-color: var(--color-bg-0-L4);
                }

                .rsvp {
                    font-style: italic;
                    min-width: 8rem;
                }
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
