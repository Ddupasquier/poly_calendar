import { browser } from "$app/environment";
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const googleCalendarListEntryOptions: Writable<string[]> = writable<string[]>([])

export const googleCalendarListEntryOptionsToShow: Writable<string[]> = writable<string[]>([]);

googleCalendarListEntryOptionsToShow.subscribe((value) => {
    if (browser) {
        if (value.length > 0) {
            localStorage.setItem(
                'googleCalendarListEntryOptionsToShow',
                JSON.stringify(value)
            );
        }
    }
});