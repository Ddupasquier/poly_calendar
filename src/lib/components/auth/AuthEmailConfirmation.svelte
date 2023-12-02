<script lang="ts">
    export let token: string | null = null;

    import { helperTextStore as helperText } from "$lib/stores/reactiveTextStore";

    import { Card } from "mysvelte-ui";
    import { colors } from "$lib/palette";
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
