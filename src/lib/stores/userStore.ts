import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Session, User } from "@supabase/supabase-js";

export const saveAuthUserAndSession = (user: User, session: Session) => {
    authUser.set(user);
    authSession.set(session);
}

export const authUser: Writable<User | null> = writable(null);
export const authSession: Writable<Session | null> = writable(null);