<script lang="ts">
    import { authenticationService } from "$lib/services/auth/authentication-service";
    import { helperTextStore as helperText } from "$lib/stores/reactiveTextStore";
    import { Button, Card } from "mysvelte-ui";
    import { colors } from "$lib/palette";
    import EmailInput from "../inputs/EmailInput.svelte";
    import PasswordInput from "../inputs/PasswordInput.svelte";

    const { signUp, signIn } = authenticationService;

    let email: string = "";
    let password: string = "";

    // const handleOAuthLogin = async (provider: Provider) => {
    //     // You need to enable the third party auth you want in Authentication > Settings
    //     // Read more on: https://supabase.com/docs/guides/auth#third-party-logins
    //     let { error } = await supabase.auth.signInWithOAuth({ provider });
    //     if (error) console.log("Error: ", error.message);
    // };
</script>

<div class="container">
    <Card background={colors["--color-bg-2"]}>
        <Card.Head style="text-align: center">Lets get you logged in!</Card.Head
        >
        <Card.Content>
            <div class="form-group">
                <EmailInput
                    bind:value={email}
                    color={colors["--color-theme-2"]}
                    background="transparent"
                    placeholder="Email"
                />
                <PasswordInput
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
            <!-- <div class="divider">
                <span>Or continue with</span>
            </div> -->
            <!-- <div class="oauth-buttons">
                <button on:click={() => handleOAuthLogin("github")}>GitHub</button>
                <button on:click={() => handleOAuthLogin("google")}>Google</button>
            </div> -->
        </Card.Foot>
        {#if !!$helperText.text}
            <div class="helper-text">
                {$helperText.text}
            </div>
        {/if}
    </Card>
</div>

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

    // .oauth-buttons {
    //     button {
    //         width: 70%;
    //         margin: 0.75rem auto;
    //         display: block;
    //         padding: 0.5rem 1rem;
    //         background-color: #007bff;
    //         color: #fff;
    //         border: none;
    //         &:hover {
    //             background-color: #0056b3;
    //         }
    //     }
    // }
</style>
