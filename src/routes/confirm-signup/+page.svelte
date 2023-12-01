<script lang="ts">
    import { onMount } from "svelte";
    import { authenticationConfirmationService } from "$lib/services/authentication-confirmation-service";
    import { helperTextStore as helperText } from "$lib/stores/reactiveTextStore";

    import { Card, Button } from "mysvelte-ui";
    import { colors } from "$lib/palette";

    const { confirmSignUp } = authenticationConfirmationService;

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
        <Card background={colors["--color-bg-2"]}>
            <Card.Head style="text-align: center">Confirm Your Signup</Card.Head
            >
            <Card.Content>
                <div class="confirmation-instructions">
                    Please click the button below to confirm your email and
                    complete your signup process.
                </div>
            </Card.Content>
            <Card.Foot>
                <Button
                    on:click={() => confirmSignUp(token ?? "")}
                    background={colors["--color-theme-2"]}
                >
                    Confirm Signup
                </Button>
            </Card.Foot>
            {#if !!$helperText.text}
                <div class="helper-text">
                    {$helperText.text}
                </div>
            {/if}
        </Card>
    {/if}
</div>

<style>
    .confirmation-instructions {
        text-align: center;
    }
</style>
