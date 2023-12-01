<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabase";
    import { goto } from "$app/navigation";
    import { userUser, userSession } from "$lib/stores/userStore";

    import { Card, Button } from "mysvelte-ui";
    import { colors } from "$lib/palette";

    interface HelperText {
        error: boolean;
        text: string | null;
    }

    let helperText: HelperText = { error: false, text: null };

    let email: string;
    let token: string | null = null;

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        email = urlParams.get("email") ?? "";
        token = urlParams.get("token");
    });

    const confirmSignUp = async () => {
        if (token) {
            try {
                if (!token) {
                    throw new Error("No access token provided.");
                }

                const { data, error: authError } =
                    await supabase.auth.verifyOtp({
                        token_hash: token,
                        type: "email",
                    });

                if (authError) {
                    throw authError;
                }

                if (!data) {
                    throw new Error("No data returned from Supabase.");
                } else if (!data.user) {
                    throw new Error("No user returned from Supabase.");
                } else {
                    userUser.set(data.user);
                    userSession.set(data.session);

                    goto("/profile");
                }
            } catch (err) {
                helperText = { error: true, text: (err as Error).message };
            }
        } else {
            helperText = { error: true, text: "No token provided." };
        }
    };
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
                    on:click={confirmSignUp}
                    background={colors["--color-theme-2"]}
                >
                    Confirm Signup
                </Button>
            </Card.Foot>
            {#if !!helperText.text}
                <div class="helper-text">
                    {helperText.text}
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
