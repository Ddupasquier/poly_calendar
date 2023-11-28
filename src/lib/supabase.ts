import { createClient } from "@supabase/supabase-js";
// import type { Database } from "./schema";

// export const supabase = createClient<Database>(
//     import.meta.env.VITE_SUPABASE_URL,
//     import.meta.env.VITE_SUPABASE_ANON_KEY
// );

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string
);