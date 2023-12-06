<script lang="ts">
    const daysOfTheWeek = [
        {
            name: "Sunday",
            shortName: "Sun",
        },
        {
            name: "Monday",
            shortName: "Mon",
        },
        {
            name: "Tuesday",
            shortName: "Tue",
        },
        {
            name: "Wednesday",
            shortName: "Wed",
        },
        {
            name: "Thursday",
            shortName: "Thu",
        },
        {
            name: "Friday",
            shortName: "Fri",
        },
        {
            name: "Saturday",
            shortName: "Sat",
        },
    ];
</script>

<div class="weekday-bar">
    {#each daysOfTheWeek as day}
        <div class="weekday">
            <h3>{day.shortName}</h3>
        </div>
    {/each}
</div>

<style lang="scss">
    .weekday-bar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        padding: 0 1.2rem;

        .weekday {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.5rem;
            border-right: 1px solid #eee;

            &:last-child {
                border-right: none;
            }

            h3 {
                font-size: 0.8rem;
                color: #666;
                margin: 0;
            }
        }
    }
</style>
