<script lang="ts">
    import { toastMessages, removeToast } from "$lib/stores";
    import ToastAlertDefault from "./ToastAlertDefault.svelte";

    const handleToastClose = (event: { detail: { id: any } }) => {
        const { id } = event.detail;
        removeToast(id);
    };
</script>

<div class="toast-container top-left">
    {#each $toastMessages as toast (toast.id)}
        <ToastAlertDefault
            id={toast.id}
            message={toast.message}
            options={toast.options}
            on:close={handleToastClose}
        />
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
        gap: 0.5rem;
    }
</style>
