import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const eventContainers: Writable<HTMLElement[]> = writable<HTMLElement[]>([]);