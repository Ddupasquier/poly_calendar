<script lang="ts">
    import { Card } from "mysvelte-ui";
    import { helperTextStore as helperText } from "$lib/stores";
    import { colors } from "$lib/constants";

    export let token: string | null = null;
</script>

<div class="container">
    {#if token}
        <Card background={colors["--color-bg-2"]}>
            <Card.Head style="text-align: center">Confirm Your Signup</Card.Head
            >
            <Card.Content style="margin-bottom: 1rem">
                <div class="confirmation-instructions">
                    Your signup has been confirmed. You can now login!
                </div>
            </Card.Content>
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
