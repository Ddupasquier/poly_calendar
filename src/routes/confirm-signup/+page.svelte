<script lang="ts">
    import { onMount } from "svelte";
    import { Card } from "mysvelte-ui";
    import { helperTextStore as helperText } from "$lib/stores";
    import { goto } from "$app/navigation";

    export let data: ConfirmSignupPageData;
    const { error, props, status, message, redirect } = data;

    onMount(async () => {
        if (redirect && status === 200) {
            setTimeout(() => goto(redirect), 5000);
        }
    });
</script>

<div class="container">
    <Card background={"var(--color-bg-2)"}>
        <Card.Head style="text-align: center">Confirm Your Signup</Card.Head>
        <Card.Content style="margin-bottom: 1rem">
            <div class="confirmation-instructions">
                {message}
            </div>
        </Card.Content>
        {#if !!$helperText.message}
            <div class="helper-text">
                {$helperText.message}
            </div>
        {/if}
    </Card>
</div>

<style>
    .confirmation-instructions {
        text-align: center;
    }
</style>
