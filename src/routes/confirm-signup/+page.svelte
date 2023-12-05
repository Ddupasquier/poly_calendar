<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { setHelperText } from "$lib/stores";
    import { Auth } from "$lib/components";
    import { confirmSignUp } from "$lib/services";

    export let data: any;
    const { token } = data;

    onMount(async () => {
        if (token) {
            const result = await confirmSignUp(token);
            if (result.success) {
                // Display success helper text and redirect
                setHelperText(
                    false,
                    "Your signup has been confirmed. You can now login!",
                );
                setTimeout(() => goto("/profile?tab=profile"), 5000);
            } else {
                // Display error helper text
                setHelperText(
                    true,
                    result.message ||
                        "AError confirming sign up. Please try again.",
                );
            }
        } else {
            setHelperText(true, "No token provided for confirmation.");
        }
    });
</script>

<div class="container">
    {#if token}
        <Auth.AuthEmailConfirmation {token} />
    {/if}
</div>
