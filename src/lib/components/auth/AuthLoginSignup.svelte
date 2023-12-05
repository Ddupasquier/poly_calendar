<script lang="ts">
    import { Button, Card } from "mysvelte-ui";
    import { signUp, signIn, handleOAuthLogin } from "$lib/services";
    import { helperTextStore as helperText } from "$lib/stores";
    import { colors } from "$lib/constants";
    import { Common } from "$lib/components";
    import LoginDivider from "./LoginDivider.svelte";

    let email: string = "";
    let password: string = "";
</script>

<Card background={colors["--color-bg-2"]}>
    <Card.Head style="text-align: center">Lets get you logged in!</Card.Head>
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
                background={colors["--color-theme-2"]}
                on:click={() => signUp(email, password)}>Sign Up</Button
            >
            <Button
                on:click={() => signIn(email, password)}
                background={colors["--color-theme-2"]}>Sign In</Button
            >
        </div>
        <LoginDivider />
        <div class="oauth-buttons">
            <!-- <button on:click={() => handleOAuthLogin("github")}>GitHub</button> -->
            <Button
                on:click={() => handleOAuthLogin("google")}
                background={colors["--color-theme-2-D1"]}
                style="width: 100%">Google</Button
            >
        </div>
    </Card.Foot>
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

    .oauth-buttons {
        button {
            width: 70%;
            margin: 0.75rem auto;
            display: block;
            padding: 0.5rem 1rem;
            background-color: #007bff;
            color: #fff;
            border: none;
            &:hover {
                background-color: #0056b3;
            }
        }
    }
</style>
