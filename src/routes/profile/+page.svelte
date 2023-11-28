<script lang="ts">
    import { supabase } from "$lib/supabase";

    import { userUser, userSession } from "$lib/stores/userStore";
    
    import Auth from "$lib/components/auth/Auth.svelte";
    import { Button } from "mysvelte-ui";

    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error);
        } else {
            userUser.set(null);
            userSession.set(null);
        }
    }
</script>

{#if !$userUser}
    <Auth />
{:else}
    <Button on:click={logout}>Logout</Button>
{/if}
