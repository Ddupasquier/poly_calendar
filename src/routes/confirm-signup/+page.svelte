<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { setHelperText } from "$lib/stores";
    import { Auth } from "$lib/components";
    import { commonUtils } from "$lib/utils";

    export let data: any;
    const { token, confirmationResult } = data;

    onMount(() => {
        if (confirmationResult !== undefined) {
            console.log("confirmationResult", confirmationResult);
            setHelperText(
                false,
                `${commonUtils.startCountdownWithMessage(
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
        <Auth.AuthEmailConfirmation {token} />
    {/if}
</div>
