<script lang="ts">
    export let header: string;
</script>

<div class="profile-section">
    <div class="profile-header">{header}</div>
    <slot />
</div>

<style>
    .profile-section {
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
    .profile-header {
        font-size: 24px;
        color: var(--color-text-dark);
        margin-bottom: 10px;
    }
</style>