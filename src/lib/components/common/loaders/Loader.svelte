<script lang="ts">
    import { constants } from "$lib/constants";
    const { colors } = constants;
    import { Loader } from "mysvelte-ui";

    export let color: string = colors["--color-theme-1-D1"];
    export let size: "small" | "medium" | "large" = "medium";
    export let speed: "slow" | "medium" | "fast" = "medium";
</script>

<div class="loader">
    <Loader.Elips {color} {speed} {size} />
</div>

<style lang="scss">
    .loader {
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
        width: 100%;
        height: 100%;
    }
</style>
