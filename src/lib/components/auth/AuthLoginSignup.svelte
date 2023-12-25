<script lang="ts">
    import { Button, Card } from "mysvelte-ui";
    import { signInWithPassword, signup } from "$lib/services";
    import {
        addToast,
        helperTextStore as helperText,
        setHelperText,
    } from "$lib/stores";
    import { Common } from "$lib/components";
    import LoginDivider from "./LoginDivider.svelte";
    import { goto } from "$app/navigation";

    let email: string = "";
    let password: string = "";

    let isSubmitting = false;

    const handleSignup = async () => {
        isSubmitting = true;

        try {
            await signup(email, password);
        } catch (error) {
            // Handle the error appropriately here
        } finally {
            isSubmitting = false;
        }
    };

    const handleSignin = async () => {
        isSubmitting = true;

        try {
            const result = await signInWithPassword(email, password);
            if (result) {
                const { email: signedInEmail, redirect } = result;
                addToast(`Logged in successfully with ${signedInEmail}!!!`, {
                    duration: 5000,
                    closable: true,
                });
                setHelperText({
                    error: false,
                    message: "Logged in successfully.",
                });

                goto(redirect);
            }
        } catch (error) {
            // Handle the error appropriately here
        } finally {
            isSubmitting = false;
        }
    };
</script>

<Card background={"var(--color-bg-2)"}>
    <form>
        <Card.Head style="text-align: center">Lets get you logged in!</Card.Head
        >
        <Card.Content>
            <div class="form-group">
                <Common.EmailInput
                    bind:value={email}
                    color={"var(--color-theme-2)"}
                    background="transparent"
                    placeholder="Email"
                />
                <Common.PasswordInput
                    bind:value={password}
                    color={"var(--color-theme-2)"}
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
                    on:click={handleSignup}>Sign Up</Button
                >

                <Button
                    disabled={isSubmitting}
                    background={"var(--color-theme-2)"}
                    on:click={handleSignin}>Sign In</Button
                >
            </div>
            <LoginDivider />
            <!-- <div class="oauth-buttons">
                <Button
                    on:click={() => handleOAuthLogin("google")}
                    background={"var(--color-theme-2-D2)"}
                    style="width: 100%">Google</Button
                >
            </div> -->
        </Card.Foot>
    </form>
    {#if !!$helperText.message}
        <div class="helper-text">
            {$helperText.message}
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
