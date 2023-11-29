<script lang="ts">
    // import type { Provider } from "@supabase/supabase-js";
    import { supabase } from "$lib/supabase";

    import { userUser, userSession } from "$lib/stores/userStore";

    import { Button, Card } from "mysvelte-ui";
    import Input from "../inputs/EmailInput.svelte";
    import { colors } from "$lib/palette";
    import EmailInput from "../inputs/EmailInput.svelte";
    import PasswordInput from "../inputs/PasswordInput.svelte";

    interface HelperText {
        error: boolean;
        text: string | null;
    }

    let email: string = "";
    let password: string = "";
    let helperText: HelperText = { error: false, text: null };

    const handleLogin = async (type: string) => {
        let result;
        if (type === "LOGIN") {
            result = await supabase.auth.signInWithPassword({
                email,
                password,
            });
        } else {
            result = await supabase.auth.signUp({ email, password });
        }

        const { data, error } = result;

        if (error) {
            console.error("Error:", error);
            helperText = { error: true, text: error.message };
        } else if (data && !data.user) {
            console.log("Success: Verification email sent");
            helperText = {
                error: false,
                text: "An email has been sent to you for verification!",
            };
        } else if (data && data.user) {
            console.log("User:", data.user);
            userUser.set(data.user);
            userSession.set(data.session!);
        }
    };

    // const handleOAuthLogin = async (provider: Provider) => {
    //     // You need to enable the third party auth you want in Authentication > Settings
    //     // Read more on: https://supabase.com/docs/guides/auth#third-party-logins
    //     let { error } = await supabase.auth.signInWithOAuth({ provider });
    //     if (error) console.log("Error: ", error.message);
    // };
</script>

<Card background={colors["--color-bg-2"]}>
    <Card.Head style="text-align: center">Lets get you logged in!</Card.Head>
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
                on:click={() => handleLogin("REGISTER")}>Sign Up</Button
            >
            <Button
                on:click={() => handleLogin("LOGIN")}
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
    {#if !!helperText.text}
        <div class="helper-text">
            {helperText.text}
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

    .helper-text {
        padding: 0.5rem;
        text-align: center;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        background-color: var(--color-theme-1);
        border: 1px solid var(--color-theme-1-D1);
        border-top: 0;
        border-radius: 0 0 0.5rem 0.5rem;
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
