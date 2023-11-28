<script lang="ts">
    import { siteName } from "$lib/constants";
</script>

<h1>
    <a href="/">{siteName}</a>
</h1>

<style lang="scss">
    h1 {
        position: absolute;
        margin: 0;
        padding: 0.25rem 2rem;
        color: white;
    }

    a {
        color: white;
        text-decoration: none;

        &:hover {
            text-decoration: none;
        }
    }

    @media (min-width: 870px) {
        h1 {
            font-size: 2.4rem;
        }
    }
</style>
