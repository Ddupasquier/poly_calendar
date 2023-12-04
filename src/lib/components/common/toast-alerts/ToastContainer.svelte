<script lang="ts">
    import ToastAlertDefault from "./ToastAlertDefault.svelte";

    export let toastMessages: ToastAlert[] = [];
</script>

<div class="toast-container top-left">
    {#each toastMessages as toast (toast.id)}
        <ToastAlertDefault {...toast} />
    {/each}
</div>

<style lang="scss">
    .toast-container {
        position: fixed;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-top: 1rem;
        gap: .5rem;
    }
</style>
