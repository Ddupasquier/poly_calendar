<script lang="ts">
    import { onMount } from "svelte";
    import { authenticationConfirmationService } from "$lib/services/authentication-confirmation-service";
    import { helperTextStore as helperText } from "$lib/stores/reactiveTextStore";

    import { Card, Button } from "mysvelte-ui";
    import { colors } from "$lib/palette";
    import AuthEmailConfirmation from "$lib/components/auth/AuthEmailConfirmation.svelte";

    let email: string;
    let token: string | null = null;

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        email = urlParams.get("email") ?? "";
        token = urlParams.get("token");
    });
</script>

<div class="container">
    {#if token}
        <AuthEmailConfirmation {token} />
    {/if}
</div>
