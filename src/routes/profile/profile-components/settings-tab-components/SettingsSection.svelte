<script lang="ts">
    export let header: string;
</script>

<div class="settings-section">
    <div class="settings-header">{header}</div>
    <slot />
</div>

<style>
    .settings-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        &:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
    }
    .settings-header {
        font-size: 24px;
        color: var(--color-text-dark);
        margin-bottom: 10px;
    }
</style>