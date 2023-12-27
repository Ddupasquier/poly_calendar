<script lang="ts">
    import type { GoogleCalendarEventModel } from "$lib/models";
    import { fetchCurrentUser } from "$lib/services";
    import { attendeeActionEventStyle, getEventColor } from "$lib/utils";
    import { format, parseISO } from "date-fns";

    export let event: GoogleCalendarEventModel;

    let currentUserAttendeeResponseStatus: string | undefined = "";
    let currentUserEmail: string | undefined = "";
    let eventStyle = "";

    const hasEventEnded = (
        endDate: string | number | Date | undefined,
    ): boolean => {
        if (!endDate) return false;

        return new Date(endDate) < new Date();
    };

    $: startTime = event.start.dateTime
        ? format(parseISO(event.start.dateTime), "MMM d, yyyy h:mm a")
        : event.start.date
          ? format(parseISO(event.start.date), "MMM d, yyyy")
          : "";

    $: endTime = event.end.dateTime
        ? format(parseISO(event.end.dateTime), "MMM d, yyyy h:mm a")
        : event.end.date
          ? format(parseISO(event.end.date), "MMM d, yyyy")
          : "";

    (async () => {
        const user = await fetchCurrentUser();
        if (user) {
            currentUserEmail = user.email;
        }
    })();

    $: if (event.attendees && event.attendees.length > 0 && currentUserEmail) {
        const currentUserAttendee = event.attendees.find(
            (attendee) => attendee.email === currentUserEmail,
        );
        currentUserAttendeeResponseStatus = currentUserAttendee?.responseStatus;
        eventStyle = attendeeActionEventStyle(
            currentUserAttendeeResponseStatus,
        );
    } else if (event.colorId) {
        eventStyle = getEventColor(event);
    } else {
        eventStyle = `
            --background: var(--color-theme-2-L1);
            --background-light: var(--color-theme-2-L3);
        `;
    }
</script>

<div
    class="event {hasEventEnded(event.end.dateTime || event.end.date)
        ? 'ended'
        : ''}"
    style={eventStyle}
>
    <h2>{event.summary}</h2>
    <p>
        Start Time: {startTime}
        <br />
        End Time: {endTime}
    </p>
</div>

<style lang="scss">
    .event {
        padding: 0.5rem;
        margin: 0.5rem 0;
        background-color: var(--background-light, var(--color-theme-2-L3));
        border: 1px solid var(--background, var(--color-theme-2-L1));
        border-radius: 4px;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: background-color 0.5s ease-in-out;
        cursor: pointer;

        h2 {
            font-size: 0.85rem;
            color: #333;
            margin: 0;
            user-select: none;
        }

        p {
            font-size: 0.75rem;
            color: #666;
            margin: 0;
            user-select: none;
        }

        &:last-child {
            margin-bottom: 0;
        }

        &:hover {
            background-color: var(--color-bg-2);
        }

        @media (max-width: 600px) {
            padding: 1rem;

            h2,
            p {
                font-size: 0.75rem;
            }
        }

        @media (max-width: 400px) {
            h2,
            p {
                font-size: 0.7rem;
            }
        }
    }

    .event.ended {
        background-color: var(--color-bg-2);
        border-color: var(--background);
        color: var(--color-text-light);
        text-decoration: line-through;
    }
</style>
