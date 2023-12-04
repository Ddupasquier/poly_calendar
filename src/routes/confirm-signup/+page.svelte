<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { setHelperText } from "$lib/stores/reactiveTextStore";
    import AuthEmailConfirmation from "$lib/components/auth/AuthEmailConfirmation.svelte";
    import { saveAuthUserAndSession } from "$lib/stores/userStore";
    import { startCountdownWithMessage } from "$lib/utils/utils";

    export let data: any;
    const { token, confirmationResult } = data;

    onMount(() => {
        if (confirmationResult !== undefined) {
            console.log("confirmationResult", confirmationResult);
            setHelperText(
                false,
                `${startCountdownWithMessage(
                    5,
                    "Sign up confirmed successfully. You will be redirected in {timer} seconds...",
                )}`,
            );
            setTimeout(() => {
                goto("/profile?tab=profile");
            }, 5000);
        }
    });
</script>

<div class="container">
    {#if token}
        <AuthEmailConfirmation {token} />
    {/if}
</div>
