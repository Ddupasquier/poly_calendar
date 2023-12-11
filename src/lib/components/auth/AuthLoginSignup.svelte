<script lang="ts">
    import { Button, Card } from "mysvelte-ui";
    import { signUp, signIn, handleOAuthLogin } from "$lib/services";
    import { helperTextStore as helperText } from "$lib/stores";
    import { colors } from "$lib/constants";
    import { Common } from "$lib/components";
    import LoginDivider from "./LoginDivider.svelte";

    let email: string = "";
    let password: string = "";

    let isSubmitting = false;

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        isSubmitting = true;

        try {
            await signUp(email, password);
            // Handle success (e.g., navigate to a new page or show a success message)
        } catch (error) {
            // Handle error (e.g., show an error message)
        }

        isSubmitting = false;
    };
</script>

<Card background={"var(--color-bg-2)"}>
    <form on:submit={handleSubmit}>
        <Card.Head style="text-align: center">Lets get you logged in!</Card.Head
        >
        <Card.Content>
            <div class="form-group">
                <Common.EmailInput
                    bind:value={email}
                    color={colors["--color-theme-2"]}
                    background="transparent"
                    placeholder="Email"
                />
                <Common.PasswordInput
                    bind:value={password}
                    color={colors["--color-theme-2"]}
                    background="transparent"
                    placeholder="Password"
                />
            </div>
        </Card.Content>
        <Card.Foot>
            <div class="button-group">
                <Button
                    disabled={isSubmitting}
                    background={"var(--color-theme-2)"}
                    on:click={() => {
                        isSubmitting = true;
                        signUp(email, password)
                            .then(() => {
                                isSubmitting = false; // Re-enable the button after the promise resolves
                            })
                            .catch(() => {
                                isSubmitting = false; // Re-enable the button if an error occurs
                            });
                    }}>Sign Up</Button
                >
                <Button
                    on:click={() => signIn(email, password)}
                    background={"var(--color-theme-2)"}>Sign In</Button
                >
            </div>
            <LoginDivider />
            <div class="oauth-buttons">
                <!-- <button on:click={() => handleOAuthLogin("github")}>GitHub</button> -->
                <Button
                    on:click={() => handleOAuthLogin("google")}
                    background={"var(--color-theme-2-D2)"}
                    style="width: 100%">Google</Button
                >
            </div>
        </Card.Foot>
    </form>
    {#if !!$helperText.text}
        <div class="helper-text">
            {$helperText.text}
        </div>
    {/if}
</Card>

<style lang="scss">
    .button-group {
        display: flex;
        justify-content: space-between;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
</style>
