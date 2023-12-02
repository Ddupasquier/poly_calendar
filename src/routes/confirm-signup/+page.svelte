<script lang="ts">
    export let data: any;

    import AuthEmailConfirmation from "$lib/components/auth/AuthEmailConfirmation.svelte";

    const { token } = data;
</script>

<div class="container">
    {#if token}
        <AuthEmailConfirmation {token} />
    {/if}
</div>
