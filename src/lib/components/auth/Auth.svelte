<script lang="ts">
    // import type { Provider } from "@supabase/supabase-js";
    import { supabase } from "$lib/supabase";

    import { userUser, userSession } from "$lib/stores/userStore";

    import { Button } from "mysvelte-ui";
    import { colors } from "$lib/palette";

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

<div class="login-container">
    <h1>Login</h1>
    <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" type="email" bind:value={email} required />
    </div>
    <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" type="password" bind:value={password} required />
    </div>
    {#if !!helperText.text}
        <div class="helper-text">
            {helperText.text}
        </div>
    {/if}
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
</div>

<style lang="scss">
    .login-container {
        max-width: 20rem;
        padding: 1.25rem;
        background-color: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        flex-direction: column;
        font-size: 1rem;

        h1 {
            text-align: center;
            margin-bottom: 0.25rem;
        }

        .form-group {
            margin-top: 1rem;
            label {
                font-weight: bold;
            }
            input {
                background-color: #f7f7f7;
                border: 1px solid #ddd;
                padding: 0.25rem 0.5rem;
                width: 100%;
            }
        }

        .helper-text {
            padding: 0.5rem;
            text-align: center;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            background-color: #ffdddd;
            border: 1px solid #ffcccc;
        }

        .button-group {
            margin-top: 0.5rem;
            display: flex;
            justify-content: space-between;

            button {
                border: 1px solid #007bff;
                background-color: #fff;
                color: #007bff;
                padding: 0.5rem 1rem;
                cursor: pointer;
                &:hover {
                    background-color: #f0f8ff;
                }
            }
        }

        .divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin-top: 1rem;

            &:before,
            &:after {
                content: "";
                flex: 1;
                border-bottom: 1px solid #ddd;
            }

            span {
                margin: 0 0.5rem;
                background-color: white;
                color: #aaa;
                padding: 0 0.5rem;
            }
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
    }
</style>
