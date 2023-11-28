import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Session, User } from "@supabase/supabase-js";

export const userUser: Writable<User | null> = writable(null);
export const userSession: Writable<Session | null> = writable(null);